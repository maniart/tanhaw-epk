# Tan Haw EPK — Implementation Handoff

Rebuild the existing single-page EPK as a Next.js site that renders multiple audience-specific versions from JSON content files. The design is already built and approved; this is a port plus a content-model refactor, not a redesign.

**Reference implementation:** `Tan Haw EPK.dc.html` in this project — the full approved design, hardcoded. Read it for exact styling. Photos are in `assets/`.

---

## 1. Stack

- **Next.js**, App Router, TypeScript
- `output: 'export'` — fully static, host-agnostic (hosting undecided; do not use platform-specific features, image optimization loaders, middleware, or server actions)
- Styling: inline styles or CSS modules — match the reference exactly. No Tailwind, no component library.
- No CMS, no database, no client data fetching. All content is JSON read at build time.
- Repo does not exist yet — scaffold it.

## 2. Routes

| Route | Variant | Audience |
|---|---|---|
| `/` | `labels` | A&R, labels |
| `/booking` | `bookers` | Venue bookers, promoters |

One page component renders both. Resolve the variant by slug (`getVariant('labels')`), pass the resolved content object down. A design change must land on every version without duplication — this is the primary constraint.

Adding a third variant (festival programmers, sync licensing) must require only a new file in `content/variants/` plus a route entry. Build the variant registry so this is genuinely one file, not a fork.

## 3. Content model

Shared content lives once. Variant files are thin and reference shared content by id.

```
content/
  shared.json              bio, collaborators, links, contact, tagline, photos, press
  tracks.json              track library, keyed by id
  ensembles.json           solo / trio / band configs + rider specs
  venues.json              selected past shows
  variants/
    labels.json
    bookers.json
```

### `shared.json`

```json
{
  "artist": "Tan Haw",
  "legalName": "Mani Nilchiani",
  "hook": "Iranian classical roots, psychedelic and electronic futures.",
  "tagline": "Mystic troubadour from Iran by way of Turtle Island",
  "meta": ["Brooklyn ⟷ Mexico", "Setâr · Vocals · Fretless guitar", "Persian · Azerbaijani · English · Spanish"],
  "bioShort": "Tan Haw is the stage name of Mani Nilchiani, an Iranian musician who splits his time between Brooklyn and Mexico…",
  "bioLong": ["para 1", "para 2", "para 3"],
  "footerSignoff": "Mystic troubadour from Iran by way of Turtle Island •☽◯☾•",
  "contact": { "email": "mani.nilchiani@gmail.com" },
  "links": {
    "listen": [{ "label": "Bandcamp", "url": "https://tanhaw.bandcamp.com/" }],
    "elsewhere": [{ "label": "linktr.ee/tanhaw", "url": "https://linktr.ee/tanhaw" }]
  },
  "press": {
    "quote": "Tan Haw is a radical improviser who explores the intersection of Iranian classical music with various forms of contemporary music.",
    "features": [{ "outlet": "Bandcamp Daily — Big Ups", "title": "Cyrus Moussavi of Mississippi Records spotlights Iranian music he loves", "url": "https://daily.bandcamp.com/big-ups/cyrus-moussavi-mississippi-records-iran-music" }]
  },
  "photos": [
    {
      "id": "press-2024-beach-setar",
      "src": "/photos/press-2024-beach-setar.jpg",
      "credit": null,
      "caption": "Press 2024",
      "alt": "Tan Haw with setâr on the beach",
      "focal": "50% 26%",
      "downloadName": "Tan Haw - Press 2024 (beach setar).jpg"
    }
  ]
}
```

**Photo objects own their own crop and download filename.** `focal` maps to `object-position` / `background-position`. `downloadName` is what the browser saves; when `credit` is set it must appear in the filename (`… - ph Julie Thompson.jpg`). Filenames must be unique across all photos — two images previously collided on the same name.

Photo credits confirmed so far: press portrait 2024 and the full-width setâr/sky image are **Julie Thompson**; Umbra 2025 is **Sasan Oskouei**; El Barrio's Artspace 2026 is **Matt Cusimano**. The hero (beach setâr) credit is **unconfirmed** — leave `credit: null` and omit it from the filename until Mani supplies it.

### `tracks.json`

Library keyed by id. Store the **SoundCloud track URL and secret token only** — never the full iframe HTML. The player component owns width, height, color (`#81212e`), and the params (`hide_related=true`, `show_comments=false`, `show_teaser=false`) so every embed is visually identical.

