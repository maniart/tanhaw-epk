'use client'

import { useEffect, useRef } from 'react'
import styles from '@/styles/linktree.module.css'

interface Props {
  src: string
  focal: string
  alt: string
}

export default function MobileParallaxBg({ src, focal, alt }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.DeviceOrientationEvent) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let baseGamma: number | null = null
    let baseBeta: number | null = null
    let rafId: number

    const handler = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return

      // Capture baseline on first reading
      if (baseGamma === null) {
        baseGamma = e.gamma
        baseBeta = e.beta!
        return
      }

      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        // Parallax: tilt right → image shifts left (negative x), tilt forward → image shifts up
        const x = Math.max(-15, Math.min(15, -(e.gamma! - baseGamma!) * 0.5))
        const y = Math.max(-10, Math.min(10, -(e.beta! - baseBeta!) * 0.3))
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      })
    }

    window.addEventListener('deviceorientation', handler, { passive: true })
    return () => {
      window.removeEventListener('deviceorientation', handler)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapperRef} className={styles.mobileBgWrapper}>
      <div
        className={styles.mobileBg}
        style={{ backgroundImage: `url('${src}')`, backgroundPosition: focal }}
        role="img"
        aria-label={alt}
      />
    </div>
  )
}
