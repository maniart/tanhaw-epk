import type { ResolvedContent, Photo } from '@/lib/types'
import styles from '@/styles/photos.module.css'
import layout from '@/styles/layout.module.css'

const DOWNLOAD_ICON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" aria-hidden="true">
    <path d="M8 1.5v9" />
    <path d="M4.2 7l3.8 3.8L11.8 7" />
    <path d="M2 14h12" />
  </svg>
)

function PhotoCard({ photo }: { photo: Photo }) {
  const captionText = photo.credit
    ? `${photo.caption} — ph. ${photo.credit}`
    : photo.caption

  return (
    <figure style={{ margin: 0 }}>
      <div className={styles.photoWrapper}>
        <img
          src={photo.src}
          alt={photo.alt}
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '3/4',
            objectFit: 'cover',
            objectPosition: photo.focal,
          }}
        />
        <a
          href={photo.src}
          download={photo.downloadName}
          aria-label={`Download ${photo.caption}`}
          className={styles.downloadBtn}
        >
          {DOWNLOAD_ICON}
        </a>
      </div>
      <figcaption
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#5E564C',
          marginTop: '12px',
        }}
      >
        {captionText}
      </figcaption>
    </figure>
  )
}

export default function PhotosSection({ content }: { content: ResolvedContent }) {
  const { gridPhotos } = content

  return (
    <section style={{ padding: 'clamp(64px,12vh,140px) 0', borderBottom: '1px solid #221E1A' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: 'clamp(24px,4vh,40px)',
          flexWrap: 'wrap',
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
          }}
        >
          Photos
        </h2>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#5E564C',
          }}
        >
          High-res on request
        </span>
      </div>
      <div className={layout.photoGrid} style={{ gap: 'clamp(12px,2vw,24px)' }}>
        {gridPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  )
}
