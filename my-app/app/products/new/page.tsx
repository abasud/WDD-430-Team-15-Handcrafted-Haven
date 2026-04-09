import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import ProductForm from "../product-form";
import { createProductAction } from "./actions";
import styles from "./product-new.module.css";

export default async function NewProductPage() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; name?: string; role?: "buyer" | "seller" }
    | undefined;

  if (!user?.id) redirect("/login");
  if (user.role !== "seller") redirect("/account");

  return (
    <div className={styles.page}>
      <h1>Create a New Product</h1>
      <p>
        Seller: <strong>{user.name}</strong>
      </p>

      <ProductForm
        action={createProductAction}
        submitLabel="Create Product"
        pendingLabel="Creating..."
      />
    </div>
  );
}