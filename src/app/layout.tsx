import type { Metadata } from 'next'
import { Bodoni_Moda, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import '../styles/globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
})

const newsreader = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tan Haw',
  description: 'Electronic Press Kit',
  metadataBase: new URL('https://tanhaw.com'),
  icons: { icon: '/logo.svg' },
  openGraph: {
    images: [{ url: '/opengraph-thumbnail.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-thumbnail.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${newsreader.variable} ${mono.variable}`}>
      <body>{children}</body>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}
    </html>
  )
}
