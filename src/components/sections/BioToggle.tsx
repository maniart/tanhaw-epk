'use client'

import { useState } from 'react'

interface Props {
  bioLong: string[]
}

export default function BioToggle({ bioLong }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          style={{
            fontSize: '18px',
            lineHeight: 1.8,
            color: '#B5AC9E',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '36px',
            borderLeft: '1px solid #221E1A',
            paddingLeft: '28px',
          }}
        >
          {bioLong.map((para, i) => (
            <p key={i} style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgb(157, 34, 34)',
          background: 'none',
          border: 'none',
          borderBottom: '1px solid #3A322B',
          padding: '0 0 6px',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = 'rgb(157, 34, 34)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = '#3A322B')}
      >
        {open ? 'Close full bio' : 'Read full bio'}
      </button>
    </>
  )
}
