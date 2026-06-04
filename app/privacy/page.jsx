"use client";

import {
  Shield,
  Database,
  Lock,
  Eye,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-12">

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3">
              <Shield size={24} className="text-blue-500" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Privacy Policy
              </h1>

              <p className="mt-1 text-sm opacity-60">
                Last updated: May 2026
              </p>
            </div>

          </div>

          <p className="max-w-2xl text-sm leading-7 opacity-70">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information when using our
            platform and services.
          </p>

        </div>

        {/* CONTENT */}
        <div className="space-y-6">

          {/* SECTION */}
          <Section
            icon={<Database size={18} />}
            title="Information We Collect"
            content="
            We may collect account information, business data, order details,
            customer information, and usage analytics necessary to provide
            and improve the platform experience.
            "
          />

          {/* SECTION */}
          <Section
            icon={<Lock size={18} />}
            title="Data Protection"
            content="
            We use industry-standard security practices to help protect your
            information against unauthorized access, loss, misuse, or disclosure.
            "
          />

          {/* SECTION */}
          <Section
            icon={<Eye size={18} />}
            title="How We Use Data"
            content="
            Your data is used to operate the platform, improve features,
            provide customer support, monitor performance, and enhance
            overall user experience.
            "
          />

          {/* SECTION */}
          <Section
            icon={<Shield size={18} />}
            title="User Rights"
            content="
            Users may request access, updates, or deletion of their personal
            information in accordance with applicable privacy regulations and policies.
            "
          />

        </div>

        {/* FOOTER */}
        <div className="mt-12 border-t border-black/10 dark:border-white/10 pt-6 text-sm opacity-60">
          For questions regarding this privacy policy, please contact the
          support team.
        </div>

      </div>

    </main>
  );
}

/* ---------------- SECTION ---------------- */

function Section({ icon, title, content }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6">

      <div className="mb-3 flex items-center gap-2">

        <span className="text-blue-500">{icon}</span>

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

      </div>

      <p className="text-sm leading-7 opacity-70">
        {content}
      </p>

    </div>
  );
}
