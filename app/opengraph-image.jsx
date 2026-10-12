import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Addis Eats Authentic Ethiopian Food Delivery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #7c5cff 0%, #633de8 50%, #4a24c4 100%)",
          color: "#ffffff",
          textAlign: "center",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glow circles */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 70%)",
            top: "-100px",
            left: "300px",
          }}
        />

        {/* Brand Header: Crisp White Tile Logo + White Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "28px",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.22)",
            }}
          >
            <svg
              width="54"
              height="54"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5b3fd1"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "92px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            }}
          >
            Addis Eats
          </span>
        </div>

        {/* High-Contrast Pill Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.22)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "999px",
            padding: "12px 36px",
            marginBottom: "22px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.01em",
            }}
          >
            Authentic Ethiopian Food Delivery
          </span>
        </div>

        {/* Subtext */}
        <p
          style={{
            fontSize: "24px",
            color: "#f0ecff",
            margin: 0,
            maxWidth: "920px",
            fontWeight: 500,
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          Doro Wat | Sega Tibs | Kitfo | Fast Delivery Across Addis Ababa
        </p>
      </div>
    ),
    { ...size }
  );
}
