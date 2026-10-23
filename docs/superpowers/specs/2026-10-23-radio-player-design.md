# Radio Player Design Spec
_Tan Haw EPK — 2026-10-23_

## Overview

A persistent, always-visible fixed bottom bar audio player that loops episodes from a remote bucket. Appears on every page of the site (linktree, EPK variants, booking, rider). Users play, pause, and skip through archived short musical episodes. The player links to the WhatsApp channel "Radio Tan Haw" where episodes are originally published. A pulsing "LIVE" indicator appears during scheduled programming windows (Tuesday and Thursday, 9 PM–midnight ET).

---

## Architecture

**Approach:** Self-contained `RadioPlayer` client component added directly to `layout.tsx`. All state lives inside the component — no context, no provider.

**Rationale:** Nothing else on the site needs to observe or control playback. A single component is the minimum viable complexity.

---

## Manifest Format

The player fetches a `manifest.json` from the remote bucket at runtime (on mount). The site never hard-codes episode URLs.

```json
{
  "episodes": [
    {
      "id": "001",
      "title": "Episode Title",
      "url": "https://bucket.example.com/radio/001.mp3",
      "date": "2026-10-21"
    }
  ]
}
```

- `id` — zero-padded string identifier, used for display
- `title` — shown in the player bar
- `url` — direct HTTPS URL to the MP3 file in the bucket
- `date` — ISO date string, informational only (not shown in player, useful for sorting)
- Episodes are played in array order (index 0 first); the player loops back to 0 after the last episode
- The bucket must serve `manifest.json` with `Access-Control-Allow-Origin: *`

A `RADIO_MANIFEST_URL` environment variable (set in `.env.local` and Cloudflare Pages) points to the manifest. This keeps the bucket URL out of source code.

---

## Component Structure

### New files

```
src/components/RadioPlayer.tsx       — 'use client' component; all logic + markup
src/styles/radio.module.css          — all player styles
```

### Modified files

```
src/app/layout.tsx                   — import RadioPlayer, add <RadioPlayer /> below {children}
src/styles/globals.css               — add padding-bottom: 56px to body
README.md                            — Radio section: manifest format, bucket setup, env var
```

---

## Component: `RadioPlayer`

### State

| Name | Type | Description |
|---|---|---|
| `episodes` | `Episode[]` | Fetched from manifest; empty until loaded |
| `currentIndex` | `number` | Index into `episodes` array |
| `playing` | `boolean` | Play/pause toggle |
| `loading` | `boolean` | True while manifest is fetching |
| `error` | `boolean` | True if manifest fetch failed |

### Refs

- `audioRef: RefObject<HTMLAudioElement>` — the native `<audio>` element

### Lifecycle

1. On mount: fetch `NEXT_PUBLIC_RADIO_MANIFEST_URL`, parse JSON, set `episodes`
2. When `currentIndex` changes or `episodes` loads: update `audio.src`, call `audio.play()` if `playing === true`
3. `audio.onended`: advance index (wraps to 0 at end), auto-play next
4. Unmount: pause and clear `audio.src`

### "Live" indicator logic

Computed on render (no timer needed — recalculates on play/pause interaction at minimum):

```
isLive = current day is Tuesday (2) or Thursday (4)
       AND current ET hour is 21–23 (9 PM–midnight)
```

ET offset: UTC−5 in standard time, UTC−4 in daylight saving. Computed via `Intl.DateTimeFormat` with `timeZone: 'America/New_York'`.

### Keyboard / accessibility

- Play/pause button: `aria-label="Play" / "Pause"`
- Prev/next buttons: `aria-label="Previous episode" / "Next episode"`
- Player landmark: `role="region" aria-label="Radio Tan Haw"`
- `<audio>` element: `aria-hidden="true"` (UI controls are the interface)

---

## Visual Design

### Desktop layout (≥ 769px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ● LIVE  /  RADIO TAN HAW  │  Ep 001 · Episode Title  │  ◂  ▶/⏸  ▸  │  WhatsApp ↗  │
└────────────────────────────────────────────────────────────────────────────┘
  56px fixed bottom bar, full width
