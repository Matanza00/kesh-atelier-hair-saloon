# Kesh Atelier - Hair Saloon

Cinematic website for a hair and beauty salon in Kalispell, Montana, with online booking and Ava, a voice receptionist built on ElevenLabs Agents. Hosted on Vercel.

## What's here
- `index.html` – the website (built from the design source with `build.py`)
- `hero/`, `svc/`, `ba/` – scroll-scrubbed video frames and before/after photos
- `api/book.js` – saves a booking request (checks hours, double bookings, phone format)
- `api/availability.js` – open start times for a day and stylist
- `api/bookings.js` – list of booking requests for the owner (needs `ADMIN_KEY`)
- `api/config.js` – gives the page the ElevenLabs agent ID
- `admin.html` – booking list for the salon (open `/admin`, enter the admin key)
- `agent/` – Ava's prompt, first message and client-tool definitions
- `lib/salon.mjs` – services, stylists and opening hours used by the API (keep in sync with `SALON` in `index.html`)

## Environment variables (Vercel → Project → Settings → Environment Variables)
| Name | What it is |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Set automatically when the private **Vercel Blob** store `kesh-atelier-bookings` is connected to the project |
| `ELEVENLABS_AGENT_ID` | The ID of Ava's agent in ElevenLabs |
| `ADMIN_KEY` | Any long secret; used to open `/admin` |

After changing environment variables, redeploy.

## License
Source-available under the **PolyForm Noncommercial License 1.0.0** (`LICENSE.md`).

- **Allowed:** using, studying, changing and sharing this project for personal, educational and other noncommercial purposes, and contributing improvements (see `CONTRIBUTING.md`).
- **Not allowed without written permission:** selling this project or any copy or adaptation of it, or using it to earn money, for example as a paid client site, a template you sell, or a commercial product.

For a commercial license, contact NXCSOL at https://nxcsol.com.

Third-party libraries loaded from CDNs (Three.js, GSAP, Lenis, the ElevenLabs client) and the `@vercel/blob` package keep their own licenses.
