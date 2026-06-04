import ToastProvider from "@/components/Providers/ToastProvider";
import RootLayoutClient from "@/components/Layouts/RootLayoutClient";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Bizly - Small Business Operating System",
    template: "%s | Bizly",
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
  applicationName: "Bizly",
  openGraph: {
    title: "Bizly - Small Business Operating System",
    description:
      "Manage products, customers, orders, inventory, and analytics from one place.",
    url: "/",
    siteName: "Bizly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bizly - Small Business Operating System",
    description:
      "Manage products, customers, orders, inventory, and analytics from one place.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
