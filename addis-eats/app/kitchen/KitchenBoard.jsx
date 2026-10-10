"use client";

import { useState } from "react";
import { updateKitchenStatus } from "@/app/actions";
import { getDishByIdSync, getDishByNameSync } from "@/lib/dishes";

export function KitchenBoard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingId(orderId);
    const res = await updateKitchenStatus(orderId, newStatus);
    setLoadingId(null);
    if (res?.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } else {
      alert(res?.error || "Failed to update order status.");
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const completedOrders = orders.filter((o) => o.status === "delivered" || o.status === "cancelled");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ margin: 0 }}>Active Kitchen Orders ({activeOrders.length})</h2>
        <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
          Auto-updates via staff action
        </span>
      </div>

      {activeOrders.length === 0 ? (
        <div className="empty-state" style={{ margin: "2rem 0 3rem" }}>
          <h2>Queue clear</h2>
          <p>No active orders waiting in the kitchen right now.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {activeOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "1.25rem",
                boxShadow: "0 2px 8px var(--shadow-color)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "1.1rem" }}>Order #{order.id}</strong>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: "var(--brand-light)",
                      color: "var(--brand-dark)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                  Customer: <strong>{order.name}</strong> ({order.phone || "No phone"})
                </div>

                <div className="profile-cart-list" style={{ margin: "0.75rem 0 1rem" }}>
                  {order.items?.map((item, idx) => {
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
                          <div className="num-pill num-pill--qty" role="cell">
                            <span className="num-pill__label">Qty</span>
                            <span className="num-pill__val">{item.qty}</span>
                          </div>
                          {item.price ? (
                            <div className="num-pill num-pill--total" role="cell">
                              <span className="num-pill__label">Total</span>
                              <span className="num-pill__val">{item.price * item.qty} ETB</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.85rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {order.status === "placed" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "preparing")}
                      disabled={loadingId === order.id}
                      className="btn-primary"
                      style={{ fontSize: "0.85rem", padding: "0.45rem 1rem", flex: 1 }}
                    >
                      {loadingId === order.id ? "Updating..." : "Start Cooking"}
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "on-the-way")}
                      disabled={loadingId === order.id}
                      className="btn-primary"
                      style={{ fontSize: "0.85rem", padding: "0.45rem 1rem", flex: 1 }}
                    >
                      {loadingId === order.id ? "Updating..." : "Hand to Courier"}
                    </button>
                  )}
                  {order.status === "on-the-way" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "delivered")}
                      disabled={loadingId === order.id}
                      className="btn-primary"
                      style={{ fontSize: "0.85rem", padding: "0.45rem 1rem", flex: 1 }}
                    >
                      {loadingId === order.id ? "Updating..." : "Mark Delivered"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Completed / Cancelled ({completedOrders.length})</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {completedOrders.slice(0, 6).map((order) => (
          <div
            key={order.id}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1rem",
              opacity: 0.85,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Order #{order.id} ({order.name})</span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "999px",
                  background: order.status === "delivered" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: order.status === "delivered" ? "#16a34a" : "#dc2626",
                }}
              >
                {order.status}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.35rem" }}>
              {order.items?.length || 0} dishes | Total: {order.total || 0} ETB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
