import type { Photo, LinktreeData } from '@/lib/types'
import styles from '@/styles/linktree.module.css'
import TrackedLink from '@/components/TrackedLink'
import HeroSection from '@/components/sections/HeroSection'

/* ─── Social icon SVGs ─── */
function SocialIcon({ id }: { id: string }) {
  switch (id) {
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'spotify':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M7 15.5c3-1.2 7-1.2 10 0" />
          <path d="M6.5 12c3.5-1.5 8-1.5 11 0" />
          <path d="M8 8.5c2.5-1 6-1 8.5.5" />
        </svg>
      )
    case 'youtube':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'substack':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 9l10 6 10-6" />
        </svg>
      )
    case 'bandcamp':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M1.5 16.5L9.5 7.5h13L14.5 16.5z" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

interface Props {
  data: LinktreeData
  heroPhoto: Photo
}

export default function LinktreePage({ data, heroPhoto }: Props) {
  const { profile, sections, socials } = data

  const nav = (
    <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }} aria-label="Site navigation">
      {/* <a href="/a-and-r" className={styles.navLink}>EPK</a> */}
      <a href="/booking" className={styles.navLink}>Booking</a>
    </nav>
  )

  return (
    <div
      style={{
        background: '#100E0C',
        color: '#E4DED2',
        fontFamily: "var(--font-instrument), Georgia, serif",
        minHeight: '100vh',
      }}
    >
      {/* Mobile: fixed photo at root (z-index 0, root stacking context) */}
      <div
        className={styles.mobileBg}
        style={{ backgroundImage: `url('${heroPhoto.src}')`, backgroundPosition: heroPhoto.focal }}
        role="img"
        aria-label={heroPhoto.alt}
      />

      {/* Mobile: fixed dark gradient overlay (z-index 1) */}
      <div className={styles.mobileOverlay} aria-hidden="true" />

      {/* Hero — section bg hidden on mobile (mobileBg takes over) */}
      <HeroSection
        heroPhoto={heroPhoto}
        nav={nav}
        hideOnMobile
        cinematicZoom
        sectionClassName={styles.heroSection}
      >
        {/* Center: name + bio + socials */}
        <div
          className={styles.heroContent}
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(40px,8vh,80px) clamp(20px,5vw,72px)',
            gap: 'clamp(20px,4vh,36px)',
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-bodoni), 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: 'clamp(64px,14vw,160px)',
              lineHeight: 0.88,
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 48px rgba(16,14,12,0.5)',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
            }}
          >
            {profile.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-instrument), Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(16px,2vw,21px)',
              lineHeight: 1.5,
              margin: 0,
              color: '#D8D0C4',
              maxWidth: '36ch',
              textWrap: 'balance' as React.CSSProperties['textWrap'],
              textShadow: '0 1px 20px rgba(16,14,12,0.6)',
            }}
          >
            {profile.bio}
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} role="list">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={styles.socialLink}
                role="listitem"
              >
                <SocialIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className={styles.scrollHint}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
          aria-hidden="true"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="rgba(181,172,158,0.5)" strokeWidth="1.2" strokeLinecap="round">
            <path d="M8 2v16M3 14l5 6 5-6" />
          </svg>
        </div>
      </HeroSection>

      {/* ─── Links ─── */}
      <section
        className={styles.linksSection}
        style={{
          padding: 'clamp(64px,10vh,120px) clamp(20px,5vw,72px) clamp(80px,14vh,160px)',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {sections.map((section, si) => (
            <div
              key={section.id}
              style={{ marginBottom: si < sections.length - 1 ? 'clamp(48px,8vh,80px)' : 0 }}
            >
              <span className={styles.sectionLabel}>{section.label}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.links.map((link) => (
                  <TrackedLink key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className={styles.footerEl}
        style={{
          padding: '0 clamp(20px,5vw,72px) clamp(40px,6vh,72px)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#A79E92',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Mystic troubadour from Iran by way of Turtle Island •☽◯☾•
        </p>
      </footer>
    </div>
  )
}
