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
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0" }}>Your Order History</h1>
      </div>

      <OrderList orders={orders} />
    </main>
  );
}
