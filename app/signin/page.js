import { signIn } from "@/app/actions";

export default async function SignInPage({ searchParams }) {
  const params = await searchParams;
  const next = params?.next || "/orders";

  const name = params?.name || "";
  const email = params?.email || "";

  let fieldErrors = {};
  try {
    fieldErrors = params?.error ? JSON.parse(params.error) : {};
  } catch {
    fieldErrors = {};
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-subtitle">
          {next && next !== "/" ? `Sign in to access ${next}` : "Sign in to your Addis Eats account"}
        </p>

        <form action={signIn} key={`${name}-${email}`}>
          <input type="hidden" name="next" value={next} />

          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              defaultValue={name}
              placeholder="e.g. Almaz"
              required
              autoComplete="name"
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              placeholder="e.g. almaz@example.com"
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
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
