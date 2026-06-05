import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'LYU — Local Youth Upliftment', template: '%s | LYU' },
  description: 'Find local jobs near you. AI-powered matching for Indian youth. Free forever for job seekers.',
  keywords: ['jobs', 'local jobs', 'youth employment', 'India jobs', 'LYU', 'Punjab jobs', 'fresher jobs'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'LYU — Local Youth Upliftment',
    description: 'Find local jobs near you. AI-powered matching for Indian youth.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
