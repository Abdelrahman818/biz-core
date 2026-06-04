"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Plus,
  LogOut,
  Boxes,
  UserPlus,
  List,
  ChevronDown,
  Mail,
  Shield,
  FileText,
} from "lucide-react";

const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    sub: [
      { label: "All Orders",  href: "/orders",     icon: List  },
      { label: "New Order",   href: "/orders/new", icon: Plus  },
    ],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    sub: [
      { label: "All Customers",  href: "/customers",     icon: List     },
      { label: "New Customer",   href: "/customers/new", icon: UserPlus },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    icon: Shield,
  },
  {
    label: "Terms of Service",
    href: "/terms",
    icon: FileText,
  },
];

export default function SideNav() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hovered,     setHovered]     = useState(false);
  const initialOpenGroups = Object.fromEntries(
    NAV_LINKS.filter((link) =>
      link.sub?.some((subLink) => pathname.startsWith(subLink.href))
    ).map((link) => [link.label, true])
  );
  const [openGroups,  setOpenGroups]  = useState(initialOpenGroups);

  // Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Sync body padding-left with hover state
  useEffect(() => {
    if (authLoading || !user) {
      document.body.classList.remove("sidenav-open", "sidenav-collapsed");
      return;
    }
    if (hovered) {
      document.body.classList.remove("sidenav-collapsed");
      document.body.classList.add("sidenav-open");
    } else {
      document.body.classList.remove("sidenav-open");
      document.body.classList.add("sidenav-collapsed");
    }
    return () => {
      document.body.classList.remove("sidenav-open", "sidenav-collapsed");
    };
  }, [user, authLoading, hovered]);

  if (authLoading || !user) return null;

  const exactActive    = (href) => pathname === href;
  const isParentOfActive = (href, sub) =>
    sub?.some((s) => pathname === s.href || pathname.startsWith(s.href + "/")) ||
    (pathname.startsWith(href + "/") && pathname !== href);

  const toggleGroup = (label) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const expanded = hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: expanded ? "220px" : "72px",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      className="fixed top-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-black/10 bg-white/80 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-[#0B1220]/80"
    >
      {/* ── Logo ── */}
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-black/10 px-[18px] dark:border-white/10">
        <Boxes className="shrink-0 text-blue-500" size={22} />
        <span
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? "translateX(0)" : "translateX(-8px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            transitionDelay: expanded ? "0.05s" : "0s",
          }}
          className="whitespace-nowrap text-lg font-bold tracking-tight"
        >
          Bizly
        </span>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-0.5">
        {NAV_LINKS.map(({ label, href, icon: Icon, sub }) => {
          const active         = exactActive(href);
          const parentOfActive = isParentOfActive(href, sub);
          const isOpen         = openGroups[label] ?? false;
          // Sub-drawer visible only when sidebar is expanded AND group is open
          const showSub        = expanded && sub && isOpen;

          return (
            <div key={href}>
              {/* ── Parent button ── */}
              <button
                onClick={() => {
                  if (sub) {
                    // Toggle accordion; also navigate to parent page
                    toggleGroup(label);
                  } else {
                    router.push(href);
                  }
                }}
                title={!expanded ? label : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/25"
                    : parentOfActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    : "text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                }`}
              >
                {/* Icon */}
                <Icon size={18} className="shrink-0" />

                {/* Label (fades in when expanded) */}
                <span
                  style={{
                    opacity: expanded ? 1 : 0,
                    flex: 1,
                    transition: "opacity 0.2s ease",
                    transitionDelay: expanded ? "0.06s" : "0s",
                  }}
                  className="whitespace-nowrap overflow-hidden text-left"
                >
                  {label}
                </span>

                {/* Chevron arrow — only visible when expanded AND has sub */}
                {sub && (
                  <ChevronDown
                    size={14}
                    style={{
                      opacity: expanded ? 1 : 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease, opacity 0.15s ease",
                      transitionDelay: expanded ? "0.06s" : "0s",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>

              {/* ── Sub-links accordion ── */}
              <div
                style={{
                  maxHeight: showSub ? `${(sub?.length ?? 0) * 44}px` : "0px",
                  opacity: showSub ? 1 : 0,
                  transition: "max-height 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease",
                  overflow: "hidden",
                }}
              >
                <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l border-black/10 pl-3 dark:border-white/10">
                  {sub?.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                    const subActive = pathname === subHref;
                    return (
                      <button
                        key={subHref}
                        onClick={() => router.push(subHref)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                          subActive
                            ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/15 dark:text-blue-400"
                            : "text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                      >
                        <SubIcon size={13} className="shrink-0" />
                        {subLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── User + Logout ── */}
      <div className="shrink-0 border-t border-black/10 px-2 py-3 dark:border-white/10">
        {/* User card */}
        <div className="mb-1 flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="avatar"
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <div
            style={{
              opacity: expanded ? 1 : 0,
              width: expanded ? "auto" : 0,
              transition: "opacity 0.15s ease",
              transitionDelay: expanded ? "0.06s" : "0s",
            }}
            className="min-w-0 overflow-hidden"
          >
            <p className="truncate whitespace-nowrap text-xs font-semibold">
              {user.displayName ?? "User"}
            </p>
            <p className="truncate whitespace-nowrap text-[10px] opacity-50">
              {user.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={!expanded ? "Logout" : undefined}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <LogOut size={16} className="shrink-0" />
          <span
            style={{
              opacity: expanded ? 1 : 0,
              width: expanded ? "auto" : 0,
              transition: "opacity 0.15s ease",
              transitionDelay: expanded ? "0.06s" : "0s",
            }}
            className="whitespace-nowrap overflow-hidden font-medium"
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
