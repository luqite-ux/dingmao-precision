'use client'

import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { InquiryCaptchaField } from '@/components/inquiry-captcha-field'

export function InquiryForm({ defaultProduct = '' }: { defaultProduct?: string }) {
  const [state, setState] = useState<{ kind: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ kind: 'idle', message: '' })
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState({ kind: 'loading', message: 'Submitting your RFQ…' })
    const values = Object.fromEntries(new FormData(form).entries())
    setCaptchaRefreshKey((key) => key + 1)

    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(values) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)
      setState({ kind: 'success', message: result.message })
      form.reset()
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : 'The inquiry could not be submitted.' })
    }
  }

  return <form className="inquiry-form" onSubmit={submit}>
    <label>Full name *<input name="name" autoComplete="name" required minLength={2} /></label>
    <label>Business email *<input name="email" type="email" autoComplete="email" required /></label>
    <label>Company *<input name="company" autoComplete="organization" required minLength={2} /></label>
    <label>Country / region *<input name="country" autoComplete="country-name" required minLength={2} /></label>
    <label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" /></label>
    <label>Product reference<input name="product" defaultValue={defaultProduct} /></label>
    <label>Target quantity<input name="quantity" inputMode="numeric" /></label>
    <label>Preferred material<input name="material" /></label>
    <label className="full">Drawing reference and project details *<textarea name="message" rows={7} required minLength={12} placeholder="Include part function, critical dimensions, finish, timing, and any drawing reference." /></label>
    <InquiryCaptchaField refreshKey={captchaRefreshKey} className="full" />
    <div className="form-submit full"><button className="button primary" disabled={state.kind === 'loading'} type="submit">{state.kind === 'loading' ? <LoaderCircle className="spin" size={18} /> : null} Submit RFQ <ArrowRight size={17} /></button><p className={state.kind} role="status" aria-live="polite">{state.message}</p></div>
  </form>
}
