"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { dashboardAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- MAIN ---------------- */

export default function AnalyticsPage() {
  const { businessId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const overview = await dashboardAPI.getOverview(businessId);
        setData({
          revenue: overview.revenue || 0,
          orders: overview.totalOrders || 0,
          customers: overview.totalCustomers || 0,
          products: overview.totalProducts || 0,
          status: {
            pending: overview.ordersStatus?.pending || 0,
            confirmed: overview.ordersStatus?.confirmed || 0,
            processing: overview.ordersStatus?.processing || 0,
            completed: overview.ordersStatus?.completed || 0,
            cancelled: overview.ordersStatus?.cancelled || 0,
          },
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
        setData({
          revenue: 0,
          orders: 0,
          customers: 0,
          products: 0,
          status: {
            pending: 0,
            confirmed: 0,
            processing: 0,
            completed: 0,
            cancelled: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchAnalytics();
    }
  }, [businessId]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-white to-gray-100 dark:from-[#0B1220] dark:to-[#0F172A] text-black dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-white to-gray-100 dark:from-[#0B1220] dark:to-[#0F172A] text-black dark:text-white">
        <div className="max-w-6xl mx-auto mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp size={26} />
            Analytics
          </h1>
        </div>
        <div className="text-center py-10 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
          {error || "Failed to load analytics"}
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-white to-gray-100 dark:from-[#0B1220] dark:to-[#0F172A] text-black dark:text-white">

    {/* HEADER */}
    <div className="max-w-6xl mx-auto mb-10">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <TrendingUp size={26} />
        Analytics
      </h1>

      <p className="text-sm opacity-60">
        Overview of your business performance
      </p>

    </div>

    {/* STATS */}
    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5 mb-10">

      <StatCard
        icon={<DollarSign size={18} />}
        label="Revenue"
        value={`${data.revenue} EGP`}
        color="text-green-600"
      />

      <StatCard
        icon={<ShoppingCart size={18} />}
        label="Orders"
        value={data.orders}
      />

      <StatCard
        icon={<Users size={18} />}
        label="Customers"
        value={data.customers}
      />

      <StatCard
        icon={<Package size={18} />}
        label="Products"
        value={data.products}
      />

    </div>

    {/* MAIN GRID */}
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

      {/* ORDER STATUS */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-white/5">

        <h2 className="font-bold mb-4">
          Orders Status
        </h2>

        <div className="space-y-3">

          <StatusRow
            icon={<Clock size={16} />}
            label="Pending"
            value={data.status.pending}
            color="text-yellow-600"
          />

          <StatusRow
            icon={<CheckCircle size={16} />}
            label="Confirmed"
            value={data.status.confirmed}
            color="text-blue-600"
          />

          <StatusRow
            icon={<Package size={16} />}
            label="Processing"
            value={data.status.processing}
            color="text-purple-600"
          />

          <StatusRow
            icon={<TrendingUp size={16} />}
            label="Completed"
            value={data.status.completed}
            color="text-green-600"
          />

          <StatusRow
            icon={<XCircle size={16} />}
            label="Cancelled"
            value={data.status.cancelled}
            color="text-red-600"
          />

        </div>

      </div>

      {/* INSIGHTS */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-white/5">

        <h2 className="font-bold mb-4">
          Business Insights
        </h2>

        <div className="space-y-4 text-sm">

          <div className="flex items-start gap-2">
            <TrendingUp size={16} className="mt-0.5 text-green-600" />
            <p>Revenue is growing steadily</p>
          </div>

          <div className="flex items-start gap-2">
            <ShoppingCart size={16} className="mt-0.5 text-blue-600" />
            <p>Completed orders drive claimed revenue</p>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 text-yellow-600" />
            <p>Low cancellation rate</p>
          </div>

          <div className="flex items-start gap-2">
            <Users size={16} className="mt-0.5 text-purple-600" />
            <p>Strong returning customer base</p>
          </div>

        </div>

      </div>

    </div>

  </main>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ icon, label, value, color = "" }) {
  return (
    <div className="p-5 rounded-2xl border bg-white dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm opacity-60 mb-2">
        {icon}
        {label}
      </div>

      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border">
      <div className="flex items-center gap-2 text-sm">
        {icon}
        <span>{label}</span>
      </div>

      <span className={`font-bold ${color}`}>
        {value}
      </span>
    </div>
  );
}
