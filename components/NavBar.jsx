"use client";

import { Boxes } from "lucide-react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();

  return (
    <nav className="border-b border-[#E5E7EB] dark:border-[#1F2937] fixed w-full z-50 dark:bg-[#0f141a00] backdrop-blur-3xl mb-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Boxes className="text-[#3B82F6]" />
          <h1 className="text-xl font-bold">Bizly</h1>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {/* CTA */}
          <button onClick={() => router.push('/auth/signup')} className="rounded-xl bg-[#3B82F6] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Join Beta
          </button>

        </div>

      </div>
    </nav>
  );
};

export default NavBar;
