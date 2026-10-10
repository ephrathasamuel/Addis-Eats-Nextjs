import { cookies } from "next/headers";

// Server-side session store fallback.
const SESSIONS = new Map();

// Seed a demo user and a demo staff member
SESSIONS.set("demo-session-customer", {
  id: "usr_almaz",
  name: "Almaz",
  email: "almaz@example.com",
  role: "customer",
  createdAt: new Date().toISOString(),
});

SESSIONS.set("demo-session-staff", {
  id: "usr_chef_kassahun",
  name: "Chef Kassahun",
  email: "staff@addiseats.com",
  role: "staff",
  createdAt: new Date().toISOString(),
});

export const SESSION_COOKIE = "addis_session";

function encodeSession(session) {
  try {
    return Buffer.from(JSON.stringify(session)).toString("base64url");
  } catch {
    return session.id;
  }
}

function decodeSession(token) {
  if (!token) return null;
  if (SESSIONS.has(token)) {
    return SESSIONS.get(token);
  }
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(jsonStr);
    if (data && data.id && data.name) {
      return data;
    }
  } catch {}
  return null;
}

/**
 * Shared getSession helper used by server components, route handlers,
 * and server actions alike.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value || cookieStore.get("session")?.value;

  if (!token) return null;

  const session = decodeSession(token);
  if (!session) return null;

  return { ...session, token };
}

/**
 * Creates a server session and sets hardened httpOnly cookies.
 */
export async function createSession({ id, name, email, role = "customer" }) {
  const userId = id || `usr_${Date.now()}`;

  const session = {
    id: userId,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  };

  const token = encodeSession(session);
  SESSIONS.set(token, session);

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  // Primary hardened httpOnly session cookie
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Secondary legacy httpOnly session cookie for compatibility
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Non-httpOnly display name cookie for immediate client greeting
  cookieStore.set("user_name", encodeURIComponent(name), {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Non-httpOnly display email cookie
  cookieStore.set("user_email", encodeURIComponent(email || ""), {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { ...session, token };
}

/**
 * Destroys the current session and clears cookies.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value || cookieStore.get("session")?.value;

  if (token) {
    SESSIONS.delete(token);
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete("session");
  cookieStore.delete("user_name");
  cookieStore.delete("user_email");
  cookieStore.delete("order_owner");
}
