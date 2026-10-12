import { cookies } from "next/headers";
import CheckoutView from "./CheckoutView";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ searchParams }) {
  const cookieStore = await cookies();
  const returning = Boolean(cookieStore.get("order_owner"));

  const params = await searchParams;
  const itemsRaw = params?.items || "[]";
  let items = [];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    items = [];
  }

  let fieldErrors = {};
  try {
    fieldErrors = params?.error ? JSON.parse(params.error) : {};
  } catch {
    fieldErrors = {};
  }

  const initialLocation = params?.location || "Bole";

  return (
    <CheckoutView
      itemsRaw={itemsRaw}
      items={items}
      initialName=""
      initialPhone=""
      initialLocation={initialLocation}
      fieldErrors={fieldErrors}
      returning={returning}
    />
  );
}
