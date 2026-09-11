import type { Metadata } from 'next'
import { loadContent, getVenueSlugs } from '@/lib/content'
import EPKPage from '@/components/EPKPage'

export function generateStaticParams() {
  return getVenueSlugs().map((venue) => ({ venue }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ venue: string }>
}): Promise<Metadata> {
  const { venue } = await params
  const content = loadContent('bookers', venue)
  return {
    title: content.variant.title,
    description: content.variant.description,
  }
}

export default async function VenueBookingPage({
  params,
}: {
  params: Promise<{ venue: string }>
}) {
  const { venue } = await params
  const content = loadContent('bookers', venue)
  return <EPKPage content={content} />
}
