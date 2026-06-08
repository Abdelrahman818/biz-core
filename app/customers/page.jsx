"use client";

import { useState, useEffect } from "react";

import {
  User,
  Phone,
  Search,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { customersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- MAIN ---------------- */

export default function CustomersPage() {
  const { businessId } = useAuth();
  const [customers, setCustomers] = useState({ data: [], total: 0, count: 0, skip: 0, limit: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await customersAPI.getAll(businessId);
        if (Array.isArray(data)) {
          setCustomers({ data, total: data.length, count: data.length, skip: 0, limit: data.length });
        } else if (data && data.data) {
          setCustomers(data);
        } else {
          setCustomers({ data: [], total: 0, count: 0, skip: 0, limit: 50 });
        }
      } catch (err) {
        setError("Failed to load customers");
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchCustomers();
    }
  }, [businessId]);

  const filtered = (customers.data || []).filter(
    (c) =>
      (c.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Customers
        </h1>

        <p className="text-sm opacity-60">
          Manage your customer database
        </p>

      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="relative mb-6">

        <Search
          size={18}
          className="absolute left-3 top-3 opacity-50"
        />

        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent"
        />

      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-10 opacity-60">
          <p className="text-lg">No customers found</p>
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid gap-4">

          {filtered.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className="p-3 rounded-xl bg-blue-500 text-white">
                  <User size={18} />
                </div>

                <div>

                  <h2 className="font-bold">
                    {customer.name}
                  </h2>

                  <div className="flex items-center gap-2 text-sm opacity-60">
                    <Phone size={14} />
                    {customer.phone}
                  </div>

                </div>

              </div>

              {/* RIGHT STATS */}
              <div className="flex items-center gap-6">

                {/* ORDERS */}
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm opacity-60 justify-center">
                    <ShoppingCart size={14} />
                    Orders
                  </div>

                  <p className="font-bold">
                    {customer.orders || 0}
                  </p>
                </div>

                {/* SPENT */}
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm opacity-60 justify-center">
                    <DollarSign size={14} />
                    Spent
                  </div>

                  <p className="font-bold text-green-600">
                    {customer.spent || customer.totalSpent || 0} EGP
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}
