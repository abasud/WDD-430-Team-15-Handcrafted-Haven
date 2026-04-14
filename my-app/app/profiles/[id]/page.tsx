import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Profile from "../../../lib/models/Profile";
import Product from "../../../lib/models/Product";
import ProductCard from "../../ui/components/productCard";
import { canViewSellerProfile } from "../../../lib/data/sellerVisibility";
import styles from "./profile-page.module.css";

type SessionUser = {
  id?: string;
  role?: "buyer" | "seller";
};

type LeanProfile = {
  _id: { toString(): string };
  sellerId: { toString(): string };
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
  memberSince: Date | string;
  productCount: number;
};

type LeanProduct = {
  _id: { toString(): string };
  title: string;
  artist: string;
  category: string;
  price: number;
  image: string;
};

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  await connectDB();

  const { allowed, seller } = await canViewSellerProfile(id, user);

  if (!allowed || !seller) {
    notFound();
  }

  const profile = (await Profile.findOne({ sellerId: seller._id }).lean()) as LeanProfile | null;

  if (!profile) {
    notFound();
  }

  const products = (await Product.find({
    $or: [{ userId: seller._id }, { userId: seller._id.toString() }, { artist: seller.name }],
  })
    .sort({ createdAt: -1 })
    .lean()) as LeanProduct[];

  const memberSinceDate = new Date(profile.memberSince);
  const memberSinceText = memberSinceDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const residenceText =
    profile.residenceCity && profile.residenceCountry
      ? `${profile.residenceCity}, ${profile.residenceCountry}`
      : profile.residenceCity || profile.residenceCountry || "Not provided";

  return (
    <main className={styles.page}>
      <div className={styles.topRow}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Catalog</Link>
          <span> / </span>
          <span>Seller Profile</span>
        </div>
      </div>

      <h1 className={styles.pageTitle}>Seller Profile</h1>

      <section className={styles.profileCard}>
        <div className={styles.imageWrap}>
          <Image
            src={profile.image || "/seller-images/default-image.jpg"}
            alt={profile.name}
            width={280}
            height={280}
            className={styles.profileImage}
            unoptimized
          />
        </div>

        <div className={styles.profileContent}>
          <h2 className={styles.name}>{profile.name}</h2>
          <p className={styles.meta}>Member since {memberSinceText}</p>
          <p className={styles.meta}>
            Age: {typeof profile.age === "number" ? profile.age : "Not provided"}
          </p>
          <p className={styles.meta}>Residence: {residenceText}</p>

          <h3 className={styles.storyHeading}>Story</h3>
          <p className={styles.story}>{profile.story}</p>

          <div className={styles.profileFooter}>
            <span className={styles.productCount}>
              {products.length} product{products.length === 1 ? "" : "s"} listed
            </span>
          </div>
        </div>
      </section>

      <section id="seller-products" className={styles.productsSection}>
        <h2 className={styles.productsTitle}>{profile.name}&apos;s Products</h2>

        {products.length === 0 ? (
          <p className={styles.emptyText}>No products found for this seller.</p>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                id={product._id.toString()}
                title={product.title}
                artist={product.artist}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}