import mongoose, { Model, Schema } from "mongoose";

export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], required: true, default: "admin" },
  },
  {
    timestamps: true,
    collection: "admin",
  }
);

const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;