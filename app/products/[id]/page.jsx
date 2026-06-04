"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Package } from "lucide-react";
import { productsAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { businessId } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsAPI.getById(id, businessId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id && businessId) {
      fetchProduct();
    }
  }, [id, businessId]);

  const deleteProduct = async () => {
    try {
      await productsAPI.delete(id, businessId);
      toast.success("Product deleted");
      router.push("/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black dark:bg-[#0B1220] dark:text-white">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.push("/products")}
          className="mb-8 inline-flex items-center gap-2 text-sm text-blue-600"
        >
          <ArrowLeft size={16} />
          Products
        </button>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && product && (
          <div className="rounded-2xl border p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-500">
                <Package />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-sm opacity-60">Product #{product.id}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="text-sm opacity-60">Price</p>
                <p className="text-2xl font-bold text-green-600">
                  {product.price} EGP
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm opacity-60">Stock</p>
                <p className="text-2xl font-bold">{product.stock ?? 0}</p>
              </div>
            </div>

            <button
              onClick={deleteProduct}
              className="mt-6 rounded-xl border border-red-500 px-4 py-3 text-sm font-medium text-red-600"
            >
              Delete Product
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
