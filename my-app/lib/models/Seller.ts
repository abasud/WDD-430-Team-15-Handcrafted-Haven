import mongoose, { Schema, Model } from "mongoose";

export interface ISeller {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: "seller";
  bio?: string;
  story?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["seller"], required: true },
    bio: { type: String, default: "" },
    story: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "sellers"
  }
);

const Seller: Model<ISeller> =
  mongoose.models.Seller ?? mongoose.model<ISeller>("Seller", SellerSchema);

export default Seller;
