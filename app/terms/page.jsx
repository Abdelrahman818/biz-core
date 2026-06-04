"use client";

import {
  ShieldCheck,
  FileText,
  Lock,
  AlertTriangle,
} from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-12 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-12">

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3">
              <FileText size={24} className="text-blue-500" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Terms & Conditions
              </h1>

              <p className="mt-1 text-sm opacity-60">
                Last updated: May 2026
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-7 opacity-70">
            By accessing or using our platform, you agree to comply with and
            be bound by the following terms and conditions. Please read them
            carefully before using the service.
          </p>

        </div>

        {/* CONTENT */}
        <div className="space-y-6">

          {/* SECTION */}
          <Section
            icon={<ShieldCheck size={18} />}
            title="Account Responsibility"
            content="
            Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their accounts.
            "
          />

          {/* SECTION */}
          <Section
            icon={<Lock size={18} />}
            title="Privacy & Data"
            content="
            We take user privacy seriously. Your business data and personal information are securely stored and protected according to industry standards.
            "
          />

          {/* SECTION */}
          <Section
            icon={<FileText size={18} />}
            title="Platform Usage"
            content="
            Users agree not to misuse the platform, attempt unauthorized access, disrupt services, or engage in activities that negatively affect other users or the system.
            "
          />

          {/* SECTION */}
          <Section
            icon={<AlertTriangle size={18} />}
            title="Service Availability"
            content="
            We strive to maintain continuous service availability, but we do not guarantee uninterrupted access at all times due to maintenance or unexpected technical issues.
            "
          />

        </div>

        {/* FOOTER */}
        <div className="mt-12 border-t border-black/10 dark:border-white/10 pt-6 text-sm opacity-60">
          If you have any questions regarding these terms, please contact the
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
