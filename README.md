# Addis Eats: Next.js Advanced Food Delivery Web Application

Addis Eats is a production-grade, full-stack Ethiopian food delivery web application built with Next.js 15+ App Router, React 18, and SWR. Developed as the Day 45 Week 9 capstone project, this repository synthesizes advanced Next.js patterns: three-layer authentication and authorization, live-polling client data fetching with zero-spinner first paint, debounced search-as-you-type, measured performance optimizations achieving strict Core Web Vitals budgets, and comprehensive SEO with dynamic OpenGraph card generation.

---

## Key Architectural Pillars

### 1. Three-Layer Security Matrix
Security in Addis Eats is enforced across three distinct boundaries rather than relying on client-side state or edge middleware alone:
* **Layer 1: Edge Middleware (`middleware.js`)**
  * Intercepts incoming requests before reaching route handlers or page components.
  * Fast redirection for unauthenticated visitors attempting to access protected endpoints like `/checkout`, `/orders`, or `/kitchen`.
  * Sanitizes the `next` redirect query parameter to prevent open redirect vulnerabilities.
* **Layer 2: Server Component Route Guards**
  * Evaluates authenticated sessions on the server via `getSession()` before rendering sensitive markup.
  * Enforces role-based access control (RBAC): renders `403 Forbidden` if a non-staff user attempts to view the `/kitchen` management portal.
* **Layer 3: Scoped Query & Server Action Guards**
  * Server Actions (`cancelOrder`, `placeOrder`, `updateKitchenStatus`) verify the caller identity directly from the cryptographically secure HTTP-only session cookie.
  * Order history queries are hard-scoped to the authenticated user ID (`getOrdersFor(user.id)`), making ID spoofing via URL parameters impossible.

For full architectural diagrams and attack scenario mitigations, see [addis-eats/AUTH.md](./addis-eats/AUTH.md).

---

### 2. Real-Time Client Data Fetching with SWR
The application pairs Server Components for initial page loads with SWR hooks for interactive and live updates:
* **Live Order Tracking (`/orders/[id]`):**
  * Server Component fetches the initial order record, passing it as `fallbackData: initial` to the SWR client hook.
  * Eliminates layout shift and loading spinners on initial paint.
  * SWR continuously polls `/api/orders/[id]` every 5 seconds to provide status transitions in real time.
* **Debounced Search (`SearchBox.jsx`):**
  * 300ms debounce window prevents flooding the server with network requests during typing.
  * Utilizes SWR conditional fetching (`debounced ? '/api/dishes?q=' + debounced : null`) to completely halt requests when input is cleared.
  * Applies `keepPreviousData: true` to prevent UI flickering between keystrokes.
* **Progressive Enhancement:**
  * Order submission and checkout use native Server Actions with form submissions, ensuring full functionality even if JavaScript is slow or unavailable.

For data fetching decisions and query key lifecycles, see [addis-eats/DATA.md](./addis-eats/DATA.md).

---

### 3. Performance Engineering & Core Web Vitals
All performance optimizations were verified under throttled network conditions (Slow 4G, 4x CPU slowdown):

| Metric | Target Budget | Baseline | Optimized | Primary Resolution |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | 5.8s | 1.8s | Replaced unoptimized `<img>` with `next/image` `<Image fill priority />` on hero banners with responsive `sizes`. |
| **CLS** (Cumulative Layout Shift) | < 0.10 | 0.24 | 0.00 | Assigned explicit aspect-ratio containers for cards and hero images; migrated to self-hosted `next/font`. |
| **INP** (Interaction to Next Paint) | < 200ms | 220ms | 68ms | Loaded third-party scripts with `next/script` (`strategy="lazyOnload"`), keeping the main hydration thread clear. |
| **Page Weight (Images)** | < 600 kB | 3,450 kB | 385 kB | Wikimedia Commons images compressed and served in WebP format tailored to mobile and desktop viewports. |
| **First Load JS** | < 100 kB | 94 kB | 88 kB | Server Components render the page shell; client code restricted strictly to interactive leaf components. |

For the complete before/after audit breakdown, see [addis-eats/PERF.md](./addis-eats/PERF.md).

---

### 4. SEO, Metadata & Social Previews
* **Dynamic Title Templates:** Configured with `%s | Addis Eats` in the root layout with centralized `metadataBase` (`https://addiseats.et`).
* **Canonical URLs:** Menu pages utilize canonical link tags to prevent search engine dilution across query parameters.
* **Structured Data (JSON-LD):**
  * Homepage serves Schema.org `Restaurant` metadata with cuisine, address, and pricing context.
  * Dish detail pages (`/menu/[id]`) serve Schema.org `MenuItem` structured records matching server-rendered data.
* **OpenGraph Image Generation:**
  * Dynamic 1200 x 630 cards rendered server-side using Next.js `ImageResponse`.
  * Unique preview images for each dish containing title, category, description, and ETB pricing.
