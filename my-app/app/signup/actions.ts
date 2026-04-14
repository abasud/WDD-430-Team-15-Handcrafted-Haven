"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db";
import Buyer from "../../lib/models/Buyer";
import Seller from "../../lib/models/Seller";
import { redirect } from "next/navigation";

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
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // Validation
  const fieldErrors: SignupState extends null ? never : NonNullable<SignupState>["fieldErrors"] = {};

  if (!name || name.length < 2) {
    fieldErrors!.name = "Name must be at least 2 characters.";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors!.email = "Please enter a valid email address.";
  }
  if (!password || password.length < 8) {
    fieldErrors!.password = "Password must be at least 8 characters.";
  }
  if (!role || !["buyer", "seller"].includes(role)) {
    fieldErrors!.role = "Please select an account type.";
  }

  if (Object.keys(fieldErrors!).length > 0) {
    return { fieldErrors };
  }

  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 12);

    if (role === "seller") {
      const existingSeller = await Seller.findOne({ email });
      if (existingSeller) {
        return { error: "An account with this email already exists." };
      }

      await Seller.create({
        name,
        email,
        password: hashedPassword,
        role: "seller",
      });
    } else {
      const existingBuyer = await Buyer.findOne({ email });
      if (existingBuyer) {
        return { error: "An account with this email already exists." };
      }

      await Buyer.create({
        name,
        email,
        password: hashedPassword,
        role: "buyer", 
      });
    }
  } catch (error) {
    console.error("Signup Database Error:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?registered=true");
}