```

Left cluster: live/label indicator
Center: episode number + title (truncated with ellipsis)
Right cluster: prev, play/pause, next, WhatsApp link

### Mobile layout (≤ 768px)

```
┌─────────────────────────────────────────┐
│  ● RADIO  │  Episode Title  │  ▶/⏸  │  ↗  │
└─────────────────────────────────────────┘
  56px fixed bottom bar
```

- Episode number hidden on mobile to save space
- Prev/next hidden on mobile (swipe mental model — or user can pause/resume)
- WhatsApp icon only (no label)

### Palette

| Element | Value |
|---|---|
| Bar background | `#0D0B09` (slightly deeper than ground) |
| Bar border-top | `1px solid rgba(228,222,210,0.07)` |
| Label / RADIO text | `#7C7266` (Label token) |
| Episode title | `#E4DED2` (Bone token) |
| Play button bg | `rgba(228,222,210,0.06)` |
| Play button hover bg | `rgba(196,85,58,0.12)` |
| Play button border | `rgba(228,222,210,0.10)` |
| Play button hover border | `rgba(196,85,58,0.35)` |
| LIVE dot color | `#C4553A` (Ember token) |
| LIVE dot animation | `pulse` keyframe: opacity 1→0.3→1, 2s infinite |
| WhatsApp link | `#7C7266` → hover `#E4DED2` |

### Typography

- "RADIO TAN HAW" / "LIVE" / "Ep 001": `var(--font-mono)`, 10px, letter-spacing 0.18em, uppercase
- Episode title: `var(--font-instrument)`, 13px, normal weight

### Loading / error states

- **Loading:** bar shows `RADIO TAN HAW` label + `—` in place of title; controls are disabled
- **Error:** bar shows `RADIO TAN HAW` + `unable to load` in muted mono; no controls
- **No episodes:** same as error

---

## Layout Integration

`layout.tsx` renders `<RadioPlayer />` as a direct child of `<body>`, below `{children}`. Because it's `position: fixed`, it doesn't affect document flow — but `globals.css` adds `padding-bottom: 56px` to `body` so no page content is obscured by the bar.

```tsx
<body>
  {children}
  <RadioPlayer />
</body>
```

`NEXT_PUBLIC_RADIO_MANIFEST_URL` is the env var name (prefixed with `NEXT_PUBLIC_` so it's available in the client bundle for the static export).

---

## Environment Variables

| Variable | Where set | Description |
|---|---|---|
| `NEXT_PUBLIC_RADIO_MANIFEST_URL` | `.env.local`, Cloudflare Pages | Full HTTPS URL to `manifest.json` in the bucket |

---

## README Section (to add)

```markdown
## Radio Tan Haw

The site includes a persistent audio player (fixed bottom bar) that streams episodes
from a remote bucket.

### Setup

1. Set `NEXT_PUBLIC_RADIO_MANIFEST_URL` in `.env.local` and in Cloudflare Pages
   environment variables, pointing to your `manifest.json` file.

2. Host a `manifest.json` in your bucket with the following structure:

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

3. Ensure your bucket serves `manifest.json` and all `.mp3` files with:
   - `Access-Control-Allow-Origin: *`
   - `Content-Type: application/json` for the manifest
   - `Content-Type: audio/mpeg` for MP3 files

### Adding episodes

Add a new object to the `episodes` array in `manifest.json` and re-upload it
to the bucket. The player fetches the manifest fresh on each page load —
no site rebuild required.

Episodes play in array order and loop back to the start.

### Scheduling / Live indicator

The player shows a pulsing "LIVE" indicator on Tuesday and Thursday between
9 PM and midnight Eastern Time. This is purely cosmetic — it does not switch
to a different stream. Use it to align with your WhatsApp channel drop schedule.
```

---

## Out of scope

- Actual live streaming (RTMP, HLS, Icecast)
- Episode artwork in the player bar
- Volume control
- Scrub/seek bar
- Playlist drawer / episode list
- Cross-tab sync
