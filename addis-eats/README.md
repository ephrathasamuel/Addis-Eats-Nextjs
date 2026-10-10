# Addis Eats: Day 45 Next.js Advanced Project

Complete synthesis of Week 9 Next.js advanced architecture:
1. **Three-Layer Authentication & Authorization (`AUTH.md`):** Edge middleware pre-guards, Server Component authentication checks, and scoped database queries (`getOrdersFor(user.id)`) preventing ID spoofing. Staff kitchen portal (`/kitchen`) with role verification.
2. **Real-Time Client Data Fetching (`DATA.md`):** Live polling order status screen (`/orders/[id]`) with `fallbackData: initial` for zero-spinner first paint; debounced search-as-you-type with `null` key and `keepPreviousData: true`; paged dish catalog.
3. **Performance Optimization Pass (`PERF.md`):** `next/image` with remote patterns, honest `sizes`, priority hero banner, self-hosted `next/font` (Inter), lazy third-party scripts via `next/script`, and environment segmentation (`.env.example`).
4. **Metadata, Social Previews & SEO (`SEO.md`):** `metadataBase`, root layout title templates, MenuItem & Restaurant JSON-LD structured data, dynamic 1200 x 630 `ImageResponse` social cards, `sitemap.xml`, and `robots.txt`.

## Project Documentation
- **[AUTH.md](./AUTH.md):** Three-layer security matrix and defense against 3 live attack simulations.
- **[DATA.md](./DATA.md):** Decision table for server vs client data fetching, query keys, and stale times.
- **[PERF.md](./PERF.md):** Performance budget before & after with LCP, CLS, INP, and page weight analysis.
- **[SEO.md](./SEO.md):** Title hierarchy, canonical tags, JSON-LD, sitemap, and robots configuration.
- **[STRATEGY.md](./STRATEGY.md):** Rendering strategy (Static, Dynamic, SSG, Client) per route.
- **[BOUNDARY.md](./BOUNDARY.md):** Component boundaries justifying every `'use client'` leaf.

## Running the Project

```bash
# Install dependencies
npm install

# Production build and start
npm run build
npm run start
```

## Demo Credentials
- **Customer:** `almaz@example.com` (Password: `password123`) : Has personal order history at `/orders`.
- **Kitchen Staff:** `staff@addiseats.com` (Password: `password123`) : Has access to `/kitchen` queue.
