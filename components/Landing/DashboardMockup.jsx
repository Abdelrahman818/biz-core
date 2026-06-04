const DashboardMockup = () => {
  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm dark:border-[#1F2937] dark:bg-[#111827]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>

        <div className="rounded-lg bg-[#22C55E]/10 px-3 py-1 text-sm font-medium text-[#22C55E]">
          +12 Orders Today
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#F9FAFB] p-5 dark:bg-[#0F172A]">
          <p className="mb-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Revenue
          </p>
          <h3 className="text-3xl font-bold">15,240 EGP</h3>
        </div>

        <div className="rounded-2xl bg-[#F9FAFB] p-5 dark:bg-[#0F172A]">
          <p className="mb-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Pending Orders
          </p>
          <h3 className="text-3xl font-bold">24</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4 dark:border-[#1F2937]">
          <div>
            <p className="font-medium">Ahmed Mohamed</p>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              2 Hoodies • Cairo
            </p>
          </div>

          <span className="rounded-lg bg-[#F59E0B]/10 px-3 py-1 text-sm font-medium text-[#F59E0B]">
            Pending
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-4 dark:border-[#1F2937]">
          <div>
            <p className="font-medium">Sara Ali</p>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Black Dress • Giza
            </p>
          </div>

          <span className="rounded-lg bg-[#22C55E]/10 px-3 py-1 text-sm font-medium text-[#22C55E]">
            Delivered
          </span>
        </div>
      </div>
    </div>
  )
}

export default DashboardMockup
