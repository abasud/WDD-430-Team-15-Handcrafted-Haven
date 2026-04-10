import ProductCard from "./ui/components/productCard";
import Filters from "./ui/components/filters";
import styles from "./ui/page.module.css";
import { connectDB } from "../lib/db";
import Product from "../lib/models/Product";

export default async function HomePage() {
  await connectDB();

  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Handcrafted Haven</h1>
        <p className={styles.subtitle}>Discover pieces made with passion</p>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for unique items"
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </div>
      </section>

      <div className={styles.mainContent}>
        <Filters />

        <section className={styles.productGallery}>
          {products.length === 0 ? (
            <p>No products yet.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={String(product._id)}
                id={String(product._id)}
                title={product.title}
                artist={product.artist}
                price={product.price}
                image={product.image}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}