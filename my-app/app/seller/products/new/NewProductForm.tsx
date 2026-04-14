"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProduct } from "../../../seller/actions";
import styles from "./newProduct.module.css";

export function NewProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, null);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Item Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="e.g. Hand-thrown Ceramic Mug"
          className={styles.input}
        />
        {state?.fieldErrors?.title && (
          <p className={styles.fieldError}>{state.fieldErrors.title}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          placeholder="Describe the materials, techniques, dimensions, and what makes this piece special..."
          className={styles.textarea}
          rows={5}
        />
        {state?.fieldErrors?.description && (
          <p className={styles.fieldError}>{state.fieldErrors.description}</p>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className={styles.input}
          />
          {state?.fieldErrors?.price && (
            <p className={styles.fieldError}>{state.fieldErrors.price}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <select id="category" name="category" className={styles.input}>
            <option value="">Select a category</option>
            <option value="Pottery">Pottery</option>
            <option value="Woodwork">Woodwork</option>
            <option value="Textile">Textile</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Painting">Painting</option>
            <option value="Glasswork">Glasswork</option>
            <option value="Leatherwork">Leatherwork</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="image" className={styles.label}>
          Image URL <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="image"
          name="image"
          type="url"
          placeholder="https://example.com/my-item.jpg"
          className={styles.input}
        />
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <Link href="/seller/profile" className={styles.cancelLink}>
          Cancel
        </Link>
        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? "Listing..." : "List Item"}
        </button>
      </div>
    </form>
  );
}
