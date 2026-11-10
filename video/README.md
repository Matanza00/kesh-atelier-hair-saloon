# Kesh Atelier: LinkedIn showcase video

A 70-second, 1080×1350 (4:5) Remotion video that walks through the site: the "before" template, the scroll-scrubbed hero, the Three.js hair strands, service scenes, before/after slider, booking popup and Ava, the voice receptionist.

## Run it

```bash
cd video
npm install
# copy the site media into public/ (the video reuses the same frames)
mkdir -p public && cp -r ../hero ../svc ../ba public/
# fonts (woff2) and screenshots go in public/fonts and public/shots
npx remotion studio          # preview
npx remotion render KeshLinkedIn out/video.mp4
npx remotion still Cover out/cover.jpg
python3 audio/music.py       # synthesizes the music bed (numpy + scipy)
```

`src/Strands.tsx` is a port of the site's hair shader, rendered per frame inside Remotion.

Remotion is free for individuals and small teams; see remotion.dev/license for company use.
