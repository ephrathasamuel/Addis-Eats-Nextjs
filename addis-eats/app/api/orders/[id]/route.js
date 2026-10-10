import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;
  const order = getOrder(id);

  if (!order) {
    return NextResponse.json({ error: `Order #${id} not found.` }, { status: 404 });
  }

  return NextResponse.json(order);
}
