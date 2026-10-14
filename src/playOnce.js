// Safari-safe muted video that plays once and freezes on the last frame.
//
// Safari paints its own play button on any visible <video> and CSS can't remove it,
// so the real <video> is a small decoder hidden behind the page (a solid cover layer
// sits over it) and its frames are drawn onto a canvas (returned as `vid`, styled
// by `className`) that has no native controls.
//
// Autoplay can be blocked outright (Safari in Low Power Mode, strict autoplay
// settings). If the video is still paused shortly after load, fall back to stepping
// through it by seeking, which needs no user gesture, so the animation always runs.
// Lets the main (hero) video get the bandwidth first: a video created with
// `waitFor: heroReady.promise` doesn't start downloading until the hero one can play.
let resolveHero;
export const heroReady = { promise: new Promise(r => { resolveHero = r; }), resolve: () => resolveHero() };

// Solid page-colored layer between the hidden decoder videos (z-index -2) and the page.
// If Safari draws its native play button on a decoder, it lands under this cover.
function ensureCover() {
  if (document.getElementById('video-cover')) return;
  const cover = document.createElement('div');
  cover.id = 'video-cover';
  Object.assign(cover.style, {
    position: 'fixed', inset: '0', background: '#080808', zIndex: '-1', pointerEvents: 'none',
  });
  document.body.insertBefore(cover, document.body.firstChild);
}

export function createPlayOnceVideo(src, className, { waitFor, isHero } = {}) {
  ensureCover();
  const video = document.createElement('video');
  video.className = 'video-decoder';
  const vid = document.createElement('canvas');
  vid.className = className;
  vid.width = 1280;
  vid.height = 720;
  const ctx = vid.getContext('2d');

  // Safari only autoplays videos it considers visible: real size, opaque, in viewport.
  Object.assign(video.style, {
    position: 'fixed', left: '0', top: '0', width: '160px', height: '90px',
    opacity: '1', pointerEvents: 'none', zIndex: '-2',
  });
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('disablepictureinpicture', '');
  video.setAttribute('disableremoteplayback', '');
  video.setAttribute('x-webkit-airplay', 'deny');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.controls = false;
  video.loop = false;
  video.autoplay = true;
  video.preload = 'auto';
  document.body.appendChild(video);
  const setSrc = () => { if (!video.src) video.src = src; };
  if (waitFor) {
    // never wait more than 6s, so a stalled hero video can't hold the background back
    Promise.race([waitFor, new Promise(r => setTimeout(r, 6000))]).then(setSrc);
  } else {
    setSrc();
  }
  if (isHero) {
    video.addEventListener('canplaythrough', heroReady.resolve, { once: true });
    video.addEventListener('error', heroReady.resolve, { once: true });
  }

  let dead = false;
  let finished = false;
  let scrubbing = false;
  let raf = 0;
  let scrubRaf = 0;

  const paint = () => {
    if (video.readyState >= 2) ctx.drawImage(video, 0, 0, vid.width, vid.height);
  };

  // ---- normal playback ----
  const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
  const media = ['loadedmetadata', 'loadeddata', 'canplay'];
  const tryPlay = () => {
    if (scrubbing || video.ended || !video.paused) return;
    // A policy block rejects right away, so start the fallback immediately.
    video.play().catch(err => { if (err && err.name === 'NotAllowedError') startScrub(); });
  };
  const stopRetry = () => {
    events.forEach(e => window.removeEventListener(e, tryPlay));
    media.forEach(e => video.removeEventListener(e, tryPlay));
  };
  media.forEach(e => video.addEventListener(e, tryPlay));
  events.forEach(e => window.addEventListener(e, tryPlay, { passive: true }));
  video.addEventListener('playing', stopRetry, { once: true });

  const loop = () => {
    paint();
    if (!video.ended && !finished && !dead) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  video.addEventListener('ended', () => { paint(); finished = true; });

  // ---- fallback: scrub through the video by seeking ----
  const startScrub = () => {
    if (dead || scrubbing || finished || !video.paused || video.ended) return;
    if (!(video.duration > 0)) {
      video.addEventListener('loadedmetadata', startScrub, { once: true });
      return;
    }
    scrubbing = true;
    stopRetry();
    const dur = video.duration;
    const last = Math.max(dur - 0.04, 0);
    const t0 = performance.now();
    video.addEventListener('seeked', () => {
      paint();
      if (video.currentTime >= last - 0.001) finished = true;
    });
    const step = () => {
      if (dead || finished) return;
      const t = (performance.now() - t0) / 1000;
      if (!video.seeking) video.currentTime = t >= dur ? last : Math.min(t, last);
      scrubRaf = requestAnimationFrame(step);
    };
    step();
  };

  tryPlay();
  const t1 = setTimeout(tryPlay, 300);
  const t2 = setTimeout(startScrub, 500); // safety net if play() neither resolves nor rejects

  return {
    vid,
    cleanup: () => {
      dead = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrubRaf);
      clearTimeout(t1);
      clearTimeout(t2);
      stopRetry();
      video.remove();
      vid.remove();
    },
  };
}
