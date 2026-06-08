"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ShoppingCart,
  MapPin,
  User,
  Phone,
  FileText,
} from "lucide-react";

import toast from "react-hot-toast";
import { customersAPI, productsAPI, ordersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { businessId } = useAuth();
  const initialCustomerName = searchParams.get("name") || "";
  const initialPhone = searchParams.get("phone") || "";
  const initialAddress = searchParams.get("address") || "";

  // API Data
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mixed Customer Selection State
  const [isNewCustomer, setIsNewCustomer] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Customer Form Fields
  const [customerName, setCustomerName] = useState(initialCustomerName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);

  // Order Fields
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);

  // Product Selection Form Fields
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState(1);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [custData, prodData] = await Promise.all([
          customersAPI.getAll(businessId),
          productsAPI.getAll(businessId),
        ]);

        const resolvedCustomers = Array.isArray(custData)
          ? custData
          : custData?.data || custData?.customers || [];

        const resolvedProducts = Array.isArray(prodData)
          ? prodData
          : prodData?.data || prodData?.products || [];

        setCustomers(resolvedCustomers);
        setProducts(resolvedProducts);
      } catch (err) {
        console.error("Error loading order page data:", err);
        toast.error("Failed to load customers or products");
      } finally {
        setLoading(false);
      }
    };
    if (businessId) {
      loadData();
    }
  }, [businessId]);

  // Handle Customer Selection change
  const handleCustomerSelect = (id) => {
    setSelectedCustomerId(id);
    if (id) {
      const cust = customers.find((c) => c.id === Number(id));
      if (cust) {
        setCustomerName(cust.name);
        setPhone(cust.phone);
        setAddress(cust.address);
      }
    } else {
      setCustomerName("");
      setPhone("");
      setAddress("");
    }
  };

  const addProduct = () => {
    if (!selectedProductId) {
      return toast.error("Please select a product from the list");
    }
    if (!productQuantity || productQuantity < 1) {
      return toast.error("Quantity must be at least 1");
    }

    // Check if product is already added
    const exists = items.some((item) => item.product_id === Number(selectedProductId));
    if (exists) {
      return toast.error("Product already added. Remove it to change quantity.");
    }

    // Check stock availability
    const selectedProd = products.find((p) => p.id === Number(selectedProductId));
    if (selectedProd && selectedProd.stock !== undefined && Number(productQuantity) > selectedProd.stock) {
      return toast.error(`Not enough stock. Only ${selectedProd.stock} available for "${selectedProd.name}"`);
    }

    const newItem = {
      product_id: Number(selectedProductId),
      name: productName,
      price: Number(productPrice),
      quantity: Number(productQuantity),
    };

    setItems([...items, newItem]);
    toast.success("Product added");

    setSelectedProductId("");
    setProductName("");
    setProductPrice("");
    setProductQuantity(1);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    toast.success("Product removed");
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const createOrder = async () => {
    if (isNewCustomer) {
      if (!customerName || !phone || !address) {
        return toast.error("Please fill in all customer fields");
      }
    } else {
      if (!selectedCustomerId) {
        return toast.error("Please select an existing customer");
      }
    }

    if (items.length === 0) {
      return toast.error("Please add at least one product to the order");
    }

    try {
      setSubmitting(true);
      let customerId = selectedCustomerId;

      if (isNewCustomer) {
        // Create the new customer first
        const custRes = await customersAPI.create({
          name: customerName,
          phone,
          address,
        }, businessId);

        if (custRes && custRes.customer && custRes.customer.id) {
          customerId = custRes.customer.id;
        } else {
          throw new Error("Failed to retrieve new customer ID");
        }
      }

      // Create the order payload
      const orderPayload = {
        customer_id: Number(customerId),
        business_id: businessId,
        total: Number(total),
        status: "pending",
        notes: notes || "",
        items: items.map((item) => ({
          product_id: item.product_id,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      await ordersAPI.create(orderPayload, businessId);
      toast.success("Order created successfully");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-6 py-10 text-black dark:from-[#0B1220] dark:to-[#0F172A] dark:text-white">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-500/10 p-3">
          <ShoppingCart className="text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Create Order</h1>
          <p className="text-sm opacity-60">Create and manage customer orders</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* CUSTOMER INFO */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-5 text-xl font-bold">Customer Info</h2>

            {/* TOGGLE TABS */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setIsNewCustomer(false);
                  setCustomerName("");
                  setPhone("");
                  setAddress("");
                  setSelectedCustomerId("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${!isNewCustomer
                    ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                Existing Customer
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNewCustomer(true);
                  setCustomerName("");
                  setPhone("");
                  setAddress("");
                  setSelectedCustomerId("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition ${isNewCustomer
                    ? "bg-white text-blue-600 shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                New Customer
              </button>
            </div>

            <div className="space-y-4">
              {/* SELECT EXISTING CUSTOMER */}
              {!isNewCustomer && (
                <div className="relative">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-white dark:bg-[#0B1220] py-3 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                  >
                    <option value="">Choose Customer</option>
                    {customers.map((cust) => (
                      <option key={cust.id} value={cust.id}>
                        {cust.name} ({cust.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* NAME */}
              <div className="relative">
                <User
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50"
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  disabled={!isNewCustomer}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full rounded-2xl border border-black/10 bg-transparent py-3 pr-4 pl-11 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 ${!isNewCustomer ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-white/5" : ""
                    }`}
                />
              </div>

              {/* PHONE */}
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute top-1/2 left-4 -translate-y-1/2 opacity-50"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  disabled={!isNewCustomer}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full rounded-2xl border border-black/10 bg-transparent py-3 pr-4 pl-11 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 ${!isNewCustomer ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-white/5" : ""
                    }`}
                />
              </div>

              {/* ADDRESS */}
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute top-4 left-4 opacity-50"
                />
                <textarea
                  rows={3}
                  placeholder="Customer Address"
                  value={address}
                  disabled={!isNewCustomer}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full resize-none rounded-2xl border border-black/10 bg-transparent py-3 pr-4 pl-11 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 ${!isNewCustomer ? "opacity-60 cursor-not-allowed bg-gray-50 dark:bg-white/5" : ""
                    }`}
                />
              </div>

              {/* NOTES */}
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute top-4 left-4 opacity-50"
                />
                <textarea
                  rows={2}
                  placeholder="Order Notes / Details (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-transparent py-3 pr-4 pl-11 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                />
              </div>
            </div>
          </div>

          {/* ADD PRODUCT */}
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Add Product</h2>
              <Link
                href="/products/new"
                className="text-sm text-blue-500 hover:underline"
              >
                Can&apos;t find a product? Add a new product
              </Link>
            </div>

            <div className="space-y-4">
              {/* SELECT PRODUCT */}
              <div className="relative">
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedProductId(val);
                    if (val) {
                      const prod = products.find((p) => p.id === Number(val));
                      if (prod) {
                        setProductName(prod.name);
                        setProductPrice(prod.price);
                      }
                    } else {
                      setProductName("");
                      setProductPrice("");
                    }
                  }}
                  className="w-full rounded-2xl border border-black/10 bg-white dark:bg-[#0B1220] py-3 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                >
                  <option value="">-- Choose Existing Product --</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id} disabled={prod.stock === 0}>
                      {prod.name} ({prod.price} EGP) — Stock: {prod.stock ?? "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRODUCT NAME (Display only) */}
              <input
                type="text"
                placeholder="Product Name"
                value={productName}
                disabled
                className="w-full rounded-2xl border border-black/10 bg-gray-50 dark:bg-white/5 opacity-70 px-4 py-3 outline-none cursor-not-allowed dark:border-white/10"
              />

              {/* PRICE (Display only) */}
              <input
                type="number"
                placeholder="Price (EGP)"
                value={productPrice}
                disabled
                className="w-full rounded-2xl border border-black/10 bg-gray-50 dark:bg-white/5 opacity-70 px-4 py-3 outline-none cursor-not-allowed dark:border-white/10"
              />

              {/* QUANTITY */}
              <div className="space-y-1">
                <label className="text-xs opacity-60 ml-1">
                  Quantity
                  {selectedProductId && (() => {
                    const p = products.find((pr) => pr.id === Number(selectedProductId));
                    return p ? <span className="ml-2 text-blue-500 font-medium">(Available: {p.stock ?? "N/A"})</span> : null;
                  })()}
                </label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={productQuantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const p = products.find((pr) => pr.id === Number(selectedProductId));
                    if (p && p.stock !== undefined && val > p.stock) {
                      toast.error(`Only ${p.stock} in stock for "${p.name}"`);
                      setProductQuantity(p.stock);
                      return;
                    }
                    setProductQuantity(val);
                  }}
                  className="w-full rounded-2xl border border-black/10 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10"
                  min="1"
                  max={(() => {
                    const p = products.find((pr) => pr.id === Number(selectedProductId));
                    return p?.stock ?? undefined;
                  })()}
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={addProduct}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-3 font-medium text-white transition hover:bg-blue-600"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

          {/* ITEMS */}
          <div className="mb-6 space-y-4">
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-black/10 py-10 text-center opacity-60 dark:border-white/10">
                No products added yet
              </div>
            )}

            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-black/10 p-4 dark:border-white/10"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm opacity-60">
                    Qty: {item.quantity} x {item.price} EGP
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-green-600">
                    {item.price * item.quantity} EGP
                  </span>
                  <button
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-blue-55 p-5 dark:bg-blue-500/10">
            <div>
              <p className="text-sm opacity-60">Total Price</p>
              <h3 className="text-lg font-bold">Order Total</h3>
            </div>
            <span className="text-3xl font-bold text-blue-600">
              {total} EGP
            </span>
          </div>

          {/* CREATE ORDER */}
          <button
            onClick={createOrder}
            disabled={submitting}
            className={`w-full rounded-2xl bg-green-500 py-4 font-semibold text-white transition hover:bg-green-600 ${submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {submitting ? "Creating Order..." : "Create Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
