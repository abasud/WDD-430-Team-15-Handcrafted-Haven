"use server";

import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";
import Review from "../../lib/models/Review";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; role?: "buyer" | "seller" }
    | undefined;

  if (!user?.id || user.role !== "seller") {
    return;
  }

  const productId = String(formData.get("productId") || "");

  if (!productId) {
    return;
  }

  await connectDB();

  await Product.findOneAndDelete({
    _id: productId,
    userId: user.id,
  });

  revalidatePath("/account");
  revalidatePath("/");
  revalidatePath(`/items/${productId}`);
}

export async function deleteReview(formData: FormData) {
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;

  if (!user?.id) {
    return;
  }

  const reviewId = String(formData.get("reviewId") || "");

  if (!reviewId) {
    return;
  }

  await connectDB();

  await Review.findOneAndDelete({
    _id: reviewId,
    userId: user.id,
  });

  revalidatePath("/account");
  revalidatePath(`/reviews/${reviewId}`);
}