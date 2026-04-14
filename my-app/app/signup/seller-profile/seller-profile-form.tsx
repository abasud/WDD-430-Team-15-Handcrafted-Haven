"use client";

import { useActionState } from "react";
import { createSellerProfileAction } from "./actions";
import styles from "./seller-profile.module.css";

type Props = {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
};

export function SellerProfileForm({ sellerId, sellerName, sellerEmail }: Props) {
  const [state, formAction, isPending] = useActionState(createSellerProfileAction, null);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="sellerId" value={sellerId} />

      <div className={styles.readOnlyBox}>
        <p>
          <strong>Name:</strong> {sellerName}
        </p>
        <p>
          <strong>Email:</strong> {sellerEmail}
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Craft Category
        </label>
        <select id="category" name="category" className={styles.input} defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          <option value="pottery">Pottery</option>
          <option value="wood">Wood</option>
          <option value="textile">Textile</option>
          <option value="painting">Painting</option>
        </select>
        {state?.fieldErrors?.category && (
          <p className={styles.fieldError}>{state.fieldErrors.category}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="image" className={styles.label}>
          Profile Image Path
        </label>
        <input
          id="image"
          name="image"
          type="text"
          placeholder="/seller-images/my-photo.jpg"
          className={styles.input}
        />
        <p className={styles.helperText}>
          Leave blank to use <code>/seller-images/default-image.jpg</code>.
        </p>
        {state?.fieldErrors?.image && (
          <p className={styles.fieldError}>{state.fieldErrors.image}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="story" className={styles.label}>
          Your Story
        </label>
        <textarea
          id="story"
          name="story"
          rows={6}
          placeholder="Tell buyers about your work, inspiration, and process..."
          className={styles.textarea}
          required
        />
        {state?.fieldErrors?.story && (
          <p className={styles.fieldError}>{state.fieldErrors.story}</p>
        )}
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.field}>
          <label htmlFor="age" className={styles.label}>
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min="18"
            max="120"
            className={styles.input}
            placeholder="29"
          />
          {state?.fieldErrors?.age && (
            <p className={styles.fieldError}>{state.fieldErrors.age}</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="residenceCity" className={styles.label}>
            City
          </label>
          <input
            id="residenceCity"
            name="residenceCity"
            type="text"
            className={styles.input}
            placeholder="Seoul"
            required
          />
          {state?.fieldErrors?.residenceCity && (
            <p className={styles.fieldError}>{state.fieldErrors.residenceCity}</p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="residenceCountry" className={styles.label}>
          Country
        </label>
        <input
          id="residenceCountry"
          name="residenceCountry"
          type="text"
          className={styles.input}
          placeholder="South Korea"
          required
        />
        {state?.fieldErrors?.residenceCountry && (
          <p className={styles.fieldError}>{state.fieldErrors.residenceCountry}</p>
        )}
      </div>

      {state?.fieldErrors?.sellerId && (
        <p className={styles.fieldError}>{state.fieldErrors.sellerId}</p>
      )}

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? "Saving profile..." : "Save Seller Profile"}
      </button>
    </form>
  );
}