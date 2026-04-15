import ProductCard from "./ui/components/productCard";
import Filters from "./ui/components/filters";
import PaginationControls from "./ui/components/PaginationControls";
import styles from "./ui/page.module.css";
import { connectDB } from "../lib/db";
import Product from "../lib/models/Product";
import Seller from "../lib/models/Seller";
import Search from "./ui/components/search";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type LeanProduct = {
  _id: { toString(): string };
  title: string;
  artist: string;
  category: string;
  price: number;
  image: string;
};

export default async function HomePage({ searchParams }: PageProps) {
  await connectDB();

  const filters = await searchParams;

  const searchQuery =
    typeof filters.query === "string" ? filters.query.trim() : "";

  const PAGE_SIZE = 8;
  const requestedPage = Number(
    typeof filters.page === "string" ? filters.page : "1"
  );
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const artist = typeof filters.artist === "string" ? filters.artist : undefined;
  const category = typeof filters.type === "string" ? filters.type : undefined;
  const maxPrice =
    typeof filters.maxPrice === "string" ? filters.maxPrice : undefined;

  const authenticatedSellers = await Seller.find(
    { authenticated: "Y" },
    "_id name"
  )
    .sort({ name: 1, _id: 1 })
    .lean();

  const authenticatedSellerIds = authenticatedSellers.map((seller) => seller._id);

  const artistNames = authenticatedSellers
    .map((seller) => seller.name)
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));

  const query: Record<string, unknown> = {
    userId: { $in: authenticatedSellerIds },
  };

  if (artist && artist !== "All Artists") {
    query.artist = artist;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  if (maxPrice) {
    query.price = { $lte: Number(maxPrice) };
  }

  if (searchQuery) {
    const escapedSearch = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { artist: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
      { materials: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const skip = (safeCurrentPage - 1) * PAGE_SIZE;

  const products = (await Product.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .lean()) as LeanProduct[];

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Handcrafted Haven</h1>
        <p className={styles.subtitle}>Discover pieces made with passion</p>

        <div className={styles.searchContainer}>
          <Search placeholder="Search by keyword, artist, type, or material" />
        </div>
      </section>

      <div className={styles.mainContent}>
        <Filters artists={artistNames} />

        <div className={styles.galleryContainer}>
          <section className={styles.productGallery}>
            {products.length === 0 ? (
              <p className={styles.noProducts}>
                No products match your current filters.
              </p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id.toString()}
                  id={product._id.toString()}
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
            currentPage={safeCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}