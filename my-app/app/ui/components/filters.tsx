import { useState } from "react";
import styles from "../page.module.css";

export default function Filters() {

    const [maxPrice, setMaxPrice] = useState<number>(1000);

    return (
    <aside className={styles.filters}>
        <h3>Filters</h3>
        <div className={`${styles.filterGroup} ${styles.firstFilter}`}>
            <label>Artist</label>
            <select>
                <option value="all">All Artists</option>
                <option value="Elena Gomez">Elena Gomez</option>
                <option value="Karl Porter">Karl Porter</option>
                <option value="Maya Lee">Maya Lee</option>
                <option value="Dominic Chen">Dominic Chen</option>
            </select>
        </div>          
        <div className={styles.filterGroup}>
            <label>Type</label>
            <select>
                <option value="all">All Types</option>
                <option value="pottery">Pottery</option>
                <option value="woodwork">Woodwork</option>
                <option value="textile">Textile</option>
                <option value="jewelry">Jewelry</option>
            </select>
        </div>
        <div className={styles.filterGroup}>
            <label>Price Range: $100 - ${maxPrice}</label>      
            <input
                className={styles.priceRange}
                type="range" 
                min="100" 
                max="1000" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
        </div>
    </aside>
  );
};