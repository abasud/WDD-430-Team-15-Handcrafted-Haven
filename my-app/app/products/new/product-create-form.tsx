"use client";

import { useActionState } from "react";
import {
  createProductAction,
  type CreateProductState,
} from "./actions";
import styles from "./product-new.module.css";

const initialState: CreateProductState = null;

export default function ProductCreateForm() {
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialState
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Title
        <input name="title" type="text" />
        {state?.fieldErrors?.title && (
          <span className={styles.error}>{state.fieldErrors.title}</span>
        )}
      </label>

      <label>
        Price
        <input name="price" type="number" step="0.01" min="0" />
        {state?.fieldErrors?.price && (
          <span className={styles.error}>{state.fieldErrors.price}</span>
        )}
      </label>

      <label>
        Image URL or path
        <input name="image" type="text" />
        {state?.fieldErrors?.image && (
          <span className={styles.error}>{state.fieldErrors.image}</span>
        )}
      </label>

      <label>
        Description
        <textarea name="description" rows={5} />
        {state?.fieldErrors?.description && (
          <span className={styles.error}>
            {state.fieldErrors.description}
          </span>
        )}
      </label>

      <label>
        Category
        <select name="category" defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          <option value="pottery">Pottery</option>
          <option value="woodwork">Woodwork</option>
          <option value="textile">Textile</option>
          <option value="jewelry">Jewelry</option>
        </select>
        {state?.fieldErrors?.category && (
          <span className={styles.error}>{state.fieldErrors.category}</span>
        )}
      </label>

      <label>
        Materials (comma separated)
        <input name="materials" type="text" />
        {state?.fieldErrors?.materials && (
          <span className={styles.error}>
            {state.fieldErrors.materials}
          </span>
        )}
      </label>

      <label>
        Dimensions
        <input name="dimensions" type="text" />
      </label>

      <label>
        Availability
        <input name="availability" type="text" />
        {state?.fieldErrors?.availability && (
          <span className={styles.error}>
            {state.fieldErrors.availability}
          </span>
        )}
      </label>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" disabled={pending} className={styles.submitButton}>
        {pending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}