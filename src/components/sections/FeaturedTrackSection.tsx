import type { ResolvedContent } from '@/lib/types'
import SoundCloudPlayer from '@/components/SoundCloudPlayer'

export default function FeaturedTrackSection({ content }: { content: ResolvedContent }) {
  const { variant, tracks } = content
  if (!variant.featuredTrack || !variant.featuredTrackLabel) return null

  const track = tracks[variant.featuredTrack]
  if (!track) return null

  return (
    <section style={{ padding: 'clamp(56px,10vh,120px) 0', borderBottom: '1px solid #221E1A' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C4553A',
          }}
        >
          {variant.featuredTrackLabel}
        </span>
        <span
          style={{
            fontFamily: "var(--font-bodoni), 'Times New Roman', serif",
            fontSize: 'clamp(24px,3.4vw,40px)',
            fontStyle: 'italic',
          }}
        >
          {track.title}
        </span>
      </div>
      {track.soundcloudTrackId && track.secretToken ? (
        <SoundCloudPlayer trackId={track.soundcloudTrackId} secretToken={track.secretToken} />
      ) : (
        <div
          style={{
            height: '166px',
            border: '1px solid #221E1A',
            background: '#16130F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: '#5E564C',
            }}
          >
            SOUNDCLOUD EMBED PENDING — {track.title.toUpperCase()}
          </span>
        </div>
      )}
    </section>
  )
}
