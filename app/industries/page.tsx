import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { CleanProductImage } from '@/components/products/CleanProductImage'
import { VisualPageHero } from '@/components/VisualPageHero'
import { visualPages } from '@/lib/site'

export const metadata = { alternates: { canonical: '/industries' } }

export default function IndustriesPage() {
  const page = visualPages.industries

  return <>
    <VisualPageHero
      eyebrow="INDUSTRIES"
      title="Precision parts live inside bigger systems."
      intro="We review the assembly around each component so interfaces, materials, geometry, and inspection needs align with its application."
      action={{ label: 'Tell us your application', href: '/contact' }}
      images={page.heroImages}
      metrics={page.metrics}
      variant="industries"
    />
    <section className="visual-story section">
      <div className="visual-story-heading">
        <span className="eyebrow">WHERE PARTS PERFORM</span>
        <h2>Application context shapes the component.</h2>
        <p>These are representative parts from Dingmao’s current product scope. Final feasibility and inspection requirements are confirmed against the buyer’s drawing and assembly needs.</p>
      </div>
      <div className="visual-story-grid">
        {page.items.map((item, index) => <article key={item.title}>
          <div className="visual-story-image">
            <CleanProductImage src={item.image} alt={`${item.title} representative component manufactured by Dingmao`} sizes={index < 2 ? '(max-width:800px) 100vw, 50vw' : '(max-width:800px) 100vw, 33vw'} />
            <span>0{index + 1}</span>
          </div>
          <div className="visual-story-copy">
            <small>{item.eyebrow}</small>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        </article>)}
      </div>
      <Link className="visual-story-cta" href="/contact">Share your application and drawing <ArrowRight size={18} /></Link>
    </section>
  </>
}
