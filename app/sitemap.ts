import type { MetadataRoute } from 'next'

import { buildSitemapEntries } from '@/lib/seo'
import { getProducts } from '@/lib/supabase/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000', await getProducts('en'))
}
