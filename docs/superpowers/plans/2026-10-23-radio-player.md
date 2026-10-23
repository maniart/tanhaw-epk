# Radio Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent fixed-bottom radio player bar to every page that loops MP3 episodes fetched from a remote bucket manifest.

**Architecture:** A single self-contained `'use client'` `RadioPlayer` component is mounted in `layout.tsx` once, below `{children}`. It fetches a remote `manifest.json` on mount, drives a hidden `<audio>` element, and renders the fixed bar. No context provider is needed — nothing else in the app observes playback state.

**Tech Stack:** Next.js 15 App Router, React 19, CSS Modules, TypeScript — no additional dependencies.

**Spec:** `docs/superpowers/specs/2026-10-23-radio-player-design.md`

## Global Constraints

- No Tailwind, no component library — CSS Modules only
- `output: 'export'` — fully static build; env vars prefixed `NEXT_PUBLIC_` are baked at build time
- No test framework in this repo — each task ends with manual browser verification steps
- Design tokens: Ground `#100E0C`, Bone `#E4DED2`, Muted `#B5AC9E`, Label `#7C7266`, Faint `#5E564C`, Ember `#C4553A`
- Fonts: `var(--font-bodoni)` display, `var(--font-instrument)` body, `var(--font-mono)` labels
- All inline SVG icons — no icon library
- Player bar height: 56px on all breakpoints
- Mobile breakpoint: `max-width: 768px`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `src/lib/types.ts` | Add `Episode` and `RadioManifest` interfaces |
| Create | `src/styles/radio.module.css` | All radio bar styles |
| Create | `src/components/RadioPlayer.tsx` | Full player component |
| Modify | `src/app/layout.tsx` | Mount `<RadioPlayer />` below `{children}` |
| Modify | `src/styles/globals.css` | Add `padding-bottom: 56px` to `body` |
| Create | `.env.local.example` | Document required env vars |
| Modify | `README.md` | Add Radio Tan Haw setup section |

---

### Task 1: Episode type

**Files:**
- Modify: `src/lib/types.ts`

**Interfaces:**
- Produces: `Episode` and `RadioManifest` — used by `RadioPlayer` in Task 3

- [ ] **Step 1: Add types to the bottom of `src/lib/types.ts`**

Append these two interfaces after the existing `VenuePage` / `ResolvedContent` block:

```typescript
export interface Episode {
  id: string       // zero-padded string: "001", "002", …
  title: string    // shown in the player bar
  url: string      // direct HTTPS URL to the MP3
  date: string     // ISO date string: "2026-10-21" (informational only)
}

export interface RadioManifest {
  episodes: Episode[]
}
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
cd /Users/mani/Workspace/tan-haw/epk
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat(radio): add Episode and RadioManifest types"
```

---

### Task 2: CSS module

**Files:**
- Create: `src/styles/radio.module.css`

**Interfaces:**
- Produces: CSS class names consumed by `RadioPlayer` in Task 3

- [ ] **Step 1: Create `src/styles/radio.module.css`**

```css
/* ─── Pulse animation for LIVE dot ─── */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ─── Fixed bottom bar ─── */
.bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0D0B09;
  border-top: 1px solid rgba(228, 222, 210, 0.07);
  display: flex;
  align-items: center;
  z-index: 100;
  user-select: none;
}

/* ─── Left cluster: station label ─── */
.left {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 0 24px;
  flex-shrink: 0;
  border-right: 1px solid rgba(228, 222, 210, 0.06);
  height: 100%;
}

.liveDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #C4553A;
  flex-shrink: 0;
}

.liveDotPulsing {
  animation: pulse 2s ease-in-out infinite;
}

.stationLabel {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7C7266;
  white-space: nowrap;
}

.stationLabelLive {
  color: #C4553A;
}

.scheduleInfo {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #3A3530;
  white-space: nowrap;
  margin-left: 4px;
}

/* ─── Center: episode info ─── */
.center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  min-width: 0;
  overflow: hidden;
}

.episodeNum {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5E564C;
  flex-shrink: 0;
}

.episodeTitle {
  font-family: var(--font-instrument), Georgia, serif;
  font-size: 13px;
  color: #E4DED2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.episodePlaceholder {
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #3A3530;
}

/* ─── Right cluster: controls + WhatsApp ─── */
.right {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 20px 0 16px;
  flex-shrink: 0;
  border-left: 1px solid rgba(228, 222, 210, 0.06);
  height: 100%;
}

/* Prev / Next skip buttons */
.iconBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: #5E564C;
  cursor: pointer;
  border-radius: 2px;
  transition: color 0.18s ease;
  flex-shrink: 0;
  padding: 0;
}

.iconBtn:hover:not(:disabled) {
  color: #B5AC9E;
}

.iconBtn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Play / Pause button */
.playBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(228, 222, 210, 0.06);
  border: 1px solid rgba(228, 222, 210, 0.10);
  color: #E4DED2;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.18s ease, border-color 0.18s ease;
  flex-shrink: 0;
  padding: 0;
}

.playBtn:hover:not(:disabled) {
  background: rgba(196, 85, 58, 0.12);
  border-color: rgba(196, 85, 58, 0.35);
}

.playBtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Vertical rule between controls and WhatsApp */
.divider {
  width: 1px;
  height: 20px;
  background: rgba(228, 222, 210, 0.06);
  margin: 0 6px;
  flex-shrink: 0;
}

/* WhatsApp channel link */
.whatsappLink {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #7C7266;
  text-decoration: none;
  font-family: var(--font-mono), monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.18s ease;
  padding: 0 4px;
}

.whatsappLink:hover {
  color: #E4DED2;
}

.whatsappLabel {
  /* visible on desktop; hidden via mobile rule below */
}

/* ─── Mobile (≤ 768px) ─── */
@media (max-width: 768px) {
  .left      { padding: 0 14px 0 16px; gap: 6px; }
  .center    { padding: 0 12px; }
  .right     { padding: 0 14px 0 10px; gap: 6px; }

  .episodeNum    { display: none; }
  .scheduleInfo  { display: none; }
  .divider       { display: none; }
  .whatsappLabel { display: none; }

  /* Hide prev/next on mobile — play/pause is the primary control */
  .iconBtn { display: none; }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .liveDotPulsing { animation: none; }
  .playBtn, .iconBtn, .whatsappLink { transition: none; }
}
```

