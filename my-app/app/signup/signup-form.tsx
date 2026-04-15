"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";
import styles from "./signup.module.css";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          className={styles.input}
        />
        {state?.fieldErrors?.name && (
          <p className={styles.fieldError}>{state.fieldErrors.name}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={styles.input}
        />
        {state?.fieldErrors?.email && (
          <p className={styles.fieldError}>{state.fieldErrors.email}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          className={styles.input}
        />
        {state?.fieldErrors?.password && (
          <p className={styles.fieldError}>{state.fieldErrors.password}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Account Type</label>
        <div className={styles.roleGroup}>
          <label className={styles.roleOption}>
            <input
              type="radio"
              name="role"
              value="buyer"
              defaultChecked
              className={styles.radioInput}
            />
            <span className={styles.roleCard}>
              <span className={styles.roleIcon}></span>
              <span className={styles.roleTitle}>Buyer</span>
              <span className={styles.roleDesc}>Discover &amp; purchase unique handcrafted items</span>
            </span>
          </label>
          <label className={styles.roleOption}>
            <input
              type="radio"
              name="role"
              value="seller"
              className={styles.radioInput}
            />
            <span className={styles.roleCard}>
              <span className={styles.roleIcon}></span>
              <span className={styles.roleTitle}>Seller</span>
              <span className={styles.roleDesc}>List and sell your handcrafted creations</span>
            </span>
          </label>
        </div>
        {state?.fieldErrors?.role && (
          <p className={styles.fieldError}>{state.fieldErrors.role}</p>
        )}
      </div>

      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? "Creating account..." : "Create Account"}
      </button>

      <p className={styles.loginLink}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
