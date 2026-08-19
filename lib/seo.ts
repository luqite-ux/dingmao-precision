import type { MetadataRoute } from 'next'

import type { CatalogProduct } from './content/types.ts'
import { requiredRoutes } from './site.ts'

export function buildSitemapEntries(baseUrl: string, products: CatalogProduct[]): MetadataRoute.Sitemap {
  const base = baseUrl.replace(/\/$/, '')
  return [
    ...requiredRoutes.map((route) => ({ url: `${base}${route === '/' ? '' : route}`, changeFrequency: route === '/' ? 'weekly' as const : 'monthly' as const, priority: route === '/' ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${base}/products/${product.slug}`, changeFrequency: 'monthly' as const, priority: 0.65 })),
  ]
}
