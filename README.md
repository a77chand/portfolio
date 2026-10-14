# Anusha Chandra — Portfolio (React)

**Live site:** https://anusha-chandra.vercel.app

React + Vite single-page portfolio: scroll-driven hero, project cards, about, skills, interests and a contact form.

## Run locally
1. Install Node.js LTS from https://nodejs.org (if not installed)
2. `npm install`
3. `npm run dev` → open the printed localhost URL

## Deploy (Vercel)
Live at https://anusha-chandra.vercel.app. Push this folder to a GitHub repo, import it on vercel.com — Vite is auto-detected. Every push to `main` redeploys.

## Structure
- `src/App.jsx` — page sections, nav, project cards (`galleryItems`)
- `src/components/HeroCubeZoom.jsx` — hero: typing eyebrow, terrain wave, comet cursor, scroll-driven cube zoom, hero animation video
- `src/playOnce.js` — shared helper that plays a video once and freezes on its last frame (see below)
- `src/index.css` — all styling
- `public/` — `BG-code.mp4` (page background), `hero-float-silent.mp4` (hero animation)

## Projects
Projects are plain clickable cards (image + title) that open the project link in a new tab. Edit the `galleryItems` array in `App.jsx` to add or change them.

## Background and hero videos
Both videos play **once** and stay frozen on their last frame (no looping).

- **Page background** — `BG-code.mp4`, fixed behind the whole page. Brightness is set by the `filter` on `.bg-video` in `index.css` (currently `brightness(1.25)`; each 0.1 step is a visible change, 1.0 is the raw video).
- **Hero animation** — `hero-float-silent.mp4`, blended over the hero (`.hero-float-video`).

### Why videos are drawn on a canvas
Safari paints its own play button on any visible `<video>` and CSS can't remove it. `createPlayOnceVideo()` in `playOnce.js` therefore plays the real video as a 2px invisible element and draws its frames onto a `<canvas>` (which gets the `.bg-video` / `.hero-float-video` class). Autoplay is retried when the video is ready and on the first click, tap or key press, since browsers may block it until a user gesture. Videos must stay muted with no audio track.

### Start-up speed
The hero video is preloaded from `index.html` and gets the bandwidth first; the background video only starts downloading once the hero one can play. Keep video files "faststart" (the `moov` index at the front of the .mp4) or playback can't begin until the whole file has downloaded. If you re-encode, use `ffmpeg -movflags +faststart`.

## TODOs in code (search "TODO")
- LinkedIn URL (App.jsx, contact section)
- Optional: replace project images in `galleryItems` with real screenshots

## Unused components
`CircularGallery` and `Lanyard` (3D ID card) are still in `src/components/` but no longer used on the page.
