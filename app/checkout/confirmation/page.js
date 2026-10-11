import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ searchParams }) {
  const params = await searchParams;
  const order = getOrder(params?.order);

  if (!order) {
    notFound();
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <ClearCartOnMount />
      <h1>Order placed</h1>
      <p>
        Thanks, {order.name}. Order <strong>#{order.id}</strong> has been received{" "}
        <strong>{order.total} ETB</strong> total.
      </p>

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          borderRadius: "16px",
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Track Your Order Live</h3>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          Watch kitchen preparation and delivery progress in real-time with automatic 5-second polling.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href={`/orders/${order.id}`} className="btn-primary">
            View Live Order Status
          </Link>
          <Link href="/menu" className="btn-ghost">
            Back to menu
          </Link>
        </div>
      </div>
    </div>
  );
}
