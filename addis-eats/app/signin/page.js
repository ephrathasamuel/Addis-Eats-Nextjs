import Link from "next/link";
import { signIn } from "@/app/actions";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = params?.next || "/orders";
  const isKitchenNext = Boolean(next && next.includes("/kitchen"));
  const defaultName = isKitchenNext ? "Chef Kassahun" : "Almaz";
  const defaultEmail = isKitchenNext ? "staff@addiseats.com" : "almaz@example.com";

  const name = params?.name || defaultName;
  const email = params?.email || defaultEmail;

  let fieldErrors = {};
  try {
    fieldErrors = params?.error ? JSON.parse(params.error) : {};
  } catch {
    fieldErrors = {};
  }

  const isStaffSelected = email.toLowerCase().includes("staff") || email.toLowerCase() === "chef@addiseats.com";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-subtitle">
          {next && next !== "/" ? `Sign in to access ${next}` : "Sign in to your Addis Eats account"}
        </p>

        {/* Quick Role Switcher Chips */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <Link
            href={`/signin?next=${encodeURIComponent(next)}&name=Chef+Kassahun&email=staff%40addiseats.com`}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: "0.45rem 0.6rem",
              textAlign: "center",
              fontSize: "0.82rem",
              textDecoration: "none",
              borderRadius: "10px",
              backgroundColor: isStaffSelected ? "var(--brand)" : "transparent",
              color: isStaffSelected ? "#fff" : "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: isStaffSelected ? "700" : "500",
            }}
          >
            Staff Demo (Kitchen)
          </Link>
          <Link
            href={`/signin?next=${encodeURIComponent(next)}&name=Almaz&email=almaz%40example.com`}
            className="btn-secondary"
            style={{
              flex: 1,
              padding: "0.45rem 0.6rem",
              textAlign: "center",
              fontSize: "0.82rem",
              textDecoration: "none",
              borderRadius: "10px",
              backgroundColor: !isStaffSelected ? "var(--brand)" : "transparent",
              color: !isStaffSelected ? "#fff" : "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: !isStaffSelected ? "700" : "500",
            }}
          >
            Customer Demo
          </Link>
        </div>

        <form action={signIn} key={`${name}-${email}`}>
          <input type="hidden" name="next" value={next} />

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={name} required autoComplete="name" />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              required
              autoComplete="email"
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="password123"
              required
              autoComplete="current-password"
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn-primary btn-block">
            {isStaffSelected ? "Sign in to Kitchen Portal" : "Sign in to Addis Eats"}
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", padding: "0.75rem", background: "var(--brand-light)", borderRadius: "12px", fontSize: "0.8rem", color: "var(--text)" }}>
          <strong>Demo Role Guide:</strong>
          <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.2rem", lineHeight: 1.45 }}>
            <li><strong>Staff Portal:</strong> <code>staff@addiseats.com</code> (Access to <code>/kitchen</code>)</li>
            <li><strong>Customer:</strong> <code>almaz@example.com</code> (Access to personal orders)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
