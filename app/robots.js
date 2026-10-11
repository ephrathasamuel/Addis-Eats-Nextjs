const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://addis-eats-nextjs-tau.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/menu", "/privacy", "/terms", "/og-image.png", "/opengraph-image"],
        disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/signin"],
      },
      {
        userAgent: "TelegramBot",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
