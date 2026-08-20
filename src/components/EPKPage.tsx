import type { ResolvedContent } from '@/lib/types'
import { EnsembleProvider } from '@/components/EnsembleContext'

import HeroSection from './sections/HeroSection'
import FeaturedTrackSection from './sections/FeaturedTrackSection'
import BioSection from './sections/BioSection'
import MusicSection from './sections/MusicSection'
import EnsembleSection from './sections/EnsembleSection'
import VideoSection from './sections/VideoSection'
import VenuesSection from './sections/VenuesSection'
import RiderSection from './sections/RiderSection'
import PressSection from './sections/PressSection'
import PhotosSection from './sections/PhotosSection'
import CollaboratorsSection from './sections/CollaboratorsSection'
import ContactSection from './sections/ContactSection'

const FULL_WIDTH_SECTIONS = new Set(['hero', 'press'])

function renderSection(key: string, content: ResolvedContent) {
  switch (key) {
    case 'hero':          return <HeroSection content={content} />
    case 'featuredTrack': return <FeaturedTrackSection content={content} />
    case 'bio':           return <BioSection content={content} />
    case 'music':         return <MusicSection content={content} />
    case 'ensembles':     return <EnsembleSection content={content} />
    case 'video':         return <VideoSection content={content} />
    case 'venues':        return <VenuesSection content={content} />
    case 'rider':         return <RiderSection content={content} />
    case 'press':         return <PressSection content={content} />
    case 'photos':        return <PhotosSection content={content} />
    case 'collaborators': return <CollaboratorsSection content={content} />
    case 'contact':       return <ContactSection content={content} />
    default:              throw new Error(`Unknown section key: "${key}"`)
  }
}

interface SectionGroup {
  fullWidth: boolean
  keys: string[]
}

function groupSections(sections: string[]): SectionGroup[] {
  const groups: SectionGroup[] = []
  let current: SectionGroup | null = null

  for (const key of sections) {
    const isFullWidth = FULL_WIDTH_SECTIONS.has(key)
    if (!current || current.fullWidth !== isFullWidth) {
      if (current) groups.push(current)
      current = { fullWidth: isFullWidth, keys: [] }
    }
    current.keys.push(key)
  }
  if (current) groups.push(current)

  return groups
}

export default function EPKPage({ content }: { content: ResolvedContent }) {
  const groups = groupSections(content.variant.sections)

  // Last content-width group gets the tighter bottom padding
  const contentGroups = groups.filter((g) => !g.fullWidth)
  const lastContentGroupIndex = groups.findLastIndex((g) => !g.fullWidth)

  const inner = (
    <div style={{ background: '#100E0C', color: '#E4DED2', fontFamily: "var(--font-newsreader), Georgia, serif", overflowX: 'hidden' }}>
      {groups.map((group, gi) => {
        if (group.fullWidth) {
          return group.keys.map((key) => (
            <div key={key}>{renderSection(key, content)}</div>
          ))
        }

        const isLastContentGroup = gi === lastContentGroupIndex
        const bottomPad = isLastContentGroup ? 'clamp(56px,9vh,96px)' : 'clamp(72px,12vh,140px)'

        return (
          <div key={gi} style={{ padding: `0 clamp(20px,5vw,72px) ${bottomPad}` }}>
            <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
              {group.keys.map((key) => (
                <div key={key}>{renderSection(key, content)}</div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  if (content.variant.defaultEnsemble) {
    return (
      <EnsembleProvider defaultEnsemble={content.variant.defaultEnsemble}>
        {inner}
      </EnsembleProvider>
    )
  }

  return inner
}
