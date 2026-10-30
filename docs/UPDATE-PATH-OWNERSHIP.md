# Path-ownership manifest — copy-paste install updates (`revenleather`)

> Verified against disk: 2026-10-23 @ `241da00`

Authority: `DECISIONS.md` ADR-020, `PLAN.md`, `TASKS.md` A-153, `AGENTS.md` §0.

Each store is a copy of AdsBookCMS in its **own repo**, deployed independently.
To update a store, copy the **product-owned** paths of a tested release into its
repo and **never touch** the install-owned ones. This list is the contract.
Derived from the real repo layout (`wrangler.jsonc`, `.gitignore`); it is a
checklist, not an automated engine.

## ⚠️ Reven Leather (`page.revenleather.com`) Protected Customizations — NEVER blindly overwrite from `adsbookcms`

Unlike a default install, `revenleather` has custom storefront, route, and checkout rules tailored for **Reven Leather (`PT East Retail Network`)**.
1. **Never push or copy these customizations back to `adsbookcms`.**
2. **When updating `revenleather` from a new `adsbookcms` release, DO NOT blind-overwrite these files — preserve or hand-merge them:**
   - `src/lib/approved-grafir.ts` — 33 approved Gratis Grafir product slugs (supports both `reven-*` LP slugs and `products.slug`).
   - `src/components/storefront/shared/SiteBrand.astro` — White inverted logo (`brightness-0 invert`) when `tone === 'light'` on `#1a1411` backgrounds.
   - `src/components/storefront/shared/SiteHeader.astro` & `src/components/storefront/shared/SiteFooter.astro` — Minimalist centered footer with `Kebijakan Privasi · Syarat & Ketentuan` in the copyright bar; no `/testimoni` or `/landing-page` links.
   - `src/components/storefront/shared/ProductListItem.astro` — Classic sharp (`rounded-none`) product card: Category → 1-line truncated Title (`truncate`) → `★★★★★ 4.9 (xx+ terjual)` → compact Price & Compare Price.
   - `src/components/storefront/home/HeroSection.astro`, `src/components/storefront/home/ProductsSection.astro` (full-width `16:9` `/images/reven-grafir-sample.webp` Gratis Grafir spotlight + category & `Gratis Grafir (33)` filter tabs), `src/components/storefront/templates/CompactMarketHome.astro` (no `<LandingPagesSection />`).
   - `src/components/storefront/shared/PageIntro.astro`, `src/components/storefront/shared/LegalPage.astro`, `src/pages/produk/index.astro`, `src/pages/produk/[slug].astro` (`4.9 • xx terjual`), `src/pages/tentang.astro`, `src/pages/kontak.astro`, `src/pages/pengiriman.astro`, `src/pages/landing-page/index.astro`.
   - **Deleted route `/testimoni`**: `src/pages/testimoni.astro` is intentionally removed (and omitted from `CONTENT_PAGES` in `src/lib/route-map.ts`). If an upstream `adsbookcms` copy re-creates `src/pages/testimoni.astro`, delete it and run `npm run route-map`.
   - `src/components/storefront/forms/FormHybridContent.astro`, `src/components/storefront/forms/GeoIpResolvedForm.astro`, `src/scripts/form-hybrid.ts`, `src/lib/shipping-quote.ts`:
     - Optional **Gratis Grafir Nama / Inisial** selector on the 33 approved grafir products (`Tanpa Grafir` allows COD; `+ Gratis Grafir Nama / Inisial` opens `grafir_text`, disables `cod` in `syncVisiblePaymentOptions()`, shows `#summary-grafir-row`, and appends `[GRAFIR: <text>]` to `address`).
     - Payment ordering: Transfer Bank / Virtual Account / QRIS first, **COD (`cod`) always at the very bottom**.
     - Single bank / VA option (`length === 1`) renders directly as a flat radio row without collapse & show accordion.
     - `GeoIpResolvedForm.astro` passes `province={resolvedProvince}` to `FormHybridContent.astro`.
   - `src/components/storefront/forms/GeoIpResolvedForm.astro`, `src/components/storefront/forms/FormMiddleContent.astro`, `src/scripts/form-middle.ts`, `src/pages/api/submit-middle-order.ts`, `src/lib/middle-grafir.test.ts`:
     - Every landing page form section is `{"mode": "hybrid"}` in D1. On the 33 approved grafir products the middle form (name, WhatsApp, address, COD) carries the `Tanpa Grafir` / `+ Gratis Grafir` choice only.
     - `GeoIpResolvedForm` puts the full form beside the middle form inside `<template data-grafir-full-form>`: inert, no script or request until used. Picking `+ Gratis Grafir` swaps the middle form for it in place (`form-middle.ts` dynamic-imports `form-hybrid`), carrying name, phone, address and variant; the full form then asks for the district, quotes shipping and hides COD. `Tanpa Grafir` there swaps back.
     - The middle form never takes a grafir order: `submit-middle-order` answers a request carrying `grafir_text` (a page cached before the change) with `AREA_REQUIRES_FULL`, which redirects to `/full-form`.
   - `public/images/reven-*.webp`, `public/images/reven-mark.svg`.
   - `src/lib/edge-cache.ts`, `src/components/storefront/tracking/GoogleAdsBase.astro`, `src/lib/reven-page-speed.test.ts` (page speed, ADR-029 §6):
     - `EDGE_CACHE_SECONDS = 600`, not upstream's 120: ad traffic spreads over ~79 landing pages times the province key. Upstream's `edge-cache.test.ts` asserts `max-age=120`; keep it at `600`.
     - gtag's idle timer is `6000`, the Meta pixel keeps `2500`, so the two libraries never load together. `reven-page-speed.test.ts` pins both.

