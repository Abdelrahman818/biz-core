const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/privacy", "/terms", "/support", "/contact"],
        disallow: ["/dashboard", "/orders", "/products", "/customers", "/analytics", "/onboarding"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
