import { notFound } from 'next/navigation'

import { PageHero } from '@/components/PageHero'
import { getPublishedArticles } from '@/lib/supabase/articles'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = (await getPublishedArticles('en')).find((item) => item.slug === slug)
  if (!article) notFound()
  return <><PageHero eyebrow={new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })} title={article.title} intro={article.excerpt} /><section className="section"><p className="empty-state">The full article content is available through the connected content system.</p></section></>
}
