import type { Metadata } from 'next'
import { Bodoni_Moda, Newsreader, IBM_Plex_Mono } from 'next/font/google'
import '../styles/globals.css'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${newsreader.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
