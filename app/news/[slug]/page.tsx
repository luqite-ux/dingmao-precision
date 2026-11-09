import { notFound } from 'next/navigation'

import { PageHero } from '@/components/PageHero'
import { getPublishedArticles } from '@/lib/supabase/articles'

export const dynamicParams = true
export const revalidate = 60

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = (await getPublishedArticles('en')).find((item) => item.slug === slug)
  if (!article) notFound()
  return <><PageHero eyebrow={new Date(article.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })} title={article.title} intro={article.excerpt} /><article className="section article-prose" dangerouslySetInnerHTML={{ __html: article.content }} /></>
}
