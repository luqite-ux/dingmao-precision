# Dingmao Precision Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and locally verify an English-first, bright premium B2B inquiry website populated from all 86 products in the supplied 1688 catalog.

**Architecture:** A standalone Next.js 16 App Router repository uses server components for content queries and focused client components for motion and forms. A source-audited product snapshot provides deterministic local fallback and seed input, while Supabase provides production products, articles, tenant settings, and inquiry persistence.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase JS, Zod, Lucide React, Node test runner, Playwright browser verification.

**Spec:** `docs/superpowers/specs/2026-08-19-dingmao-precision-website-design.md`

## Global Constraints

- Customer code lives only in `D:\Cursor\Grand\dingmao-precision`.
- Launch language is English; locale-aware JSONB interfaces remain available for expansion.
- The catalog source is member `b2b-2212842386990a416f` and must resolve to 86 products.
- No price, cart, checkout, payment, sales count, coupon, or 1688 platform branding is rendered.
- Every commercial CTA reaches the real inquiry form.
- `admin_group` is exactly `2` and must be read back after seeding.
- No restricted after-sales duration or service-responsibility promise may exist in deliverable content.
- Logo and favicon use the supplied `LOGO.png`.
- Normal text contrast is at least 4.5:1 and interactive boundaries at least 3:1.

---

### Task 1: Project Foundation And Source Contract

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `app/layout.tsx`, `app/globals.css`
- Create: `tests/source-contract.test.mjs`
- Create: `scripts/fetch-1688-products.mjs`, `data/1688-products.json`

**Interfaces:**
- Produces: `fetchCatalog(memberId): Promise<CatalogSnapshot>` and a snapshot containing `categories` and `products`.

- [ ] Write a failing Node test asserting member ID, ten categories, 86 unique offer IDs, non-empty title/image/source URL, and absence of price fields.
- [ ] Run `pnpm test tests/source-contract.test.mjs` and verify it fails because the source module and snapshot do not exist.
- [ ] Add the minimal Next.js configuration and implement the signed read-only MTop requests for `recommendItemTabV3Service` and `recommendRollingItemV3Service`.
- [ ] Fetch every page, normalize only source-safe fields, write the deterministic JSON snapshot, and rerun the test until it passes.
- [ ] Copy the supplied logo to `public/brand/logo.png` and product images to `public/products/<offerId>.jpg`, then add assertions that every image exists.
- [ ] Commit with `feat: import Dingmao 1688 product catalog`.

### Task 2: Locale-Aware Content And Supabase Layer

**Files:**
- Create: `lib/i18n/resolve.ts`, `lib/content/types.ts`, `lib/content/catalog.ts`
- Create: `lib/supabase/server.ts`, `lib/supabase/products.ts`, `lib/supabase/articles.ts`, `lib/supabase/inquiries.ts`
- Create: `tests/i18n.test.mjs`, `tests/content.test.mjs`

**Interfaces:**
- Produces: `resolveLocalized(value, requested, fallback)`, `getProducts(locale)`, `getProduct(slug, locale)`, `getPublishedArticles(locale)`, and `createInquiry(input)`.

- [ ] Write failing tests for requested-language, default-language, and first-non-empty fallback order.
- [ ] Run the focused tests and verify failures come from missing implementations.
- [ ] Implement pure locale resolution and product normalization without React dependencies.
- [ ] Write failing tests proving Supabase results are preferred and the audited snapshot is used only when configuration or data is unavailable.
- [ ] Implement server-only Supabase clients using environment variables and return typed content models.
- [ ] Run all tests and commit with `feat: add locale-aware content data layer`.

