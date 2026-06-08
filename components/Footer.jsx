import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-[#E5E7EB] dark:border-[#1F2937] py-12">

      <div className="mx-auto max-w-7xl px-6">

        {/* TOP SECTION */}
        <div className="grid gap-10 md:grid-cols-3">

          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold text-[#111827] dark:text-white">
              BIZ CORE
            </h2>

            <p className="mt-3 text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-6">
              Simple business management system for tracking orders, customers,
              and products in one place.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#111827] dark:text-white">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <li>
                <Link href="/" className="hover:text-blue-500 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="hover:text-blue-500 transition">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/support" className="hover:text-blue-500 transition">
                  Support
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-blue-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[#111827] dark:text-white">
              Contact
            </h3>

            <ul className="space-y-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <li>support@biz-core.com</li>
              <li>+20 100 000 0000</li>
              <li>Cairo, Egypt</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-[#E5E7EB] dark:border-[#1F2937] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">

          <div>
            © {new Date().getFullYear()} BIZ CORE. All rights reserved.
          </div>

          <div className="text-center md:text-right">
            Made by Technology Craft
          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
