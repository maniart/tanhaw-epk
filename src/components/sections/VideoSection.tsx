import type { ResolvedContent } from '@/lib/types'
import YoutubeEmbed from '@/components/YoutubeEmbed'

export default function VideoSection({ content }: { content: ResolvedContent }) {
  const { variant } = content
  const videos = variant.videos ?? []

  if (videos.length === 0) {
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
            margin: '0 0 clamp(32px,5vh,48px)',
          }}
        >
          Live video
        </h2>
        <div
          style={{
            height: '240px',
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
            VIDEO EMBEDS PENDING
          </span>
        </div>
      </section>
    )
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
          margin: '0 0 clamp(32px,5vh,48px)',
        }}
      >
        Live video
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px,4vh,40px)' }}>
        {videos.map((videoId) => (
          <YoutubeEmbed key={videoId} videoId={videoId} title="Tan Haw live" />
        ))}
      </div>
    </section>
  )
}
