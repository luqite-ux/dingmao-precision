import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Menu } from 'lucide-react'

import { navigation } from '@/lib/site'

export function Header() {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Dingmao Precision home">
      <Image src="/brand/logo.png" width={46} height={46} alt="Dingmao Precision logo" priority />
      <span><b>DINGMAO</b><small>PRECISION TECHNOLOGY</small></span>
    </Link>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
    </nav>
    <Link className="header-cta" href="/contact">Start an RFQ <ArrowUpRight size={16} /></Link>
    <details className="mobile-nav">
      <summary aria-label="Open navigation"><Menu size={22} /></summary>
      <nav>{navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
    </details>
  </header>
}
