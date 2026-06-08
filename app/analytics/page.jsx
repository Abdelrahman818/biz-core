"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  LineChart,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { dashboardAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

const DETAIL_GROUPS = {
  financial: ["claimedRevenue", "pendingAmount", "profit", "cost"],
  orders: ["allOrders", "claimedOrders", "pendingOrders", "completed", "cancelled"],
  inventory: ["products", "lowStock", "customers"],
};

const DETAIL_OPTIONS = [
  { id: "claimedRevenue", label: "Claimed revenue", unit: "EGP", color: "#16a34a", group: "Financial" },
  { id: "pendingAmount", label: "Pending amount", unit: "EGP", color: "#ca8a04", group: "Financial" },
  { id: "profit", label: "Profit", unit: "EGP", color: "#2563eb", group: "Financial" },
  { id: "cost", label: "Cost", unit: "EGP", color: "#7c3aed", group: "Financial" },
  { id: "allOrders", label: "All orders", unit: "", color: "#0f766e", group: "Orders" },
  { id: "claimedOrders", label: "Claimed orders", unit: "", color: "#15803d", group: "Orders" },
  { id: "pendingOrders", label: "Pending orders", unit: "", color: "#d97706", group: "Orders" },
  { id: "confirmed", label: "Confirmed", unit: "", color: "#2563eb", group: "Orders" },
  { id: "processing", label: "Processing", unit: "", color: "#9333ea", group: "Orders" },
  { id: "completed", label: "Completed", unit: "", color: "#16a34a", group: "Orders" },
  { id: "cancelled", label: "Cancelled", unit: "", color: "#dc2626", group: "Orders" },
  { id: "products", label: "Products", unit: "", color: "#0891b2", group: "Inventory" },
  { id: "lowStock", label: "Low stock", unit: "", color: "#ea580c", group: "Inventory" },
  { id: "customers", label: "Customers", unit: "", color: "#4f46e5", group: "Customers" },
];

const DEFAULT_DETAILS = [
  "claimedRevenue",
  "pendingAmount",
  "profit",
  "allOrders",
  "pendingOrders",
  "products",
  "customers",
];

