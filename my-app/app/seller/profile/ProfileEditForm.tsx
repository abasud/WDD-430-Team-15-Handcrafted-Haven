"use client";

import { useState, useActionState } from "react";
import { updateSellerProfile } from "../actions";
import styles from "./profile.module.css";

interface ProfileEditFormProps {
  currentBio: string;
  currentStory: string;
}

export function ProfileEditForm({ currentBio, currentStory }: ProfileEditFormProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateSellerProfile, null);

  return (
    <div className={styles.editSection}>
      <button
        type="button"
        className={styles.editToggleButton}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Cancel" : "Edit Profile"}
      </button>

      {open && (
        <form action={formAction} className={styles.editForm}>
          <div className={styles.field}>
            <label htmlFor="bio" className={styles.label}>
              Short Bio <span className={styles.hint}>(tagline or specialization)</span>
            </label>
            <input
              id="bio"
              name="bio"
              type="text"
              defaultValue={currentBio}
              placeholder="e.g. Hand-thrown ceramics inspired by the Pacific Northwest"
              className={styles.input}
              maxLength={160}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="story" className={styles.label}>
              My Story <span className={styles.hint}>(share your craftsmanship journey)</span>
            </label>
            <textarea
              id="story"
              name="story"
              defaultValue={currentStory}
              placeholder="Tell buyers about yourself, your craft, and what inspires you..."
              className={styles.textarea}
              rows={5}
            />
          </div>

          {state?.error && <p className={styles.error}>{state.error}</p>}

          <button type="submit" className={styles.saveButton} disabled={isPending}>
            {isPending ? "Saving..." : "Save Profile"}
          </button>
        </form>
      )}
    </div>
  );
}