- [ ] **Step 2: Verify no typos by checking Next.js compiles**

```bash
cd /Users/mani/Workspace/tan-haw/epk
npm run build 2>&1 | tail -10
```

Expected: build succeeds (CSS module not yet imported, so no impact).

- [ ] **Step 3: Commit**

```bash
git add src/styles/radio.module.css
git commit -m "feat(radio): add radio player CSS module"
```

---

### Task 3: RadioPlayer component

**Files:**
- Create: `src/components/RadioPlayer.tsx`

**Interfaces:**
- Consumes: `Episode` from `src/lib/types.ts` (Task 1), all classes from `src/styles/radio.module.css` (Task 2)
- Produces: default export `RadioPlayer` — mounted in `layout.tsx` in Task 4

**Key implementation notes:**
- `shouldAutoPlayRef` (a `useRef<boolean>`) tracks whether the next track change should auto-play. Set to `true` by `handleEnded` (always auto-advance) and by `handlePlayPause` when starting play. Set to `false` when pausing. Lets prev/next skip preserve play/pause state without stale closure issues.
- `audio.src` is only set when episodes are loaded and index changes. First play sets src if it is empty.
- `WHATSAPP_CHANNEL_URL` is a module-level constant — **update it with the real invite link before deploying**.
- `getIsLive()` uses `Intl.DateTimeFormat` with `timeZone: 'America/New_York'` — handles DST automatically.

- [ ] **Step 1: Create `src/components/RadioPlayer.tsx`**

```tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { Episode } from '@/lib/types'
import styles from '@/styles/radio.module.css'

const MANIFEST_URL = process.env.NEXT_PUBLIC_RADIO_MANIFEST_URL ?? ''

// ── Replace with the actual WhatsApp channel invite link ──────────────────────
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/REPLACE_WITH_YOUR_INVITE_CODE'
// ─────────────────────────────────────────────────────────────────────────────

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

      {/* Center: episode info */}
      <div className={styles.center}>
        {loadError ? (
          <span className={styles.episodePlaceholder} role="status">unable to load</span>
        ) : !hasEpisodes ? (
          <span className={styles.episodePlaceholder} aria-label="Loading">—</span>
        ) : (
          <>
            <span className={styles.episodeNum} aria-hidden="true">Ep {currentEpisode?.id}</span>
            <span className={styles.episodeTitle}>{currentEpisode?.title}</span>
          </>
        )}
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
          href={WHATSAPP_CHANNEL_URL}
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
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd /Users/mani/Workspace/tan-haw/epk
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/RadioPlayer.tsx
git commit -m "feat(radio): add RadioPlayer component"
```

---

### Task 4: Layout integration

**Files:**
- Modify: `src/app/layout.tsx` — mount `<RadioPlayer />`
- Modify: `src/styles/globals.css` — add body padding-bottom
- Create: `.env.local.example` — document required env vars

**Interfaces:**
- Consumes: default export `RadioPlayer` from `src/components/RadioPlayer.tsx` (Task 3)

- [ ] **Step 1: Add `padding-bottom` to `body` in `src/styles/globals.css`**

The radio bar is `position: fixed`, so it does not affect document flow. Without body padding, the bar will cover the last few pixels of page content. Add to the existing `body` rule:

Find the `body` rule (currently lines 12–15):
```css
body {
  font-family: var(--font-instrument), Georgia, serif;
  color: #E4DED2;
}
```

Change it to:
```css
body {
  font-family: var(--font-instrument), Georgia, serif;
  color: #E4DED2;
  padding-bottom: 56px;
}
```

