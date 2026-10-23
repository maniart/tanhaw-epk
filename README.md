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
