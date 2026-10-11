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

  "https://addis-eats-nextjs-tau.vercel.app";

export const metadata = {

  metadataBase: new URL(siteUrl),

  title: {

    default: "Addis Eats | Authentic Ethiopian Food Delivery",

    template: "%s | Addis Eats",

  },

  description:

    "Order slow-cooked Ethiopian cuisine delivered fresh across Addis Ababa. Doro wat, sega tibs, kitfo, live tracking and honest ETB prices.",

  openGraph: {

    title: "Addis Eats | Authentic Ethiopian Food Delivery",

    description:

      "Order slow-cooked Ethiopian cuisine delivered fresh across Addis Ababa. Doro wat, sega tibs, kitfo, live tracking and honest ETB prices.",

    url: siteUrl,

    siteName: "Addis Eats",

    locale: "en_ET",

    type: "website",

    images: [

      {

        url: `${siteUrl}/og-image.png`,

        width: 1200,

        height: 630,

        alt: "Addis Eats - Authentic Ethiopian Food Delivery",

        type: "image/png",

      },

    ],

  },

  twitter: {

    card: "summary_large_image",

    title: "Addis Eats | Authentic Ethiopian Food Delivery",

    description:

      "Order slow-cooked Ethiopian cuisine delivered fresh across Addis Ababa. Doro wat, sega tibs, kitfo, live tracking and honest ETB prices.",

    images: [`${siteUrl}/og-image.png`],

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

