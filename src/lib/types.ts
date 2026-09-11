export interface Photo {
  id: string
  src: string
  credit: string | null
  caption: string
  alt: string
  focal: string
  focalDesktop?: string
  downloadName: string
}

export interface Track {
  title: string
  description: string
  credits: string
  soundcloudTrackId: string | null
  secretToken: string | null
  ensembles: string[]
}

export interface RiderItem {
  item: string
  detail: string
}

export interface EnsembleConfig {
  label: string
  pitch: string
  rider: {
    summary: string[]
    spec: RiderItem[]
  }
}

export interface Venue {
  name: string
  city: string
  year: number
}

export interface PressFeature {
  outlet: string
  title: string
  url: string
}

export interface LinkItem {
  label: string
  url: string
}

export interface Collaborator {
  name: string
  role: string
}

export interface SharedContent {
  artist: string
  legalName: string
  hook: string
  tagline: string
  meta: string[]
  bioShort: string
  bioLong: string[]
  footerSignoff: string
  contact: { email: string }
  links: {
    listen: LinkItem[]
    elsewhere: LinkItem[]
  }
  press: {
    quote: string
    photo: string
    features: PressFeature[]
  }
  collaborators: Collaborator[]
  photos: Photo[]
  photoGrid: string[]
}

export interface Variant {
  slug: string
  route: string
  title: string
  description: string
  heroPhoto: string
  bio: 'short' | 'long' | 'both'
  sections: string[]
  featuredTrack: string | null
  featuredTrackLabel: string | null
  tracks: string[] | null
  defaultEnsemble: string | null
  videos: string[]
}

export interface StreamingLinks {
  embed: string | null       // Spotify embed URL (iframe src)
  spotify: string | null
  appleMusic: string | null
  soundcloud: string | null
  tidal: string | null
  amazonMusic: string | null
  bandcamp: string | null
}

export interface LinktreeLink {
  id: string
  label: string
  sublabel: string | null
  url: string
  thumbnail: string | null
  streaming: StreamingLinks | null
}

export interface LinktreeSection {
  id: string
  label: string
  links: LinktreeLink[]
}

export interface LinktreeSocial {
  id: string
  label: string
  url: string
}

export interface LinktreeData {
  profile: {
    name: string
    bio: string
    heroPhoto: string
  }
  sections: LinktreeSection[]
  socials: LinktreeSocial[]
}

export interface VenuePage {
  displayName: string
  tracks: string[] | null
}

export interface ResolvedContent {
  variant: Variant
  shared: SharedContent
  tracks: Record<string, Track>
  ensembles: Record<string, EnsembleConfig>
  venues: Venue[]
  photoMap: Record<string, Photo>
  heroPhoto: Photo
  pressPhoto: Photo
  gridPhotos: Photo[]
  orderedTracks: Array<{ id: string; track: Track }>
}
