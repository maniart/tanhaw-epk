import type { ResolvedContent } from '@/lib/types'
import styles from '@/styles/photos.module.css'
import layout from '@/styles/layout.module.css'

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" aria-hidden="true">
    <path d="M8 1.5v9" />
    <path d="M4.2 7l3.8 3.8L11.8 7" />
    <path d="M2 14h12" />
  </svg>
)

export default function HeroSection({ content }: { content: ResolvedContent }) {
  const { shared, heroPhoto } = content

  return (
    <section
      className={styles.photoWrapper}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px clamp(20px,5vw,72px) clamp(48px,8vh,88px)',
      }}
    >
      {/* Background photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${heroPhoto.src}')`,
          backgroundSize: 'cover',
          backgroundPosition: heroPhoto.focal,
          backgroundRepeat: 'no-repeat',
        }}
        role="img"
        aria-label={heroPhoto.alt}
      />

      {/* Scrims: top/bottom only, middle stays clear */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 78% at 50% 42%, rgba(16,14,12,0) 42%, rgba(16,14,12,0.55) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16,14,12,0.72) 0%, rgba(16,14,12,0.16) 26%, rgba(16,14,12,0.12) 46%, rgba(16,14,12,0.72) 78%, #100E0C 100%)' }} />

      {/* Download button */}
      {heroPhoto.downloadName && (
        <a
          href={heroPhoto.src}
          download={heroPhoto.downloadName}
          aria-label="Download hero photo"
          className={`${styles.downloadBtn} ${styles.downloadBtnLarge}`}
        >
          {DOWNLOAD_ICON}
        </a>
      )}

      {/* Header: logotype + badge */}
      <header
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          fontFamily: "var(--font-mono), monospace",
          fontSize: '11px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C0B8AC',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo.svg"
            alt="Tan Haw logotype"
            style={{ height: '44px', width: 'auto', display: 'block' }}
          />
        </span>
        <span>Electronic Press Kit — 2026</span>
      </header>

      {/* Artist name + hook + meta */}
      <div style={{ position: 'relative', maxWidth: '1160px', width: '100%', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: "var(--font-bodoni), 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: 'clamp(72px,17vw,240px)',
            lineHeight: 0.82,
            margin: '0 0 clamp(24px,4vh,40px)',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 60px rgba(16,14,12,0.5)',
          }}
        >
          {shared.artist}
        </h1>
        <div
          className={layout.heroBottom}
          style={{ gap: 'clamp(24px,6vw,80px)' }}
        >
          <p
            style={{
              fontSize: 'clamp(21px,2.6vw,32px)',
              lineHeight: 1.3,
              fontWeight: 300,
              margin: 0,
              maxWidth: '34ch',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
              textShadow: '0 1px 24px rgba(16,14,12,0.5)',
            }}
          >
            {shared.hook}
          </p>
          <p
            className={layout.heroMeta}
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#B0A79A',
              lineHeight: 2.1,
              margin: 0,
            }}
          >
            {shared.meta.map((line, i) => (
              <span key={i}>
                {line}
                {i < shared.meta.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
