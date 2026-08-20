'use client'

import { useEnsemble } from '@/components/EnsembleContext'
import SoundCloudPlayer from '@/components/SoundCloudPlayer'
import type { ResolvedContent, Track } from '@/lib/types'
import layout from '@/styles/layout.module.css'

function TrackRow({
  index,
  id,
  track,
  isLast,
}: {
  index: number
  id: string
  track: Track
  isLast: boolean
}) {
  const isFirst = index === 0

  return (
    <div
      style={{
        padding: `clamp(40px,7vh,72px) 0 ${isLast ? 0 : 'clamp(40px,7vh,72px)'}`,
        borderTop: isFirst ? 'none' : '1px solid #1C1917',
      }}
    >
      <div className={layout.trackRow} style={{ gap: 'clamp(20px,4vw,56px)' }}>
        {/* Left: number, title, description, credits */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline', marginBottom: '18px' }}>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: '11px', color: '#5E564C' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-bodoni), 'Times New Roman', serif",
                fontWeight: 400,
                fontSize: 'clamp(30px,3.6vw,46px)',
                lineHeight: 1.02,
                margin: 0,
                letterSpacing: '-0.015em',
                textWrap: 'balance' as React.CSSProperties['textWrap'],
              }}
            >
              {track.title}
            </h3>
          </div>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#B5AC9E',
              margin: '0 0 20px',
              maxWidth: '38ch',
              textWrap: 'pretty' as React.CSSProperties['textWrap'],
            }}
          >
            {track.description}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#7C7266',
              lineHeight: 1.9,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            {track.credits}
          </p>
        </div>

        {/* Right: player or placeholder */}
        <div style={{ minWidth: 0 }}>
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
                padding: '0 16px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  color: '#5E564C',
                  wordBreak: 'break-all',
                }}
              >
                SOUNDCLOUD EMBED PENDING — {track.title.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MusicSection({ content }: { content: ResolvedContent }) {
  const ensemble = useEnsemble()
  const { variant, tracks } = content

  let displayedTracks: Array<{ id: string; track: Track }>

  if (variant.tracks) {
    displayedTracks = variant.tracks.map((id) => ({ id, track: tracks[id] }))
  } else {
    const active = ensemble?.active ?? variant.defaultEnsemble ?? ''
    const filtered = Object.entries(tracks)
      .filter(([, t]) => t.ensembles.includes(active))
      .map(([id, track]) => ({ id, track }))
    displayedTracks =
      filtered.length > 0
        ? filtered
        : Object.entries(tracks).map(([id, track]) => ({ id, track }))
  }

  return (
    <section style={{ padding: 'clamp(64px,12vh,140px) 0', borderBottom: '1px solid #221E1A' }}>
      <h2
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#7C7266',
          margin: '0 0 clamp(32px,6vh,64px)',
        }}
      >
        Music
      </h2>
      {displayedTracks.map(({ id, track }, i) => (
        <TrackRow key={id} index={i} id={id} track={track} isLast={i === displayedTracks.length - 1} />
      ))}
    </section>
  )
}
