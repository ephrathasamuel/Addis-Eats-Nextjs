"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { validateOrder, validateSignIn } from "@/lib/validation";
import { createOrder, cancelOrderRecord, updateOrderStatus } from "@/lib/orders";
import { getSession, createSession, clearSession } from "@/lib/session";

/**
 * Place Order Server Action
 * Layer 3 Check: Reads session internally on the server, binding the order to the authenticated user.
 */
export async function placeOrder(formData) {
  const name = formData.get("name");
  const phone = formData.get("phone");
  const itemsRaw = formData.get("items");

  let items = [];
  try {
    items = JSON.parse(itemsRaw || "[]");
  } catch {
    items = [];
  }

  const { valid, fieldErrors } = validateOrder({ name, phone, items });

  if (!valid) {
    const params = new URLSearchParams();
    params.set("items", itemsRaw || "[]");
    params.set("name", name || "");
    params.set("phone", phone || "");
    params.set("error", JSON.stringify(fieldErrors));
    redirect(`/checkout?${params.toString()}`);
  }

  const session = await getSession();
  const userId = session?.id || "usr_guest";

  const order = createOrder({
    userId,
    name,
    phone,
    items,
    ownerToken: session?.token || "guest_token",
  });

  redirect(`/checkout/confirmation?order=${order.id}`);
}

/**
 * Cancel Order Server Action
 * Layer 3 Check: Authenticates caller via getSession() and enforces ownership server-side.
 */
export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) {
    return { ok: false, status: 401, error: "Authentication required." };
  }

  const res = cancelOrderRecord(orderId, user.id, user.role === "staff");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  return res;
}

/**
 * Sign In Server Action
 * Issues an httpOnly session cookie and validates destination to stop open-redirects.
 */
export async function signIn(formData) {
  const name = formData.get("name") || "Demo User";
  const email = formData.get("email");
  const password = formData.get("password");
  const rawNext = formData.get("next") || "/";

  const { valid, fieldErrors } = validateSignIn({ name, email, password });

  if (!valid) {
    const params = new URLSearchParams();
    params.set("name", name || "");
    params.set("email", email || "");
    params.set("next", rawNext);
    params.set("error", JSON.stringify(fieldErrors));
    redirect(`/signin?${params.toString()}`);
  }

  // Staff role assignment for demo staff accounts
  const isStaff = email.toLowerCase().includes("staff") || email.toLowerCase() === "chef@addiseats.com";
  const role = isStaff ? "staff" : "customer";
  const userId = isStaff ? "usr_chef_kassahun" : "usr_almaz";

  await createSession({
    id: userId,
    name,
    email,
    role,
  });

  // Open-Redirect Defense: Reject absolute URLs, protocol-relative '//', or external schemes
  let safeNext = "/";
  if (typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    safeNext = rawNext;
  }

  redirect(safeNext);
}

/**
 * Sign Out Server Action
 */
export async function signOut() {
  await clearSession();
  redirect("/");
}

/**
 * Staff Kitchen Status Update Action
 * Layer 3 Check: Only staff role permitted.
 */
export async function updateKitchenStatus(orderId, newStatus) {
  const user = await getSession();
  if (!user || user.role !== "staff") {
    return { ok: false, status: 403, error: "Unauthorized: Staff permission required." };
  }

  const updated = updateOrderStatus(orderId, newStatus);
  revalidatePath("/kitchen");
  revalidatePath(`/orders/${orderId}`);
  return { ok: true, order: updated };
}
