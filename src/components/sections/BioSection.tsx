import type { ResolvedContent } from '@/lib/types'
import BioToggle from './BioToggle'
import layout from '@/styles/layout.module.css'

export default function BioSection({ content }: { content: ResolvedContent }) {
  const { shared, variant } = content

  return (
    <section
      className={layout.labeled}
      style={{
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
          paddingTop: '14px',
        }}
      >
        Bio
      </h2>
      <div style={{ minWidth: 0, maxWidth: '66ch' }}>
        <p
          style={{
            fontSize: 'clamp(22px,2.4vw,30px)',
            lineHeight: 1.5,
            fontWeight: 300,
            margin: '0 0 40px',
            textWrap: 'pretty' as React.CSSProperties['textWrap'],
          }}
        >
          {shared.bioShort}
        </p>
        {(variant.bio === 'both' || variant.bio === 'long') && (
          <BioToggle bioLong={shared.bioLong} />
        )}
      </div>
    </section>
  )
}
