"use client";

import { useEffect, useState } from 'react';
import ProductCard from "./productCard";
import styles from "../../ui/page.module.css";

export default function WishlistManager() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);
  }, []);

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  
  if (!mounted) return null;

  if (wishlist.length === 0) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
  <div className={styles.productGallery}>
    {wishlist.map((product) => (
      <div key={product.id} className={styles.cardWrapper}>
        
        <ProductCard 
          id={product.id}
          title={product.title}
          artist={product.artist}
          category={product.category}
          price={product.price}
          image={product.image}
        />

        <button 
          className={styles.deleteBtn} 
          onClick={(e) => removeItem(e, product.id)}
          title="Remove from wishlist"
        >
          Remove from wishlist
        </button>

      </div>
    ))}
  </div>
);
}