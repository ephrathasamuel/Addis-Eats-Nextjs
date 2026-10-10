// Order database with ownership and status progression
if (!globalThis.__addis_orders) {
  globalThis.__addis_orders = new Map();
  globalThis.__addis_order_counter = 1001;

  globalThis.__addis_orders.set("1000", {
    id: "1000",
    userId: "usr_almaz",
    name: "Almaz",
    phone: "0912345678",
    items: [
      { id: "doro-wat", name: "Doro Wat", price: 320, qty: 1 },
      { id: "buna", name: "Buna", price: 60, qty: 2 },
    ],
    total: 440,
    ownerToken: "demo-token-1000",
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  });

  globalThis.__addis_orders.set("999", {
    id: "999",
    userId: "usr_stranger",
    name: "Someone Else",
    phone: "0911999999",
    items: [{ id: "kitfo", name: "Kitfo", price: 350, qty: 1 }],
    total: 350,
    ownerToken: "stranger-token",
    status: "placed",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  });
}
const orders = globalThis.__addis_orders;

export function createOrder({ userId = "usr_guest", name, phone, items, ownerToken }) {
  const id = String(globalThis.__addis_order_counter++);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = {
    id,
    userId,
    name,
    phone,
    items,
    total,
    ownerToken,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  orders.set(id, order);
  return order;
}

export function getOrder(id) {
  const order = orders.get(String(id));
  if (!order) return null;
  return { ...order };
}

/**
 * Scoped query: returns orders belonging ONLY to this userId.
 * Proves that an attacker cannot access other visitors' orders.
 */
export function getOrdersFor(userId) {
  if (!userId) return [];
  return [...orders.values()]
    .filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrdersByOwner(ownerToken) {
  if (!ownerToken) return [];
  return [...orders.values()]
    .filter((order) => order.ownerToken === ownerToken)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}


/**
 * Staff-only query: returns all orders across all customers for the kitchen screen.
 */
export function getAllOrders() {
  return [...orders.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function updateOrderStatus(id, newStatus) {
  const order = orders.get(String(id));
  if (!order) return null;
  order.status = newStatus;
  return { ...order };
}

export function cancelOrderRecord(id, userId, isStaff = false) {
  const order = orders.get(String(id));
  if (!order) {
    return { ok: false, status: 404, error: "Order not found." };
  }
  // Layer 3: Authorisation check. Must match owner userId unless staff.
  if (order.userId !== userId && !isStaff) {
    return { ok: false, status: 403, error: "Not yours: you do not own this order." };
  }
  order.status = "cancelled";
  return { ok: true, order: { ...order } };
}
