import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  title,
  artist,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link href={`/items/${id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            alt={`Image of ${title}`}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className={styles.details}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.artist}>By {artist}</p>
          <div className={styles.footer}>
            <span className={styles.price}>${price.toFixed(2)}</span>
            <span className={styles.viewButton}>View →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}