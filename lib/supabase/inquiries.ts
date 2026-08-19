import { buildInquiryRecord, type InquiryInput } from '../inquiry/schema.ts'
import { getSupabaseServerClient, getTenantId } from './server.ts'

export async function createInquiry(input: InquiryInput) {
  const client = getSupabaseServerClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) {
    throw new Error('The inquiry service is not configured yet. Please email our team directly.')
  }

  const { error } = await client.from('inquiries').insert(buildInquiryRecord(tenantId, input))
  if (error) throw new Error('Your inquiry could not be submitted. Please try again or email our team.')
}
