import mongoose, { Model, Schema } from "mongoose";

export interface IProfile {
  _id: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: "seller";
  authenticated: "Y" | "N";
  category: "pottery" | "wood" | "textile" | "painting";
  image: string;
  story: string;
  age?: number;
  residenceCity?: string;
  residenceCountry?: string;
  memberSince: Date;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    role: { type: String, enum: ["seller"], required: true },
    authenticated: { type: String, enum: ["Y", "N"], required: true },
    category: {
      type: String,
      enum: ["pottery", "wood", "textile", "painting"],
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      default: "/seller-images/default-image.jpg",
    },
    story: { type: String, required: true, trim: true },
    age: { type: Number },
    residenceCity: { type: String, trim: true },
    residenceCountry: { type: String, trim: true },
    memberSince: { type: Date, required: true },
    productCount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

const Profile: Model<IProfile> =
  mongoose.models.Profile ?? mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;