import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveLocalized } from '../lib/i18n/resolve.ts'

test('localized content prefers the requested language', () => {
  assert.equal(resolveLocalized({ en: 'English', de: 'Deutsch' }, 'de', 'en'), 'Deutsch')
})

test('localized content falls back to the tenant default language', () => {
  assert.equal(resolveLocalized({ en: 'English', de: '' }, 'de', 'en'), 'English')
})

test('localized content falls back to the first non-empty language', () => {
  assert.equal(resolveLocalized({ fr: 'Francais', en: '' }, 'de', 'en'), 'Francais')
})

test('localized content returns an empty string for missing values', () => {
  assert.equal(resolveLocalized(null, 'en', 'en'), '')
})
