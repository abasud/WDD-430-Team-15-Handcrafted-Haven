import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../auth";
import { connectDB } from "../../../../../lib/db";
import Seller from "../../../../../lib/models/Seller";
import Product from "../../../../../lib/models/Product";
import { adminDeleteSellerProduct } from "../../../actions";
import styles from "./seller-products.module.css";

type SessionUser = {
  id?: string;
  name?: string;
  role?: "admin" | "buyer" | "seller";
};

type LeanSeller = {
  _id: { toString(): string };
  name?: string;
  email: string;
  authenticated: "Y" | "N";
};

type LeanProduct = {
  _id: { toString(): string };
  title?: string;
  description?: string;
  category?: string;
  availability?: string;
  price?: number;
  image?: string;
  artist?: string;
  userId?: string | { toString(): string };
};

export default async function AdminSellerProductsPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/account");
  }

  const { sellerId } = await params;

  await connectDB();

  const seller = (await Seller.findById(sellerId).lean()) as LeanSeller | null;

  if (!seller) {
    notFound();
  }

  const products = (await Product.find({
    $or: [{ userId: sellerId }, { userId: seller._id }, { artist: seller.name }],
  })
    .sort({ createdAt: -1 })
    .lean()) as LeanProduct[];

  const isApproved = seller.authenticated === "Y";

  return (
    <main className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Admin seller product management</p>
          <h1 className={styles.title}>
            {seller.name || "Unnamed Seller"}&apos;s Products
          </h1>
          <p className={styles.meta}>{seller.email}</p>
          <p className={styles.meta}>
            Status:{" "}
            <span
              className={
                isApproved
                  ? `${styles.statusBadge} ${styles.statusApproved}`
                  : `${styles.statusBadge} ${styles.statusPending}`
              }
            >
              {isApproved ? "Approved" : "Unapproved"}
            </span>
          </p>
        </div>

        <div className={styles.headerLinks}>
          <Link href="/account" className={styles.backLink}>
            Back to Admin Account
          </Link>
          <Link href={`/profiles/${sellerId}`} className={styles.profileLink}>
            View Seller Profile
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyCard}>
          <p>This seller has no products.</p>
        </div>
      ) : (
        <section className={styles.list}>
          {products.map((product) => {
            const productId = product._id.toString();

            return (
              <article key={productId} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.productTitle}>
                      {product.title || "Untitled Product"}
                    </h2>
                    <p className={styles.productMeta}>
                      ${Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {product.description ? (
                  <p className={styles.description}>{product.description}</p>
                ) : null}

                <div className={styles.details}>
                  <p>
                    <strong>Category:</strong> {product.category || "Not provided"}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {product.availability || "Not provided"}
                  </p>
                  <p>
                    <strong>Artist:</strong> {product.artist || seller.name || "Unknown"}
                  </p>
                </div>

                <div className={styles.actions}>
                  <Link href={`/items/${productId}`} className={styles.viewButton}>
                    View Product
                  </Link>

                  <form action={adminDeleteSellerProduct}>
                    <input type="hidden" name="productId" value={productId} />
                    <input type="hidden" name="sellerId" value={sellerId} />
                    <button type="submit" className={styles.deleteButton}>
                      Delete Product
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}