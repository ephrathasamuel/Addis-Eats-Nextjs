# AUTH.md — Addis Eats Authentication & Multi-Layer Authorization

## Architecture: The Three Layers of Defense

Authentication verifies who is asking; authorization verifies what they are allowed to do.
In Addis Eats, security is enforced across three distinct layers:

| Route / Action | Layer 1: Middleware | Layer 2: Server Component Guard | Layer 3: Action / Scoped Query Guard | What Each Layer Proves |
|---|---|---|---|---|
| `/menu`, `/menu/[id]` | Public | Public | Public | Fully public and indexable; no auth needed. |
| `/checkout` | `middleware.js` redirects unauthenticated users to `/signin?next=/checkout` | Re-verifies `getSession()` before rendering payment and delivery forms | Form submission (`placeOrder`) verifies session and binds order to session `userId` | Layer 1 provides cheap edge redirection; Layer 2 prevents rendering private UI; Layer 3 guarantees the DB write cannot be forged. |
| `/orders` | `middleware.js` redirects to `/signin?next=/orders` | Checks `getSession()`; redirects if null | Scoped query: calls `getOrdersFor(user.id)`, never accepting an arbitrary ID from search params | Proves that an authenticated user can only view their own past orders. |
| `/kitchen` | `middleware.js` ensures user is signed in | Server Component evaluates `user.role === 'staff'`; renders 403 Forbidden if not staff | Action `updateKitchenStatus` verifies `user.role === 'staff'` before altering kitchen status | Proves role-based access control (RBAC). A customer account cannot view the queue or update dishes. |
| `cancelOrder` action | N/A (Server Action) | N/A | Authenticates caller via `getSession()`, verifies `order.userId === user.id` (or staff) | Proves ownership authorization: user A cannot cancel user B's order even if they know the order ID. |

---

## The Three Attack Scenarios & Mitigations

### Attack 1: Bypassing Middleware
- **Attack Vector:** An attacker sends a direct POST request using `curl` directly to the `cancelOrder` server action or `placeOrder` action without passing through the Next.js router UI, attempting to manipulate orders.
- **Why it failed:** Middleware is an edge convenience for routing and UI redirects, NOT the primary security boundary. The server action itself calls `const user = await getSession(); if (!user) throw ...`. Because Layer 3 checks the session directly from the cryptographically random httpOnly cookie, requests missing the session cookie are immediately rejected with `401 Unauthorized`.

### Attack 2: Spoofing User ID to Access Another Person's Orders
- **Attack Vector:** An attacker authenticated as User A navigates to `/orders?userId=usr_stranger` or tampers with request headers to read another customer's orders.
- **Why it failed:** The orders page in `app/orders/page.js` **never reads a user ID from query parameters or request bodies**. It strictly passes `user.id` obtained from the validated server session: `const orders = getOrdersFor(user.id)`. The query is intrinsically scoped to the authenticated caller.

### Attack 3: Open Redirect via Crafted Next Parameter
- **Attack Vector:** A phishing attacker tricks a user into visiting:
  `/signin?next=https://attacker-phishing.com/steal-creds` or `/signin?next=//attacker.com`.
- **Why it failed:** In `app/actions.js`, the `signIn` handler inspects the `next` parameter before performing redirection:
  ```javascript
  let safeNext = "/";
  if (typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//")) {
    safeNext = rawNext;
  }
  redirect(safeNext);
  ```
  Any absolute URL or protocol-relative URL is discarded, falling back safely to `/`.

---

## Session Security Configuration

- **Cookie Name:** `addis_session`
- **Flags:**
  - `httpOnly: true`: Prevents XSS scripts in the browser from reading the token.
  - `secure: true` (in production): Only transmitted over HTTPS.
  - `sameSite: "lax"`: Protects against cross-site request forgery (CSRF).
  - `path: "/"`: Available across all application routes.