### Task 3: Shared Shell, Home, And Motion System

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/InquiryLink.tsx`
- Create: `components/home/PrecisionHero.tsx`, `components/home/ProductStage.tsx`, `components/home/CategoryRail.tsx`
- Create: `app/page.tsx`, `tests/routes.test.mjs`, `tests/copy-policy.test.mjs`

**Interfaces:**
- Consumes: `getProducts('en')`.
- Produces: a complete homepage and reusable global navigation with explicit Home.

- [ ] Write failing route/copy tests for Home navigation, required homepage sections, real product image references, CTA targets, and prohibited commerce/service language.
- [ ] Run the tests and confirm expected failures.
- [ ] Implement the responsive shell and bright layered background tokens.
- [ ] Implement the hero product stage with transform-only pointer/parallax motion and a reduced-motion fallback.
- [ ] Implement proof, category, featured products, capabilities, industries, process, FAQ, empty-news, and closing inquiry sections.
- [ ] Run tests and commit with `feat: build premium Dingmao homepage`.

### Task 4: Independent Product And Company Pages

**Files:**
- Create: `app/products/page.tsx`, `app/products/[slug]/page.tsx`
- Create: `app/capabilities/page.tsx`, `app/industries/page.tsx`, `app/quality/page.tsx`
- Create: `app/about/page.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`
- Create: `app/news/page.tsx`, `app/news/[slug]/page.tsx`, `app/not-found.tsx`

**Interfaces:**
- Consumes: locale-aware products and published articles.
- Produces: independent index/detail routes with product-prefilled inquiry links.

- [ ] Extend route tests with every required route, product static parameters, missing-product 404 behavior, and news empty state.
- [ ] Run tests and verify new assertions fail.
- [ ] Implement product filtering and cards without price or purchase controls.
- [ ] Implement product detail sections for overview, features, applications, source-safe specifications, and inquiry CTA.
- [ ] Implement capabilities, industries, quality, about, FAQ, contact, and news routes using verified source facts only.
- [ ] Run tests and commit with `feat: add independent B2B content pages`.

### Task 5: Real Inquiry Persistence

**Files:**
- Create: `components/inquiry/InquiryForm.tsx`, `lib/inquiry/schema.ts`
- Create: `app/api/inquiries/route.ts`, `tests/inquiry.test.mjs`

**Interfaces:**
- Produces: `InquirySchema`, `POST /api/inquiries`, and accessible client submission states.

- [ ] Write failing tests for required business email, company, country, message, product prefill, success response, and database failure response.
- [ ] Run the focused test and verify expected failures.
- [ ] Implement Zod validation and the server route that inserts tenant-scoped inquiries through `createInquiry`.
- [ ] Implement the form with persistent values, field errors, loading state, and an inline result message.
- [ ] Run inquiry and full tests, then commit with `feat: connect production inquiry workflow`.

### Task 6: SEO, Tenant Seed, And Brand Assets

**Files:**
- Create: `lib/seo.ts`, `components/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Create: `scripts/seed-dingmao-precision.mjs`, `.env.example`
- Modify: `app/layout.tsx`, product and article detail pages

**Interfaces:**
- Produces: route-aware metadata, Organization/Product JSON-LD, sitemap entries, and tenant-scoped multilingual seed data.

- [ ] Write failing tests for title/description, canonical URL, product sitemap coverage, JSON-LD contact consistency, `admin_group=2`, and multilingual JSONB field presence.
- [ ] Run tests and verify failures.
- [ ] Implement metadata, sitemap, robots, JSON-LD, and favicon metadata from the supplied logo.
- [ ] Implement the seed script for tenant settings, categories, products, and source audit metadata with exact tenant scoping and read-back assertions.
- [ ] Run tests and commit with `feat: add SEO and tenant delivery seed`.

### Task 7: Delivery Verification

**Files:**
- Create: `tests/visual.spec.ts`, `scripts/scan-prohibited-terms.mjs`, `docs/delivery/source-audit.md`

**Interfaces:**
- Produces: repeatable desktop/mobile visual checks and a source audit recording workbook and 1688 provenance.

- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`; repair each failure with a reproducing test when behavior changes.
- [ ] Run the prohibited-term scan across source, snapshot, generated routes, metadata, and seed content and require zero findings.
- [ ] Start the dev server and capture desktop and mobile screenshots for Home, Products, a product detail, About, and Contact.
- [ ] Verify no console errors, no blank images, no overlap, readable contrast, reduced-motion behavior, and successful inquiry validation/error states.
- [ ] Run a final production build, record verification commands in the source audit, and commit with `test: verify Dingmao website delivery`.
