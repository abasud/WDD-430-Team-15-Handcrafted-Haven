import { LoginForm } from "./login-form";
import styles from "./login.module.css";

interface Props {
  searchParams: Promise<{ registered?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const justRegistered = params.registered === "true";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Welcome back to Handcrafted Haven</p>
        </div>
        {justRegistered && (
          <p className={styles.success}>
            Account created! You can now sign in.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
