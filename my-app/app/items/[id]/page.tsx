import Image from "next/image";
import Link from "next/link";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Product from "../../../lib/models/Product";
import Review from "../../../lib/models/Review";
import { notFound } from "next/navigation";
import { createReview } from "./actions";
import styles from "./item-page.module.css";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as
    | { id?: string; name?: string; role?: string }
    | undefined;

  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) notFound();

  const reviews = await Review.find({ productId: id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* PRODUCT CARD — DO NOT TOUCH */}
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <div className={styles.imageBox}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.content}>
            <h1 className={styles.title}>{product.title}</h1>

            <p className={styles.textRow}>
              <strong>Artist:</strong> {product.artist}
            </p>

            <p className={styles.textRow}>
              <strong>Price:</strong> ${Number(product.price).toFixed(2)}
            </p>

            <p className={styles.textRow}>
              <strong>Description:</strong> {product.description}
            </p>

            <p className={styles.textRow}>
              <strong>Category:</strong> {product.category}
            </p>

            <p className={styles.textRow}>
              <strong>Availability:</strong> {product.availability}
            </p>

            {product.dimensions && (
              <p className={styles.textRow}>
                <strong>Dimensions:</strong> {product.dimensions}
              </p>
            )}

            {product.materials?.length > 0 && (
              <p className={styles.textRow}>
                <strong>Materials:</strong> {product.materials.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* REVIEW SECTION */}
        <section className={styles.reviewSection}>
          <h2 className={styles.reviewHeading}>Leave a Review</h2>

          {user?.id ? (
            <div className={styles.reviewFormBox}>
              <form action={createReview} className={styles.reviewForm}>
                <input type="hidden" name="productId" value={id} />

                <div className={styles.reviewField}>
                  <label className={styles.reviewLabel}>Rating:</label>
                  <select
                    name="rating"
                    defaultValue="5"
                    required
                    className={styles.reviewSelect}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className={styles.reviewField}>
                  <label className={styles.reviewLabel}>
                    Review Title:
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    className={styles.reviewInput}
                  />
                </div>

                <div className={styles.reviewField}>
                  <label className={styles.reviewLabel}>Comment:</label>
                  <textarea
                    name="comment"
                    rows={5}
                    required
                    className={styles.reviewTextarea}
                  />
                </div>

                <button type="submit" className={styles.reviewButton}>
                  Submit Review
                </button>
              </form>
            </div>
          ) : (
            <p className={styles.signInText}>
              Please <Link href="/login">sign in</Link> to leave a review.
            </p>
          )}

          <h2 className={styles.reviewHeading}>Reviews</h2>

          {reviews.length === 0 ? (
            <div className={styles.reviewCard}>
              <p>No reviews yet.</p>
            </div>
          ) : (
            <div className={styles.reviewList}>
              {reviews.map((review: any) => (
                <article key={String(review._id)} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <h3 className={styles.reviewTitleText}>
                      {review.title}
                    </h3>
                    <strong>{review.rating}/5</strong>
                  </div>

                  <p className={styles.reviewComment}>{review.comment}</p>
                  <p className={styles.reviewAuthor}>
                    - {review.userName}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}