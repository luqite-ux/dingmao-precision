import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const snapshotPath = new URL('../data/1688-products.json', import.meta.url)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('catalog snapshot preserves all source products without commerce fields', async () => {
  const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'))

  assert.equal(snapshot.memberId, 'b2b-2212842386990a416f')
  assert.equal(snapshot.categories.length, 10)
  assert.equal(snapshot.products.length, 86)
  assert.equal(new Set(snapshot.products.map((product) => product.offerId)).size, 86)

  for (const product of snapshot.products) {
    assert.match(product.offerId, /^\d+$/)
    assert.ok(product.sourceTitle.trim())
    assert.match(product.sourceImage, /^https:\/\//)
    assert.match(product.sourceUrl, /^https:\/\/detail\.1688\.com\/offer\/\d+\.html$/)
    assert.ok(product.sourceCategoryId)
    assert.ok(product.sourceCategoryName)
    assert.equal(product.localImage, `/products/${product.offerId}.jpg`)
    await access(path.join(projectRoot, 'public', product.localImage))
    assert.equal('price' in product, false)
    assert.equal('offerMinPrice' in product, false)
    assert.equal('saleCount' in product, false)
  }
})

test('supplied brand mark is present for header and favicon generation', async () => {
  await access(path.join(projectRoot, 'public/brand/logo.png'))
})
