'use client'

import { useState } from 'react'

interface Props {
  videoId: string
  title: string
}

const PLAY_ICON = (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    aria-hidden="true"
    style={{ filter: 'drop-shadow(0 2px 12px rgba(16,14,12,0.7))' }}
  >
    <circle cx="28" cy="28" r="28" fill="rgba(16,14,12,0.72)" />
    <path d="M22 19l18 9-18 9V19z" fill="#E4DED2" />
  </svg>
)

export default function YoutubeEmbed({ videoId, title }: Props) {
  const [loaded, setLoaded] = useState(false)
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  if (loaded) {
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
        <iframe
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      aria-label={`Play ${title}`}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        aspectRatio: '16/9',
        overflow: 'hidden',
      }}
    >
      <img
        src={thumbnail}
        alt={title}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(16,14,12,0.24)',
          transition: 'background 0.2s ease',
        }}
      >
        {PLAY_ICON}
      </div>
    </button>
  )
}
