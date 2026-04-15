import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Review from "../../../lib/models/Review";
import { createReview } from "./actions";
import WishlistCheckbox from "../../ui/components/Wishlist";
import styles from "./item-page.module.css";
import { canViewProduct } from "../../../lib/data/sellerVisibility";

type SessionUser = {
  id?: string;
  name?: string;
  role?: "admin" | "buyer" | "seller";
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  await connectDB();

  const { allowed, product, seller } = await canViewProduct(id, user);

  if (!allowed || !product || !seller) {
    notFound();
  }

  const reviews = await Review.find({ productId: id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
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
              <strong>Artist:</strong>{" "}
              <Link
                href={`/profiles/${seller._id.toString()}`}
                className={styles.artistLink}
              >
                {product.artist}
              </Link>
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

            {product.dimensions ? (
              <p className={styles.textRow}>
                <strong>Dimensions:</strong> {product.dimensions}
              </p>
            ) : null}

            {Array.isArray(product.materials) && product.materials.length > 0 ? (
              <p className={styles.textRow}>
                <strong>Materials:</strong> {product.materials.join(", ")}
              </p>
            ) : null}

            <WishlistCheckbox
              product={{
                id: product._id.toString(),
                title: product.title,
                image: product.image,
                price: product.price,
                artist: product.artist,
                category: product.category,
              }}
              isLoggedIn={!!session}
            />
          </div>
        </div>

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
                  <label className={styles.reviewLabel}>Review Title:</label>
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
              {reviews.map((review) => {
                const reviewId = String(review._id);
                const reviewTitle =
                  typeof review.title === "string" ? review.title : "";
                const reviewComment =
                  typeof review.comment === "string" ? review.comment : "";
                const reviewRating =
                  typeof review.rating === "number" ? review.rating : 0;
                const reviewUserName =
                  typeof review.userName === "string" ? review.userName : "Anonymous";

                return (
                  <article key={reviewId} className={styles.reviewCard}>
                    <div className={styles.reviewTop}>
                      <h3 className={styles.reviewTitleText}>{reviewTitle}</h3>
                      <strong>{reviewRating}/5</strong>
                    </div>

                    <p className={styles.reviewComment}>{reviewComment}</p>
                    <p className={styles.reviewAuthor}>- {reviewUserName}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}