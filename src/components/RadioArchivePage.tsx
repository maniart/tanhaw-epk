'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Episode } from '@/lib/types'
import { requestPlay, onIndexChange, getCurrentIndex } from '@/lib/radioEvents'
import styles from '@/styles/radioArchive.module.css'

const MANIFEST_URL = process.env.NEXT_PUBLIC_RADIO_MANIFEST_URL ?? ''

function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const BackIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 2L4 6l4 4" />
  </svg>
)

const PlayingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <rect x="1.5" y="1.5" width="3" height="9" rx="1" />
    <rect x="7.5" y="1.5" width="3" height="9" rx="1" />
  </svg>
)

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M2.5 1.5l8 4.5-8 4.5z" />
  </svg>
)

export default function RadioArchivePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loadError, setLoadError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => getCurrentIndex())

  // Fetch manifest
  useEffect(() => {
    if (!MANIFEST_URL) { setLoadError(true); return }
    fetch(MANIFEST_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data: unknown) => {
        const manifest = data as { episodes?: Episode[] }
        if (Array.isArray(manifest?.episodes) && manifest.episodes.length > 0) {
          setEpisodes(manifest.episodes)
        } else {
          setLoadError(true)
        }
      })
      .catch(() => setLoadError(true))
  }, [])

  // Stay in sync with RadioPlayer's current index
  useEffect(() => {
    return onIndexChange(setActiveIndex)
  }, [])

  // Episodes shown newest-first; we keep track of original index for play requests
  const reversed = [...episodes].map((ep, originalIndex) => ({ ep, originalIndex })).reverse()

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          <BackIcon />
          Back
        </Link>
        <img src="/logo.svg" alt="Tan Haw" style={{ height: '36px', width: 'auto' }} />
      </div>

      {/* Heading */}
      <div className={styles.heading}>
        <span className={styles.headingLabel}>Archive</span>
        <h1 className={styles.headingTitle}>Radio Tan Haw</h1>
      </div>

      {/* List */}
      {loadError ? (
        <div className={styles.status} role="status">Unable to load episodes</div>
      ) : episodes.length === 0 ? (
        <div className={styles.status} role="status">Loading…</div>
      ) : (
        <ul className={styles.list} role="list">
          {reversed.map(({ ep, originalIndex }) => {
            const isActive = originalIndex === activeIndex
            return (
              <li key={ep.id} role="listitem">
                <button
                  className={`${styles.row}${isActive ? ' ' + styles.rowActive : ''}`}
                  onClick={() => requestPlay(originalIndex)}
                  aria-label={`Play Episode ${ep.id}: ${ep.title}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={styles.epNum}>Ep {ep.id}</span>
                  <span className={styles.epTitle}>{ep.title}</span>
                  <span className={styles.epDate}>{formatDate(ep.date)}</span>
                  <span className={styles.playIcon}>
                    {isActive ? <PlayingIcon /> : <PlayIcon />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
