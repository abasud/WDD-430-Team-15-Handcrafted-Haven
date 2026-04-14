"use client";

import { useTransition } from "react";
import { deleteProduct } from "../actions";
import styles from "./profile.module.css";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Remove this item from your shop?")) return;
    startTransition(async () => {
      await deleteProduct(productId);
      // The page will revalidate on next navigation; for instant feedback we reload
      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={styles.deleteButton}
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
