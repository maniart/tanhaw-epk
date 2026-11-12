import type { Metadata } from 'next'
import Script from 'next/script'
import '../styles/globals.css'
import RadioPlayer from '@/components/RadioPlayer'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: 'Tan Haw',
  description: 'Electronic Press Kit',
  metadataBase: new URL('https://tanhaw.netlify.app'),
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body>
        {children}
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
        <RadioPlayer />
      </body>
    </html>
  )
}
