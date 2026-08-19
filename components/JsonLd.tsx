import { company } from '@/lib/site'

export function JsonLd() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    url: baseUrl,
    logo: `${baseUrl}/brand/logo.png`,
    email: company.email,
    telephone: company.phones[0],
    address: { '@type': 'PostalAddress', streetAddress: company.address, addressLocality: 'Jiaxing', addressRegion: 'Zhejiang', addressCountry: 'CN' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
