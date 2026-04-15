import mongoose, { Schema, Model } from "mongoose";

export interface IBuyer {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  role: "buyer";
  createdAt: Date;
  updatedAt: Date;
}

const BuyerSchema = new Schema<IBuyer>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer"], required: true }
  },
  {
    timestamps: true,
    collection: "buyers"
  }
);

const Buyer: Model<IBuyer> =
  mongoose.models.Buyer ?? mongoose.model<IBuyer>("Buyer", BuyerSchema);

export default Buyer;
