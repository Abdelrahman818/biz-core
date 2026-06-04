"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Package, Save } from "lucide-react";
import { productsAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function NewProductPage() {
  const router = useRouter();
  const { businessId } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);

  const createProduct = async (event) => {
    event.preventDefault();

    if (!businessId) {
      toast.error("Business setup is still loading");
      return;
    }

    if (!name.trim() || !price || stock === "") {
      toast.error("Fill all product fields");
      return;
    }

    try {
      setSaving(true);
      await productsAPI.create(
        {
          name: name.trim(),
          price: Number(price),
          stock: Number(stock),
        },
        businessId
      );
      toast.success("Product created");
      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black dark:bg-[#0B1220] dark:text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-500">
            <Package />
          </div>
          <div>
            <h1 className="text-3xl font-bold">New Product</h1>
            <p className="text-sm opacity-60">
              Add inventory that can be attached to orders.
            </p>
          </div>
        </div>

        <form
          onSubmit={createProduct}
          className="space-y-5 rounded-2xl border bg-white p-6 dark:bg-white/5"
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Product name"
            className="w-full rounded-xl border bg-transparent px-4 py-3"
          />

          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price"
            type="number"
            min="0"
            className="w-full rounded-xl border bg-transparent px-4 py-3"
          />

          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            placeholder="Stock"
            type="number"
            min="0"
            className="w-full rounded-xl border bg-transparent px-4 py-3"
          />

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Create Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
