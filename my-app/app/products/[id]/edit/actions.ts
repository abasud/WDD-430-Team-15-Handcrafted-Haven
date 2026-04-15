"use server";

import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../lib/models/Product";
import { revalidatePath } from "next/cache";
import type { ProductFormState } from "../../product-form";

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await auth();
  const user = session?.user as
    | { id?: string; name?: string; role?: "admin" | "buyer" | "seller" }
    | undefined;

  if (!user?.id) {
    return { error: "You must be logged in." };
  }

  if (user.role !== "seller") {
    return { error: "Only sellers can edit products." };
  }

  const productId = (formData.get("productId") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const materialsRaw = (formData.get("materials") as string)?.trim();
  const dimensions = (formData.get("dimensions") as string)?.trim();
  const availability = (formData.get("availability") as string)?.trim();

  const fieldErrors: NonNullable<ProductFormState>["fieldErrors"] = {};
  const validCategories = ["pottery", "woodwork", "textile", "jewelry"];

  if (!productId) {
    return { error: "Product not found." };
  }

  if (!title) fieldErrors!.title = "Title is required.";

  if (!priceRaw || Number.isNaN(Number(priceRaw)) || Number(priceRaw) < 0) {
    fieldErrors!.price = "Enter a valid price.";
  }

  if (!image) fieldErrors!.image = "Image is required.";

  if (!description || description.length < 10) {
    fieldErrors!.description = "Description must be at least 10 characters.";
  }

  if (!category || !validCategories.includes(category)) {
    fieldErrors!.category = "Select a valid category.";
  }

  if (!materialsRaw) fieldErrors!.materials = "Materials are required.";

  if (!availability) fieldErrors!.availability = "Availability is required.";

  if (Object.keys(fieldErrors!).length > 0) {
    return { fieldErrors };
  }

  const materials = materialsRaw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  try {
    await connectDB();

    const updated = await Product.findOneAndUpdate(
      {
        _id: productId,
        userId: user.id,
      },
      {
        artist: user.name || "Unknown Seller",
        title,
        price: Number(priceRaw),
        image,
        description,
        category,
        materials,
        dimensions: dimensions || undefined,
        availability,
      },
      { new: true }
    );

    if (!updated) {
      return { error: "Product not found or you do not have permission." };
    }
  } catch {
    return { error: "Failed to update product." };
  }

  revalidatePath("/account");
  revalidatePath("/");
  revalidatePath(`/items/${productId}`);
  redirect("/account");
}