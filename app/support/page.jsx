"use client";

import { useState } from "react";

import {
  LifeBuoy,
  Search,
  MessageCircle,
  BookOpen,
  ChevronDown,
} from "lucide-react";

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I create my first product?",
      a: "Go to Products → Click Add Product → Fill name, price, and stock → Save.",
    },
    {
      q: "How do I track orders?",
      a: "Open Orders to see each status: pending, confirmed, processing, completed, or cancelled.",
    },
    {
      q: "Can I edit customer information?",
      a: "Yes, go to Customers → Select customer → Edit details and save changes.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, all data is stored securely and protected using modern encryption practices.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-14 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
            <LifeBuoy size={16} />
            Support Center
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            How can we help you?
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 opacity-70">
            Search help articles or browse frequently asked questions to get
            quick answers.
          </p>

        </div>

        {/* SEARCH */}
        <div className="mx-auto mb-12 max-w-2xl">

          <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search for help..."
              className="w-full bg-transparent outline-none"
            />

          </div>

        </div>

        {/* QUICK HELP */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">

          <QuickCard
            icon={<BookOpen size={18} />}
            title="Getting Started"
            desc="Learn how to set up your account and start using the platform."
          />

          <QuickCard
            icon={<MessageCircle size={18} />}
            title="Orders Help"
            desc="Everything about creating, tracking, and managing orders."
          />

          <QuickCard
            icon={<LifeBuoy size={18} />}
            title="Account Support"
            desc="Manage your account settings and troubleshooting issues."
          />

        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-3xl">

          <h2 className="mb-6 text-2xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">

            {faqs.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card"
              >

                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >

                  <span className="font-medium">
                    {item.q}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`transition ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />

                </button>

                {openIndex === index && (
                  <div className="px-5 pb-4 text-sm opacity-70">
                    {item.a}
                  </div>
                )}

              </div>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}

/* ---------------- QUICK CARD ---------------- */

function QuickCard({ icon, title, desc }) {
  return (
    <div className="rounded-3xl border bg-card p-6">

      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border">
        {icon}
      </div>

      <h3 className="mb-2 text-lg font-semibold">
        {title}
      </h3>

      <p className="text-sm opacity-70">
        {desc}
      </p>

    </div>
  );
}
