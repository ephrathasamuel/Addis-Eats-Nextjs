import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://food-delivery-system-sigma-pink.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ethiopian food, delivered in Addis Ababa",
    template: "%s | Addis Eats",
  },
  description:
    "Addis Eats delivers doro wat, sega tibs, pizza and buna across Addis Ababa - live order tracking, honest ETB prices, cash on delivery.",
  openGraph: {
    title: "Ethiopian food, delivered in Addis Ababa",
    description:
      "Addis Eats delivers doro wat, sega tibs, pizza and buna across Addis Ababa - live order tracking, honest ETB prices, cash on delivery.",
    url: siteUrl,
    siteName: "Addis Eats",
    locale: "en_ET",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats - Ethiopian Food Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethiopian food, delivered in Addis Ababa",
    description:
      "Addis Eats delivers doro wat, sega tibs, pizza and buna across Addis Ababa - live order tracking, honest ETB prices, cash on delivery.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>

        <Script
          id="partner-telemetry"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.__perfTelemetry = { initialized: true, timestamp: Date.now() };`,
          }}
        />
      </body>
    </html>
  );
}
