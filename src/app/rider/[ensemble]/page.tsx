import type { Metadata } from 'next'
import ensemblesData from '../../../../content/ensembles.json'
import type { EnsembleConfig, RiderItem } from '@/lib/types'
import PrintButton from './PrintButton'

const ensembles = ensemblesData as Record<string, EnsembleConfig>

export function generateStaticParams() {
  return Object.keys(ensembles).map((ensemble) => ({ ensemble }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ensemble: string }>
}): Promise<Metadata> {
  const { ensemble } = await params
  const config = ensembles[ensemble]
  return {
    title: `Tan Haw — Technical Rider (${config?.label ?? ensemble})`,
  }
}

export default async function RiderPage({
  params,
}: {
  params: Promise<{ ensemble: string }>
}) {
  const { ensemble } = await params
  const config = ensembles[ensemble]

  if (!config) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Georgia, serif' }}>
        <p>Ensemble not found: {ensemble}</p>
      </div>
    )
  }

  const { label, pitch, rider } = config

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #fff; color: #1a1a1a; font-family: Georgia, 'Times New Roman', serif; }
      `}</style>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 40px 80px' }}>
        {/* Print button */}
        <div className="no-print" style={{ marginBottom: '40px' }}>
          <PrintButton />
        </div>

        {/* Header */}
        <header style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '24px', marginBottom: '40px' }}>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#666',
              margin: '0 0 12px',
            }}
          >
            Technical Rider — Tan Haw — 2026
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              fontSize: '32px',
              margin: '0 0 8px',
            }}
          >
            {label}
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#444', margin: 0 }}>
            mani.nilchiani@gmail.com
          </p>
        </header>

        {/* Pitch */}
        {pitch && (
          <section style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333', margin: 0 }}>{pitch}</p>
          </section>
        )}

        {/* Spec table */}
        <section>
          <h2
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#666',
              margin: '0 0 20px',
              fontWeight: 400,
            }}
          >
            Technical requirements
          </h2>

          {rider.spec.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                {(rider.spec as RiderItem[]).map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      background: i % 2 === 0 ? '#fafafa' : '#fff',
                    }}
                  >
                    <td
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#555',
                        padding: '12px 16px 12px 0',
                        width: '36%',
                        verticalAlign: 'top',
                      }}
                    >
                      {row.item}
                    </td>
                    <td
                      style={{
                        padding: '12px 0',
                        lineHeight: 1.6,
                        verticalAlign: 'top',
                        color: '#1a1a1a',
                      }}
                    >
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#999' }}>
              Rider spec pending — contact mani.nilchiani@gmail.com
            </p>
          )}
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid #e0e0e0',
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#999',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Tan Haw — tanhaw.bandcamp.com — mani.nilchiani@gmail.com
        </footer>
      </div>
    </>
  )
}
