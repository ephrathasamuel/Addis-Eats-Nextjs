import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersFor } from "@/lib/orders";
import { OrderList } from "./OrderList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // Layer 2: Server Component Guard
  const user = await getSession();
  if (!user) {
    redirect("/signin?next=/orders");
  }

  // Scoped Query: Always scoped to user.id from the verified session, never from URL params
  const orders = getOrdersFor(user.id);

  return (
    <main style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: "0 0 0.25rem" }}>Your Order History</h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
            Viewing orders placed by <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "0.3rem 0.8rem",
            borderRadius: "999px",
            backgroundColor: "var(--brand-light)",
            color: "var(--brand-dark)",
          }}
        >
          {user.role} account
        </span>
      </div>

      <OrderList orders={orders} />
    </main>
  );
}
