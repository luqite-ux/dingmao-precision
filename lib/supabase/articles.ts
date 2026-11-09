import { resolveLocalized } from '../i18n/resolve.ts'
import { getSupabaseServerClient, getTenantId } from './server.ts'

export type ArticleSummary = {
  slug: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
}

export async function getPublishedArticles(locale = 'en'): Promise<ArticleSummary[]> {
  const client = getSupabaseServerClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) return []

  const { data, error } = await client
    .from('articles')
    .select('slug,title,title_i18n,excerpt,excerpt_i18n,content,content_i18n,published_at')
    .eq('tenant_id', tenantId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error || !data) return []
  return data.map((row) => ({
    slug: row.slug,
    title: resolveLocalized(row.title_i18n, locale, 'en') || row.title,
    excerpt: resolveLocalized(row.excerpt_i18n, locale, 'en') || row.excerpt || '',
    content: resolveLocalized(row.content_i18n, locale, 'en') || row.content || '',
    publishedAt: row.published_at,
  }))
}
