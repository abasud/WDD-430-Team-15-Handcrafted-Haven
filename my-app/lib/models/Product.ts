import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
