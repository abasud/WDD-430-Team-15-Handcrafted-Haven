"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProduct } from "./actions";
import styles from "./account.module.css";

export default function ProductCardActions({
  productId,
}: {
  productId: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className={styles.itemActions}>
        <Link href={`/items/${productId}`} className={styles.viewAction}>
          View
        </Link>

        <Link href={`/products/${productId}/edit`} className={styles.editAction}>
          Edit
        </Link>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className={styles.deleteOutlineAction}
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalText}>
              Are you sure you wish to delete? This action can not be undone.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className={styles.cancelButton}
              >
                No
              </button>

              <form action={deleteProduct} className={styles.inlineForm}>
                <input type="hidden" name="productId" value={productId} />
                <button type="submit" className={styles.confirmButton}>
                  Yes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}