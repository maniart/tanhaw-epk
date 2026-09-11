'use client'

import { useRef } from 'react'
import type { LinktreeLink, StreamingLinks } from '@/lib/types'
import styles from '@/styles/linktree.module.css'

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
)

const CLOSE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M4 4l10 10M14 4L4 14" />
  </svg>
)

type PlatformId = keyof Omit<StreamingLinks, 'embed'>

const PLATFORM_META: { id: PlatformId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'spotify',
    label: 'Spotify',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M7 15.5c3-1.2 7-1.2 10 0" />
        <path d="M6.5 12c3.5-1.5 8-1.5 11 0" />
        <path d="M8 8.5c2.5-1 6-1 8.5.5" />
      </svg>
    ),
  },
  {
    id: 'appleMusic',
    label: 'Apple Music',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M9 18V6l12-2v12" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 16.5c0-1.4 1-2.5 2.3-2.5.1 0 .3 0 .4.1C5 12.4 6.4 11 8.2 11c.4 0 .8.1 1.2.2C9.8 9.4 11.3 8 13.2 8c2.2 0 4 1.8 4 4 0 .2 0 .4-.1.6.3-.1.6-.1.9-.1 1.7 0 3 1.3 3 3s-1.3 3-3 3H4.5C3.1 18.5 2 17.6 2 16.5z" />
      </svg>
    ),
  },
  {
    id: 'tidal',
    label: 'Tidal',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 11c1.3-1.3 3.4-1.3 4.7 0l2.6 2.6c1.3 1.3 3.4 1.3 4.7 0l4-4" />
        <path d="M8.7 7.3l2.6 2.6" />
        <path d="M12.7 15.3l2.6-2.6" />
      </svg>
    ),
  },
  {
    id: 'amazonMusic',
    label: 'Amazon Music',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M3 17c4 2 10 2 14 0" />
        <path d="M19.5 15.5c.5-.5.5-1 0-1.5" />
        <path d="M12 4a5 5 0 0 0-5 5c0 2 1 3.5 2.5 4.5h5C16 12.5 17 11 17 9a5 5 0 0 0-5-5z" />
      </svg>
    ),
  },
  {
    id: 'bandcamp',
    label: 'Bandcamp',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M1.5 16.5L9.5 7.5h13L14.5 16.5z" fill="currentColor" />
      </svg>
    ),
  },
]

function track(link: LinktreeLink) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = typeof window !== 'undefined' ? (window as any) : null
  if (w && typeof w.gtag === 'function') {
    w.gtag('event', 'link_click', { link_id: link.id, link_label: link.label, link_url: link.url })
  }
}

export default function TrackedLink({ link }: { link: LinktreeLink }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const hasModal = !!link.streaming

  function handleClick(e: React.MouseEvent) {
    track(link)
    if (hasModal) {
      e.preventDefault()
      dialogRef.current?.showModal()
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) dialogRef.current?.close()
  }

  const s = link.streaming
  const activePlatforms = s
    ? PLATFORM_META.filter((p) => s[p.id] != null)
    : []

  return (
    <>
      <a
        href={link.url}
        target={hasModal ? undefined : '_blank'}
        rel="noopener noreferrer"
        className={styles.linkBtn}
        onClick={handleClick}
      >
        {link.thumbnail && (
          <img src={link.thumbnail} alt="" aria-hidden="true" className={styles.linkThumb} />
        )}
        <span style={{ flex: 1 }}>
          <span className={styles.linkLabel}>{link.label}</span>
          {link.sublabel && <span className={styles.linkSublabel}>{link.sublabel}</span>}
        </span>
        <span className={styles.linkArrow}>{ARROW}</span>
      </a>

      {s && (
        <dialog ref={dialogRef} className={styles.modal} onClick={handleBackdropClick}>
          <div className={styles.modalInner}>

            {/* Header */}
            <div className={styles.modalHeader}>
              {link.thumbnail && (
                <img src={link.thumbnail} alt="" aria-hidden="true" className={styles.modalThumb} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.modalTitle}>{link.label}</div>
                {link.sublabel && <div className={styles.modalSublabel}>{link.sublabel}</div>}
              </div>
              <button
                className={styles.modalClose}
                onClick={() => dialogRef.current?.close()}
                aria-label="Close"
              >
                {CLOSE_ICON}
              </button>
            </div>

            {/* Spotify embed */}
            {s.embed && (
              <div className={styles.modalEmbed}>
                <iframe
                  src={s.embed}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ border: 0, display: 'block', borderRadius: '4px' }}
                  title={`Listen to ${link.label} on Spotify`}
                />
              </div>
            )}

            {/* Platform links */}
            {activePlatforms.length > 0 && (
              <div className={styles.modalPlatforms}>
                <div className={styles.modalPlatformsLabel}>Listen on</div>
                <div className={styles.platformGrid}>
                  {activePlatforms.map((p) => (
                    <a
                      key={p.id}
                      href={s[p.id]!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.platformBtn}
                      onClick={() => track(link)}
                    >
                      {p.icon}
                      <span>{p.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  )
}
