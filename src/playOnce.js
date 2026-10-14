// Safari-safe muted video that plays once and freezes on the last frame.
//
// Safari paints its own play button on any visible <video> and CSS can't remove it,
// so the real <video> is a small decoder hidden behind the page (the page background
// canvas covers it) and its frames are drawn onto a canvas (returned as `vid`, styled
// by `className`) that has no native controls.
//
// Autoplay can be blocked outright (Safari in Low Power Mode, strict autoplay
// settings). If the video is still paused shortly after load, fall back to stepping
// through it by seeking, which needs no user gesture, so the animation always runs.
export function createPlayOnceVideo(src, className) {
  const video = document.createElement('video');
  const vid = document.createElement('canvas');
  vid.className = className;
  vid.width = 1280;
  vid.height = 720;
  const ctx = vid.getContext('2d');

  // Safari only autoplays videos it considers visible: real size, opaque, in viewport.
  Object.assign(video.style, {
    position: 'fixed', left: '0', top: '0', width: '160px', height: '90px',
    opacity: '1', pointerEvents: 'none', zIndex: '-1',
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
  video.src = src;
  document.body.appendChild(video);

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
    video.play().catch(() => {});
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
  const t2 = setTimeout(startScrub, 900);

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
