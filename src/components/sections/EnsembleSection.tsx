'use client'

import { useEnsemble } from '@/components/EnsembleContext'
import type { ResolvedContent } from '@/lib/types'

export default function EnsembleSection({ content }: { content: ResolvedContent }) {
  const ensemble = useEnsemble()
  const { ensembles, variant } = content

  if (!ensemble) return null

  const { active, setActive } = ensemble
  const ensembleKeys = Object.keys(ensembles)

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
          margin: '0 0 clamp(32px,5vh,56px)',
        }}
      >
        Configuration
      </h2>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginBottom: 'clamp(32px,5vh,56px)',
          flexWrap: 'wrap',
        }}
      >
        {ensembleKeys.map((key) => {
          const isActive = key === active
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                background: isActive ? '#C4553A' : 'transparent',
                color: isActive ? '#100E0C' : '#7C7266',
                border: `1px solid ${isActive ? '#C4553A' : '#3A322B'}`,
                cursor: 'pointer',
                transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#E4DED2'
                  e.currentTarget.style.borderColor = '#7C7266'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#7C7266'
                  e.currentTarget.style.borderColor = '#3A322B'
                }
              }}
            >
              {ensembles[key].label}
            </button>
          )
        })}
      </div>

      {/* Pitch for active ensemble */}
      <p
        style={{
          fontSize: 'clamp(19px,2vw,26px)',
          lineHeight: 1.55,
          fontWeight: 300,
          color: '#B5AC9E',
          margin: 0,
          maxWidth: '56ch',
          textWrap: 'pretty' as React.CSSProperties['textWrap'],
        }}
      >
        {ensembles[active].pitch}
      </p>
    </section>
  )
}
