import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function PageHero({ eyebrow, title, intro, action, compact = false }: { eyebrow: string; title: string; intro: string; action?: { label: string; href: string }; compact?: boolean }) {
  return <section className={`page-hero${compact ? ' compact' : ''}`}><Link href="/"><ArrowLeft size={15} /> Home</Link><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p>{action && <Link className="button primary" href={action.href}>{action.label} <ArrowRight size={17} /></Link>}</section>
}
