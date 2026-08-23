import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

import { company, navigation } from '@/lib/site'

export function Footer() {
  const legalName = 'Jiaxing Dingmao Precision Technology Co., Ltd.'.replace(/[.\s]+$/, '')
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <Link href="/" aria-label="Dingmao Precision home"><Image src="/brand/logo.png" width={84} height={84} alt="Dingmao Precision logo" className="h-16 w-auto max-w-[220px] object-contain sm:h-20" /></Link>
        <h2>Precision parts.<br />Clear production paths.</h2>
        <Link href="/contact">Discuss your drawing <ArrowUpRight size={18} /></Link>
      </div>
      <div><h3>Navigate</h3>{navigation.slice(0, 7).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div>
      <div><h3>Contact</h3><p><Mail size={16} /> {company.email}</p><p><Phone size={16} /> {company.phones[0]}</p><p><Phone size={16} /> {company.phones[1]}</p><p><MapPin size={16} /> {company.address}</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {legalName}. All rights reserved.</span><span>English · Global B2B</span></div>
  </footer>
}
