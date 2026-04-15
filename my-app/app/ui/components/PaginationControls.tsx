"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button 
        className={styles.pageButton}
        disabled={currentPage <= 1} 
        onClick={() => changePage(currentPage - 1)}
      >
        ← Prev
      </button>

      <span className={styles.pageInfo}>
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button 
        className={styles.pageButton}
        disabled={currentPage >= totalPages} 
        onClick={() => changePage(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
}