import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

import snapshot from '../data/1688-products.json' with { type: 'json' }
import { buildFallbackCatalog } from '../lib/content/catalog.ts'
import { buildTenantPayload } from '../lib/seed.ts'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (!url || !serviceKey || !tenantId || !siteUrl) throw new Error('Supabase, tenant, and site URL environment variables are required.')
const r2Base = (process.env.R2_PUBLIC_URL_PREFIX || process.env.NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX || '').replace(/\/$/, '')
const imageUrl = (image) => r2Base
  ? `${r2Base}/tenants/dingmao-precision/products-ai/${image.split('/').pop()}`
  : `${siteUrl.replace(/\/$/, '')}${image}`

const db = createClient(url, serviceKey, { auth: { persistSession: false } })
const passwordHash = await bcrypt.hash('info12345', 12)
const tenantPayload = buildTenantPayload(siteUrl)
const { data: existingTenant, error: tenantLookupError } = await db.from('tenants').select('id').eq('domain', tenantPayload.domain).maybeSingle()
if (tenantLookupError) throw tenantLookupError
const effectiveTenantId = existingTenant?.id ?? tenantId
const tenant = { id: effectiveTenantId, ...tenantPayload, password_hash: passwordHash }
const { data: emailOwners, error: emailOwnerError } = await db.from('admin_users').select('id,tenant_id').eq('email', tenant.email).limit(2)
if (emailOwnerError) throw emailOwnerError
if (emailOwners.length && emailOwners[0].tenant_id !== effectiveTenantId) throw new Error(`${tenant.email} already belongs to another tenant.`)
const tenantMutation = existingTenant
  ? await db.from('tenants').update(tenantPayload).eq('id', effectiveTenantId)
  : await db.from('tenants').insert(tenant)
if (tenantMutation.error) throw tenantMutation.error

const catalog = buildFallbackCatalog(snapshot, 'en')
const categoryRows = catalog.categories.map((category, index) => ({
  tenant_id: effectiveTenantId, slug: category.slug,
  name: category.name, name_i18n: { en: category.name }, sort_order: index, is_active: true,
  extra_data: { source_category_id: category.id, source_count: category.count },
}))
const { error: categoryError } = await db.from('product_categories').upsert(categoryRows, { onConflict: 'tenant_id,slug' })
if (categoryError) throw categoryError

const { data: storedCategories, error: storedCategoryError } = await db.from('product_categories').select('id,slug,extra_data').eq('tenant_id', effectiveTenantId)
if (storedCategoryError) throw storedCategoryError
const categoryBySource = new Map(storedCategories.map((row) => [String(row.extra_data?.source_category_id), row.id]))

const productRows = catalog.products.map((product, index) => ({
  tenant_id: effectiveTenantId, slug: product.slug, name: product.name, name_en: product.name, name_i18n: { en: product.name },
  description: product.description, description_i18n: { en: product.description }, overview_i18n: { en: product.description },
  features_i18n: { en: ['Drawing-based geometry', 'Material and finish confirmed per RFQ', 'Sampling route available'] },
  applications_i18n: { en: [product.categoryName] }, advantages_i18n: { en: ['Focused small-part machining', 'Order-specific process review'] },
  category: product.categoryName, category_slug: catalog.categories.find((item) => item.id === product.categoryId)?.slug,
  image_url: imageUrl(product.image), is_active: true, sort_order: index,
  extra_data: { source_offer_id: product.id, source_url: product.sourceUrl, source_category_id: product.categoryId, category_record_id: categoryBySource.get(product.categoryId) },
}))
const { error: productError } = await db.from('products').upsert(productRows, { onConflict: 'tenant_id,slug' })
if (productError) throw productError

const adminPayload = {
  tenant_id: effectiveTenantId,
  email: tenant.email,
  name: '嘉兴鼎茂精密科技有限公司管理员',
  role: 'admin',
  admin_group: 2,
  is_active: true,
  must_change_password: false,
}
if (emailOwners.length) {
  const { error } = await db.from('admin_users').update(adminPayload).eq('id', emailOwners[0].id).eq('tenant_id', effectiveTenantId)
  if (error) throw error
} else {
  const { error } = await db.from('admin_users').insert({ ...adminPayload, password_hash: passwordHash })
  if (error) throw error
}

const { data: verified, error: verifyError } = await db.from('tenants').select('id,admin_group,default_language,supported_languages,logo_url,contact_email').eq('id', effectiveTenantId).single()
if (verifyError) throw verifyError
if (verified.admin_group !== 2) throw new Error(`Tenant group verification failed: ${verified.admin_group}`)
const { data: verifiedAdmin, error: adminVerifyError } = await db.from('admin_users').select('email,tenant_id,admin_group,is_active').eq('tenant_id', effectiveTenantId).eq('email', tenant.email).single()
if (adminVerifyError) throw adminVerifyError
console.log(JSON.stringify({ tenant: verified, admin: verifiedAdmin, products: productRows.length, categories: categoryRows.length }, null, 2))
