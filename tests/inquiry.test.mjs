import assert from 'node:assert/strict'
import test from 'node:test'

import { InquirySchema, buildInquiryRecord } from '../lib/inquiry/schema.ts'

const validInput = {
  name: 'Ada Buyer',
  email: 'ada@example.com',
  company: 'Example Industrial',
  country: 'Germany',
  phone: '+49 123 456',
  product: '827090966795',
  quantity: '5000',
  material: 'Stainless steel',
  message: 'Please review the attached drawing reference DM-42.',
}

test('inquiry validation accepts a complete B2B request', () => {
  assert.equal(InquirySchema.safeParse(validInput).success, true)
})

test('inquiry validation rejects missing sourcing context', () => {
  const result = InquirySchema.safeParse({ ...validInput, company: '', country: '', message: '' })
  assert.equal(result.success, false)
})

test('inquiry record is tenant scoped and preserves product context', () => {
  assert.deepEqual(buildInquiryRecord('tenant-123', validInput), {
    tenant_id: 'tenant-123',
    name: 'Ada Buyer',
    email: 'ada@example.com',
    phone: '+49 123 456',
    company: 'Example Industrial',
    subject: 'RFQ · Product 827090966795 · Germany',
    message: 'Quantity: 5000\nMaterial: Stainless steel\n\nPlease review the attached drawing reference DM-42.',
    status: 'unread',
  })
})
