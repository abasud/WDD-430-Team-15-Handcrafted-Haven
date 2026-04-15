import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";
import Review from "../../lib/models/Review";
import Seller from "../../lib/models/Seller";
import {
  deleteProduct,
  deleteReview,
  updateSellerApprovalStatus,
} from "./actions";
import styles from "./account.module.css";
import WishlistManager from "../ui/components/WishlistManager";

type SessionUser = {
  id?: string;
  name?: string;
  role?: "admin" | "buyer" | "seller";
};

type LeanReview = {
  _id: { toString(): string };
  title: string;
  comment: string;
};

type LeanProduct = {
  _id: { toString(): string };
  title: string;
  description: string;
  category: string;
  availability: string;
  price: number;
};

type LeanSeller = {
  _id: { toString(): string };
  name?: string;
  email: string;
  authenticated: "Y" | "N";
  createdAt?: Date | string;
};

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) redirect("/login");

  await connectDB();

  const reviews = (await Review.find({ userId: user.id }).lean()) as unknown as LeanReview[];

  const products =
    user.role === "seller"
      ? ((await Product.find({ userId: user.id }).lean()) as unknown as LeanProduct[])
      : [];

  const sellers =
    user.role === "admin"
      ? ((await Seller.find({})
          .sort({ createdAt: -1 })
          .lean()) as unknown as LeanSeller[])
      : [];

  const sellerProfileHref = `/profiles/${user.id}`;

  return (
    <main className={styles.page}>
      {user.role === "seller" ? (
        <section className={styles.profileCallout}>
          <div className={styles.profileCalloutText}>
            <p className={styles.profileEyebrow}>Seller account</p>

            <h1 className={styles.accountName}>
              <Link href={sellerProfileHref} className={styles.profileNameLink}>
                {user.name}
              </Link>
            </h1>

            <p className={styles.profileHint}>
              Your name is clickable. Open your public seller profile to see what buyers see.
            </p>

            <div className={styles.sellerCalloutActions}>
              <Link href={sellerProfileHref} className={styles.profileButtonSecondary}>
                View My Seller Profile
              </Link>

              <Link href="/account/seller-profile/edit" className={styles.profileButton}>
                Edit Seller Profile
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <h1 className={styles.accountName}>
          {user.role === "admin" ? "Admin Account" : user.name}
        </h1>
      )}

      {user.role === "admin" && (
        <section className={styles.adminSection}>
          <div className={styles.adminHeader}>
            <div>
              <p className={styles.profileEyebrow}>Admin tools</p>
              <h2 className={styles.sectionTitle}>Seller Approval Management</h2>
              <p className={styles.adminHint}>
                Review all sellers, change approval status, and manage their products.
              </p>
            </div>
          </div>

          {sellers.length === 0 ? (
            <div className={styles.card}>
              <p>No sellers found.</p>
            </div>
          ) : (
            <div className={styles.adminList}>
              {sellers.map((seller) => {
                const sellerId = seller._id.toString();
                const isApproved = seller.authenticated === "Y";
                const createdAtText = seller.createdAt
                  ? new Date(seller.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unknown";

                return (
                  <article key={sellerId} className={styles.adminCard}>
                    <div className={styles.adminCardTop}>
                      <div className={styles.adminSellerInfo}>
                        <h3 className={styles.adminSellerName}>
                          {seller.name || "Unnamed Seller"}
                        </h3>

                        <p className={styles.adminSellerMeta}>{seller.email}</p>

                        <p className={styles.adminSellerMeta}>Joined: {createdAtText}</p>

                        <div className={styles.adminLinksRow}>
                          <Link
                            href={`/profiles/${sellerId}`}
                            className={styles.adminProfileLink}
                          >
                            View profile
                          </Link>

                          <Link
                            href={`/account/sellers/${sellerId}/products`}
                            className={styles.adminManageLink}
                          >
                            Manage products
                          </Link>
                        </div>
                      </div>

                      <div className={styles.adminStatusBlock}>
                        <span
                          className={
                            isApproved
                              ? `${styles.statusBadge} ${styles.statusApproved}`
                              : `${styles.statusBadge} ${styles.statusPending}`
                          }
                        >
                          {isApproved ? "Approved" : "Unapproved"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.adminActions}>
                      {isApproved ? (
                        <form action={updateSellerApprovalStatus}>
                          <input type="hidden" name="sellerId" value={sellerId} />
                          <input type="hidden" name="authenticated" value="N" />
                          <button type="submit" className={styles.rejectButton}>
                            Mark as Unapproved
                          </button>
                        </form>
                      ) : (
                        <form action={updateSellerApprovalStatus}>
                          <input type="hidden" name="sellerId" value={sellerId} />
                          <input type="hidden" name="authenticated" value="Y" />
                          <button type="submit" className={styles.approveButton}>
                            Approve Seller
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className={styles.wishlistSection}>
        <h2 className={styles.sectionTitle}>My Wishlist</h2>
        <WishlistManager />
      </section>

      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>My Reviews</h2>

        {reviews.length === 0 ? (
          <p>You have not written any reviews yet.</p>
        ) : (
          reviews.map((review) => {
            const reviewId = String(review._id);

            return (
              <div key={reviewId} className={styles.card}>
                <h3 className={styles.reviewTitle}>{review.title}</h3>
                <p>{review.comment}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginTop: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href={`/reviews/${reviewId}`}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "999px",
                      border: "2px solid #2563eb",
                      color: "#2563eb",
                      textDecoration: "none",
                      fontWeight: 600,
                      backgroundColor: "#ffffff",
                      fontSize: "0.95rem",
                      lineHeight: "1",
                    }}
                  >
                    View
                  </Link>

                  <Link
                    href={`/reviews/${reviewId}/edit`}
                    style={{
                      padding: "0.55rem 1.1rem",
                      borderRadius: "999px",
                      border: "2px solid #1f3b14",
                      color: "#1f3b14",
                      textDecoration: "none",
                      fontWeight: 600,
                      backgroundColor: "#ffffff",
                      fontSize: "0.95rem",
                      lineHeight: "1",
                    }}
                  >
                    Edit
                  </Link>

                  <form action={deleteReview} style={{ margin: 0 }}>
                    <input type="hidden" name="reviewId" value={reviewId} />
                    <button
                      type="submit"
                      style={{
                        padding: "0.55rem 1.1rem",
                        borderRadius: "999px",
                        border: "2px solid #b91c1c",
                        color: "#b91c1c",
                        backgroundColor: "#ffffff",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        lineHeight: "1",
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        )}
      </section>

      {user.role === "seller" && (
        <section className={styles.productsSection}>
          <div className={styles.productsHeader}>
            <h2 className={styles.sectionTitle}>My Products</h2>
            <Link href={sellerProfileHref} className={styles.inlineProfileLink}>
              See my public seller profile
            </Link>
          </div>

          {products.length === 0 ? (
            <p>You have not created any products yet.</p>
          ) : (
            products.map((product) => {
              const productId = String(product._id);

              return (
                <div key={productId} className={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                      gap: "1rem",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{product.title}</h3>
                    <span style={{ fontWeight: 700 }}>
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <p>{product.description}</p>

                  <p>
                    <strong>Category:</strong> {product.category}
                  </p>

                  <p>
                    <strong>Availability:</strong> {product.availability}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      href={`/items/${productId}`}
                      style={{
                        padding: "0.55rem 1.1rem",
                        borderRadius: "999px",
                        border: "2px solid #2563eb",
                        color: "#2563eb",
                        textDecoration: "none",
                        fontWeight: 600,
                        backgroundColor: "#ffffff",
                        fontSize: "0.95rem",
                        lineHeight: "1",
                      }}
                    >
                      View
                    </Link>

                    <Link
                      href={`/products/${productId}/edit`}
                      style={{
                        padding: "0.55rem 1.1rem",
                        borderRadius: "999px",
                        border: "2px solid #1f3b14",
                        color: "#1f3b14",
                        textDecoration: "none",
                        fontWeight: 600,
                        backgroundColor: "#ffffff",
                        fontSize: "0.95rem",
                        lineHeight: "1",
                      }}
                    >
                      Edit
                    </Link>

                    <form action={deleteProduct} style={{ margin: 0 }}>
                      <input type="hidden" name="productId" value={productId} />
                      <button
                        type="submit"
                        style={{
                          padding: "0.55rem 1.1rem",
                          borderRadius: "999px",
                          border: "2px solid #b91c1c",
                          color: "#b91c1c",
                          backgroundColor: "#ffffff",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          lineHeight: "1",
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          )}

          <div style={{ marginTop: "2rem" }}>
            <Link
              href="/products/new"
              style={{
                display: "inline-block",
                padding: "0.6rem 1.3rem",
                borderRadius: "999px",
                border: "2px solid #1f3b14",
                color: "#1f3b14",
                textDecoration: "none",
                fontWeight: 600,
                backgroundColor: "#ffffff",
                fontSize: "1rem",
              }}
            >
              + Create New Product
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}