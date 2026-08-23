import { NextResponse } from 'next/server'

import { InquirySchema } from '@/lib/inquiry/schema'
import { createInquiry } from '@/lib/supabase/inquiries'
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  const captchaSecret = process.env.CAPTCHA_SECRET?.trim()
  if (!captchaSecret) {
    return NextResponse.json({ ok: false, message: 'Verification service is temporarily unavailable.' }, { status: 503 })
  }
  try {
    const context = createSupabaseCaptchaContextFromEnv()
    const captcha = await verifyCaptchaSubmission({
      secret: captchaSecret,
      ...context,
      scope: String(payload?.captchaScope ?? ''),
      token: String(payload?.captchaToken ?? ''),
      answer: String(payload?.captchaAnswer ?? ''),
    })
    if (!captcha.ok) {
      return NextResponse.json({ ok: false, message: 'The verification code is incorrect or expired. Please try again.' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ ok: false, message: 'Verification service is temporarily unavailable.' }, { status: 503 })
  }
  const parsed = InquirySchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Please review the required fields.', fields: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  try {
    await createInquiry(parsed.data)
    return NextResponse.json({ ok: true, message: 'Thank you. Your RFQ has been received.' }, { status: 201 })
  } catch {
    return NextResponse.json({ ok: false, message: 'The inquiry service is unavailable.' }, { status: 503 })
  }
}
