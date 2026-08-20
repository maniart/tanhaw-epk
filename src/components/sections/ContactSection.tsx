import type { ResolvedContent } from '@/lib/types'

export default function ContactSection({ content }: { content: ResolvedContent }) {
  const { shared } = content

  return (
    <section style={{ padding: 'clamp(64px,12vh,140px) 0 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 'clamp(28px,5vw,56px)',
          alignItems: 'start',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7C7266',
              display: 'block',
              marginBottom: '18px',
            }}
          >
            Contact
          </span>
          <p style={{ fontSize: '22px', fontWeight: 300, margin: 0 }}>
            <a href={`mailto:${shared.contact.email}`}>{shared.contact.email}</a>
          </p>
        </div>
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7C7266',
              display: 'block',
              marginBottom: '18px',
            }}
          >
            Listen
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '20px', fontWeight: 300 }}>
            {shared.links.listen.map((link) => (
              <a key={link.label} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7C7266',
              display: 'block',
              marginBottom: '18px',
            }}
          >
            Elsewhere
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '20px', fontWeight: 300 }}>
            {shared.links.elsewhere.map((link) => (
              <a key={link.label} href={link.url}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#A79E92',
          margin: 'clamp(64px,10vh,120px) 0 0',
        }}
      >
        {shared.footerSignoff}
      </p>
    </section>
  )
}
