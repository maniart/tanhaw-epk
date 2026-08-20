import type { ResolvedContent } from '@/lib/types'

export default function CollaboratorsSection({ content }: { content: ResolvedContent }) {
  const { shared } = content

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,220px) minmax(0,1fr)',
        gap: 'clamp(24px,5vw,64px)',
        padding: 'clamp(64px,12vh,140px) 0',
        borderBottom: '1px solid #221E1A',
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#7C7266',
          margin: 0,
          paddingTop: '8px',
        }}
      >
        Collaborators
      </h2>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {shared.collaborators.map((c, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)',
              gap: '24px',
              padding: '18px 0',
              borderBottom: '1px solid #1C1917',
              alignItems: 'baseline',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 300 }}>{c.name}</span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#7C7266',
                lineHeight: 1.7,
              }}
            >
              {c.role}
            </span>
          </div>
        ))}
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#5E564C',
            margin: '20px 0 0',
          }}
        >
          Full album credits available on request
        </p>
      </div>
    </section>
  )
}
