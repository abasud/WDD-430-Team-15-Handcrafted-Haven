import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";
import Review from "../../lib/models/Review";
import { deleteProduct, deleteReview } from "./actions";
import styles from "./account.module.css";

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user as any;

  if (!user?.id) redirect("/login");

  await connectDB();

  const reviews = await Review.find({ userId: user.id }).lean();
  const products =
    user.role === "seller"
      ? await Product.find({ userId: user.id }).lean()
      : [];

  return (
    <main className={styles.page}>
      <h1 className={styles.accountName}>{user.name}</h1>

      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>My Reviews</h2>

        {reviews.length === 0 ? (
          <p>You have not written any reviews yet.</p>
        ) : (
          reviews.map((review: any) => {
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
          <h2 className={styles.sectionTitle}>My Products</h2>

          {products.length === 0 ? (
            <p>You have not created any products yet.</p>
          ) : (
            products.map((product: any) => {
              const productId = String(product._id);

              return (
                <div key={productId} className={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
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
                      <input
                        type="hidden"
                        name="productId"
                        value={productId}
                      />
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