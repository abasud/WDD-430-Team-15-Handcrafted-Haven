"use server";

import mongoose from "mongoose";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Review from "../../../lib/models/Review";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; name?: string }
    | undefined;

  if (!user?.id) {
    return;
  }

  const productId = String(formData.get("productId") || "").trim();
  const rating = Number(formData.get("rating") || 0);
  const title = String(formData.get("title") || "").trim();
  const comment = String(formData.get("comment") || "").trim();

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    return;
  }

  if (!title || !comment || rating < 1 || rating > 5) {
    return;
  }

  await connectDB();

  await Review.create({
    userId: new mongoose.Types.ObjectId(user.id),
    productId: new mongoose.Types.ObjectId(productId),
    userName: user.name || "Anonymous User",
    rating,
    title,
    comment,
  });

  revalidatePath(`/items/${productId}`);
}