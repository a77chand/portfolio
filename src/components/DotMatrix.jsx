import { useEffect, useRef } from 'react';

export default function DotMatrix({ text = "LET'S CONNECT", height = 110 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const off = document.createElement('canvas');
    off.width = canvas.width; off.height = height;
    const octx = off.getContext('2d');
    octx.fillStyle = '#fff';
    const fs = Math.min(canvas.width / 8.5, height * 0.62);
    octx.font = `800 ${fs}px 'Space Grotesk', sans-serif`;
    octx.textAlign = 'center'; octx.textBaseline = 'middle';
    octx.fillText(text, off.width / 2, off.height / 2);

    const img = octx.getImageData(0, 0, off.width, off.height).data;
    const GAP = 5, dots = [];
    for (let y = 0; y < off.height; y += GAP)
      for (let x = 0; x < off.width; x += GAP)
        if (img[(y * off.width + x) * 4 + 3] > 128) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });

    let mx = -999, my = -999, alive = true;
    const move = e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = -999; my = -999; };
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseleave', leave);

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, height);
      dots.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 45) {
          const force = ((45 - dist) / 45) * 2.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx += (p.ox - p.x) * 0.06;
        p.vy += (p.oy - p.y) * 0.06;
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
        const disp = Math.hypot(p.x - p.ox, p.y - p.oy) > 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = disp ? 'rgba(196,168,255,0.95)' : 'rgba(167,139,250,0.6)';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => {
      alive = false;
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseleave', leave);
    };
  }, [text, height]);
  return <canvas ref={ref} className="dots-canvas" />;
}