- [ ] **Step 2: Import and mount `RadioPlayer` in `src/app/layout.tsx`**

Add the import after the existing imports:
```tsx
import RadioPlayer from '@/components/RadioPlayer'
```

In the `return` block, add `<RadioPlayer />` as the last child of `<body>`, after `{children}` and the GA scripts:

```tsx
<body>
  {children}
  {GA_ID && (
    <>
      <Script src={...} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`...`}</Script>
    </>
  )}
  <RadioPlayer />
</body>
```

- [ ] **Step 3: Create `.env.local.example`**

```bash
# Radio Tan Haw player
# Full HTTPS URL to manifest.json in your bucket
# The bucket must serve this file with Access-Control-Allow-Origin: *
NEXT_PUBLIC_RADIO_MANIFEST_URL=https://your-bucket.example.com/radio/manifest.json

# Google Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

- [ ] **Step 4: Add env var to your `.env.local`**

Create or edit `.env.local` and add:
```
NEXT_PUBLIC_RADIO_MANIFEST_URL=https://your-actual-bucket-url/manifest.json
```

If you don't have a bucket URL yet, set it to an empty string — the player will gracefully show "unable to load" without crashing.

- [ ] **Step 5: Run the dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:

- [ ] Fixed bar appears at the bottom of every page (linktree `/`, `/booking`, `/preview`)
- [ ] Bar is 56px tall; page content is not obscured by it — scroll to the very bottom and confirm
- [ ] On mobile viewport (≤ 768px): prev/next buttons are hidden, WhatsApp text label is hidden, schedule text is hidden
- [ ] If `NEXT_PUBLIC_RADIO_MANIFEST_URL` is empty/invalid: bar shows `—` or "unable to load" — no console crash (check DevTools → Console)
- [ ] If manifest URL is valid and returns episodes: episode title appears, play/pause works, audio plays, advances to next on end

- [ ] **Step 6: Verify the live indicator**

The "LIVE" indicator appears only on Tuesday/Thursday between 9 PM and midnight ET. To test it without waiting for the real time, temporarily patch `getIsLive()` in `RadioPlayer.tsx` to `return true`, confirm the dot pulses ember and label reads "Live", then revert the change.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/styles/globals.css .env.local.example
git commit -m "feat(radio): mount RadioPlayer in layout, add body clearance"
```

---

### Task 5: Update WhatsApp URL and README

**Files:**
- Modify: `src/components/RadioPlayer.tsx` — replace `WHATSAPP_CHANNEL_URL` placeholder
- Modify: `README.md` — add Radio Tan Haw setup section

- [ ] **Step 1: Replace the WhatsApp placeholder in `src/components/RadioPlayer.tsx`**

Find:
```typescript
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/REPLACE_WITH_YOUR_INVITE_CODE'
```

Replace with your actual channel invite link, e.g.:
```typescript
const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/YOUR_ACTUAL_CODE_HERE'
```

You can get the invite link from: WhatsApp → your channel → Info → Invite link.

- [ ] **Step 2: Add the Radio section to `README.md`**

Append the following section to the end of `README.md`:

```markdown
## Radio Tan Haw

The site includes a persistent audio player (fixed bottom bar on every page) that streams episodes from a remote bucket.

### Setup

1. Add `NEXT_PUBLIC_RADIO_MANIFEST_URL` to `.env.local` and to your Cloudflare Pages environment variables, pointing to your `manifest.json` file (see `.env.local.example`).

2. Host a `manifest.json` in your bucket:

   ```json
   {
     "episodes": [
       {
         "id": "001",
         "title": "Episode Title",
         "url": "https://your-bucket.example.com/radio/001.mp3",
         "date": "2026-10-21"
       }
     ]
   }
   ```

3. Configure CORS on your bucket so the browser can fetch the manifest and MP3s:
   - `Access-Control-Allow-Origin: *`
   - `Content-Type: application/json` for `manifest.json`
   - `Content-Type: audio/mpeg` for `.mp3` files

### Adding episodes

Add a new object to the `episodes` array in `manifest.json` and re-upload it. The player fetches the manifest fresh on every page load — no site rebuild required.

Episodes play in array order and loop back to the start automatically.

### Live indicator

The player shows a pulsing "LIVE" label on Tuesday and Thursday between 9 PM and midnight Eastern Time. This is cosmetic — it does not switch to a different stream. It aligns with the WhatsApp channel drop schedule.

### WhatsApp channel link

The `WHATSAPP_CHANNEL_URL` constant at the top of `src/components/RadioPlayer.tsx` holds the invite link. Update it when the channel invite link changes.
```

- [ ] **Step 3: Build to confirm static export is clean**

```bash
cd /Users/mani/Workspace/tan-haw/epk
npm run build
```

Expected: build completes without errors. Confirm `out/` is generated.

- [ ] **Step 4: Commit**

```bash
git add src/components/RadioPlayer.tsx README.md
git commit -m "feat(radio): set WhatsApp URL, add README setup docs"
```
