import mongoose, { Model, Schema } from "mongoose";

export interface ISeller {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: "seller";
  authenticated: "Y" | "N";
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["seller"], required: true, default: "seller" },
    authenticated: {
      type: String,
      enum: ["Y", "N"],
      required: true,
      default: "N",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "sellers",
  }
);

const Seller: Model<ISeller> =
  mongoose.models.Seller ?? mongoose.model<ISeller>("Seller", SellerSchema);

export default Seller;