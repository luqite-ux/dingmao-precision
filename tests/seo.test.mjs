import assert from 'node:assert/strict'
import test from 'node:test'

import { getProducts } from '../lib/supabase/products.ts'
import { buildSitemapEntries } from '../lib/seo.ts'
import { buildTenantPayload } from '../lib/seed.ts'

test('sitemap contains every product and public buyer route', async () => {
  const products = await getProducts('en')
  const entries = buildSitemapEntries('https://example.com', products)
  assert.equal(entries.length, 95)
  assert.ok(entries.some((entry) => entry.url === 'https://example.com/contact'))
  assert.ok(entries.some((entry) => entry.url === `https://example.com/products/${products[0].slug}`))
})

test('tenant seed preserves multilingual expansion and group assignment', () => {
  const payload = buildTenantPayload('https://example.com')
  assert.equal(payload.admin_group, 2)
  assert.equal(payload.default_language, 'en')
  assert.deepEqual(payload.supported_languages, ['en'])
  assert.equal(payload.display_name, '嘉兴鼎茂精密科技有限公司')
  assert.match(payload.site_title_i18n.en, /Dingmao Precision/)
  assert.match(payload.seo_description_i18n.en, /Jiaxing/)
  assert.equal(payload.contact_email, 'info@dingmaoprecision.com')
  assert.equal(payload.logo_url, 'https://example.com/brand/logo.png')
  assert.equal(payload.favicon_url, 'https://example.com/brand/logo.png')
})
