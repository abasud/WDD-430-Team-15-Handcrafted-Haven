import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  artist: string;
  price: number;
  image: string;
  description: string;
  category: "pottery" | "woodwork" | "textile" | "jewelry";
  materials: string[];
  dimensions?: string;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["pottery", "woodwork", "textile", "jewelry"],
      required: true,
    },
    materials: {
      type: [String],
      default: [],
    },
    dimensions: { type: String, trim: true },
    availability: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;