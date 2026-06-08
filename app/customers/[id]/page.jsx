"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Phone,
  ShoppingCart,
  DollarSign,
  Package,
  MapPin,
  Clock,
} from "lucide-react";
import { customersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- STATUS STYLE ---------------- */

const statusStyleMap = {
  pending: "text-yellow-600",
  confirmed: "text-blue-600",
  processing: "text-purple-600",
  completed: "text-green-600",
  cancelled: "text-red-600",
};

const getStatusStyle = (status) =>
  statusStyleMap[status?.toLowerCase()] || "text-gray-600";

/* ---------------- MAIN ---------------- */

export default function CustomerDetailsPage() {
  const params = useParams();
  const customerId = params.id;
  const { businessId } = useAuth();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await customersAPI.getById(customerId, businessId);
        setCustomer(data);
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    if (customerId && businessId) {
      fetchCustomer();
    }
  }, [customerId, businessId]);

  return (
    <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          {loading ? "Loading..." : customer?.name || "Customer"}
        </h1>

        <p className="text-sm opacity-60">
          Customer history
        </p>

      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* CONTENT */}
      {!loading && customer && (
        <>
      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        {/* SPENT */}
        <div className="rounded-2xl border p-5">

          <div className="flex items-center gap-2 opacity-60 text-sm">
            <DollarSign size={16} />
            Total Spent
          </div>

          <p className="text-2xl font-bold text-green-600">
            {customer.claimedTotal ?? customer.totalSpent ?? customer.spent ?? 0} EGP
          </p>

        </div>

        {/* PENDING AMOUNT */}
        <div className="rounded-2xl border p-5">

          <div className="flex items-center gap-2 opacity-60 text-sm">
            <Clock size={16} />
            Pending Amount
          </div>

          <p className="text-2xl font-bold text-yellow-600">
            {customer.pendingTotal ?? 0} EGP
          </p>

        </div>

        {/* CLAIMED ORDERS */}
        <div className="rounded-2xl border p-5">

          <div className="flex items-center gap-2 opacity-60 text-sm">
            <ShoppingCart size={16} />
            Claimed Orders
          </div>

          <p className="text-2xl font-bold">
            {customer.claimedOrders ?? customer.totalOrders ?? 0}
          </p>

        </div>

        {/* PENDING ORDERS */}
        <div className="rounded-2xl border p-5">

          <div className="flex items-center gap-2 opacity-60 text-sm">
            <Clock size={16} />
            Pending Orders
          </div>

          <p className="text-2xl font-bold text-yellow-600">
            {customer.pendingOrders ?? 0}
          </p>

        </div>

        {/* CONTACT */}
        <div className="rounded-2xl border p-5 space-y-2 md:col-span-4">

          <div className="flex items-center gap-2 opacity-60 text-sm">
            <User size={16} />
            Contact Info
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} />
            {customer.phone}
          </div>

          <div className="flex items-center gap-2 text-sm opacity-70">
            <MapPin size={14} />
            {customer.address || "N/A"}
          </div>

        </div>

      </div>

      {/* ORDERS LIST */}
      <div className="rounded-2xl border p-6">

        <h2 className="text-xl font-bold mb-4">
          Customer History
        </h2>

        {!customer.orders || customer.orders.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">

            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl border"
              >

                {/* LEFT */}
                <div className="flex items-center gap-2">

                  <Package size={18} />

                  <div>
                    <p className="font-medium">
                      Order #{order.id}
                    </p>

                    <p
                      className={`text-sm ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </p>

                    <p className="text-xs opacity-60">
                      {order.items?.length || 0} items
                    </p>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="font-bold text-green-600">
                  {order.total || order.totalPrice || 0} EGP
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

        </>
      )}

    </main>
  );
}
