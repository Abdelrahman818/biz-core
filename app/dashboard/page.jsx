"use client";

import { useState, useEffect, useRef } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  UserPlus,
  Clock,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { dashboardAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- MAIN ---------------- */

function DashboardContent() {
  const router = useRouter();
  const { businessId } = useAuth();
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadedBusinessIdRef = useRef(null);
  const inFlightBusinessIdRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // If no businessId, we don't set state - let ProtectedRoute redirect
    if (!businessId) {
      return;
    }

    if (
      loadedBusinessIdRef.current === businessId ||
      inFlightBusinessIdRef.current === businessId
    ) {
      return;
    }

    const fetchDashboard = async () => {
      inFlightBusinessIdRef.current = businessId;
      setLoading(true);
      setError(null);

      // Set a 15-second timeout for the request
      timeoutRef.current = setTimeout(() => {
        setError("Dashboard data is taking too long to load. Please refresh the page.");
        setLoading(false);
        inFlightBusinessIdRef.current = null;
      }, 15000);

      try {
        const dashboardData = await dashboardAPI.getSummary(businessId, 4);
        clearTimeout(timeoutRef.current);

        const overviewData = dashboardData.overview || {};
        const recentOrders = dashboardData.recentOrders || [];

        const statsData = [
          {
            title: "Claimed Revenue",
            value: `${overviewData.claimedTotal ?? overviewData.revenue ?? 0} EGP`,
            icon: DollarSign,
            desc: "Delivered orders only",
          },
          {
            title: "Pending Amount",
            value: `${overviewData.pendingTotal ?? 0} EGP`,
            icon: Clock,
            desc: `${overviewData.pendingOrders ?? 0} pending orders`,
          },
          {
            title: "Claimed Orders",
            value: overviewData.claimedOrders ?? overviewData.totalOrders ?? 0,
            icon: ShoppingCart,
            desc: "Delivered orders only",
          },
          {
            title: "Products",
            value: overviewData.totalProducts || 0,
            icon: Package,
            desc: `${overviewData.lowStockCount || 0} low stock`,
          },
        ];

        setStats(statsData);
        setOrders((Array.isArray(recentOrders) ? recentOrders : recentOrders.orders || []).slice(0, 4));
        loadedBusinessIdRef.current = businessId;
      } catch (err) {
        clearTimeout(timeoutRef.current);
        console.error("Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard. Please try again.");
        setStats([
          { title: "Claimed Revenue", value: "0 EGP", icon: DollarSign, desc: "Error loading" },
          { title: "Pending Amount", value: "0 EGP", icon: Clock, desc: "Error loading" },
          { title: "Orders", value: "0", icon: ShoppingCart, desc: "Error loading" },
          { title: "Products", value: "0", icon: Package, desc: "Error loading" },
        ]);
      } finally {
        setLoading(false);
        inFlightBusinessIdRef.current = null;
      }
    };

    fetchDashboard();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [businessId]);

  // Show loading state while fetching business data
  if (loading && !error) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-[#0B1220] dark:text-white px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="opacity-60">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  // Show error state if something went wrong
  if (error) {
    return (
      <main className="min-h-screen bg-white text-black dark:bg-[#0B1220] dark:text-white px-6 py-10">
        <div className="max-w-md mx-auto mt-20">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0B1220] dark:text-white px-6 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-sm opacity-60">
            Welcome back — manage your business
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-4 mb-10">

        {stats.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm opacity-60">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold">
                  {item.value}
                </h2>

                <p className="text-xs opacity-50 mt-1">
                  {item.desc}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-500 text-white">
                <item.icon size={20} />
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Orders */}
        <div className="md:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 p-6">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold">
              Recent Orders
            </h2>

            <button className="text-sm text-blue-500 flex items-center gap-1">
              <TrendingUp size={16} />
              View all
            </button>

          </div>

          <div className="space-y-3">

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <p>No recent orders</p>
              </div>
            ) : (
              orders.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 p-5 transition hover:bg-black/5 dark:hover:bg-white/5"
                >

                  {/* LEFT SIDE */}
                  <div className="space-y-3">

                    {/* ORDER + STATUS */}
                    <div className="flex items-center justify-between gap-3">

                      <p className="font-semibold text-sm">
                        Order #{item.id}
                      </p>

                      <span className="text-[11px] px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                        {item.status || "pending"}
                      </span>

                    </div>

                    {/* CUSTOMER NAME */}
                    <div className="flex items-center gap-2 text-sm font-medium text-black/80 dark:text-white/80">

                      <span>{item.customer?.name || "Unknown"}</span>

                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">

                      <span>{item.customer?.phone || "N/A"}</span>

                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-center gap-2 text-xs text-black/60 dark:text-white/60">

                      <span>{item.customer?.address || "N/A"}</span>

                    </div>

                  </div>

                  {/* RIGHT SIDE */}
                  <div className="text-right">

                    <div className="text-lg font-bold text-green-500">
                      ${item.total || 0}
                    </div>

                    <div className="text-xs text-black/50 dark:text-white/50">
                      total
                    </div>

                  </div>

                </div>
              ))
            )}

          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6">

            <h2 className="text-lg font-bold mb-4">
              Quick Actions
            </h2>

            <div className="space-y-2">

              <button onClick={() => router.push('/products/new')} className="w-full flex items-center gap-2 rounded-xl border p-3 text-left hover:bg-black/5 dark:hover:bg-white/10">
                <Package size={18} />
                Add Product
              </button>

              <button onClick={() => router.push('/orders/new')} className="w-full flex items-center gap-2 rounded-xl border p-3 text-left hover:bg-black/5 dark:hover:bg-white/10">
                <ShoppingCart size={18} />
                Create Order
              </button>

              <button onClick={() => router.push('/analytics')} className="w-full flex items-center gap-2 rounded-xl border p-3 text-left hover:bg-black/5 dark:hover:bg-white/10">
                <TrendingUp size={18} />
                Analytics
              </button>

              <button onClick={() => router.push('/customers/new')} className="w-full flex items-center gap-2 rounded-xl border p-3 text-left hover:bg-black/5 dark:hover:bg-white/10">
                <UserPlus size={18} />
                Create Customer
              </button>

            </div>
          </div>

          {/* STATUS CARD */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6">

            <h2 className="text-lg font-bold mb-3">
              System Status
            </h2>

            <p className="text-sm opacity-60 mb-4">
              All systems running normally
            </p>

            <div className="flex items-center gap-2 text-green-500 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Online
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
