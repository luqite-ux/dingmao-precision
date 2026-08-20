import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'

import { InquiryForm } from '@/components/inquiry/InquiryForm'
import { company } from '@/lib/site'
import { getProducts } from '@/lib/supabase/products'

export const metadata: Metadata = { title: 'Contact & RFQ', description: 'Send a drawing-based RFQ to Dingmao Precision in Jiaxing, China.', alternates: { canonical: '/contact' } }

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product: productId } = await searchParams
  const product = productId ? (await getProducts('en')).find((item) => item.id === productId) : null
  return <section className="contact-layout"><div className="contact-intro"><span className="eyebrow">CONTACT · RFQ</span><h1>Put the drawing in motion.</h1><p>Share the part requirement and our team will review the geometry, material, quantity, and next technical step.</p><div className="contact-details"><p><Mail size={18}/><span><b>Email</b>{company.email}</span></p><p><Phone size={18}/><span><b>Phone</b>{company.phones.join(' · ')}</span></p><p><MapPin size={18}/><span><b>Factory address</b>{company.address}</span></p></div></div><div className="form-panel"><InquiryForm defaultProduct={product ? `${product.id} · ${product.name}` : ''}/></div></section>
}
