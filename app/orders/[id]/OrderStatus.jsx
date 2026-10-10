"use client";

import { getDishByIdSync, getDishByNameSync } from "@/lib/dishes";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";

export function OrderStatus({ id, initial }) {
  // SWR polling every 5 seconds, seeded with server-side initial data
  // fallbackData eliminates any loading spinner on initial paint
  const { data: order } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: 5000,
  });

  const current = order || initial;

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return { label: "Delivered", bg: "rgba(34, 197, 94, 0.15)", color: "#16a34a" };
      case "on-the-way":
        return { label: "On The Way", bg: "rgba(59, 130, 246, 0.15)", color: "#2563eb" };
      case "preparing":
        return { label: "In Kitchen", bg: "rgba(245, 158, 11, 0.15)", color: "#d97706" };
      case "cancelled":
        return { label: "Cancelled", bg: "rgba(239, 68, 68, 0.15)", color: "#dc2626" };
      default:
        return { label: "Order Placed", bg: "var(--brand-light)", color: "var(--brand-dark)" };
    }
  };

  const badge = getStatusBadge(current.status);

  return (
    <div style={{ maxWidth: "620px", margin: "1rem auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Order #{current.id}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: current.status === "delivered" ? "#16a34a" : "#7c5cff",
              boxShadow: "0 0 8px currentColor",
              animation: current.status !== "delivered" ? "pulse 2s infinite" : "none",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {current.status === "delivered" ? "Completed" : "Live polling (every 5s)"}
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "20px",
          backgroundColor: badge.bg,
          border: "1px solid var(--border)",
          marginBottom: "1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
            Current Status
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "700", color: badge.color, marginTop: "0.2rem" }}>
            {badge.label}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
            Estimated Wait
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--text)", marginTop: "0.2rem" }}>
            {current.status === "delivered" ? "Arrived" : current.status === "on-the-way" ? "5–10 mins" : "15–20 mins"}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "20px",
          padding: "1.75rem",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 12px var(--shadow-color)",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Order Details</h3>
        <p style={{ margin: "0.3rem 0", color: "var(--muted)" }}>
          <strong style={{ color: "var(--text)" }}>Customer:</strong> {current.name} ({current.phone})
        </p>
        <p style={{ margin: "0.3rem 0", color: "var(--muted)" }}>
          <strong style={{ color: "var(--text)" }}>Placed at:</strong>{" "}
          {new Date(current.createdAt).toLocaleTimeString()}
        </p>

        <h3 style={{ marginTop: "1.5rem", marginBottom: "0.75rem" }}>Items Ordered</h3>
        <div className="profile-cart-list">
          {current.items?.map((item, idx) => {
            const dish = getDishByIdSync(item.id) || getDishByNameSync(item.name);
            const imgSrc = item.image || dish?.image || "/images/food/doro-wat.jpg";
            return (
              <div className="order-item-card" key={idx}>
                <div className="order-item-media">
                  <div className="order-item-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgSrc} alt={item.name} className="order-item-thumb" />
                  </div>
                  <span className="order-item-name">{item.name}</span>
                </div>

                <div className="order-item-tables">
                  <div className="num-pill" role="cell">
                    <span className="num-pill__label">Qty</span>
                    <span className="num-pill__val">{item.qty}</span>
                  </div>
                  <div className="num-pill num-pill--total" role="cell">
                    <span className="num-pill__label">Total</span>
                    <span className="num-pill__val">{item.price * item.qty} ETB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.25rem",
            paddingTop: "0.5rem",
            fontSize: "1.15rem",
            fontWeight: "700",
          }}
        >
          <span>Total</span>
          <span style={{ color: "var(--brand-dark)" }}>{current.total} ETB</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/menu" className="btn-primary">
          Order more dishes
        </Link>
        <Link href="/" className="btn-ghost">
          Return home
        </Link>
      </div>
    </div>
  );
}