export default function AnalyticsPage() {
  const { businessId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(DEFAULT_DETAILS);
  const [chartType, setChartType] = useState("bar");
  const [normalized, setNormalized] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Validate businessId before making API calls
      if (!businessId) {
        setError("No business ID available. Please complete onboarding.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [overview, profit] = await Promise.all([
          dashboardAPI.getOverview(businessId),
          dashboardAPI.getProfit(businessId),
        ]);

        const status = {
          pending: overview.ordersStatus?.pending || 0,
          confirmed: overview.ordersStatus?.confirmed || 0,
          processing: overview.ordersStatus?.processing || 0,
          completed: overview.ordersStatus?.completed || 0,
          cancelled: overview.ordersStatus?.cancelled || 0,
        };

        setData({
          claimedRevenue: overview.claimedTotal ?? overview.revenue ?? 0,
          pendingAmount: overview.pendingTotal ?? 0,
          profit: profit.profit ?? 0,
          cost: profit.totalCost ?? 0,
          margin: profit.margin ?? 0,
          allOrders: overview.allOrders ?? overview.totalOrders ?? 0,
          claimedOrders: overview.claimedOrders ?? overview.totalOrders ?? 0,
          pendingOrders: overview.pendingOrders ?? 0,
          products: overview.totalProducts ?? 0,
          lowStock: overview.lowStockCount ?? 0,
          customers: overview.totalCustomers ?? 0,
          status,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to load analytics data. Please try again.");
        setData(createEmptyData());
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [businessId]);

  const valuesById = useMemo(() => {
    if (!data) return {};

    return {
      claimedRevenue: data.claimedRevenue,
      pendingAmount: data.pendingAmount,
      profit: data.profit,
      cost: data.cost,
      allOrders: data.allOrders,
      claimedOrders: data.claimedOrders,
      pendingOrders: data.pendingOrders,
      confirmed: data.status.confirmed,
      processing: data.status.processing,
      completed: data.status.completed,
      cancelled: data.status.cancelled,
      products: data.products,
      lowStock: data.lowStock,
      customers: data.customers,
    };
  }, [data]);

  const chartItems = useMemo(
    () =>
      DETAIL_OPTIONS.filter((option) => selectedDetails.includes(option.id)).map((option) => ({
        ...option,
        value: Number(valuesById[option.id] || 0),
      })),
    [selectedDetails, valuesById]
  );

  const toggleDetail = (id) => {
    setSelectedDetails((current) =>
      current.includes(id)
        ? current.filter((detailId) => detailId !== id)
        : [...current, id]
    );
  };

  const applyPreset = (preset) => {
    if (preset === "all") {
      setSelectedDetails(DETAIL_OPTIONS.map((option) => option.id));
      return;
    }
    setSelectedDetails(DETAIL_GROUPS[preset]);
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white dark:bg-[#0B1220] text-black dark:text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white dark:bg-[#0B1220] text-black dark:text-white">
        <div className="max-w-6xl mx-auto mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp size={26} />
            Analytics
          </h1>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-10 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
            <p className="font-semibold mb-4">{error || "Failed to load analytics"}</p>
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
    <main className="min-h-screen px-6 py-10 bg-white dark:bg-[#0B1220] text-black dark:text-white">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp size={26} />
          Analytics
        </h1>

        <p className="text-sm opacity-60">
          Overview of your business performance
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<DollarSign size={18} />}
          label="Claimed revenue"
          value={`${formatNumber(data.claimedRevenue)} EGP`}
          color="text-green-600"
        />

        <StatCard
          icon={<ShoppingCart size={18} />}
          label="All orders"
          value={data.allOrders}
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

      <section className="max-w-6xl mx-auto mb-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              <BarChart3 size={20} />
              Details Graph
            </h2>
            <p className="text-sm opacity-60 mt-1">
              {chartItems.length} selected
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-black/10 dark:border-white/10 overflow-hidden">
              <button
                onClick={() => setChartType("bar")}
                className={`h-10 px-3 flex items-center gap-2 text-sm ${chartType === "bar" ? "bg-blue-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
              >
                <BarChart3 size={16} />
                Bar
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`h-10 px-3 flex items-center gap-2 text-sm ${chartType === "line" ? "bg-blue-600 text-white" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
              >
                <LineChart size={16} />
                Line
              </button>
            </div>

            <label className="h-10 px-3 rounded-xl border border-black/10 dark:border-white/10 flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={normalized}
                onChange={(event) => setNormalized(event.target.checked)}
                className="h-4 w-4"
              />
              Normalize
            </label>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <PresetButton label="All" onClick={() => applyPreset("all")} />
          <PresetButton label="Financial" onClick={() => applyPreset("financial")} />
          <PresetButton label="Orders" onClick={() => applyPreset("orders")} />
          <PresetButton label="Inventory" onClick={() => applyPreset("inventory")} />
        </div>

        <AnalyticsChart items={chartItems} chartType={chartType} normalized={normalized} />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DETAIL_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex min-h-12 items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
            >
              <input
                type="checkbox"
                checked={selectedDetails.includes(option.id)}
                onChange={() => toggleDetail(option.id)}
                className="h-4 w-4"
              />
              <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: option.color }} />
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
              <span className="font-semibold opacity-70">{formatValue(valuesById[option.id], option.unit)}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5">
          <h2 className="font-bold mb-4">
            Orders Status
          </h2>

          <div className="space-y-3">
            <StatusRow icon={<Clock size={16} />} label="Pending" value={data.status.pending} color="text-yellow-600" />
            <StatusRow icon={<CheckCircle size={16} />} label="Confirmed" value={data.status.confirmed} color="text-blue-600" />
            <StatusRow icon={<Package size={16} />} label="Processing" value={data.status.processing} color="text-purple-600" />
            <StatusRow icon={<TrendingUp size={16} />} label="Completed" value={data.status.completed} color="text-green-600" />
            <StatusRow icon={<XCircle size={16} />} label="Cancelled" value={data.status.cancelled} color="text-red-600" />
          </div>
        </section>

        <section className="p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5">
          <h2 className="font-bold mb-4">
            Business Insights
          </h2>

          <div className="grid gap-3 text-sm">
            <Insight icon={<Activity size={16} />} label="Margin" value={`${formatNumber(data.margin)}%`} color="text-blue-600" />
            <Insight icon={<DollarSign size={16} />} label="Profit" value={`${formatNumber(data.profit)} EGP`} color="text-green-600" />
            <Insight icon={<AlertTriangle size={16} />} label="Low stock" value={data.lowStock} color="text-yellow-600" />
            <Insight icon={<Users size={16} />} label="Customers" value={data.customers} color="text-purple-600" />
          </div>
        </section>
      </div>
    </main>
  );
}

function AnalyticsChart({ items, chartType, normalized }) {
  const width = 960;
  const height = 360;
  const padding = { top: 24, right: 22, bottom: 88, left: 58 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const rawMax = Math.max(...items.map((item) => item.value), 1);
  const displayMax = normalized ? 100 : rawMax;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: displayMax * ratio,
    y: padding.top + chartHeight - chartHeight * ratio,
  }));

  const plottedItems = items.map((item, index) => {
    const displayedValue = normalized ? (item.value / rawMax) * 100 : item.value;
    const x = padding.left + (chartWidth / Math.max(items.length, 1)) * index;
    const slotWidth = chartWidth / Math.max(items.length, 1);
    const barWidth = Math.min(46, Math.max(18, slotWidth * 0.5));
    const barHeight = displayMax ? (displayedValue / displayMax) * chartHeight : 0;
    const centerX = x + slotWidth / 2;
    const y = padding.top + chartHeight - barHeight;

    return {
      ...item,
      displayedValue,
      x,
      centerX,
      y,
      barWidth,
      barHeight,
    };
  });

  const linePath = plottedItems
    .map((item, index) => `${index === 0 ? "M" : "L"} ${item.centerX} ${item.y}`)
    .join(" ");

  if (!items.length) {
    return (
      <div className="h-[360px] rounded-xl border border-dashed border-black/20 dark:border-white/20 flex items-center justify-center text-sm opacity-60">
        No details selected
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-black/20">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" className="min-w-[760px] w-full h-[360px]">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={tick.y}
              y2={tick.y}
              stroke="currentColor"
              strokeOpacity="0.08"
            />
            <text x={padding.left - 12} y={tick.y + 4} textAnchor="end" fontSize="12" fill="currentColor" opacity="0.55">
              {normalized ? `${Math.round(tick.value)}%` : compactNumber(tick.value)}
            </text>
          </g>
        ))}

        {chartType === "line" && (
          <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {plottedItems.map((item) => (
          <g key={item.id}>
            {chartType === "bar" ? (
              <rect
                x={item.centerX - item.barWidth / 2}
                y={item.y}
                width={item.barWidth}
                height={item.barHeight}
                rx="6"
                fill={item.color}
              />
            ) : (
              <circle cx={item.centerX} cy={item.y} r="6" fill={item.color} stroke="white" strokeWidth="2" />
            )}

            <text x={item.centerX} y={Math.max(item.y - 10, 14)} textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="700">
              {formatValue(item.value, item.unit)}
            </text>

            <text
              x={item.centerX}
              y={height - 46}
              textAnchor="end"
              fontSize="12"
              fill="currentColor"
              opacity="0.72"
              transform={`rotate(-32 ${item.centerX} ${height - 46})`}
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function StatCard({ icon, label, value, color = "" }) {
  return (
    <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5">
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
    <div className="flex items-center justify-between p-3 rounded-xl border border-black/10 dark:border-white/10">
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

function Insight({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/10 p-3">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function PresetButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-9 rounded-xl border border-black/10 dark:border-white/10 px-3 text-sm hover:bg-black/5 dark:hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function createEmptyData() {
  return {
    claimedRevenue: 0,
    pendingAmount: 0,
    profit: 0,
    cost: 0,
    margin: 0,
    allOrders: 0,
    claimedOrders: 0,
    pendingOrders: 0,
    products: 0,
    lowStock: 0,
    customers: 0,
    status: {
      pending: 0,
      confirmed: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    },
  };
}

function formatValue(value, unit) {
  const numericValue = Number(value || 0);
  return unit ? `${formatNumber(numericValue)} ${unit}` : formatNumber(numericValue);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function compactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}
