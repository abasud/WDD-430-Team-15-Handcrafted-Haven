"use server";

import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import User from "../../lib/models/User";
import Product from "../../lib/models/Product";

type ProfileState = { error?: string } | null;
type ProductState = { error?: string; fieldErrors?: Record<string, string> } | null;

export async function updateSellerProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return { error: "Not authenticated." };

  const bio = (formData.get("bio") as string)?.trim() ?? "";
  const story = (formData.get("story") as string)?.trim() ?? "";

  await connectDB();
  await User.findByIdAndUpdate(userId, { bio, story });

  return null;
}

export async function createProduct(
  _prev: ProductState,
  formData: FormData
): Promise<ProductState> {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return { error: "Not authenticated." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const priceRaw = formData.get("price") as string;
  const category = (formData.get("category") as string)?.trim() ?? "";
  const image = (formData.get("image") as string)?.trim() ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!title || title.length < 2) fieldErrors.title = "Title must be at least 2 characters.";
  if (!description || description.length < 10) fieldErrors.description = "Description must be at least 10 characters.";
  const price = parseFloat(priceRaw);
  if (isNaN(price) || price < 0) fieldErrors.price = "Enter a valid price.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  await connectDB();
  await Product.create({ sellerId: userId, title, description, price, category, image });

  redirect("/seller/profile");
}

export async function deleteProduct(productId: string): Promise<void> {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return;

  await connectDB();
  await Product.findOneAndDelete({ _id: productId, sellerId: userId });
}
