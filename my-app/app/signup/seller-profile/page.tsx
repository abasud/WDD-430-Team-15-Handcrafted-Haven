import { notFound } from "next/navigation";
import { connectDB } from "../../../lib/db";
import Seller from "../../../lib/models/Seller";
import { SellerProfileForm } from "./seller-profile-form";
import styles from "./seller-profile.module.css";

export default async function SellerProfileSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ sellerId?: string }>;
}) {
  const { sellerId } = await searchParams;

  if (!sellerId) {
    notFound();
  }

  await connectDB();

  const seller = await Seller.findById(sellerId).lean();

  if (!seller) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Complete Your Seller Profile</h1>
          <p className={styles.subtitle}>
            Add the details buyers will see on your public seller page.
          </p>
        </div>

        <SellerProfileForm
          sellerId={seller._id.toString()}
          sellerName={seller.name || ""}
          sellerEmail={seller.email}
        />
      </div>
    </div>
  );
}