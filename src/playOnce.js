// Safari-safe muted autoplay that plays once and freezes on the last frame.
// Safari paints its own play button on any visible <video> and CSS can't remove it,
// so the real <video> is a tiny invisible decoder and its frames are drawn onto a
// canvas (returned as `vid`, styled by `className`) that has no native controls.
// Attributes are set before src so Safari treats the element as muted inline media.
export function createPlayOnceVideo(src, className) {
  const video = document.createElement('video');
  const vid = document.createElement('canvas');
  vid.className = className;
  vid.width = 1280;
  vid.height = 720;
  const ctx = vid.getContext('2d');
  Object.assign(video.style, {
    position: 'fixed', right: '0', bottom: '0', width: '2px', height: '2px',
    opacity: '0.01', pointerEvents: 'none', zIndex: '-1',
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

  const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
  const media = ['loadedmetadata', 'loadeddata', 'canplay'];
  const tryPlay = () => {
    if (video.ended || !video.paused) return;
    video.play().catch(() => {});
  };
  const stop = () => {
    events.forEach(e => window.removeEventListener(e, tryPlay));
    media.forEach(e => video.removeEventListener(e, tryPlay));
  };
  media.forEach(e => video.addEventListener(e, tryPlay));
  events.forEach(e => window.addEventListener(e, tryPlay, { passive: true }));
  video.addEventListener('playing', stop, { once: true });
  tryPlay();
  const t = setTimeout(tryPlay, 300);

  // Paint frames until the video ends; the canvas then keeps the last frame.
  let raf = 0;
  const draw = () => {
    if (video.readyState >= 2) ctx.drawImage(video, 0, 0, vid.width, vid.height);
    if (!video.ended) raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  video.addEventListener('ended', draw);

  return {
    vid,
    cleanup: () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      stop();
      video.remove();
      vid.remove();
    },
  };
}
