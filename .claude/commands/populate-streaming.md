# Populate Streaming Links

Find and fill in streaming platform URLs for all music releases in `content/linktree.json` that have a `streaming` object with null platform fields. Updates the file in place.

## Steps

### 1. Read the file

Read `content/linktree.json`. Collect every link where `streaming` is not null — these are releases that need platform URLs.

For each such link, note:
- `link.id` — identifier
- `link.label` — release title (use this for searches)
- `link.sublabel` — release type hint (e.g. "Single", "Album")
- `link.streaming` — the current streaming object (may have some nulls)

The artist name for all searches is **Tan Haw**.

### 2. Derive Spotify embed URL

For any release where `streaming.spotify` is set but `streaming.embed` is null, derive the embed URL by transforming the Spotify URL:

| Spotify URL pattern | Embed URL |
|---|---|
| `https://open.spotify.com/track/{id}` | `https://open.spotify.com/embed/track/{id}?utm_source=generator&theme=0` |
| `https://open.spotify.com/album/{id}` | `https://open.spotify.com/embed/album/{id}?utm_source=generator&theme=0` |

Extract the type (`track` or `album`) and the ID from the path, then construct the embed URL. No search needed — this is a pure URL transformation.

### 3. Search for missing platform URLs

For each release and each platform field that is currently null, use `WebSearch` to find the correct URL. Run searches in parallel where possible.

Search queries to use (substitute `{title}` and `{type}` from the link data):

| Platform | Search query |
|---|---|
| Apple Music | `Tan Haw "{title}" site:music.apple.com` |
| SoundCloud | `Tan Haw "{title}" site:soundcloud.com` |
| Tidal | `Tan Haw "{title}" site:tidal.com` |
| Amazon Music | `Tan Haw "{title}" site:music.amazon.com` |
| Bandcamp | `Tan Haw "{title}" site:bandcamp.com` |

**Validation rules** — only accept a URL if:
- The result clearly matches the correct artist (Tan Haw) and the specific release title
- The URL points to the specific track or album, not just the artist profile page
- For Bandcamp, accept artist-level URLs (`tanhaw.bandcamp.com`) only if no release-specific page is found

If a search returns no confident match, leave the field as `null` — do not guess.

### 4. Write the updated JSON

Merge the found URLs back into the `streaming` objects in the JSON. Do not change any other fields. Write the updated content back to `content/linktree.json` using the Edit or Write tool.

Preserve the exact JSON formatting style (2-space indent, same key order).

### 5. Report results

After writing, print a summary in this format:

```
Release: {label}
  embed:        {url or "(already set)" or "(derived)" or "(not found)"}
  spotify:      {url or "(already set)" or "(not found)"}
  appleMusic:   {url or "(found)" or "(not found)"}
  soundcloud:   {url or "(found)" or "(not found)"}
  tidal:        {url or "(found)" or "(not found)"}
  amazonMusic:  {url or "(found)" or "(not found)"}
  bandcamp:     {url or "(found)" or "(not found)"}
```

List any platforms that could not be found so the user knows what to fill in manually.
