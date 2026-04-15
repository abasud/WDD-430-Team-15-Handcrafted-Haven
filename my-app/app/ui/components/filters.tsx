"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";

interface FiltersProps {
  artists?: string[];
}

export default function Filters({ artists = [] }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice")) || 1000
  );
  const [selectedArtist, setSelectedArtist] = useState(
    searchParams.get("artist") || ""
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className={styles.filters}>
      <h3>Filters</h3>

      <div className={`${styles.filterGroup} ${styles.firstFilter}`}>
        <label>Artist</label>
        <input
          type="text"
          list="artist-options"
          placeholder="Search artist"
          value={selectedArtist}
          onChange={(e) => {
            setSelectedArtist(e.target.value);
            updateFilters("artist", e.target.value);
          }}
          onFocus={(e) => {
            e.currentTarget.value = "";
          }}
        />
        <datalist id="artist-options">
          {artists.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      <div className={styles.filterGroup}>
        <label>Type</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            updateFilters("type", e.target.value);
          }}
        >
          <option value="all">All Types</option>
          <option value="pottery">Pottery</option>
          <option value="woodwork">Woodwork</option>
          <option value="textile">Textile</option>
          <option value="jewelry">Jewelry</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Max Price: ${maxPrice}</label>
        <input
          className={styles.priceRange}
          type="range"
          min="10"
          max="1000"
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          onMouseUp={() => updateFilters("maxPrice", maxPrice.toString())}
          onTouchEnd={() => updateFilters("maxPrice", maxPrice.toString())}
        />
      </div>
    </aside>
  );
}