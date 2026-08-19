import assert from 'node:assert/strict'
import test from 'node:test'

import snapshot from '../data/1688-products.json' with { type: 'json' }
import { buildFallbackCatalog } from '../lib/content/catalog.ts'
import { getProduct, getProducts } from '../lib/supabase/products.ts'

test('fallback catalog exposes every audited product as English inquiry content', () => {
  const catalog = buildFallbackCatalog(snapshot, 'en')

  assert.equal(catalog.products.length, 86)
  assert.equal(catalog.categories.length, 10)
  assert.equal(new Set(catalog.products.map((product) => product.slug)).size, 86)

  for (const product of catalog.products) {
    assert.match(product.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.match(product.name, /[A-Za-z]/)
    assert.ok(product.description.length >= 60)
    assert.match(product.image, /^\/products-ai\/\d+\.jpg$/)
    assert.match(product.inquiryHref, /^\/contact\?product=/)
    assert.equal(product.price, undefined)
  }
})

test('product data access uses the audited catalog when Supabase is not configured', async () => {
  const products = await getProducts('en')
  assert.equal(products.length, 86)

  const product = await getProduct(products[0].slug, 'en')
  assert.equal(product?.id, products[0].id)
  assert.equal(await getProduct('missing-product', 'en'), null)
})
