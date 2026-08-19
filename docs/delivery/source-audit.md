# Dingmao Precision Source And Verification Audit

Date: 2026-08-20

## Verified Sources

- Customer workbook: `企业资料&产品&FAQ问题收集表.xlsx`
- Customer logo: `LOGO.png`
- Product catalog: 1688 member `b2b-2212842386990a416f`
- Design references: local case-library records for Kintec Machining, Trans Mold, and Archie Hardware

The workbook supplied the legal company name, address, telephone numbers, email, machining range, equipment list, industry applications, and buyer FAQ answers. One restricted after-sales duration row was intentionally excluded from all deliverable content.

The 1688 catalog supplied ten categories, 86 unique offer identifiers, 86 source names, 86 source URLs, and 86 source images. Commerce fields, platform promotions, sales figures, and purchase behavior were excluded from the website snapshot.

## Delivered Content

- 86 English product records with stable slugs and inquiry references
- 86 locally stored source product images
- Independent Home, Products, Product Detail, Capabilities, Industries, Quality, About, FAQ, News, News Detail, and Contact routes
- English-first locale fallback interfaces and multilingual JSONB seed fields
- Tenant initialization payload with `admin_group=2`
- Real Supabase inquiry route with tenant-scoped inserts
- Metadata, JSON-LD, robots, and a 95-entry sitemap

## Verification Evidence

- `pnpm lint`: passed with zero warnings
- `pnpm typecheck`: passed
- `pnpm test`: 16 passed, 0 failed
- `pnpm build`: passed and generated 100 routes/artifacts including 86 product detail paths
- Restricted-term scan: zero matches
- Desktop browser: Home, Products, Product Detail, and About checked
- Mobile browser: Home and Contact checked at 390 x 844
- Browser checks: no error overlay, no horizontal overflow, no broken loaded images, no console errors in the final clean session
- Inquiry behavior: product prefill verified; unconfigured local persistence returns an inline service message and preserves entered values
