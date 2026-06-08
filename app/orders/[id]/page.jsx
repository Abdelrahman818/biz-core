"use client";

import { createElement, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Package,
  Phone,
  User,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { ordersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- STATUS STYLE ---------------- */

const statusStyleMap = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-500/10",
  processing: "bg-purple-100 text-purple-700 dark:bg-purple-500/10",
  completed: "bg-green-100 text-green-700 dark:bg-green-500/10",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10",
};

/* ---------------- STATUS ICON ---------------- */

const statusIconMap = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  completed: Truck,
  cancelled: XCircle,
};

const getStatusStyle = (status) =>
  statusStyleMap[status?.toLowerCase()] || statusStyleMap.pending;

const getStatusIcon = (status) =>
  statusIconMap[status?.toLowerCase()] || Clock;

/* ---------------- MAIN ---------------- */

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;
  const { businessId } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ordersAPI.getById(orderId, businessId);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && businessId) {
      fetchOrder();
    }
  }, [orderId, businessId]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await ordersAPI.updateStatus(orderId, newStatus, businessId);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
          {error || "Order not found"}
        </div>
      </main>
    );
  }

  const total = order.total || 0;
  const statusIcon = getStatusIcon(order.status);

  return (
    <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Order Details
          </h1>

          <p className="text-sm opacity-60">
            {order.id}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusStyle(order.status)}`}
        >
          {createElement(statusIcon, { size: 16 })}
          {order.status}
        </div>

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* CUSTOMER INFO */}
        <div className="rounded-2xl border p-6 space-y-4">

          <h2 className="text-lg font-bold mb-2">
            Customer Info
          </h2>

          <div className="flex items-center gap-2">
            <User size={18} />
            <span>{order.customer?.name || "Unknown"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={18} />
            <span>{order.customer?.phone || ""}</span>
          </div>

        </div>

        {/* ITEMS */}
        <div className="md:col-span-2 rounded-2xl border p-6">

          <h2 className="text-lg font-bold mb-4">
            Items
          </h2>

          <div className="space-y-3">

            {!order.items || order.items.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <p>No items in this order</p>
              </div>
            ) : (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border"
                >

                  <div className="flex items-center gap-2">
                    <Package size={18} />
                    <span>{item.name}</span>
                  </div>

                  <span className="font-bold text-green-600">
                    {item.price} EGP
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* TOTAL + STATUS CONTROL */}
      <div className="mt-6 grid md:grid-cols-3 gap-6">

        {/* TOTAL */}
        <div className="rounded-2xl border p-6">

          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} />
            <h2 className="font-bold">
              Total
            </h2>
          </div>

          <p className="text-2xl font-bold text-green-600">
            {total} EGP
          </p>

        </div>

        {/* STATUS CONTROL */}
        <div className="md:col-span-2 rounded-2xl border p-6">

          <h2 className="font-bold mb-4">
            Update Status
          </h2>

          <div className="flex flex-wrap gap-3">

            {[
              "pending",
              "confirmed",
              "processing",
              "completed",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={updating || order.status === status}
                className={`px-4 py-2 rounded-xl border transition ${
                  order.status === status
                    ? status === "cancelled"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-black/5 dark:hover:bg-white/10"
                } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {updating && order.status === status ? "..." : status}
              </button>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}
