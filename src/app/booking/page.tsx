import type { Metadata } from 'next'
import { loadContent } from '@/lib/content'
import EPKPage from '@/components/EPKPage'

const content = loadContent('bookers')

export const metadata: Metadata = {
  title: content.variant.title,
  description: content.variant.description,
}

export default function BookingPage() {
  return <EPKPage content={content} />
}
