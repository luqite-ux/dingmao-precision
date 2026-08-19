import { createClient } from '@supabase/supabase-js'

import snapshot from '../data/1688-products.json' with { type: 'json' }
import { buildFallbackCatalog } from '../lib/content/catalog.ts'
import { buildTenantPayload } from '../lib/seed.ts'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (!url || !serviceKey || !tenantId || !siteUrl) throw new Error('Supabase, tenant, and site URL environment variables are required.')

const db = createClient(url, serviceKey, { auth: { persistSession: false } })
const tenant = { id: tenantId, ...buildTenantPayload(siteUrl) }
const { error: tenantError } = await db.from('tenants').upsert(tenant, { onConflict: 'id' })
if (tenantError) throw tenantError

const catalog = buildFallbackCatalog(snapshot, 'en')
const categoryRows = catalog.categories.map((category, index) => ({
  tenant_id: tenantId, slug: category.slug,
  name: category.name, name_i18n: { en: category.name }, sort_order: index, is_active: true,
  extra_data: { source_category_id: category.id, source_count: category.count },
}))
const { error: categoryError } = await db.from('product_categories').upsert(categoryRows, { onConflict: 'tenant_id,slug' })
if (categoryError) throw categoryError

const { data: storedCategories, error: storedCategoryError } = await db.from('product_categories').select('id,slug,extra_data').eq('tenant_id', tenantId)
if (storedCategoryError) throw storedCategoryError
const categoryBySource = new Map(storedCategories.map((row) => [String(row.extra_data?.source_category_id), row.id]))

const productRows = catalog.products.map((product, index) => ({
  tenant_id: tenantId, slug: product.slug, name: product.name, name_i18n: { en: product.name },
  description: product.description, description_i18n: { en: product.description }, overview_i18n: { en: product.description },
  features_i18n: { en: ['Drawing-based geometry', 'Material and finish confirmed per RFQ', 'Sampling route available'] },
  applications_i18n: { en: [product.categoryName] }, advantages_i18n: { en: ['Focused small-part machining', 'Order-specific process review'] },
  category_id: categoryBySource.get(product.categoryId), main_image: `${siteUrl.replace(/\/$/, '')}${product.image}`,
  images: [`${siteUrl.replace(/\/$/, '')}${product.image}`], is_active: true, sort_order: index,
  extra_data: { source_offer_id: product.id, source_url: product.sourceUrl, source_category_id: product.categoryId },
}))
const { error: productError } = await db.from('products').upsert(productRows, { onConflict: 'tenant_id,slug' })
if (productError) throw productError

const { data: verified, error: verifyError } = await db.from('tenants').select('id,admin_group,default_language,supported_languages,logo_url,contact_email').eq('id', tenantId).single()
if (verifyError) throw verifyError
if (verified.admin_group !== 2) throw new Error(`Tenant group verification failed: ${verified.admin_group}`)
console.log(JSON.stringify({ tenant: verified, products: productRows.length, categories: categoryRows.length }, null, 2))
