'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: 'monospace',
        fontSize: '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '8px 16px',
        background: 'none',
        border: '1px solid #ccc',
        cursor: 'pointer',
      }}
    >
      Print / Save as PDF
    </button>
  )
}
