// Safari-safe muted autoplay that plays once and freezes on the last frame.
// Attributes are set before src so Safari treats the element as muted inline media.
export function createPlayOnceVideo(src, className) {
  const vid = document.createElement('video');
  vid.className = className;
  vid.setAttribute('muted', '');
  vid.setAttribute('playsinline', '');
  vid.setAttribute('webkit-playsinline', '');
  vid.setAttribute('disablepictureinpicture', '');
  vid.setAttribute('disableremoteplayback', '');
  vid.setAttribute('x-webkit-airplay', 'deny');
  vid.muted = true;
  vid.defaultMuted = true;
  vid.playsInline = true;
  vid.controls = false;
  vid.loop = false;
  vid.autoplay = true;
  vid.preload = 'auto';
  vid.src = src;

  const events = ['pointerdown', 'touchstart', 'keydown', 'click'];
  const media = ['loadedmetadata', 'loadeddata', 'canplay'];
  const tryPlay = () => {
    if (vid.ended || !vid.paused) return;
    vid.play().catch(() => {});
  };
  const stop = () => {
    events.forEach(e => window.removeEventListener(e, tryPlay));
    media.forEach(e => vid.removeEventListener(e, tryPlay));
  };
  media.forEach(e => vid.addEventListener(e, tryPlay));
  events.forEach(e => window.addEventListener(e, tryPlay, { passive: true }));
  vid.addEventListener('playing', stop, { once: true });
  tryPlay();
  const t = setTimeout(tryPlay, 300);

  return { vid, cleanup: () => { clearTimeout(t); stop(); vid.remove(); } };
}
