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

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et"),
  title: {
    default: "Addis Eats | Authentic Ethiopian Food Delivery",
    template: "%s | Addis Eats",
  },
  description: "Order slow-cooked Ethiopian cuisine delivered fresh across Addis Ababa. Paid with TeleBirr or cash on delivery.",
  openGraph: {
    title: "Addis Eats",
    description: "Authentic Ethiopian Food Delivery across Addis Ababa",
    siteName: "Addis Eats",
    locale: "en_ET",
    type: "website",
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
