import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Addis Eats - Authentic Ethiopian Food Delivery";
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
          background: "radial-gradient(ellipse at 50% 35%, #25174e 0%, #130a2a 55%, #080413 100%)",
          color: "#ffffff",
          textAlign: "center",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow halo behind logo */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 92, 255, 0.22) 0%, rgba(124, 92, 255, 0) 70%)",
            top: "70px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          {/* Addis Eats Signature Purple Brand Icon */}
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #7c5cff 0%, #5b3fd1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(124, 92, 255, 0.4)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
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
              fontSize: "88px",
              fontWeight: 850,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            Addis Eats
          </span>
        </div>

        <p
          style={{
            fontSize: "38px",
            color: "#a48fff",
            margin: "0 0 18px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Authentic Ethiopian Food Delivery
        </p>

        <p
          style={{
            fontSize: "24px",
            color: "#c9c4df",
            margin: 0,
            maxWidth: "880px",
            fontWeight: 450,
          }}
        >
          Fresh Doro Wat, Sega Tibs, Kitfo and Vegetarian Bayenetu in Addis Ababa
        </p>
      </div>
    ),
    { ...size }
  );
}
