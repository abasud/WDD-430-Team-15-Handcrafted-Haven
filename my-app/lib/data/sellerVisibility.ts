import Seller from "../models/Seller";
import Product from "../models/Product";

type Viewer =
  | {
      id?: string;
      role?: "admin" | "buyer" | "seller";
    }
  | undefined;

export async function canViewSellerProfile(sellerId: string, viewer?: Viewer) {
  const seller = await Seller.findById(sellerId).lean();

  if (!seller) {
    return {
      allowed: false,
      seller: null,
    };
  }

  const isAdmin = viewer?.role === "admin";
  const isOwner = viewer?.id === String(seller._id);
  const isAuthenticatedSeller = seller.authenticated === "Y";

  return {
    allowed: isAdmin || isOwner || isAuthenticatedSeller,
    seller,
  };
}

export async function canViewProduct(productId: string, viewer?: Viewer) {
  const product = await Product.findById(productId).lean();

  if (!product) {
    return {
      allowed: false,
      product: null,
      seller: null,
    };
  }

  const sellerId =
    typeof product.userId === "string"
      ? product.userId
      : String(product.userId);

  const seller = await Seller.findById(sellerId).lean();

  if (!seller) {
    return {
      allowed: false,
      product: null,
      seller: null,
    };
  }

  const isAdmin = viewer?.role === "admin";
  const isOwner = viewer?.id === String(seller._id);
  const isAuthenticatedSeller = seller.authenticated === "Y";

  return {
    allowed: isAdmin || isOwner || isAuthenticatedSeller,
    product,
    seller,
  };
}