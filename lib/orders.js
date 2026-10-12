import fs from "fs";

const TMP_ORDERS_FILE = "/tmp/addis_orders_store.json";

function loadFromDisk() {
  try {
    if (fs.existsSync(TMP_ORDERS_FILE)) {
      const raw = fs.readFileSync(TMP_ORDERS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item?.id) {
            orders.set(String(item.id), item);
            const numId = Number(item.id);
            if (!isNaN(numId) && numId >= globalThis.__addis_order_counter) {
              globalThis.__addis_order_counter = numId + 1;
            }
          }
        }
      }
    }
  } catch {}
}

function saveToDisk() {
  try {
    const list = Array.from(orders.values());
    fs.writeFileSync(TMP_ORDERS_FILE, JSON.stringify(list), "utf-8");
  } catch {}
}

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
    location: "Bole",
    deliveryFee: 0,
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
    location: "Kazanchis",
    deliveryFee: 0,
    ownerToken: "stranger-token",
    status: "placed",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  });
}
const orders = globalThis.__addis_orders;
loadFromDisk();

export function saveOrder(order) {
  if (!order || !order.id) return;
  orders.set(String(order.id), order);
  const numId = Number(order.id);
  if (!isNaN(numId) && numId >= globalThis.__addis_order_counter) {
    globalThis.__addis_order_counter = numId + 1;
  }
  saveToDisk();
}

export function encodeOrder(order) {
  try {
    return Buffer.from(JSON.stringify(order)).toString("base64url");
  } catch {
    return "";
  }
}

export function decodeOrder(token) {
  if (!token) return null;
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(jsonStr);
    if (data && data.id) {
      return data;
    }
  } catch {}
  try {
    const data = JSON.parse(decodeURIComponent(token));
    if (data && data.id) return data;
  } catch {}
  return null;
}

export function getOrderFromCookies(id, cookieStore) {
  if (!id || !cookieStore) return null;
  try {
    const lastOrderVal = cookieStore.get("last_order")?.value;
    if (lastOrderVal) {
      const order = decodeOrder(lastOrderVal);
      if (order && String(order.id) === String(id)) {
        saveOrder(order);
        return order;
      }
    }
    const recentVal = cookieStore.get("recent_orders")?.value;
    if (recentVal) {
      let list = [];
      try {
        list = JSON.parse(Buffer.from(recentVal, "base64url").toString("utf8"));
      } catch {
        list = JSON.parse(decodeURIComponent(recentVal));
      }
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item?.id) saveOrder(item);
          if (String(item?.id) === String(id)) {
            return item;
          }
        }
      }
    }
  } catch {}
  return null;
}

export function getOrdersForUserWithCookies(userId, cookieStore) {
  const currentOrders = getOrdersFor(userId);
  if (!cookieStore) return currentOrders;
  try {
    const recentVal = cookieStore.get("recent_orders")?.value;
    if (recentVal) {
      let list = [];
      try {
        list = JSON.parse(Buffer.from(recentVal, "base64url").toString("utf8"));
      } catch {
        list = JSON.parse(decodeURIComponent(recentVal));
      }
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item?.id && (!userId || item.userId === userId || userId === "usr_guest")) {
            saveOrder(item);
          }
        }
      }
    }
  } catch {}
  return getOrdersFor(userId);
}

export function createOrder({ userId = "usr_guest", name, phone, items, location = "Bole", deliveryFee = 50, ownerToken }) {
  loadFromDisk();
  const id = String(globalThis.__addis_order_counter++);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const fee = subtotal > 600 ? 0 : (Number(deliveryFee) || 0);
  const total = subtotal + fee;
  const order = {
    id,
    userId,
    name,
    phone,
    location,
    deliveryFee: fee,
    items,
    total,
    ownerToken,
    status: "placed",
    createdAt: new Date().toISOString(),
  };
  orders.set(id, order);
  saveToDisk();
  return order;
}

export function getOrder(id) {
  let order = orders.get(String(id));
  if (!order) {
    loadFromDisk();
    order = orders.get(String(id));
  }
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
