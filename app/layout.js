import ToastProvider from "@/components/Providers/ToastProvider";
import RootLayoutClient from "@/components/Layouts/RootLayoutClient";
import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "biz core - Small Business Operating System",
    template: "%s | biz core",
  },
  description:
    "Manage small business products, customers, orders, inventory, and analytics from one operating system.",
  keywords: [
    "small business software",
    "order management",
    "inventory management",
    "customer management",
    "business analytics",
  ],
  applicationName: "biz core",
  openGraph: {
    title: "biz core - Small Business Operating System",
    description:
      "Manage products, customers, orders, inventory, and analytics from one place.",
    url: "/",
    siteName: "biz core",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "biz core - Small Business Operating System",
    description:
      "Manage products, customers, orders, inventory, and analytics from one place.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <>
          <ToastProvider />
          <RootLayoutClient>{children}</RootLayoutClient>
        </>
      </body>
    </html>
  );
}
