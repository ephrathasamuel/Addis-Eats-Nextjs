# STRATEGY.md — rendering strategy per route

Written before the route was built, checked against the build output after.

| Route | Strategy | Why (one line) |
|---|---|---|
| `/` | **Static** | Nobody in particular is asking, and it reads no per-request data — prerendered once at build time. |
| `/menu` | **Dynamic** (reads `searchParams`) | The `?category=Meat` filter is read per request on the server, so the route cannot be prerendered. Trade-off: it costs a render per request, but the dish grid still streams behind the sidebar via Suspense. The ISR alternative (a static all-dishes page filtered client-side) would need a client filter component. |
| `/menu/[id]` | **Static via `generateStaticParams`** | We know every dish id ahead of time (8 of them), so every dish page is prerendered at build time rather than rendered on first request. |
| `/favorites` | **Client** | Favorites live in `localStorage`, same reasoning as `/cart`; also checks the `user_name` cookie client-side to gate the list behind sign-in. |
| `/profile` | **Dynamic** | Reads three cookies (`session`, `user_name`, `order_owner`) to build a response specific to one visitor — account info and order history are looked up per request, never cached or shared between visitors. |
| `/privacy`, `/terms` | **Static** | Plain placeholder text, no per-request data at all. |
| `/signin` | **Dynamic** (reads `searchParams` for field errors/prefill) | No cookie read on this page itself, but `searchParams` makes it dynamic the same way `/menu` is. |
| `/cart` | **Client** | The cart is private to one browser tab (`localStorage`) — there is nothing here for the server to prerender, cache, or even see. |
| `/checkout` | **Dynamic** (`export const dynamic = "force-dynamic"`) | Reads `cookies()` for the `order_owner` session token, so the response legitimately differs per visitor and must never be cached. `searchParams` (the cart items carried over from `/cart`) would already force dynamic rendering on its own — the explicit flag just documents the intent. |
| `/checkout/confirmation` | **Dynamic** | Reads `searchParams.order` and looks up one specific order — inherently per-request, nothing to prerender. |
| `/api/dishes` | Route handler, dynamic by default | Exists only because something *outside* our own pages could call it. Our own server components call `getDishes()` directly — they never fetch this endpoint. |
| `/api/dishes/[id]` | Route handler, dynamic by default | Same reasoning; also the endpoint proving the honest-404 contract (`curl .../not-a-dish` → `404 { "error": ... }`). |
| `/api/orders` | Route handler, dynamic by default | The write endpoint for outside callers, validated with the exact same schema (`lib/validation.js`) the checkout form uses. |

## One route I changed my mind about

`/menu` was planned as ISR (`revalidate = 3600`). The production build showed
`ƒ`, not `○`: reading `searchParams` for the category filter makes it dynamic,
so the planned strategy and the build disagreed. I resolved it by changing the
strategy to match the reality (dynamic, filter on the server) and deleting the
meaningless `revalidate` export. The page itself is `async` only to `await
searchParams` (a Promise on Next 15+, a plain object on Next 14; `await`
works on both). `DishList` is rendered, not awaited, inside `<Suspense>` so
the sidebar paints before the 700 ms dish query finishes.

## Verified against the actual build output (Next 14.2.35 and 16.3.6)

```
┌ ○ /                        static
├ ○ /cart                    static shell, client-rendered content
├ ƒ /checkout                dynamic (cookies + searchParams)
├ ƒ /checkout/confirmation   dynamic
├ ƒ /menu                    dynamic (searchParams filter)
└ ● /menu/[id]               SSG, 8 dish pages from generateStaticParams
  ƒ /api/dishes, /api/dishes/[id], /api/orders
```
