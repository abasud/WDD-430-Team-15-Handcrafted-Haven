"use client";

import { useActionState } from "react";
import styles from "./new/product-new.module.css";

export type ProductFormState = {
  error?: string;
  fieldErrors?: {
    title?: string;
    price?: string;
    image?: string;
    description?: string;
    category?: string;
    materials?: string;
    dimensions?: string;
    availability?: string;
  };
} | null;

type ProductFormProps = {
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  submitLabel: string;
  pendingLabel: string;
  initialData?: {
    title?: string;
    price?: number;
    image?: string;
    description?: string;
    category?: string;
    materials?: string[];
    dimensions?: string;
    availability?: string;
  };
};

const initialState: ProductFormState = null;

export default function ProductForm({
  action,
  submitLabel,
  pendingLabel,
  initialData,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Title
        <input
          name="title"
          type="text"
          defaultValue={initialData?.title ?? ""}
        />
        {state?.fieldErrors?.title && (
          <span className={styles.error}>{state.fieldErrors.title}</span>
        )}
      </label>

      <label>
        Price
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={initialData?.price ?? ""}
        />
        {state?.fieldErrors?.price && (
          <span className={styles.error}>{state.fieldErrors.price}</span>
        )}
      </label>

      <label>
        Image URL or path
        <input
          name="image"
          type="text"
          defaultValue={initialData?.image ?? ""}
        />
        {state?.fieldErrors?.image && (
          <span className={styles.error}>{state.fieldErrors.image}</span>
        )}
      </label>

      <label>
        Description
        <textarea
          name="description"
          rows={5}
          defaultValue={initialData?.description ?? ""}
        />
        {state?.fieldErrors?.description && (
          <span className={styles.error}>
            {state.fieldErrors.description}
          </span>
        )}
      </label>

      <label>
        Category
        <select name="category" defaultValue={initialData?.category ?? ""}>
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
        <input
          name="materials"
          type="text"
          defaultValue={initialData?.materials?.join(", ") ?? ""}
        />
        {state?.fieldErrors?.materials && (
          <span className={styles.error}>
            {state.fieldErrors.materials}
          </span>
        )}
      </label>

      <label>
        Dimensions
        <input
          name="dimensions"
          type="text"
          defaultValue={initialData?.dimensions ?? ""}
        />
      </label>

      <label>
        Availability
        <input
          name="availability"
          type="text"
          defaultValue={initialData?.availability ?? ""}
        />
        {state?.fieldErrors?.availability && (
          <span className={styles.error}>
            {state.fieldErrors.availability}
          </span>
        )}
      </label>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" disabled={pending} className={styles.submitButton}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}