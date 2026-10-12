import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { getOrdersForUserWithCookies } from "@/lib/orders";
import { OrderList } from "./OrderList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // Layer 2: Server Component Guard
  const user = await getSession();
  if (!user) {
    redirect("/signin?next=/orders");
  }

  // Scoped Query: Always scoped to user.id from the verified session, limited to last 10
  const cookieStore = await cookies();
  const orders = getOrdersForUserWithCookies(user.id, cookieStore).slice(0, 10);

  return (
    <main style={{ maxWidth: "760px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0" }}>Your Order History</h1>
      </div>

      <OrderList orders={orders} />
    </main>
  );
}
