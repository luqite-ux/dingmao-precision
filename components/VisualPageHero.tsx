import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { CleanProductImage } from '@/components/products/CleanProductImage'

type VisualPageHeroProps = {
  eyebrow: string
  title: string
  intro: string
  action: { label: string; href: string }
  images: ReadonlyArray<{ src: string; alt: string; label: string }>
  metrics: ReadonlyArray<readonly [string, string]>
  variant: 'industries' | 'capabilities'
}

export function VisualPageHero({ eyebrow, title, intro, action, images, metrics, variant }: VisualPageHeroProps) {
  return <section className={`visual-page-hero visual-page-hero--${variant}`}>
    <Link className="visual-page-back" href="/"><ArrowLeft size={15} /> Home</Link>
    <div className="visual-page-copy">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{intro}</p>
      <Link className="button primary" href={action.href}>{action.label} <ArrowRight size={17} /></Link>
    </div>
    <div className="visual-page-stage" aria-label="Representative Dingmao precision components">
      {images.map((image, index) => <figure key={image.src}>
        <CleanProductImage src={image.src} alt={image.alt} sizes={index === 0 ? '(max-width:800px) 78vw, 34vw' : '(max-width:800px) 38vw, 18vw'} priority={index === 0} />
        <figcaption><span>0{index + 1}</span>{image.label}</figcaption>
      </figure>)}
      <div className="visual-page-scan" aria-hidden="true" />
    </div>
    <dl className="visual-page-metrics">
      {metrics.map(([value, label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}
    </dl>
  </section>
}
