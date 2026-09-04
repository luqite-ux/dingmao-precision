import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { JsonLd } from '@/components/JsonLd'

import './globals.css'

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' })
const displayFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dingmaoprecision.com'),
  title: { default: 'Dingmao Precision | Custom CNC Components', template: '%s | Dingmao Precision' },
  description: 'Drawing-based Swiss turning, CNC turning, and precision component manufacturing in Jiaxing, China.',
  icons: { icon: '/brand/logo.png', apple: '/brand/logo.png' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f5f8f8' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${bodyFont.variable} ${displayFont.variable}`}><JsonLd /><Header /><main>{children}</main><Footer />
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_TENANT_ID && (
          <script
            async
            src={`https://admin.globle-trade.com/api/public/analytics.js?tenantId=${encodeURIComponent(process.env.NEXT_PUBLIC_TENANT_ID)}`}
          />
        )}
      </body></html>
}
