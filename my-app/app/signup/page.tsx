import { SignupForm } from "./signup-form";
import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join the Handcrafted Haven community</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
