import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import { OrderStatus } from "./OrderStatus";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const initial = getOrder(id);

  if (!initial) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem 1.5rem 4rem" }}>
      <OrderStatus id={id} initial={initial} />
    </main>
  );
}
