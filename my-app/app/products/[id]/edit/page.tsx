import { auth } from "../../../../auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "../../../../lib/db";
import Product from "../../../../lib/models/Product";
import ProductForm from "../../product-form";
import { updateProductAction } from "./actions";
import styles from "../../new/product-new.module.css";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; name?: string; role?: "admin" | "buyer" | "seller" }
    | undefined;

  if (!user?.id) redirect("/login");
  if (user.role !== "seller") redirect("/account");

  const { id } = await params;

  await connectDB();

  const product = await Product.findOne({
    _id: id,
    userId: user.id,
  }).lean();

  if (!product) notFound();

  async function boundUpdateAction(prevState: any, formData: FormData) {
    "use server";
    formData.set("productId", id);
    return updateProductAction(prevState, formData);
  }

  return (
    <div className={styles.page}>
      <h1>Edit Product</h1>
      <p>
        Seller: <strong>{user.name}</strong>
      </p>

      <ProductForm
        action={boundUpdateAction}
        submitLabel="Save Changes"
        pendingLabel="Saving..."
        initialData={{
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          materials: product.materials,
          dimensions: product.dimensions,
          availability: product.availability,
        }}
      />
    </div>
  );
}