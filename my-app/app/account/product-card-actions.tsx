"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteProduct } from "./actions";

export default function ProductCardActions({
  productId,
}: {
  productId: string;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        <Link href={`/items/${productId}`}>View</Link>

        <Link href={`/products/${productId}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          style={{
            border: "1px solid #b91c1c",
            background: "#fff",
            color: "#b91c1c",
            padding: "0.5rem 0.9rem",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Delete
        </button>
      </div>

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Are you sure you wish to delete? This action can not be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                style={{
                  border: "1px solid #ccc",
                  background: "#fff",
                  color: "#333",
                  padding: "0.6rem 1rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                No
              </button>

              <form action={deleteProduct}>
                <input type="hidden" name="productId" value={productId} />
                <button
                  type="submit"
                  style={{
                    border: "1px solid #b91c1c",
                    background: "#b91c1c",
                    color: "#fff",
                    padding: "0.6rem 1rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Yes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}