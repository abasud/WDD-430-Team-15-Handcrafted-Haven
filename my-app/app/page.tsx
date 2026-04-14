import ProductCard from "./ui/components/productCard";
import Filters from "./ui/components/filters";
import styles from "./ui/page.module.css";
import { connectDB } from "../lib/db";
import Product from "../lib/models/Product";
import Seller from "../lib/models/Seller";
import PaginationControls from "./ui/components/PaginationControls";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  await connectDB();

  // Extract the filter values from the URL
  const filters = await searchParams;

  // --- PAGINATION LOGIC ---
  const PAGE_SIZE = 8; 
  const currentPage = Number(filters.page) || 1; 
  const skip = (currentPage - 1) * PAGE_SIZE;

  const artist = filters.artist as string;
  const category = filters.type as string; 
  const maxPrice = filters.maxPrice as string;

  // Construct the dynamic MongoDB query
  const query: any = {};

  if (artist && artist !== "All Artists") {
    query.artist = artist;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (maxPrice) {
    query.price = { $lte: Number(maxPrice) };
  }

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  // Fetch the filtered products
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .lean();
  
  const sellers = await Seller.find({}, "name").lean();
  const artistNames: string[] = sellers
    .map(seller => seller.name)
    .filter((name): name is string => Boolean(name));

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
        
        <Filters artists={artistNames} />

        <div className={styles.galleryContainer}>
          <section className={styles.productGallery}>
            {products.length === 0 ? (
              <p className={styles.noProducts}>No products match your current filters.</p>
            ) : (
              products.map((product: any) => (
                <ProductCard
                  key={String(product._id)}
                  id={String(product._id)}
                  title={product.title}
                  artist={product.artist}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                />
              ))
            )}
          </section>
          <PaginationControls 
            currentPage={currentPage} 
            totalPages={totalPages} 
          />
        </div>
      </div>
    </div>
  );
}