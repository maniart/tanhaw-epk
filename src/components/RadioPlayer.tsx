'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { Episode } from '@/lib/types'
import styles from '@/styles/radio.module.css'

const MANIFEST_URL = process.env.NEXT_PUBLIC_RADIO_MANIFEST_URL ?? ''

// ── WhatsApp channel invite link ─────────────────────────────────────────────
// To find the invite link: WhatsApp → your channel → Info → Invite link
// Replace the placeholder below with the actual invite code when available.
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/REPLACE_WITH_YOUR_INVITE_CODE'
// ─────────────────────────────────────────────────────────────────────────────

/* ── Date formatter ── */
function formatEpisodeDate(isoDate: string): string {
  // Append time to force local parsing and avoid UTC date shift
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Live indicator ── */
function getIsLive(): boolean {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(now)
  const weekday = parts.find(p => p.type === 'weekday')?.value
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10)
  // Tuesday (Tue) or Thursday (Thu), 21:00–23:59 ET
  return (weekday === 'Tue' || weekday === 'Thu') && hour >= 21 && hour <= 23
}

/* ── SVG icons ── */
const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <path d="M3 1.5l8 5-8 5z" />
  </svg>
)

const PauseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <rect x="2" y="1.5" width="3.5" height="10" rx="1" />
    <rect x="7.5" y="1.5" width="3.5" height="10" rx="1" />
  </svg>
)

const PrevIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <path d="M10.5 1.5L3 6.5l7.5 5z" />
    <rect x="1.5" y="1.5" width="2" height="10" rx="1" />
  </svg>
)

const NextIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <path d="M2.5 1.5L10 6.5l-7.5 5z" />
    <rect x="9.5" y="1.5" width="2" height="10" rx="1" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.046 21.954a.5.5 0 00.6.6l4.786-1.392A9.954 9.954 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.07-1.115l-.29-.175-3.016.877.877-3.016-.175-.29A7.95 7.95 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.618c-.242-.121-1.43-.706-1.651-.787-.22-.08-.38-.121-.54.121-.161.242-.623.787-.764.948-.14.16-.28.18-.523.06-.242-.12-1.022-.377-1.946-1.2-.719-.64-1.204-1.431-1.346-1.673-.14-.242-.015-.373.106-.493.109-.109.242-.283.363-.424.12-.141.161-.242.242-.404.08-.161.04-.302-.02-.424-.061-.12-.541-1.308-.741-1.79-.195-.47-.394-.406-.54-.414-.14-.007-.302-.009-.463-.009-.161 0-.424.06-.646.302-.22.242-.846.827-.846 2.015 0 1.19.866 2.34.987 2.502.12.161 1.703 2.603 4.126 3.648.577.249 1.027.398 1.378.509.579.184 1.106.158 1.522.096.464-.07 1.43-.585 1.632-1.149.2-.564.2-1.048.14-1.149-.06-.1-.22-.16-.463-.282z" />
  </svg>
)

