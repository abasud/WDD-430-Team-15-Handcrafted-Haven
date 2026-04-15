import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/db";
import Seller from "../../../lib/models/Seller";
import Product from "../../../lib/models/Product";
import styles from "./sellerPublic.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicSellerProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();

  const user = await Seller.findOne({ _id: id, role: "seller" }).lean();
  if (!user) notFound();

  const products = await Product.find({ sellerId: id })
    .sort({ createdAt: -1 })
    .lean();

  const seller = {
    name: user.name ?? "Unnamed Artisan",
    bio: user.bio ?? "",
    story: user.story ?? "",
  };

  const productList = products.map((p) => ({
    id: (p._id as { toString(): string }).toString(),
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    image: p.image,
  }));

  return (
    <div className={styles.page}>
      {/* ── Seller Header ── */}
      <section className={styles.hero}>
        <div className={styles.avatar}>{seller.name.charAt(0).toUpperCase()}</div>
        <div className={styles.heroInfo}>
          <h1 className={styles.sellerName}>{seller.name}</h1>
          <span className="role-badge role-badge--seller">Artisan</span>
          {seller.bio && <p className={styles.bio}>{seller.bio}</p>}
        </div>
      </section>

      {/* ── Story ── */}
      {seller.story && (
        <section className={styles.storySection}>
          <h2 className={styles.storyHeading}>About This Artisan</h2>
          <p className={styles.storyText}>{seller.story}</p>
        </section>
      )}

      {/* ── Products ── */}
      <section className={styles.productsSection}>
        <h2 className={styles.productsHeading}>
          Handcrafted Collection
          <span className={styles.productCount}>{productList.length} items</span>
        </h2>

        {productList.length === 0 ? (
          <p className={styles.empty}>No items listed yet.</p>
        ) : (
          <div className={styles.grid}>
            {productList.map((product) => (
              <div key={product.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.title} className={styles.image} />
                  ) : (
                    <span className={styles.noImage}>No Image</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{product.title}</h3>
                  {product.category && (
                    <span className={styles.cardCategory}>{product.category}</span>
                  )}
                  <p className={styles.cardDescription}>{product.description}</p>
                  <p className={styles.cardPrice}>${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
