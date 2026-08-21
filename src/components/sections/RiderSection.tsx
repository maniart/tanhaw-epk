'use client'

import { useEnsemble } from '@/components/EnsembleContext'
import type { ResolvedContent } from '@/lib/types'
import layout from '@/styles/layout.module.css'

export default function RiderSection({ content }: { content: ResolvedContent }) {
  const ensemble = useEnsemble()
  const { ensembles, variant } = content

  const activeKey = ensemble?.active ?? variant.defaultEnsemble ?? 'trio'
  const activeEnsemble = ensembles[activeKey]

  if (!activeEnsemble) return null

  const { summary } = activeEnsemble.rider

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
          paddingTop: '6px',
        }}
      >
        Technical rider
      </h2>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgb(157, 34, 34)',
            margin: '0 0 20px',
          }}
        >
          {activeEnsemble.label}
        </p>
        {summary.length > 0 ? (
          <ul
            style={{
              margin: '0 0 28px',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {summary.map((line, i) => (
              <li key={i} style={{ fontSize: '18px', lineHeight: 1.5, color: '#B5AC9E', fontWeight: 300 }}>
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              color: '#5E564C',
              margin: '0 0 28px',
            }}
          >
            RIDER SPEC PENDING
          </p>
        )}
        <a
          href={`/rider/${activeKey}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "var(--font-mono), monospace",
            fontSize: '11px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgb(157, 34, 34)',
            borderBottom: '1px solid #3A322B',
            paddingBottom: '6px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'rgb(157, 34, 34)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = '#3A322B')}
        >
          Full rider PDF
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M1 9L9 1M9 1H3M9 1v6" />
          </svg>
        </a>
      </div>
    </section>
  )
}
