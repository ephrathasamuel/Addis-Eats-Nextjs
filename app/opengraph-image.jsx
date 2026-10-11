import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Addis Eats - Ethiopian Food Delivery";
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
          background: "radial-gradient(ellipse at 50% 30%, #156637 0%, #0d4324 55%, #062313 100%)",
          color: "#ffffff",
          textAlign: "center",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            marginBottom: "26px",
          }}
        >
          {/* Orange circular emblem with inner yellow dot */}
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "50%",
              backgroundColor: "#e86b28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#fbc02d",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "86px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Addis Eats
          </span>
        </div>
        <p
          style={{
            fontSize: "36px",
            color: "#cbead6",
            margin: 0,
            maxWidth: "960px",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          Ethiopian food, delivered in Addis Ababa
        </p>
      </div>
    ),
    { ...size }
  );
}
