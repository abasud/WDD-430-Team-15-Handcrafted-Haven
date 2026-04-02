"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./login.module.css";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
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
          autoComplete="current-password"
          placeholder="••••••••"
          className={styles.input}
        />
      </div>

      {state?.error && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" className={styles.button} disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
