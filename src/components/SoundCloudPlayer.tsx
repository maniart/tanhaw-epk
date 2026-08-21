interface Props {
  trackId: string
  secretToken: string | null
}

export default function SoundCloudPlayer({ trackId, secretToken }: Props) {
  const trackUrl = `https://api.soundcloud.com/tracks/soundcloud:tracks:${trackId}${secretToken ? `?secret_token=${secretToken}` : ''}`
  const src =
    `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}` +
    `&color=%2381212e&auto_play=false&hide_related=true&show_comments=false` +
    `&show_user=true&show_reposts=false&show_teaser=false`

  return (
    <iframe
      width="100%"
      height="166"
      scrolling="no"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      src={src}
      style={{ display: 'block', border: '1px solid #221E1A', minWidth: 0 }}
    />
  )
}
