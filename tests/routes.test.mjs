import assert from 'node:assert/strict'
import test from 'node:test'

import { homeSections, navigation, requiredRoutes } from '../lib/site.ts'

test('navigation exposes Home and every buyer decision route', () => {
  assert.deepEqual(navigation[0], { label: 'Home', href: '/' })
  assert.deepEqual(
    navigation.map((item) => item.href),
    ['/', '/products', '/capabilities', '/industries', '/quality', '/about', '/news', '/contact'],
  )
})

test('site contract includes independent buyer routes', () => {
  assert.deepEqual(requiredRoutes, [
    '/',
    '/products',
    '/capabilities',
    '/industries',
    '/quality',
    '/about',
    '/faq',
    '/news',
    '/contact',
  ])
})

test('homepage presents a complete manufacturing inquiry narrative', () => {
  assert.deepEqual(homeSections, [
    'hero',
    'proof',
    'categories',
    'products',
    'capabilities',
    'industries',
    'equipment',
    'process',
    'faq',
    'news',
    'inquiry',
  ])
})
