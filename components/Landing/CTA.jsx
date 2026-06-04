"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();

  return (
    <>
      {/* CTA SECTION */}
      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="rounded-[32px] bg-[#3B82F6] p-10 text-center text-white md:p-16">

          <h2 className="mb-4 text-4xl font-bold">
            Start organizing your business today.
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
            Join the beta and manage orders, customers, and products in one simple dashboard.
          </p>

          <button
            onClick={() => router.push('/auth/signup')}
            className="rounded-2xl bg-white px-7 py-4 font-semibold text-[#3B82F6] hover:opacity-90 transition"
          >
            Join us
          </button>

        </div>

      </section>
    </>
  );
};

export default CTA;
