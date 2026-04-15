"use server";

import { auth } from "../../auth";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";
import Review from "../../lib/models/Review";
import Seller from "../../lib/models/Seller";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; role?: "admin" | "buyer" | "seller" }
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

export async function updateSellerApprovalStatus(formData: FormData) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; role?: "admin" | "buyer" | "seller" }
    | undefined;

  if (!user?.id || user.role !== "admin") {
    return;
  }

  const sellerId = String(formData.get("sellerId") || "");
  const authenticated = String(formData.get("authenticated") || "");

  if (!sellerId || !["Y", "N"].includes(authenticated)) {
    return;
  }

  await connectDB();

  await Seller.findByIdAndUpdate(sellerId, {
    authenticated,
  });

  revalidatePath("/account");
  revalidatePath(`/profiles/${sellerId}`);
  revalidatePath(`/account/sellers/${sellerId}/products`);
}

export async function adminDeleteSellerProduct(formData: FormData) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; role?: "admin" | "buyer" | "seller" }
    | undefined;

  if (!user?.id || user.role !== "admin") {
    return;
  }

  const productId = String(formData.get("productId") || "");
  const sellerId = String(formData.get("sellerId") || "");

  if (!productId || !sellerId) {
    return;
  }

  await connectDB();

  await Product.findByIdAndDelete(productId);

  revalidatePath("/account");
  revalidatePath("/");
  revalidatePath(`/items/${productId}`);
  revalidatePath(`/profiles/${sellerId}`);
  revalidatePath(`/account/sellers/${sellerId}/products`);
}