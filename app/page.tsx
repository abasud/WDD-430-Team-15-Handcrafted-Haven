'use client';
import ProductCard from "./ui/components/productCard";
import Filters from "./ui/components/filters";
import styles from "./ui/page.module.css";

export default function HomePage() {
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
          <ProductCard
            id="temp-id-001" 
            title="Ceramic Vase" 
            artist="Elena Gomez" 
            price={45.00} 
            image="/sample-product.jpg" 
          />
        </section>
      </div>
    </div>
  );
}