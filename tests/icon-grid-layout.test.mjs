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
