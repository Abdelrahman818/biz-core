'use client'

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const Hero = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-4 inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm dark:border-[#1F2937] dark:bg-[#111827]">
        Built for Instagram & WhatsApp sellers
      </div>

      <h1 className="mb-6 text-5xl font-bold leading-tight">
        Stop losing orders.
        <br />
        Organize your business in one place.
      </h1>

      <p className="mb-8 text-lg text-[#6B7280] dark:text-[#9CA3AF]">
        Manage orders, customers, products, and daily business
        transactions without WhatsApp chaos or spreadsheets.
      </p>

      <div className="flex flex-wrap gap-4">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 rounded-xl bg-[#3B82F6] px-6 py-3 font-medium text-white transition hover:opacity-90">
          Start Free Beta
          <ArrowRight size={18} />
        </button>

        <button className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 font-medium transition hover:bg-gray-100 dark:border-[#1F2937] dark:bg-[#111827] dark:hover:bg-[#1A2234]">
          Watch Demo
        </button>
      </div>
    </div>
  )
}

export default Hero
