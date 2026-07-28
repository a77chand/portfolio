import { useEffect, useRef } from 'react';

export default function Orb({ size = 200 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const S = size, C = S / 2;
    let t = 0, alive = true;
    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, S, S);
      t += 0.02;
      const g = ctx.createRadialGradient(C, C, 1, C, C, S * 0.19);
      g.addColorStop(0, 'rgba(220,200,255,0.95)');
      g.addColorStop(0.4, 'rgba(167,139,250,0.5)');
      g.addColorStop(1, 'rgba(124,58,237,0)');
      ctx.beginPath(); ctx.arc(C, C, S * 0.19, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      for (let k = 0; k < 9; k++) {
        const tilt = k * 0.7 + t * (k % 2 ? 0.5 : -0.35);
        const rx = S * 0.24 + k * S * 0.032;
        const ry = (S * 0.14 + k * S * 0.036) * Math.abs(Math.sin(t * 0.6 + k));
        ctx.beginPath();
        for (let i = 0; i <= 70; i++) {
          const th = (i / 70) * Math.PI * 2;
          const wob = Math.sin(th * 3 + t * 2 + k) * S * 0.03;
          const X = Math.cos(th) * (rx + wob), Y = Math.sin(th) * (ry + wob);
          const px = C + X * Math.cos(tilt) - Y * Math.sin(tilt);
          const py = C + X * Math.sin(tilt) + Y * Math.cos(tilt);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${150 + k * 8},${110 + k * 8},250,${0.35 - k * 0.025})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      requestAnimationFrame(draw);
    };
    draw();
    return () => { alive = false; };
  }, [size]);
  return <canvas ref={ref} width={size} height={size} />;
}