* **Crawling Directives:**
  * `sitemap.xml`: Dynamically generated route list including all menu item permalinks with priority rankings.
  * `robots.txt`: Prevents crawling of private authenticated paths (`/cart`, `/checkout`, `/orders`, `/kitchen`, `/signin`).

For the complete search engine discoverability audit, see [addis-eats/SEO.md](./addis-eats/SEO.md).

---

## Repository Structure

```text
Addis-Eats-Nextjs/
├── README.md                          # Repository overview and documentation guide
└── addis-eats/                        # Next.js application root
    ├── app/
    │   ├── actions.js                 # Server Actions (signIn, signOut, placeOrder, cancelOrder)
    │   ├── favicon.ico                # Application favicon
    │   ├── globals.css                # Global design system styles and responsive layout rules
    │   ├── layout.js                  # Root layout with fonts, navigation, and metadataBase
    │   ├── not-found.js               # Custom 404 page
    │   ├── opengraph-image.jsx        # Root dynamic OpenGraph card (1200 x 630)
    │   ├── page.js                    # Home page with hero banner and JSON-LD Restaurant schema
    │   ├── robots.js                  # Dynamic robots.txt configuration
    │   ├── sitemap.js                 # Dynamic sitemap.xml generator
    │   ├── api/
    │   │   ├── dishes/                # REST endpoint for dish queries and search
    │   │   └── orders/                # REST endpoint for live order status polling
    │   ├── cart/                      # Shopping cart page (client-side state)
    │   ├── checkout/                  # Protected checkout page and order submission form
    │   ├── favorites/                 # Customer favorites list
    │   ├── kitchen/                   # Protected staff kitchen queue (RBAC guard)
    │   ├── menu/                      # Menu catalog with SWR search, filters, and SSG dish routes
    │   ├── orders/                    # Customer order history and live polling order status
    │   ├── privacy/                   # Privacy policy page
    │   ├── profile/                   # Customer profile page
    │   ├── signin/                    # Authentication login form
    │   └── terms/                     # Terms of service page
    ├── components/                    # Modular UI components (DishImage, ThemeToggle, etc.)
    │   ├── DishImage.jsx
    │   └── ThemeToggle.jsx
    ├── hooks/                         # Client hooks (useCart, useDebounce)
    │   ├── useCart.js
    │   └── useDebounce.js
    ├── lib/                           # Core business logic, mock database, and session helpers
    │   ├── auth.js                    # Session cookie management and verification
    │   └── data.js                    # Dish catalog and order state store
    ├── public/                        # Static assets and icons
    ├── .env.example                   # Environment variable template
    ├── AUTH.md                        # Detailed authentication and security matrix
    ├── BOUNDARY.md                    # Server vs client component boundaries
    ├── DATA.md                        # Client and server data fetching documentation
    ├── PERF.md                        # Performance budget and Core Web Vitals audit
    ├── README.md                      # Application-level README
    ├── SEO.md                         # Search engine optimization and metadata guide
    ├── STRATEGY.md                    # Route rendering strategies (Static, Dynamic, SSG, Client)
    ├── next.config.js                 # Next.js configuration (remote image patterns)
    └── package.json                   # Project scripts and dependencies
```

---

## Getting Started

### Prerequisites
* Node.js 18.18 or higher
* npm 9.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ephrathasamuel/Addis-Eats-Nextjs.git
   cd Addis-Eats-Nextjs/addis-eats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```

---

## Demo Accounts

The project includes pre-configured mock credentials to test multi-layer authorization and role-based workflows:

| Role | Email | Password | Accessible Routes |
|---|---|---|---|
| **Customer** | `almaz@example.com` | `password123` | `/orders`, `/checkout`, `/profile`, `/favorites` |
| **Kitchen Staff** | `staff@addiseats.com` | `password123` | `/kitchen`, `/orders`, `/menu` |

---

## Architectural Documentation

Deep-dive documentation files are located in the `addis-eats/` directory:
* [AUTH.md](./addis-eats/AUTH.md): Multi-layer security architecture, attack simulations, and cookie configurations.
* [DATA.md](./addis-eats/DATA.md): Data fetching strategies, caching tiers, SWR polling, and debounced queries.
* [PERF.md](./addis-eats/PERF.md): Core Web Vitals measurements, image compression, and script execution rules.
* [SEO.md](./addis-eats/SEO.md): Title hierarchy, canonical tags, JSON-LD schemas, and dynamic social cards.
* [STRATEGY.md](./addis-eats/STRATEGY.md): Rendering strategy breakdown for every application route.
* [BOUNDARY.md](./addis-eats/BOUNDARY.md): Server and client component boundaries with justification for client leaves.

---

## License

This project is open-source under the MIT License.
