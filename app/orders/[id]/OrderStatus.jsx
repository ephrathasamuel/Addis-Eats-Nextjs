"use client";

import { getDishByIdSync, getDishByNameSync } from "@/lib/dishes";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import { cancelOrder } from "@/app/actions";

export function OrderStatus({ id, initial }) {
  const { data: order, mutate } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: 5000,
  });

  const current = order || initial;

  const [deliveredConfirmed, setDeliveredConfirmed] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isWithinFiveMinutes =
    current.createdAt &&
    Date.now() - new Date(current.createdAt).getTime() < 5 * 60 * 1000;

  const handleCancelRequest = async () => {
    if (!confirm(`Are you sure you want to request cancellation for Order #${current.id}?`)) return;
    setCancelling(true);
    const res = await cancelOrder(current.id);
    setCancelling(false);
    if (res?.ok) {
      mutate({ ...current, status: "cancelled" }, false);
    } else {
      alert(res?.error || "Failed to cancel order.");
    }
  };

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
  const isCooking = current.status === "placed" || current.status === "preparing";

  return (
    <div className="order-status-container">
      <div className="order-status-header">
        <h1 style={{ margin: 0 }}>Order #{current.id}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor:
                current.status === "delivered"
                  ? "#16a34a"
                  : current.status === "cancelled"
                  ? "#dc2626"
                  : "#7c5cff",
              boxShadow: "0 0 8px currentColor",
              animation:
                current.status !== "delivered" && current.status !== "cancelled"
                  ? "pulse 2s infinite"
                  : "none",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            {current.status === "delivered"
              ? "Completed"
              : current.status === "cancelled"
              ? "Cancelled"
              : "Live polling (every 5s)"}
          </span>
        </div>
      </div>

      {/* Status Badge Card */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "20px",
          backgroundColor: badge.bg,
          border: "1px solid var(--border)",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
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

        {current.status === "on-the-way" && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
              Driver Estimated Wait
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: "700", color: badge.color, marginTop: "0.2rem" }}>
              5 to 10 mins
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Driver is on the way {current.location ? `to ${current.location}` : ""}
            </div>
          </div>
        )}

        {isCooking && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
              Kitchen Status
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: "700", color: badge.color, marginTop: "0.2rem" }}>
              Cooking Fresh
            </div>
          </div>
        )}
      </div>

      {/* Cooking Notice: Customer notification that food is being cooked and on the way soon */}
      {isCooking && (
        <div className="kitchen-notification-banner">
          <div className="kitchen-notification-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="kitchen-notification-text">
            <strong>Kitchen Notification</strong>
            <p>Your food is being cooked and it will be on the way soon.</p>
          </div>
        </div>
      )}

      {current.status === "delivered" && !deliveredConfirmed && (
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid var(--border)",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem" }}>Confirm Delivery</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 1rem" }}>
            Did you receive your delivery?
          </p>
          <button
            type="button"
            onClick={() => setDeliveredConfirmed(true)}
            className="btn-primary"
            style={{ borderRadius: "999px", padding: "0.6rem 1.5rem" }}
          >
            Yes, I Received My Delivery
          </button>
        </div>
      )}

      {current.status === "delivered" && deliveredConfirmed && (
        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid var(--border)",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem", textAlign: "center" }}>Rate and Review</h3>
          {reviewSubmitted ? (
            <p style={{ color: "#16a34a", fontWeight: "600", textAlign: "center", margin: 0 }}>
              Thank you for your review!
            </p>
          ) : (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text)", marginBottom: "0.4rem" }}>
                  Rating
                </div>
                <div style={{ display: "inline-flex", gap: "0.4rem", justifyContent: "center" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.6rem",
                        color: star <= rating ? "#a48fff" : "var(--border)",
                        padding: "0.2rem",
                        lineHeight: 1,
                      }}
                      aria-label={`${star} star`}
                    >
                      *
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us about the flavor, freshness, temperature, or packaging..."
                  rows={3}
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    padding: "0.85rem",
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    color: "var(--text)",
                    fontSize: "0.92rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setReviewSubmitted(true)}
                  className="btn-primary"
                  style={{ borderRadius: "999px", padding: "0.6rem 2rem" }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details & Items */}
      <div className="order-details-card">
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Order Details</h3>
        <p style={{ margin: "0.3rem 0", color: "var(--muted)" }}>
          <strong style={{ color: "var(--text)" }}>Customer:</strong> {current.name} ({current.phone})
        </p>
        {current.location && (
          <p style={{ margin: "0.3rem 0", color: "var(--muted)" }}>
            <strong style={{ color: "var(--text)" }}>Delivery Location:</strong> {current.location}
          </p>
        )}
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
            alignItems: "center",
            marginTop: "1.25rem",
            paddingTop: "0.85rem",
            borderTop: "1px dashed var(--border)",
            fontSize: "1.1rem",
            fontWeight: "750",
          }}
        >
          <span>Total Paid</span>
          <span className="grand-total-val">{current.total} ETB</span>
        </div>
      </div>

      <div className="order-status-actions">
        <Link href="/menu" className="btn-primary order-action-btn">
          Order more dishes
        </Link>
        <Link href="/" className="btn-ghost order-action-btn">
          Return home
        </Link>
        {current.status === "placed" && isWithinFiveMinutes && (
          <button
            type="button"
            onClick={handleCancelRequest}
            disabled={cancelling}
            className="cancel-request-btn"
          >
            {cancelling ? "Requesting..." : "Cancel Request"}
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderStatus;
