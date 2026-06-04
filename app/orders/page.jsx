"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
} from "lucide-react";
import { ordersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

const statusStyle = {
  pending:
    "text-yellow-600 bg-yellow-100 dark:bg-yellow-500/10",
  confirmed:
    "text-blue-600 bg-blue-100 dark:bg-blue-500/10",
  processing:
    "text-purple-600 bg-purple-100 dark:bg-purple-500/10",
  completed:
    "text-green-600 bg-green-100 dark:bg-green-500/10",
  cancelled:
    "text-red-600 bg-red-100 dark:bg-red-500/10",
};

const statusIcon = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  completed: Truck,
  cancelled: XCircle,
};

export default function OrdersPage() {
  const { businessId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ordersAPI.getAll(businessId);
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchOrders();
    }
  }, [businessId]);

  const filtered = orders.filter((o) =>
    (o.customer?.name?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <OrdersPageContent 
      orders={filtered} 
      loading={loading} 
      error={error}
      search={search}
      setSearch={setSearch}
    />
  );
}

function OrdersPageContent({ orders, loading, error, search, setSearch }) {
    return (
    <main className="min-h-screen px-6 py-10 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Orders
          </h1>

          <p className="text-sm opacity-60">
            Manage all customer orders
          </p>
        </div>

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
          className="absolute left-3 top-3 opacity-50"
          size={18}
        />

        <input
          placeholder="Search customer..."
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
      {!loading && orders.length === 0 && (
        <div className="text-center py-10 opacity-60">
          <p className="text-lg">No orders found</p>
        </div>
      )}

      {/* ORDERS LIST */}
      {!loading && (
        <div className="space-y-4">

          {orders.map((order) => {
            const StatusIcon =
              statusIcon[order.status] || Clock;

            return (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-black/10 dark:border-white/10 p-5"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <div className="p-3 rounded-xl bg-blue-500 text-white">
                    <Package size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {order.customer?.name || "Unknown"}
                    </h3>

                    <p className="text-sm opacity-60">
                      {order.customer?.phone || "N/A"}
                    </p>

                    <p className="text-xs opacity-50">
                      #{order.id}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                  <div className="text-right">
                    <p className="font-bold">
                      {order.totalPrice || order.total} EGP
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      statusStyle[order.status] || statusStyle.pending
                    }`}
                  >
                    {StatusIcon && <StatusIcon size={14} />}
                    {order.status}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </main>
    );
}