## Product-owned — copy on every update

All application code and its build/test/doc surface. Overwrite these wholesale
from the release:

- `src/**` — all source, scripts, styles, and `src/db/migrations/**` (the sole
  ordered schema source; the install applies only the missing suffix).
- `src/plugins/**`: first-party plugins such as Kelola. Every install carries
  their code. A plugin is installed on a store only when the store activates it
  at Pengaturan → Plugin, which writes D1 rows and plugin tables, not files. An
  install that does not use a plugin keeps its files as they are and does not
  delete them (ADR-027, ADR-028).
- `public/**` **except** merchant brand assets (see install-owned) — shared
  static files, and the favicons until a store replaces them.
- `package.json`, `package-lock.json` — product dependencies and scripts.
- `astro.config.mjs`, `tsconfig.json`, `components.json` — product build config.
- Product docs: `ARCHITECTURE.md`, `PRD.md`, `DECISIONS.md`, `TASKS.md`,
  `PLAN.md`, `UNIMPLEMENTED_SPECS.md`, `OBSERVABILITY.md`, `INSTALLATION.md`,
  `STATUS.md`, `BUILD-LOG.md`, `DESIGN-SYSTEM.md`, `docs/**` (except this file's
  install-specific notes, if any).

## Install-owned — NEVER overwrite

These carry the store's Cloudflare identity, secrets, brand, and history. A
copy-paste update must leave them byte-identical:

- **`wrangler.jsonc`** — holds the store's real Cloudflare resources and
  identity: `name`, `kv_namespaces[].id`, `d1_databases[].database_name` +
  `database_id`, `r2_buckets[].bucket_name`, `routes[]` (custom domain), and
  every `vars.PUBLIC_*` (site name/url/tagline/logo/theme/locale/template/COD
  provinces). Overwriting it points the store at another store's D1 or domain.
  See "Merge by hand" for the product-structural parts.
- **Secrets** — `.env`, `.env.*` (keep `.env.example` as product), `.dev.vars`,
  `.dev.vars.*`. Gitignored, so a tracked-file copy won't carry them, but never
  copy them across stores.
- **`.wrangler/`**, `node_modules/`, `.astro/`, `dist/`, `tmp/` — local
  Cloudflare state and build artifacts. Gitignored; never copied.
- **Merchant brand assets** the store replaced — `public/images/logo.svg`
  (admin and login tab icon), `public/images/adsbook-mark.webp` (wordmark),
  `public/images/payment/**` marks, and the favicons `public/favicon.ico`,
  `public/favicon.png` (32 px) and `public/favicon-192.png` (apple-touch; keep
  it full-bleed, the OS rounds it). The product ships neutral defaults; a store
  that swapped them keeps its own, and in a merge-type install a product change
  to one of them is a conflict the store's copy wins.
- **`RELEASE.md`** — once in a store's repo it is that install's adoption and
  deployment log, not the product release log. Do not overwrite it with the
  product's.

## Merge by hand — product-structural fields inside `wrangler.jsonc`

`wrangler.jsonc` is a product template *and* install-owned once filled. When a
release changes its structure, review and apply only these by hand, preserving
every id/name/domain/var above:

- binding **names** (`OMS_DB`, `SESSION`, `ASSET_BUCKET`, `AI`, `ASSETS`) — the
  app resolves bindings by name; they are fixed across installs.
- `main`, `compatibility_date`, `compatibility_flags`.
- `triggers.crons`, `observability`, `workers_dev`.
- `secrets.required` — the list of secret names a deployed Worker must define
  (a new required secret is a product change every install must provision).

## Update procedure (recap of `PLAN.md` §4)

1. Product `main` passes `npm test` / `check` / `build`; that commit is the release.
2. In the store's repo, branch `chore/adsbookcms-<version>`.
3. Copy the product-owned paths from the release; leave install-owned untouched;
   hand-merge the `wrangler.jsonc` structural fields if the release changed them.
4. Apply the missing migration suffix to the store's own D1
   (`npm run db:migrate:local` to verify).
5. `npm test` / `check` / `build` + fresh local D1 migration.
6. Review, deploy, and record the adopted product ref in the store's `RELEASE.md`.

An unknown/unclassified changed path stops the update until it is classified
here — never blind-copy a path this manifest does not name.
