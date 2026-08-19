import { PageHero } from '@/components/PageHero'
import { getPublishedArticles } from '@/lib/supabase/articles'

export default async function NewsPage(){const articles=await getPublishedArticles('en');return <><PageHero eyebrow="NEWSROOM" title="Company and production updates." intro="Published company news and technical updates will be collected here."/><section className="section">{articles.length?<div className="news-list">{articles.map((article)=><a href={`/news/${article.slug}`} key={article.slug}><time>{new Date(article.publishedAt).toLocaleDateString('en-US',{dateStyle:'medium'})}</time><h2>{article.title}</h2><p>{article.excerpt}</p></a>)}</div>:<p className="empty-state">No company updates have been published yet.</p>}</section></>}
