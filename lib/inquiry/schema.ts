import { z } from 'zod'

export const InquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(2).max(160),
  country: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(80).default(''),
  product: z.string().trim().max(160).default('General inquiry'),
  quantity: z.string().trim().max(80).default('To be discussed'),
  material: z.string().trim().max(120).default('To be discussed'),
  message: z.string().trim().min(12).max(4000),
})

export type InquiryInput = z.infer<typeof InquirySchema>

export function buildInquiryRecord(tenantId: string, input: InquiryInput) {
  return {
    tenant_id: tenantId,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    company: input.company.trim(),
    subject: `RFQ · Product ${input.product || 'General inquiry'} · ${input.country}`,
    message: `Quantity: ${input.quantity || 'To be discussed'}\nMaterial: ${input.material || 'To be discussed'}\n\n${input.message.trim()}`,
    status: 'unread',
  }
}
