import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../lib/models/Buyer";

const MONGODB_URI = process.env.DATABASE_URL!;

async function main() {
  await mongoose.connect(MONGODB_URI);

  const hashedPassword = await bcrypt.hash("password123", 10);

  await User.findOneAndUpdate(
    { email: "test@example.com" },
    { name: "Test User", email: "test@example.com", password: hashedPassword },
    { upsert: true, new: true }
  );

  console.log("Seed complete: test@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
