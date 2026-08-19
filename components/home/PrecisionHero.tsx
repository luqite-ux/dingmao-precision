'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Crosshair, MoveUpRight } from 'lucide-react'
import { useRef } from 'react'

const heroProducts = ['827090966795', '912243390296', '913159100220']

export function PrecisionHero() {
  const stage = useRef<HTMLDivElement>(null)

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const element = stage.current
    if (!element) return
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    element.style.setProperty('--rx', `${-y * 5}deg`)
    element.style.setProperty('--ry', `${x * 7}deg`)
  }

  function reset() {
    stage.current?.style.setProperty('--rx', '0deg')
    stage.current?.style.setProperty('--ry', '0deg')
  }

  return <section className="hero" id="hero">
    <div className="hero-copy">
      <span className="eyebrow"><Crosshair size={15} /> SWISS-TURNED & CNC COMPONENTS</span>
      <h1>Small parts.<br /><em>Exact outcomes.</em></h1>
      <p>Drawing-based precision components for automotive, communications, sensors, medical systems, and demanding industrial assemblies.</p>
      <div className="hero-actions">
        <Link className="button primary" href="/contact">Start an RFQ <ArrowRight size={18} /></Link>
        <Link className="button secondary" href="/products">Explore components <MoveUpRight size={18} /></Link>
      </div>
      <div className="hero-meta"><span><b>0.5–38 mm</b> Machining range</span><span><b>≈200</b> Production machines</span><span><b>OEM / ODM</b> Drawing based</span></div>
    </div>
    <div className="hero-stage" ref={stage} onPointerMove={move} onPointerLeave={reset}>
      <div className="stage-grid" />
      <div className="stage-ring ring-one" />
      <div className="stage-ring ring-two" />
      {heroProducts.map((id, index) => <div className={`hero-product product-${index + 1}`} key={id}>
        <Image src={`/products/${id}.jpg`} alt="Custom precision machined component" fill sizes="(max-width: 900px) 45vw, 24vw" priority={index === 0} />
      </div>)}
      <div className="scan-line" />
      <div className="stage-label"><span>LIVE PART MATRIX</span><b>DM · 038</b></div>
    </div>
  </section>
}
