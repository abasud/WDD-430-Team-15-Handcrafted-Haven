"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  artist: string;
  price: number;
  image: string;
}

const DEFAULT_IMAGE = "/card-images/default-image.jpg";

export default function ProductCard({
  id,
  title,
  artist,
  category,
  price,
  image,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    image?.trim() ? image : DEFAULT_IMAGE
  );

  return (
    <Link href={`/items/${id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={imgSrc}
            alt={`Image of ${title}`}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(DEFAULT_IMAGE)}
          />
        </div>
        <div className={styles.details}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.artist}>By {artist}</p>
          <p className={styles.artist}>Category: {category}</p>
          <div className={styles.footer}>
            <span className={styles.price}>${price.toFixed(2)}</span>
            <span className={styles.viewButton}>View →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
