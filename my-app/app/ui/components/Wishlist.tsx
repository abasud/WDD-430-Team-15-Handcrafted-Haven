"use client";

import { useState, useEffect } from 'react';

interface Props {
  product: {
    id: string;
    title: string;
    image: string;
    price: number;
    artist: string;
    category: string;
  };
  isLoggedIn: boolean; 
}

export default function WishlistCheckbox({ product, isLoggedIn }: Props) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = wishlist.some((item: any) => item.id === product.id);
      setIsSaved(exists);
    }
  }, [product.id, isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (e.target.checked) {
      const itemToSave = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: Number(product.price),
        artist: product.artist,
        category: product.category
      };
      const updated = [...wishlist, itemToSave];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsSaved(true);
    } else {
      const updated = wishlist.filter((item: any) => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsSaved(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <label htmlFor="wishlist-check">
      <input 
        type="checkbox" 
        id="wishlist-check" 
        checked={isSaved}
        onChange={handleChange}
      /> 
      <span>
        {isSaved ? " In your Wishlist" : " Add to Wishlist"}
      </span>
    </label>
  );
}