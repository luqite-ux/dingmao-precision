import assert from 'node:assert/strict'
import test from 'node:test'

import * as site from '../lib/site.ts'

test('five industry cards use a balanced 3+2 desktop layout', () => {
  assert.equal(typeof site.getIconGridLayout, 'function')
  assert.equal(site.getIconGridLayout(5), 'icon-page-grid--industries')
})

test('six capability cards use a balanced 3x2 desktop layout', () => {
  assert.equal(typeof site.getIconGridLayout, 'function')
  assert.equal(site.getIconGridLayout(6), 'icon-page-grid--capabilities')
})

test('industries page pairs every application with a real Dingmao product image', () => {
  assert.equal(typeof site.visualPages, 'object')
  assert.deepEqual(
    site.visualPages.industries.items.map(({ image }) => image),
    [
      '/products-ai/911919047728.jpg',
      '/products-ai/851736252645.jpg',
      '/products-ai/827323925194.jpg',
      '/products-ai/771952089765.jpg',
      '/products-ai/827354457551.jpg',
    ],
  )
})

test('capabilities page exposes verified manufacturing proof in the visual narrative', () => {
  assert.equal(typeof site.visualPages, 'object')
  assert.deepEqual(site.visualPages.capabilities.metrics, [
    ['0.5–38 mm', 'Outside diameter range'],
    ['~200', 'Machines listed'],
    ['3–15 days', 'Sampling reference'],
  ])
})
