"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/db";
import Buyer from "../../lib/models/Buyer";
import Seller from "../../lib/models/Seller";

export type SignupState = {
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
} | null;

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "").trim();

  const fieldErrors: NonNullable<SignupState>["fieldErrors"] = {};

  if (!name || name.length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!password || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  if (!role || !["buyer", "seller"].includes(role)) {
    fieldErrors.role = "Please select an account type.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await connectDB();

    const existingBuyer = await Buyer.findOne({ email }).lean();
    const existingSeller = await Seller.findOne({ email }).lean();

    if (existingBuyer || existingSeller) {
      return { error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (role === "seller") {
      await Seller.create({
        name,
        email,
        password: hashedPassword,
        role: "seller",
        authenticated: "N",
      });
    } else {
      await Buyer.create({
        name,
        email,
        password: hashedPassword,
        role: "buyer",
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?registered=true");
}