import type { ResolvedContent } from '@/lib/types'

export default function VenuesSection({ content }: { content: ResolvedContent }) {
  const { venues } = content

  if (venues.length === 0) {
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
            margin: '0 0 clamp(24px,4vh,36px)',
          }}
        >
          Selected shows
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: '#5E564C',
            margin: 0,
          }}
        >
          PAST VENUES — CONTENT PENDING
        </p>
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
          margin: '0 0 clamp(24px,4vh,36px)',
        }}
      >
        Selected shows
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {venues.map((venue, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr) auto',
              gap: '24px',
              padding: '18px 0',
              borderBottom: '1px solid #1C1917',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 300 }}>{venue.name}</span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#7C7266',
              }}
            >
              {venue.city}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#5E564C',
              }}
            >
              {venue.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
