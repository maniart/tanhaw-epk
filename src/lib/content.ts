import fs from 'fs'
import path from 'path'
import type { ResolvedContent, Photo, Track, Variant } from './types'

import sharedData from '../../content/shared.json'
import tracksData from '../../content/tracks.json'
import ensemblesData from '../../content/ensembles.json'
import venuesData from '../../content/venues.json'
import labelsVariant from '../../content/variants/labels.json'
import bookersVariant from '../../content/variants/bookers.json'

const VALID_SECTIONS = new Set([
  'hero', 'featuredTrack', 'bio', 'music',
  'ensembles', 'video', 'venues', 'rider',
  'press', 'photos', 'collaborators', 'contact',
])

const VARIANT_MAP: Record<string, Variant> = {
  labels: labelsVariant as Variant,
  bookers: bookersVariant as Variant,
}

function validate(variant: Variant): void {
  const errors: string[] = []

  // Section keys
  for (const key of variant.sections) {
    if (!VALID_SECTIONS.has(key)) {
      errors.push(`Unknown section key "${key}" in variant "${variant.slug}"`)
    }
  }

  // Fixed track list
  if (variant.tracks) {
    for (const id of variant.tracks) {
      if (!(id in tracksData)) {
        errors.push(`Track "${id}" referenced in variant "${variant.slug}" not found in tracks.json`)
      }
    }
  }

  // Featured track
  if (variant.featuredTrack && !(variant.featuredTrack in tracksData)) {
    errors.push(`featuredTrack "${variant.featuredTrack}" not found in tracks.json`)
  }

  // Default ensemble
  if (variant.defaultEnsemble && !(variant.defaultEnsemble in ensemblesData)) {
    errors.push(`defaultEnsemble "${variant.defaultEnsemble}" not found in ensembles.json`)
  }

  // Photos
  const photoIds = new Set<string>()
  const downloadNames = new Set<string>()

  for (const photo of sharedData.photos as Photo[]) {
    if (photoIds.has(photo.id)) {
      errors.push(`Duplicate photo id "${photo.id}"`)
    }
    photoIds.add(photo.id)

    if (downloadNames.has(photo.downloadName)) {
      errors.push(`Duplicate downloadName "${photo.downloadName}"`)
    }
    downloadNames.add(photo.downloadName)

    if (photo.credit && !photo.downloadName.includes(photo.credit)) {
      errors.push(
        `Photo "${photo.id}" has credit "${photo.credit}" but it is not included in downloadName "${photo.downloadName}"`
      )
    }

    const filePath = path.join(process.cwd(), 'public', photo.src.replace(/^\//, ''))
    if (!fs.existsSync(filePath)) {
      errors.push(`Photo file not found on disk: ${photo.src} (expected at ${filePath})`)
    }
  }

  // Hero photo exists in photo list
  if (!photoIds.has(variant.heroPhoto)) {
    errors.push(`heroPhoto "${variant.heroPhoto}" not found in shared.photos`)
  }

  // Press photo exists
  if (!photoIds.has(sharedData.press.photo)) {
    errors.push(`press.photo "${sharedData.press.photo}" not found in shared.photos`)
  }

  // Grid photos exist
  for (const id of sharedData.photoGrid) {
    if (!photoIds.has(id)) {
      errors.push(`photoGrid entry "${id}" not found in shared.photos`)
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Content validation failed for variant "${variant.slug}":\n${errors.map((e) => `  \u2022 ${e}`).join('\n')}`
    )
  }
}

export function loadContent(slug: string): ResolvedContent {
  const variant = VARIANT_MAP[slug]
  if (!variant) {
    throw new Error(`Unknown variant slug "${slug}". Available: ${Object.keys(VARIANT_MAP).join(', ')}`)
  }

  validate(variant)

  const shared = sharedData as typeof sharedData & { photos: Photo[] }
  const tracks = tracksData as Record<string, Track>
  const ensembles = ensemblesData as typeof ensemblesData
  const venues = venuesData as typeof venuesData

  const photoMap: Record<string, Photo> = {}
  for (const photo of shared.photos) {
    photoMap[photo.id] = photo
  }

  const heroPhoto = photoMap[variant.heroPhoto]
  const pressPhoto = photoMap[shared.press.photo]
  const gridPhotos = shared.photoGrid.map((id) => photoMap[id])

  // Build ordered track list for this variant
  let trackIds: string[]
  if (variant.tracks) {
    trackIds = variant.tracks
  } else {
    // Will be filtered client-side by active ensemble; provide full library
    trackIds = Object.keys(tracks)
  }
  const orderedTracks = trackIds.map((id) => ({ id, track: tracks[id] }))

  return {
    variant,
    shared,
    tracks,
    ensembles,
    venues,
    photoMap,
    heroPhoto,
    pressPhoto,
    gridPhotos,
    orderedTracks,
  }
}
