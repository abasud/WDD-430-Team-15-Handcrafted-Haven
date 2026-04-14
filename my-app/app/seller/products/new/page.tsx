import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { NewProductForm } from "./NewProductForm";
import styles from "./newProduct.module.css";

export default async function NewProductPage() {
  const session = await auth();
  const sessionUser = session?.user as { id?: string; role?: string } | undefined;

  if (!sessionUser?.id || sessionUser.role !== "seller") {
    redirect("/");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>List a New Item</h1>
        <p className={styles.subheading}>
          Describe your handcrafted piece so buyers can appreciate your craftsmanship.
        </p>
        <NewProductForm />
      </div>
    </div>
  );
}
