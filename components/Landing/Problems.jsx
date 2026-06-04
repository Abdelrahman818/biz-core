import {
  Users,
  Package,
  LayoutDashboard,
} from "lucide-react"

const Problems = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Built for small businesses.
        </h2>

        <p className="text-[#6B7280] dark:text-[#9CA3AF]">
          Everything you need to organize your daily business operations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 transition hover:-translate-y-1 dark:border-[#1F2937] dark:bg-[#111827]">
          <LayoutDashboard className="mb-5 text-[#3B82F6]" size={34} />

          <h3 className="mb-3 text-xl font-semibold">
            Orders Management
          </h3>

          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Track every order from pending to delivered without losing
            customers in chats.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 transition hover:-translate-y-1 dark:border-[#1F2937] dark:bg-[#111827]">
          <Users className="mb-5 text-[#8B5CF6]" size={34} />

          <h3 className="mb-3 text-xl font-semibold">Customer Tracking</h3>

          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Save customer history, repeated orders, and contact information
            in one place.
          </p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 transition hover:-translate-y-1 dark:border-[#1F2937] dark:bg-[#111827]">
          <Package className="mb-5 text-[#22C55E]" size={34} />

          <h3 className="mb-3 text-xl font-semibold">Products & Stock</h3>

          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Manage products, prices, and stock levels with simple fast tools.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Problems
