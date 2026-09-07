'use client'

import type { LinktreeLink } from '@/lib/types'
import styles from '@/styles/linktree.module.css'

const ARROW = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
)

export default function TrackedLink({ link }: { link: LinktreeLink }) {
  function handleClick() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = typeof window !== 'undefined' ? (window as any) : null
    if (w && typeof w.gtag === 'function') {
      w.gtag('event', 'link_click', {
        link_id: link.id,
        link_label: link.label,
        link_url: link.url,
      })
    }
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkBtn}
      onClick={handleClick}
    >
      <span>
        <span className={styles.linkLabel}>{link.label}</span>
        {link.sublabel && (
          <span className={styles.linkSublabel}>{link.sublabel}</span>
        )}
      </span>
      <span className={styles.linkArrow}>{ARROW}</span>
    </a>
  )
}
