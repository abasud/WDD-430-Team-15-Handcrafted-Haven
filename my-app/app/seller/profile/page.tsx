import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../auth";
import { connectDB } from "../../../lib/db";
import Seller from "../../../lib/models/Seller";
import Product from "../../../lib/models/Product";
import { ProfileEditForm } from "./ProfileEditForm";
import { DeleteProductButton } from "./DeleteProductButton";
import styles from "./profile.module.css";

export default async function SellerProfilePage() {
  const session = await auth();
  const sessionUser = session?.user as { id?: string; role?: string } | undefined;

  if (!sessionUser?.id || sessionUser.role !== "seller") {
    redirect("/");
  }

  await connectDB();

  const user = await Seller.findById(sessionUser.id).lean();
  if (!user) redirect("/");

  const products = await Product.find({ sellerId: sessionUser.id })
    .sort({ createdAt: -1 })
    .lean();

  const seller = {
    id: (user._id as { toString(): string }).toString(),
    name: user.name ?? "Unnamed Artisan",
    email: user.email,
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
      {/* ── Profile Section ── */}
      <section className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {seller.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileMeta}>
            <h1 className={styles.sellerName}>{seller.name}</h1>
            <span className={`role-badge role-badge--seller`}>Artisan</span>
            {seller.bio && <p className={styles.bio}>{seller.bio}</p>}
          </div>
        </div>

        {seller.story && (
          <div className={styles.storyBox}>
            <h2 className={styles.storyHeading}>My Story</h2>
            <p className={styles.storyText}>{seller.story}</p>
          </div>
        )}

        <ProfileEditForm
          currentBio={seller.bio}
          currentStory={seller.story}
        />
      </section>

      {/* ── Products Section ── */}
      <section className={styles.productsSection}>
        <div className={styles.productsSectionHeader}>
          <h2 className={styles.sectionTitle}>My Handcrafted Items</h2>
          <Link href="/seller/products/new" className={styles.addButton}>
            + Add Item
          </Link>
        </div>

        {productList.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven&apos;t listed any items yet.</p>
            <Link href="/seller/products/new" className={styles.addButton}>
              List your first item
            </Link>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {productList.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImagePlaceholder}>
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image} alt={product.title} className={styles.productImage} />
                  ) : (
                    <span className={styles.noImage}>No Image</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  {product.category && (
                    <span className={styles.productCategory}>{product.category}</span>
                  )}
                  <p className={styles.productDescription}>{product.description}</p>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                </div>
                <div className={styles.productActions}>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Public Profile Link ── */}
      <div className={styles.publicLinkSection}>
        <p className={styles.publicLinkText}>
          Share your public profile:{" "}
          <Link href={`/sellers/${seller.id}`} className={styles.publicLink}>
            View public profile →
          </Link>
        </p>
      </div>
    </div>
  );
}
