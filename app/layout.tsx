import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { company } from '@/lib/site'

import './globals.css'

const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' })
const displayFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: { default: 'Dingmao Precision | Custom CNC Components', template: '%s | Dingmao Precision' },
  description: 'Drawing-based Swiss turning, CNC turning, and precision component manufacturing in Jiaxing, China.',
  icons: { icon: '/brand/logo.png', apple: '/brand/logo.png' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f5f8f8' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${bodyFont.variable} ${displayFont.variable}`}><Header /><main>{children}</main><Footer /></body></html>
}
