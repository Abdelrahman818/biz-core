"use client";

import {
  Check,
  CreditCard,
  Zap,
  Building2,
} from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-14 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
            <CreditCard size={16} />
            Pricing Plans
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Simple pricing for growing businesses
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 opacity-70">
            Choose the plan that fits your business needs. Start simple,
            upgrade anytime, and scale without complexity.
          </p>

        </div>

        {/* PRICING GRID */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* STARTER */}
          <PricingCard
            icon={<Zap size={18} />}
            title="Starter"
            price="Free"
            description="Perfect for individuals and small businesses starting out."
            features={[
              "Products management",
              "Orders tracking",
              "Customers system",
              "Basic analytics",
            ]}
            button="Get Started"
          />

          {/* PRO */}
          <PricingCard
            featured
            icon={<CreditCard size={18} />}
            title="Pro"
            price="299 EGP"
            period="/month"
            description="Advanced tools for growing businesses and teams."
            features={[
              "Everything in Starter",
              "Advanced analytics",
              "Team access",
              "Priority support",
              "Real-time updates",
            ]}
            button="Start Pro"
          />

          {/* BUSINESS */}
          <PricingCard
            icon={<Building2 size={18} />}
            title="Business"
            price="Custom"
            description="Custom solutions for larger operations and enterprise needs."
            features={[
              "Custom integrations",
              "Dedicated support",
              "Advanced permissions",
              "Scalable infrastructure",
            ]}
            button="Contact Sales"
          />

        </div>

      </div>

    </main>
  );
}

/* ---------------- CARD ---------------- */

function PricingCard({
  icon,
  title,
  price,
  period,
  description,
  features,
  button,
  featured,
}) {
  return (
    <div
      className={`relative rounded-3xl border bg-card p-7 transition ${
        featured
          ? "border-blue-500 shadow-lg"
          : ""
      }`}
    >

      {/* FEATURED BADGE */}
      {featured && (
        <div className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
          Popular
        </div>
      )}

      {/* HEADER */}
      <div className="mb-6">

        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border">
          {icon}
        </div>

        <h2 className="mb-2 text-2xl font-bold">
          {title}
        </h2>

        <p className="text-sm leading-6 opacity-70">
          {description}
        </p>

      </div>

      {/* PRICE */}
      <div className="mb-6 flex items-end gap-1">

        <h3 className="text-4xl font-bold">
          {price}
        </h3>

        {period && (
          <span className="mb-1 text-sm opacity-60">
            {period}
          </span>
        )}

      </div>

      {/* FEATURES */}
      <div className="mb-8 space-y-3">

        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-sm"
          >

            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-600">
              <Check size={14} />
            </div>

            <span className="opacity-80">
              {feature}
            </span>

          </div>
        ))}

      </div>

      {/* BUTTON */}
      <button
        className={`w-full rounded-2xl px-5 py-3 text-sm font-medium transition ${
          featured
            ? "bg-blue-600 text-white hover:opacity-90"
            : "border hover:bg-black/5 dark:hover:bg-white/5"
        }`}
      >
        {button}
      </button>

    </div>
  );
}
