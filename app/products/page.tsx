import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { PageHero } from '@/components/PageHero'
import { CleanProductImage } from '@/components/products/CleanProductImage'
import { getProducts } from '@/lib/supabase/products'

export const metadata: Metadata = { title: 'Precision Components', description: 'Browse drawing-based CNC, hardware, fastener, pneumatic, sensor, and industrial components.' }

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const products = await getProducts('en')
  const categories = [...new Map(products.map((product) => [product.categoryId, product.categoryName])).entries()]
  const visible = category ? products.filter((product) => product.categoryId === category) : products
  return <><PageHero eyebrow="PRODUCT CATALOG" title="Precision components, organized for real RFQs." intro="Explore representative parts from our active manufacturing catalog. Dimensions, material, finish, and production requirements are confirmed from your drawing." action={{ label: 'Send a drawing', href: '/contact' }} />
    <section className="catalog section"><nav className="catalog-filters"><Link className={!category ? 'active' : ''} href="/products">All <span>86</span></Link>{categories.map(([id, name]) => <Link className={category === id ? 'active' : ''} href={`/products?category=${id}`} key={id}>{name}<span>{products.filter((product) => product.categoryId === id).length}</span></Link>)}</nav>
      <div className="catalog-results"><p>{visible.length} representative components</p><div className="product-grid">{visible.map((product, index) => <Link className="product-card" href={`/products/${product.slug}`} key={product.id}><div className="product-image"><CleanProductImage src={product.image} alt={product.name} sizes="(max-width:700px) 100vw, 28vw" eager={index === 0} /></div><span>{product.categoryName}</span><h2>{product.name}</h2><p>{product.description}</p><b>View component <ArrowRight size={15} /></b></Link>)}</div></div>
    </section></>
}
