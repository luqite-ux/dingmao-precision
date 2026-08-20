import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, FileSearch, Gauge, Shapes } from 'lucide-react'
import { notFound } from 'next/navigation'

import { CleanProductImage } from '@/components/products/CleanProductImage'
import { getProduct, getProducts } from '@/lib/supabase/products'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() { return (await getProducts('en')).map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const product = await getProduct(slug, 'en'); return product ? { title: product.name, description: product.description, alternates: { canonical: `/products/${slug}` } } : { title: 'Component Not Found' } }

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug, 'en')
  if (!product) notFound()
  return <><section className="product-detail-hero"><div className="product-detail-copy"><Link href="/products"><ArrowLeft size={16} /> All products</Link><span className="eyebrow">{product.categoryName}</span><h1>{product.name}</h1><p>{product.description}</p><Link className="button primary" href={product.inquiryHref}>Request this component <ArrowRight size={17} /></Link></div><div className="product-detail-image"><CleanProductImage src={product.image} alt={product.name} sizes="(max-width:800px) 100vw, 50vw" priority /></div></section>
    <section className="detail-specs section"><div className="section-heading"><span className="eyebrow">DRAWING-BASED PRODUCTION</span><h2>Defined by your requirement.</h2><p>The catalog image represents a current manufacturing direction. Final geometry and commercial details are confirmed during RFQ review.</p></div><div className="detail-grid">{[[Shapes,'Geometry','Outside diameter, threads, bores, shoulders, and other features are reviewed from the drawing.'],[Gauge,'Material & tolerance','Material grade, dimensional tolerances, and surface requirements are confirmed before production.'],[FileSearch,'Sampling','Sample timing and validation steps depend on part complexity, tooling, and material availability.'],[Check,'Inspection','Inspection scope and requested documentation are agreed as part of the order requirement.']].map(([Icon,title,text])=><article key={String(title)}><Icon size={23}/><h3>{String(title)}</h3><p>{String(text)}</p></article>)}</div></section>
    <section className="inquiry-band"><span className="eyebrow">REFERENCE ID · {product.id}</span><h2>Need a part like this?</h2><p>Share the drawing, target quantity, material, and application so our team can review a suitable production path.</p><Link className="button primary" href={product.inquiryHref}>Start an RFQ <ArrowRight size={17}/></Link></section></>
}