/* ── Component ── */
export default function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const shouldAutoPlayRef = useRef(false)

  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const live = getIsLive()

  // Fetch manifest once on mount
  useEffect(() => {
    if (!MANIFEST_URL) {
      setLoadError(true)
      return
    }
    fetch(MANIFEST_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: unknown) => {
        const manifest = data as { episodes?: Episode[] }
        if (Array.isArray(manifest?.episodes) && manifest.episodes.length > 0) {
          setEpisodes(manifest.episodes)
          if (getIsLive()) {
            setCurrentIndex(manifest.episodes.length - 1)
          }
        } else {
          setLoadError(true)
        }
      })
      .catch(() => setLoadError(true))
  }, [])

  // Update audio src when index or episode list changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || episodes.length === 0) return
    const ep = episodes[currentIndex]
    if (!ep) return
    audio.src = ep.url
    audio.load()
    if (shouldAutoPlayRef.current) {
      audio.play().catch(() => {
        shouldAutoPlayRef.current = false
        setPlaying(false)
      })
    }
  }, [currentIndex, episodes])

  // Attach / detach ended listener
  const handleEnded = useCallback(() => {
    shouldAutoPlayRef.current = true
    setCurrentIndex(i => (i + 1) % episodes.length)
  }, [episodes.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [handleEnded])

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  // Controls
  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio || episodes.length === 0) return

    if (playing) {
      shouldAutoPlayRef.current = false
      audio.pause()
      setPlaying(false)
    } else {
      shouldAutoPlayRef.current = true
      // Set src on very first play (before any index change has set it)
      if (!audio.src || audio.src === window.location.href) {
        const ep = episodes[currentIndex]
        if (!ep) return
        audio.src = ep.url
        audio.load()
      }
      audio.play().catch(() => {
        shouldAutoPlayRef.current = false
        setPlaying(false)
      })
      setPlaying(true)
    }
  }

  function handlePrev() {
    shouldAutoPlayRef.current = playing
    setCurrentIndex(i => (i - 1 + episodes.length) % episodes.length)
  }

  function handleNext() {
    shouldAutoPlayRef.current = playing
    setCurrentIndex(i => (i + 1) % episodes.length)
  }

  const currentEpisode = episodes[currentIndex] ?? null
  const hasEpisodes = episodes.length > 0
  const disabled = !hasEpisodes || loadError

  return (
    <div role="region" aria-label="Radio Tan Haw" className={styles.bar}>
      {/* Hidden audio element */}
      <audio ref={audioRef} aria-hidden="true" preload="none" />

      {/* Left: LIVE / station label */}
      <div className={styles.left}>
        <span
          className={live ? `${styles.liveDot} ${styles.liveDotPulsing}` : styles.liveDot}
          aria-hidden="true"
        />
        <span className={live ? `${styles.stationLabel} ${styles.stationLabelLive}` : styles.stationLabel}>
          {live ? 'Live' : 'Radio Tan Haw'}
        </span>
        {!live && (
          <span className={styles.scheduleInfo} aria-label="Programming: Tuesday and Thursday at 9 PM Eastern">
            · Tue &amp; Thu 9PM ET
          </span>
        )}
      </div>

      {/* Center: marquee when loaded, placeholder otherwise */}
      <div className={styles.center}>
        {loadError ? (
          <span className={styles.episodePlaceholder} role="status">unable to load</span>
        ) : !hasEpisodes ? (
          <span className={styles.episodePlaceholder} aria-label="Loading">—</span>
        ) : (() => {
          const ep = currentEpisode!
          const text = `Radio Tan Haw\u00A0\u00A0•\u00A0\u00A0Episode ${ep.id}\u00A0\u00A0•\u00A0\u00A0${ep.title}\u00A0\u00A0•\u00A0\u00A0Airing: ${formatEpisodeDate(ep.date)}`
          const gap = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
          return (
            <span
              key={currentIndex}
              className={styles.marqueeTrack}
              aria-label={text}
            >
              <span aria-hidden="true">{text}{gap}</span>
              <span aria-hidden="true">{text}{gap}</span>
            </span>
          )
        })()}
      </div>

      {/* Right: controls + WhatsApp */}
      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={handlePrev}
          disabled={disabled}
          aria-label="Previous episode"
        >
          <PrevIcon />
        </button>

        <button
          className={styles.playBtn}
          onClick={handlePlayPause}
          disabled={disabled}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          className={styles.iconBtn}
          onClick={handleNext}
          disabled={disabled}
          aria-label="Next episode"
        >
          <NextIcon />
        </button>

        <span className={styles.divider} aria-hidden="true" />

        <a
          href={"https://chat.whatsapp.com/JPIwhPOgYFKAbESH5KG5aG"}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappLink}
          aria-label="Join Radio Tan Haw on WhatsApp"
        >
          <WhatsAppIcon />
          <span className={styles.whatsappLabel}>Radio Tan Haw</span>
        </a>
      </div>
    </div>
  )
}
