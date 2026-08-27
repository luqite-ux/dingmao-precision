import Link from 'next/link'
import { ArrowRight, Cog, Combine, Drill, Gauge, ScanLine, Wrench } from 'lucide-react'

import { CleanProductImage } from '@/components/products/CleanProductImage'
import { VisualPageHero } from '@/components/VisualPageHero'
import { visualPages } from '@/lib/site'

export const metadata = { alternates: { canonical: '/capabilities' } }

const routes = [
  [Cog, 'Swiss turning', 'Small-diameter, feature-rich components produced through a focused turning route.'],
  [Combine, 'Mill-turn machining', 'Turning and milling features coordinated for multi-surface component geometry.'],
  [Drill, 'Secondary operations', 'Threads, cross holes, slots, and additional drawing-defined features.'],
  [Wrench, 'Material coordination', 'Stainless steel, aluminum, copper alloys, and other suitable materials reviewed per order.'],
  [Gauge, 'Sampling', 'Prototype and sample routes aligned with geometry, tooling, and the confirmed requirement.'],
  [ScanLine, 'Inspection', 'Dimensional and appearance checks matched to the drawing and order scope.'],
] as const

export default function CapabilitiesPage() {
  const page = visualPages.capabilities

  return <>
    <VisualPageHero
      eyebrow="MANUFACTURING CAPABILITIES"
      title="The route matters as much as the machine."
      intro="We align machining, material, secondary work, sampling, and inspection into one traceable production path around the component requirement."
      action={{ label: 'Discuss a component', href: '/contact' }}
      images={page.heroImages}
      metrics={page.metrics}
      variant="capabilities"
    />
    <section className="capability-evidence section">
      <div className="capability-evidence-gallery">
        <figure><CleanProductImage src="/products-ai/771945202977.jpg" alt="Stainless steel connector manufactured by Dingmao" sizes="(max-width:800px) 100vw, 45vw" eager /></figure>
        <figure><CleanProductImage src="/products-ai/851736252645.jpg" alt="Multi-feature precision connector manufactured by Dingmao" sizes="(max-width:800px) 50vw, 24vw" /></figure>
        <figure><CleanProductImage src="/products-ai/827323925194.jpg" alt="Precision valve connector manufactured by Dingmao" sizes="(max-width:800px) 50vw, 24vw" /></figure>
      </div>
      <div className="capability-evidence-copy">
        <span className="eyebrow">PRODUCTION FOUNDATION</span>
        <h2>Capability becomes useful when the route is clear.</h2>
        <p>Dingmao’s listed production platform includes Tsugami 385C, Tsugami 325, Tsugami S205A, Tsugami BO205, Citizen 20G, and Star 20-class machines.</p>
        <p>Machine choice is only one part of the review. Material, geometry, secondary features, sampling expectations, and requested inspection documents are confirmed together.</p>
        <Link className="text-link" href="/contact">Review a drawing with us <ArrowRight size={17} /></Link>
      </div>
    </section>
    <section className="capability-route section">
      <div className="capability-route-heading">
        <span className="eyebrow">ONE CONNECTED ROUTE</span>
        <h2>From geometry review to dispatch checks.</h2>
      </div>
      <div className="capability-route-grid">
        {routes.map(([Icon, title, text], index) => <article key={title}>
          <span>0{index + 1}</span>
          <Icon size={25} />
          <h2>{title}</h2>
          <p>{text}</p>
        </article>)}
      </div>
    </section>
  </>
}
