import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const articlesSource = await readFile(new URL('../lib/supabase/articles.ts', import.meta.url), 'utf8')
const listSource = await readFile(new URL('../app/news/page.tsx', import.meta.url), 'utf8')
const detailSource = await readFile(new URL('../app/news/[slug]/page.tsx', import.meta.url), 'utf8')

test('news data access filters the real published flag', () => {
  assert.match(articlesSource, /\.eq\(['"]is_published['"],\s*true\)/)
  assert.doesNotMatch(articlesSource, /\.eq\(['"]status['"],\s*['"]published['"]\)/)
})

test('news detail reads and renders the localized article body', () => {
  assert.match(articlesSource, /content_i18n/)
  assert.match(articlesSource, /content:/)
  assert.match(detailSource, /dangerouslySetInnerHTML/)
  assert.doesNotMatch(detailSource, /full article content is available through the connected content system/i)
})

test('news routes revalidate backend content without a redeploy', () => {
  assert.match(listSource, /export const revalidate\s*=\s*60/)
  assert.match(detailSource, /export const revalidate\s*=\s*60/)
  assert.match(detailSource, /export const dynamicParams\s*=\s*true/)
})
