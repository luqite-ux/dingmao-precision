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
  return {
    id: String(row.id),
    slug,
    name,
    description,
    categoryId: String((row.extra_data as Record<string, unknown> | null)?.source_category_id ?? row.category_slug ?? ''),
    categoryName: String(row.category ?? 'Custom Precision Components'),
    image: String(row.image_url ?? '/brand/logo.png'),
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
