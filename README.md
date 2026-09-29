# Composable Storefront (SAP Spartacus Equivalent in Next.js & React)

Enterprise headless e-commerce storefront architecture designed as a modern, decoupled React/Next.js equivalent to **SAP Composable Storefront (Spartacus)**.

---

## 🏛️ Architecture Overview

```
                                  apps/storefront-web
                    Next.js App Router: [[...slug]]/page.tsx
                                       │
                                       ▼
                                @storefront/cms
              <CmsPageLayout> -> <CmsSlot> -> <CmsComponentWrapper>
                 (Component Registry & SmartEdit Contract Attributes)
                   │                                         │
                   ▼                                         ▼
            @storefront/ui                             @storefront/api
    Atoms, Molecules, Organisms                Adapter Pattern & Normalizers
                   ▲                                         │
                   │                          ┌──────────────┴──────────────┐
                   │                          ▼                             ▼
                   │                  useMockData = true           useMockData = false
                   │                          │                             │
                   │                          ▼                             ▼
                   │                 Mock Data Module              Live SAP OCC Connector
                   │               (Local JSON Fixtures)             (/occ/v2/{baseSite})
                   │
            @storefront/core (Shared Domain Models, Configuration Schema)
            @storefront/auth (OAuth2 Guest Client Tokens & User Sessions)
```

---

## 📦 Consumable Workspace Packages

| Package | Role | Key Exports |
| :--- | :--- | :--- |
| **`@storefront/core`** | Domain models & global config | `Product`, `CmsPage`, `Cart`, `StorefrontConfig`, `configureStorefront()` |
| **`@storefront/api`** | Data adapters & mock module | `ProductAdapter`, `CmsAdapter`, `CartAdapter`, `AdapterFactory`, `MockProductAdapter`, `OccProductAdapter` |
| **`@storefront/cms`** | Dynamic CMS layout engine | `CmsPageLayout`, `CmsSlot`, `CmsComponentRegistry`, `BannerComponent`, `ProductCarouselComponent`, `SmartEditBridge` |
| **`@storefront/ui`** | Headless & styled UI system | `Button`, `Badge`, `PriceTag`, `ProductCard`, `Header`, `Footer` |
| **`@storefront/auth`** | Headless token & auth manager | `TokenManager`, `AuthProvider`, `useAuth()` |

---

## 🔄 Live API vs. Mock Data Module Configuration

The storefront features an **Adapter Factory** that switches between local mock fixtures and live SAP Commerce Cloud OCC endpoints based on a single boolean flag:

### Option A: Running with Mock Data Module (Default)
In `.env.local` or environment:
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```
- Fetches mock CMS page fixtures (`packages/api/src/mocks/fixtures/cms-pages.fixture.ts`).
- Fetches mock product catalogs with stock & ratings (`packages/api/src/mocks/fixtures/products.fixture.ts`).
- Supports in-memory cart mutations (`addToCart`, `updateCartEntry`, `removeCartEntry`).

### Option B: Connecting to Live SAP Commerce Cloud (Hybris OCC)
In `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_OCC_BASE_URL=https://your-hybris-server.com
NEXT_PUBLIC_OCC_PREFIX=/occ/v2/
NEXT_PUBLIC_OCC_BASE_SITE=electronics-spa
NEXT_PUBLIC_OCC_CLIENT_ID=mobile_android
NEXT_PUBLIC_OCC_CLIENT_SECRET=your-secret
```
- The `AdapterFactory` automatically returns `OccProductAdapter` and `OccCmsAdapter`.
- Raw Hybris OCC responses are normalized into `@storefront/core` models so UI components remain completely decoupled.

---

## 🧩 Dynamic CMS Page & Slot Mapping (Spartacus Equivalence)

In Spartacus, pages are composed of **Templates ➔ Slots ➔ Components**. This storefront replicates that exact paradigm:

1. **Catch-All Routing**: `apps/storefront-web/src/app/[...slug]/page.tsx` resolves the URL path.
2. **Layout Resolution**: `<CmsPageLayout page={pageData} />` renders slots according to template metadata.
3. **Component Registry**: CMS `typeCode` values are resolved dynamically:
   ```typescript
   import { CmsComponentRegistry } from '@storefront/cms';

   // Register or override any CMS component:
   CmsComponentRegistry.register('CustomPromoBannerComponent', MyCustomBanner);
   ```
4. **SmartEdit Support**: `<CmsComponentWrapper>` adds standard SmartEdit preview data attributes (`data-smartedit-component-id`, `data-smartedit-component-type`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run the Development Server
```bash
pnpm --filter storefront-web run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

### 3. Key Routes to Explore
- **`/`**: CMS-driven homepage (Hero banner, Intro paragraph, Product carousel).
- **`/products/CONF-DEMO-001`**: Product Details Page (PDP) with specifications and Add to Cart.
- **`/cart`**: Interactive shopping cart.
- **`/architecture`**: In-browser architecture blueprint and status dashboard.
- **`/faq`**: Dynamic CMS content page rendering `ContentPage1Template`.

---

## 🛠️ Build & Typecheck
```bash
# Typecheck all packages
pnpm run typecheck

# Production build via Turborepo
pnpm run build
```
