import snapshot from '../../data/1688-products.json' with { type: 'json' }

import { buildFallbackCatalog } from '../content/catalog.ts'
import type { CatalogProduct } from '../content/types.ts'
import { resolveLocalized } from '../i18n/resolve.ts'
import { getSupabaseServerClient, getTenantId } from './server.ts'

const fallback = buildFallbackCatalog(snapshot, 'en')

function normalizeDatabaseProduct(row: Record<string, unknown>, locale: string): CatalogProduct {
  const slug = String(row.slug ?? row.id)
  const name = resolveLocalized(
    row.name_i18n as Record<string, string> | null,
    locale,
    'en',
  ) || String(row.name ?? 'Custom Precision Component')
  const description = resolveLocalized(
    row.description_i18n as Record<string, string> | null,
    locale,
    'en',
  ) || String(row.description ?? '')
  const images = Array.isArray(row.images) ? row.images : []
  return {
    id: String(row.id),
    slug,
    name,
    description,
    categoryId: String(row.category_id ?? ''),
    categoryName: String(row.category_name ?? 'Custom Precision Components'),
    image: String(row.main_image ?? images[0] ?? '/brand/logo.png'),
    sourceUrl: String((row.extra_data as Record<string, unknown> | null)?.source_url ?? ''),
    inquiryHref: `/contact?product=${encodeURIComponent(String(row.id))}`,
  }
}

export async function getProducts(locale = 'en'): Promise<CatalogProduct[]> {
  const client = getSupabaseServerClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) return fallback.products

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !data?.length) return fallback.products
  return data.map((row) => normalizeDatabaseProduct(row, locale))
}

export async function getProduct(slug: string, locale = 'en') {
  return (await getProducts(locale)).find((product) => product.slug === slug) ?? null
}
