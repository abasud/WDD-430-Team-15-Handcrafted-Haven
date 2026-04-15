import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../auth";
import { connectDB } from "../../../../lib/db";
import Seller from "../../../../lib/models/Seller";
import Profile from "../../../../lib/models/Profile";
import { SellerProfileForm } from "../../../signup/seller-profile/seller-profile-form";
import { updateSellerProfileAction } from "../../../signup/seller-profile/actions";
import styles from "../../../signup/seller-profile/seller-profile.module.css";

type SessionUser = {
  id?: string;
  name?: string;
  role?: "admin" | "buyer" | "seller";
};

type LeanSeller = {
  _id: { toString(): string };
  name?: string;
  email: string;
};

type LeanProfile = {
  category?: "pottery" | "wood" | "textile" | "painting";
  image?: string;
  story?: string;
  age?: number;
  residenceCity?: string;
  residenceCountry?: string;
};

export default async function EditSellerProfilePage() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    redirect("/login");
  }

  if (user.role !== "seller") {
    redirect("/account");
  }

  await connectDB();

  const seller = (await Seller.findById(user.id).lean()) as LeanSeller | null;

  if (!seller) {
    notFound();
  }

  const profile = (await Profile.findOne({ sellerId: user.id }).lean()) as LeanProfile | null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Seller Profile</h1>
          <p className={styles.subtitle}>
            Update the public profile details buyers see on your seller page.
          </p>
        </div>

        <SellerProfileForm
          sellerId={seller._id.toString()}
          sellerName={seller.name || ""}
          sellerEmail={seller.email}
          action={updateSellerProfileAction}
          submitLabel="Update Seller Profile"
          pendingLabel="Updating profile..."
          initialValues={{
            category: profile?.category || "",
            image:
              profile?.image && profile.image !== "/seller-images/default-image.jpg"
                ? profile.image
                : "",
            story: profile?.story || "",
            age: typeof profile?.age === "number" ? profile.age : null,
            residenceCity: profile?.residenceCity || "",
            residenceCountry: profile?.residenceCountry || "",
          }}
        />
      </div>
    </div>
  );
}