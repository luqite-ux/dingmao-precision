import { NextResponse } from 'next/server'

import { InquirySchema } from '@/lib/inquiry/schema'
import { createInquiry } from '@/lib/supabase/inquiries'

export async function POST(request: Request) {
  const parsed = InquirySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Please review the required fields.', fields: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  try {
    await createInquiry(parsed.data)
    return NextResponse.json({ ok: true, message: 'Thank you. Your RFQ has been received.' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'The inquiry service is unavailable.' }, { status: 503 })
  }
}
