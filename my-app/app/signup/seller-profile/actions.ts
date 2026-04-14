"use server";

import { redirect } from "next/navigation";
import { connectDB } from "../../../lib/db";
import Profile from "../../../lib/models/Profile";
import Seller from "../../../lib/models/Seller";

export type SellerProfileState = {
  error?: string;
  fieldErrors?: {
    image?: string;
    story?: string;
    age?: string;
    residenceCity?: string;
    residenceCountry?: string;
    category?: string;
    sellerId?: string;
  };
} | null;

const VALID_CATEGORIES = ["pottery", "wood", "textile", "painting"] as const;

export async function createSellerProfileAction(
  _prevState: SellerProfileState,
  formData: FormData
): Promise<SellerProfileState> {
  const sellerId = String(formData.get("sellerId") || "").trim();
  const imageInput = String(formData.get("image") || "").trim();
  const story = String(formData.get("story") || "").trim();
  const ageInput = String(formData.get("age") || "").trim();
  const residenceCity = String(formData.get("residenceCity") || "").trim();
  const residenceCountry = String(formData.get("residenceCountry") || "").trim();
  const category = String(formData.get("category") || "").trim();

  const fieldErrors: NonNullable<SellerProfileState>["fieldErrors"] = {};

  if (!sellerId) {
    fieldErrors.sellerId = "Missing seller account.";
  }

  if (!story || story.length < 20) {
    fieldErrors.story = "Story must be at least 20 characters.";
  }

  if (!residenceCity) {
    fieldErrors.residenceCity = "Please enter your city.";
  }

  if (!residenceCountry) {
    fieldErrors.residenceCountry = "Please enter your country.";
  }

  if (!category || !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    fieldErrors.category = "Please select a category.";
  }

  let parsedAge: number | undefined;

  if (ageInput) {
    parsedAge = Number(ageInput);

    if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      fieldErrors.age = "Age must be a whole number between 18 and 120.";
    }
  }

  const image =
    imageInput && imageInput.startsWith("/")
      ? imageInput
      : imageInput
        ? `/${imageInput.replace(/^\/+/, "")}`
        : "/seller-images/default-image.jpg";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  try {
    await connectDB();

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return { error: "Seller account not found." };
    }

    await Profile.findOneAndUpdate(
      { sellerId: seller._id },
      {
        sellerId: seller._id,
        name: seller.name || "Seller",
        email: seller.email,
        role: "seller",
        authenticated: seller.authenticated,
        image,
        story,
        age: parsedAge,
        residenceCity,
        residenceCountry,
        category,
        memberSince: seller.createdAt || new Date(),
        productCount: 0,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    console.error("Create seller profile error:", error);
    return { error: "Could not save seller profile. Please try again." };
  }

  redirect("/login?registered=true&profileCreated=true");
}