```json
{
  "roya-ye-mahtab": {
    "title": "Royâ-ye Mahtâb",
    "description": "Title track.",
    "credits": "Maziar Sharifian — Kamânche, Setâr",
    "soundcloudTrackId": "2354673524",
    "secretToken": "s-a9mJtRQyuAu",
    "ensembles": ["trio", "band"]
  },
  "sho-hud": {
    "title": "Sho-Hud",
    "description": "Iranian-traditional-inspired psychedelic instrumental rock, microtonal fretless guitar riffs.",
    "credits": "Yahya Alkhansa — percussion · Kate Pass — electric bass",
    "soundcloudTrackId": "2384737716",
    "secretToken": "s-HJzPEozsABp",
    "ensembles": ["band"]
  },
  "all-you-could-have-been": {
    "title": "All You Could Have Been",
    "description": "The album's only English-language track — rock, Setâr, double bass, drums, vocals.",
    "credits": "Yahya Alkhansa — drums · Kate Pass — double bass · Mani — Setâr, vocals",
    "soundcloudTrackId": null,
    "secretToken": null,
    "ensembles": ["band"]
  }
}
```

A track with `soundcloudTrackId: null` renders the **placeholder slot** used in the reference (bordered box, mono label naming what's missing) — do not hide it and do not collapse the layout. Only two embeds exist today; the third is pending.

### `ensembles.json`

```json
{
  "solo": { "label": "Solo", "pitch": "Setâr and voice.", "rider": { "summary": [], "spec": [] } },
  "trio": { "label": "Trio", "pitch": "…", "rider": { "summary": [], "spec": [] } },
  "band": { "label": "Full band", "pitch": "…", "rider": { "summary": [], "spec": [] } }
}
```

`rider.summary` is the short on-page version (a few lines: stage size, channel count, backline, load-in). `rider.spec` is the full line-item list used by the PDF. Same JSON feeds both — no second source of truth.

### `variants/*.json`

Thin. Only what differs.

```json
{
  "slug": "bookers",
  "route": "/booking",
  "heroPhoto": "press-2024-beach-setar",
  "bio": "short",
  "sections": ["hero", "ensembles", "music", "video", "venues", "rider", "press", "photos", "collaborators", "contact"],
  "tracks": null,
  "defaultEnsemble": "trio"
}
```

- `sections` is an **ordered array of section keys** — it drives both which sections render and in what order. Unknown keys throw at build time.
- `bio: "short" | "long" | "both"` — `both` is the reference behavior (short paragraph plus expandable long bio).
- `tracks`: array of track ids for a fixed list, or `null` to derive from the ensemble switcher.

**Labels variant:** same three tracks as the reference, in order. `bio: "both"`. Section order as built today.

**Bookers variant:** short bio only, plus four sections that don't exist yet — see §4.

## 4. New sections (bookers only)

**Ensemble switcher.** Solo / trio / full band. Defaults to **trio** on load. Switching updates the **rider summary and the track list** — nothing else (photos, video, press stay fixed). Client-side state, no route change.

Track selection per config: show tracks whose `ensembles` array includes the active config; **if that yields nothing, fall back to the full library** rather than rendering an empty section. Never show an empty Music section.

**Technical rider.** On-page summary for the active ensemble, plus a download link to the full rider PDF.

**Rider PDF.** Generated from `ensembles.json` — not a separately maintained document. Two acceptable approaches, your call: a `/rider` (or `/rider/[ensemble]`) print-styled route the browser saves as PDF, or build-time generation. Prefer the print route unless there's a clear reason otherwise — it avoids a heavy dependency and stays compatible with static export.

**Live video.** YouTube embeds. Store video ids in JSON, not iframe HTML — same rule as the audio player. Use a lightweight facade (thumbnail, click to load) so unplayed embeds don't cost page weight.

**Past venues.** Selected highlights, about six named shows. Simple credit list — venue name, city, year. Content TBD from Mani.

## 5. Design spec

Port exactly from `Tan Haw EPK.dc.html`. Do not re-derive.

**Palette**

| Token | Value | Use |
|---|---|---|
| Ground | `#100E0C` | page background |
| Bone | `#E4DED2` | body copy, links |
| Bone bright | `#F2EDE4` | copy over photography |
| Muted | `#B5AC9E` | secondary prose |
| Label | `#7C7266` | mono section labels |
| Faint | `#5E564C` | captions, credits |
| Footer | `#A79E92` | footer sign-off — deliberately brighter than Faint |
| Rule | `#221E1A` / `#1C1917` | section dividers / inner rules |
| Ember | `rgb(157, 34, 34)` | accent, hover, active |
| Ember light | `rgb(157, 34, 34)` | accent over photography |

Two background values only — the ground and photography. No gradient fills as decoration; gradients are photo scrims only.

**Type**

- Display: **Bodoni Moda** 400 — artist name, track titles, press quote, album title (italic)
- Body: **Newsreader** 300/400 — prose, links, list items
- Labels: **IBM Plex Mono** 400/500, `letter-spacing: 0.2em`, uppercase, 10–11px — section headers, credits, captions, metadata

Fluid sizing via `clamp()` throughout — see the reference for exact values. Never below 10px for mono labels.

**Layout**

- Content column `max-width: 1160px`, centered; page padding `clamp(20px, 5vw, 72px)`
- Labeled sections use a two-column grid: `minmax(0, 220px)` mono label / `minmax(0, 1fr)` content
- Track rows: `minmax(0, 1fr) / minmax(0, 1.1fr)` — title, description, and credits in the left column so the **title's top edge aligns with the embed's top edge** (this alignment was specifically requested)
- Prose capped at `66ch`; track descriptions `38ch`; press quote `19ch`
- Generous vertical rhythm: `clamp(64px, 12vh, 140px)` between major sections
- `text-wrap: pretty` on prose, `balance` on headings
- Flex/grid with `gap` for all sibling groups

**Photography treatment**

- Hero: full-bleed `background-size: cover`, focal point from the photo's `focal` field, `min-height: 100vh`, artist name and `hook` over it
- Photo scrims darken **top and bottom edges only** — the middle of the frame stays near-clear so the image keeps its color. Copy over photography carries `text-shadow` rather than relying on a heavy overlay. Mani rejected a darker treatment twice; do not increase overall scrim density.
- The press section sits over the full-width setâr/sky image: a vertical scrim reaching solid ground at both edges, plus a left-to-right scrim that **holds its density past the end of the longest text line** before falling off toward the sky. Verify legibility at every breakpoint — this was an explicit requirement.
- Grid photos: `aspect-ratio: 3/4`, `object-fit: cover`, focal point per photo, credit caption in mono below

**Download buttons.** Every photo — hero, full-width press image, and each grid photo — carries a 40px download button, bottom-right, 1px bone border at 30% on a translucent ground with `backdrop-filter: blur(6px)`. Hidden at `opacity: 0`, fading in over `0.28s` on hover of the containing photo, and turning ember-filled on hover of the button itself. Implemented in the reference by setting a CSS custom property on the photo wrapper's hover state — port the mechanism or use any equivalent. On touch devices, where hover doesn't exist, make them permanently visible.

**Copy placement.** `hook` is the hero line beneath the artist name (capped at `34ch` so it sets on two lines). `tagline` appears once and never in the hero: in the footer sign-off with the `•☽◯☾•` mark, mono uppercase 10px in Label tone (`#A79E92`). It was tried inside the expanded bio and rejected — do not reintroduce it there. `meta` is the mono block in the hero, right-aligned.

**Interaction inventory:** expandable long bio, ensemble switcher (bookers), photo download buttons, SoundCloud players, YouTube facades. Nothing else is interactive.

## 6. Accessibility & metadata

- Every photo needs real `alt` text; download buttons need `aria-label`
- Verify contrast on every text-over-photo case at all breakpoints
- Per-variant `<title>` and OG tags from variant JSON; OG image is the variant's hero photo
- `prefers-reduced-motion`: drop the download-button fade

## 7. Build-time validation

Fail the build, don't render broken:

- Every track id in a variant exists in `tracks.json`
- Every photo id referenced exists in `shared.json`; every `src` file exists on disk
- All `downloadName` values are unique across photos
- Every section key in `sections` maps to a real component
- Every ensemble key in a variant exists in `ensembles.json`
- A photo with a non-null `credit` has that credit in its `downloadName`

## 8. Assets

Copy from `assets/` in this project into `public/photos/`. Web-sized versions are in place (roughly 1200–2400px long edge); camera originals live in `uploads/` and are 4–18MB — do not ship those. If a "high-res on request" download is wanted later, it should point at separately hosted files, not the repo.

## 9. Open content items

Not blockers for the build — wire the structure, use the placeholder pattern:

- Logotype (`{{ LOGOTYPE }}` slot in the hero, top-left) — designed, not yet supplied
- Hero photo credit — unconfirmed
- Third track embed (All You Could Have Been)
- Rider line items for all three ensemble configs
- Past venues list
- Live video ids
