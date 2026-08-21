import type { ResolvedContent } from '@/lib/types'
import styles from '@/styles/photos.module.css'

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" aria-hidden="true">
    <path d="M8 1.5v9" />
    <path d="M4.2 7l3.8 3.8L11.8 7" />
    <path d="M2 14h12" />
  </svg>
)

export default function PressSection({ content }: { content: ResolvedContent }) {
  const { shared, pressPhoto } = content

  return (
    <section
      className={styles.photoWrapper}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        minHeight: 'clamp(460px,64vh,720px)',
        padding: 'clamp(64px,12vh,140px) clamp(20px,5vw,72px) clamp(56px,10vh,120px)',
        backgroundImage: `url('${pressPhoto.src}')`,
        backgroundSize: 'cover',
        backgroundPosition: pressPhoto.focal,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Vertical scrim: solid ground at top/bottom, clear in middle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(16,14,12,0.9) 0%, rgba(16,14,12,0.12) 22%, rgba(16,14,12,0.1) 55%, rgba(16,14,12,0.62) 90%, #100E0C 100%)',
        }}
      />
      {/* Left-to-right scrim: holds density past text lines, fades toward sky */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(100deg, rgba(16,14,12,0.66) 0%, rgba(16,14,12,0.58) 46%, rgba(16,14,12,0.3) 68%, rgba(16,14,12,0) 88%)',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: '1160px', width: '100%', margin: '0 auto' }}>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#C0B8AC',
            display: 'block',
            marginBottom: 'clamp(24px,4vh,44px)',
          }}
        >
          Press
        </span>
        <blockquote
          style={{
            fontFamily: "var(--font-bodoni), 'Times New Roman', serif",
            fontSize: 'clamp(27px,4vw,58px)',
            lineHeight: 1.18,
            fontWeight: 400,
            margin: '0 0 clamp(32px,5vh,56px)',
            maxWidth: '19ch',
            color: '#F2EDE4',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 28px rgba(16,14,12,0.85), 0 1px 3px rgba(16,14,12,0.7)',
          }}
        >
          &ldquo;{shared.press.quote}&rdquo;
        </blockquote>
        {shared.press.features.map((feature, i) => (
          <a
            key={i}
            href={feature.url}
            style={{
              display: 'block',
              borderTop: '1px solid rgba(228,222,210,0.28)',
              paddingTop: '22px',
              maxWidth: '52ch',
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgb(157, 34, 34)',
                display: 'block',
                marginBottom: '10px',
                textShadow: '0 1px 12px rgba(16,14,12,0.9)',
              }}
            >
              {feature.outlet} ↗
            </span>
            <span
              style={{
                fontSize: '20px',
                lineHeight: 1.5,
                display: 'block',
                color: '#F2EDE4',
                textShadow: '0 2px 20px rgba(16,14,12,0.9), 0 1px 3px rgba(16,14,12,0.7)',
              }}
            >
              {feature.title}
            </span>
          </a>
        ))}
      </div>

      {/* Download button */}
      <a
        href={pressPhoto.src}
        download={pressPhoto.downloadName}
        aria-label="Download press photo"
        className={`${styles.downloadBtn} ${styles.downloadBtnLarge}`}
      >
        {DOWNLOAD_ICON}
      </a>
    </section>
  )
}
