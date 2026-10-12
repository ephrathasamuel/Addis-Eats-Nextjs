import { NextResponse } from "next/server";
import { getOrder, getOrderFromCookies } from "@/lib/orders";

export async function GET(request, { params }) {
  const { id } = await params;
  let order = getOrder(id);

  if (!order && id) {
    order = getOrderFromCookies(id, request.cookies);
  }

  if (!order) {
    return NextResponse.json({ error: `Order #${id} not found.` }, { status: 404 });
  }

  return NextResponse.json(order);
}
