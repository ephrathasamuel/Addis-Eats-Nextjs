import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { KitchenBoard } from "./KitchenBoard";

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  // Layer 2: Server-side role check
  const user = await getSession();

  if (!user) {
    redirect("/signin?next=/kitchen");
  }

  if (user.role !== "staff") {
    return (
      <main style={{ maxWidth: "620px", margin: "4rem auto", textAlign: "center", padding: "0 1.5rem" }}>
        <h1>403 Forbidden</h1>
        <p style={{ color: "var(--muted)", margin: "1rem 0 1.5rem", lineHeight: 1.6 }}>
          Access to the kitchen dashboard is restricted to staff members only. You are currently signed in as <strong>{user.name}</strong> (<code>{user.role}</code> role).
        </p>
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/signin?next=/kitchen&email=staff%40addiseats.com&name=Chef+Kassahun"
            className="btn-primary"
          >
            Switch to Staff Account
          </Link>
          <Link href="/" className="btn-secondary">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const orders = getAllOrders();

  return (
    <main style={{ maxWidth: "1040px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: "0 0 0.25rem" }}>Kitchen Order Queue</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Logged in as <strong>{user.name}</strong> (Staff Role)
          </p>
        </div>
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            padding: "0.35rem 0.9rem",
            borderRadius: "999px",
            backgroundColor: "#2e7d32",
            color: "white",
          }}
        >
          Staff Portal
        </span>
      </div>

      <KitchenBoard initialOrders={orders} />
    </main>
  );
}
