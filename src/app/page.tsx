import type { Metadata } from 'next'
import { getPhoto } from '@/lib/content'
import LinktreePage from '@/components/LinktreePage'
import type { LinktreeData } from '@/lib/types'
import linktreeData from '../../content/linktree.json'

const heroPhoto = getPhoto((linktreeData as LinktreeData).profile.heroPhoto)

export const metadata: Metadata = {
  title: 'Tan Haw',
  description: 'Mystic troubadour from Iran through Turtle Island •☽◯☾•',
  openGraph: {
    title: 'Tan Haw',
    description: 'Mystic troubadour from Iran through Turtle Island •☽◯☾•',
    images: [{ url: heroPhoto.src }],
  },
}

export default function HomePage() {
  return <LinktreePage data={linktreeData as LinktreeData} heroPhoto={heroPhoto} />
}
