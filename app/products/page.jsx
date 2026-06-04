"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  DollarSign,
  Package,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { productsAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

const Toast = ({ message, type = "success" }) => (
  <div
    className={`fixed top-6 right-6 z-50 rounded-xl px-4 py-3 text-white shadow-lg ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`}
  >
    {message}
  </div>
);

export default function ProductsPage() {
  const { businessId } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsAPI.getAll(businessId);
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchProducts();
    }
  }, [businessId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const addProduct = async () => {
    if (!businessId) {
      showToast("Business setup is still loading", "error");
      return;
    }

    if (!name.trim() || !price || stock === "") {
      showToast("Fill all fields", "error");
      return;
    }

    try {
      const newProduct = await productsAPI.create(
        {
          name: name.trim(),
          price: Number(price),
          stock: Number(stock),
        },
        businessId
      );

      setProducts([newProduct, ...products]);
      setName("");
      setPrice("");
      setStock("");
      showToast("Product added");
    } catch (err) {
      showToast("Failed to add product", "error");
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsAPI.delete(id, businessId);
      setProducts(products.filter((product) => product.id !== id));
      showToast("Product deleted");
    } catch (err) {
      showToast("Failed to delete product", "error");
      console.error("Error deleting product:", err);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock ?? 0));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditStock("");
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editPrice || editStock === "") return;

    try {
      await productsAPI.update(
        editingId,
        {
          name: editName.trim(),
          price: Number(editPrice),
          stock: Number(editStock),
        },
        businessId
      );

      setProducts(
        products.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: editName.trim(),
                price: Number(editPrice),
                stock: Number(editStock),
              }
            : product
        )
      );

      showToast("Product updated");
      cancelEdit();
    } catch (err) {
      showToast("Failed to update product", "error");
      console.error("Error updating product:", err);
    }
  };

  const filtered = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-6 py-10 text-black dark:from-[#0B1220] dark:to-[#0F172A] dark:text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Package />
            Products
          </h1>
          <p className="text-sm opacity-60">
            Manage your inventory with full control
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      {error && (
        <div className="mx-auto mb-6 max-w-5xl rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}

      {!loading && (
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 dark:bg-white/5">
            <h2 className="mb-4 font-bold">Add Product</h2>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Product name"
              className="mb-3 w-full rounded-xl border bg-transparent px-4 py-3"
            />

            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price"
              type="number"
              min="0"
              className="mb-3 w-full rounded-xl border bg-transparent px-4 py-3"
            />

            <input
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              placeholder="Stock"
              type="number"
              min="0"
              className="mb-4 w-full rounded-xl border bg-transparent px-4 py-3"
            />

            <button
              onClick={addProduct}
              className="w-full rounded-xl bg-blue-600 py-3 text-white"
            >
              <Plus size={18} className="mr-1 inline" />
              Add
            </button>
          </div>

          <div className="lg:col-span-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="mb-5 w-full rounded-xl border bg-white px-4 py-3 dark:bg-white/5"
            />

            {filtered.length === 0 && (
              <div className="py-10 text-center opacity-60">
                <p className="text-lg">No products found</p>
              </div>
            )}

            <div className="space-y-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border bg-white p-5 dark:bg-white/5"
                >
                  <div className="flex-1">
                    {editingId === product.id ? (
                      <div className="space-y-2">
                        <input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="w-full rounded-lg border bg-transparent px-3 py-2"
                        />

                        <input
                          value={editPrice}
                          onChange={(event) =>
                            setEditPrice(event.target.value)
                          }
                          type="number"
                          min="0"
                          className="w-full rounded-lg border bg-transparent px-3 py-2"
                        />

                        <input
                          value={editStock}
                          onChange={(event) =>
                            setEditStock(event.target.value)
                          }
                          type="number"
                          min="0"
                          className="w-full rounded-lg border bg-transparent px-3 py-2"
                        />
                      </div>
                    ) : (
                      <>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-lg font-semibold hover:text-blue-600"
                        >
                          {product.name}
                        </Link>

                        <p className="flex items-center gap-1 text-green-600">
                          <DollarSign size={16} />
                          {product.price}
                        </p>

                        <p className="text-sm opacity-60">
                          Stock: {product.stock ?? 0}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === product.id ? (
                      <>
                        <button onClick={saveEdit} className="text-green-600">
                          <Check />
                        </button>

                        <button onClick={cancelEdit} className="text-red-500">
                          <X />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(product)}
                          className="text-blue-600"
                        >
                          <Pencil />
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-500"
                        >
                          <Trash2 />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
