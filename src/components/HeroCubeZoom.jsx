// Hero with terrain wave, typing eyebrow, and the scroll-driven cube zoom.
// Same math as the vanilla version, wrapped in React refs + useEffect.
import { useEffect, useRef } from 'react';
import Lanyard from './Lanyard/Lanyard.jsx';

const lerp = (a, b, t) => a + (b - a) * t;
const cl = v => Math.max(0, Math.min(1, v));
const ease = t => t * t * (3 - 2 * t);

export default function HeroCubeZoom() {
  const terrainRef = useRef(null);
  const cubeRef = useRef(null);
  const textRef = useRef(null);
  const flashRef = useRef(null);
  const cueRef = useRef(null);
  const stageRef = useRef(null);
  const pinRef = useRef(null);
  const typedRef = useRef(null);
  const lanyardRef = useRef(null);

  useEffect(() => {
    let alive = true;

    // ---- typing eyebrow ----
    const phrase = 'cs student @ university of waterloo';
    let ti = 0;
    (function type() {
      if (!alive || !typedRef.current) return;
      if (ti < phrase.length) {
        typedRef.current.textContent += phrase[ti++];
        setTimeout(type, 60);
      }
    })();

    // ---- comet tail cursor ----
    const cometCanvas = document.getElementById('comet');
    let onCometMove, fitComet;
    if (cometCanvas) {
      const cctx = cometCanvas.getContext('2d');
      fitComet = () => {
        cometCanvas.width = window.innerWidth;
        cometCanvas.height = window.innerHeight;
      };
      fitComet();
      window.addEventListener('resize', fitComet);

      const trail = [];
      let cmx = -100, cmy = -100, cpmx = -100, cpmy = -100;

      onCometMove = e => {
        cmx = e.clientX;
        cmy = e.clientY;
      };
      window.addEventListener('mousemove', onCometMove);

      const cometLoop = () => {
        if (!alive) return;
        const vel = Math.hypot(cmx - cpmx, cmy - cpmy);
        if (cmx > 0) {
          trail.push({
            x: cmx, y: cmy, life: 1,
            size: 3 + Math.min(vel * 0.15, 4),
            dx: (Math.random() - 0.5) * 0.6,
            dy: (Math.random() - 0.5) * 0.6,
          });
          if (vel > 6) {
            for (let i = 0; i < 2; i++) {
              trail.push({
                x: cmx + (Math.random() - 0.5) * 8,
                y: cmy + (Math.random() - 0.5) * 8,
                life: 0.7,
                size: 1 + Math.random() * 1.5,
                dx: (Math.random() - 0.5) * 1.6,
                dy: (Math.random() - 0.5) * 1.6,
              });
            }
          }
        }
        cpmx = cmx; cpmy = cmy;
        cctx.clearRect(0, 0, cometCanvas.width, cometCanvas.height);
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          p.life -= 0.025;
          p.x += p.dx; p.y += p.dy;
          if (p.life <= 0) { trail.splice(i, 1); continue; }
          cctx.beginPath();
          cctx.arc(p.x + Math.sin(p.life * 12) * 1.5, p.y, p.size * p.life, 0, Math.PI * 2);
          cctx.fillStyle = `rgba(${Math.floor(153 - (1 - p.life) * 80)},${Math.floor(51 + p.life * 88)},255,${p.life * 0.8})`;
          cctx.fill();
        }
        if (cmx > 0) {
          cctx.beginPath();
          cctx.arc(cmx, cmy, 6, 0, Math.PI * 2);
          cctx.strokeStyle = 'rgba(196,168,255,0.95)';
          cctx.lineWidth = 1.5;
          cctx.stroke();
          cctx.beginPath();
          cctx.arc(cmx, cmy, 2, 0, Math.PI * 2);
          cctx.fillStyle = '#c4a8ff';
          cctx.fill();
        }
        requestAnimationFrame(cometLoop);
      };
      cometLoop();
    }

    // ---- terrain wave ----
    const tCanvas = terrainRef.current;
    let tctx, TW, TH;
    const fitT = () => {
      const r = tCanvas.getBoundingClientRect();
      tCanvas.width = r.width * 2;
      tCanvas.height = r.height * 2;
      tctx = tCanvas.getContext('2d');
      tctx.scale(2, 2);
      TW = r.width; TH = r.height;
    };
    fitT();

    // hero float video — created in JS so React never remounts it
    const stageEl = stageRef.current;
    let onHeroInteract;
    const existingVideo = stageEl.querySelector('.hero-float-video');
    if (!existingVideo) {
      const vid = document.createElement('video');
      vid.className = 'hero-float-video';
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('preload', 'auto');
      vid.controls = false;
      vid.removeAttribute('controls');

      const src = document.createElement('source');
      src.src = '/hero-float.mp4';
      src.type = 'video/mp4';
      vid.appendChild(src);
      stageEl.appendChild(vid);

      vid.load();

      // Try autoplay immediately
      const tryPlay = () => {
        vid.muted = true;
        vid.play().catch(() => {});
      };
      tryPlay();

      // Also try on any user interaction — covers browsers that block autoplay
      onHeroInteract = () => {
        vid.play().catch(() => {});
        document.removeEventListener('click', onHeroInteract);
        document.removeEventListener('keydown', onHeroInteract);
        document.removeEventListener('touchstart', onHeroInteract);
        document.removeEventListener('scroll', onHeroInteract);
      };
      document.addEventListener('click', onHeroInteract);
      document.addEventListener('keydown', onHeroInteract);
      document.addEventListener('touchstart', onHeroInteract);
      document.addEventListener('scroll', onHeroInteract, { once: true });
    }

    const noise = (x, z, t) =>
      Math.sin(x * 0.9 + t) * Math.cos(z * 0.7 - t * 0.6) +
      Math.sin(x * 1.7 - t * 0.8 + z * 0.5) * 0.5 +
      Math.sin(x * 3.1 + t * 1.3) * Math.sin(z * 2.3 + t * 0.4) * 0.35 +
      Math.sin(x * 0.4 + z * 1.4 + t * 0.5) * 0.8;

    let tt = 0;
    const ROWS = 26, COLS = 70, f = 190;
    const project = (x, z, h) => {
      const zz = z + 3.2;
      const s = f / (f + zz * 70);
      return { x: TW / 2 + x * TW * 0.95 * s, y: TH * 0.16 + (110 - h * 26) * s * (zz * 0.16) };
    };

    const drawTerrain = () => {
      if (!alive) return;
      tctx.clearRect(0, 0, TW, TH);
      const grid = [];
      for (let i = 0; i < ROWS; i++) {
        grid.push([]);
        const z = (i / (ROWS - 1)) * 4.5;
        for (let j = 0; j <= COLS; j++) {
          const x = (j / COLS - 0.5) * 2;
          grid[i].push(project(x, z, noise(x * 4, z, tt)));
        }
      }
      tctx.shadowColor = 'rgba(147,102,250,0.8)';
      for (let i = ROWS - 1; i >= 0; i--) {
        const d = 1 - i / (ROWS - 1);
        tctx.shadowBlur = d > 0.6 ? 6 : 0;
        tctx.beginPath();
        grid[i].forEach((p, j) => (j === 0 ? tctx.moveTo(p.x, p.y) : tctx.lineTo(p.x, p.y)));
        tctx.strokeStyle = `rgba(${140 + d * 40},${95 + d * 45},250,${0.06 + d * 0.55})`;
        tctx.lineWidth = 0.5 + d * 0.9;
        tctx.stroke();
      }
      tctx.shadowBlur = 0;
      for (let j = 0; j <= COLS; j += 2) {
        tctx.beginPath();
        for (let i = 0; i < ROWS; i++) {
          const p = grid[i][j];
          i === 0 ? tctx.moveTo(p.x, p.y) : tctx.lineTo(p.x, p.y);
        }
        tctx.strokeStyle = 'rgba(124,58,237,0.14)';
        tctx.lineWidth = 0.5;
        tctx.stroke();
      }
      tt += 0.016;
      requestAnimationFrame(drawTerrain);
    };
    drawTerrain();

    // ---- cube (full-stage canvas, geometry-driven zoom = always sharp) ----
    const cCanvas = cubeRef.current;
    let cctx, CW, CH;
    const fitC = () => {
      const r = cCanvas.getBoundingClientRect();
      cCanvas.width = r.width * 2;
      cCanvas.height = r.height * 2;
      cctx = cCanvas.getContext('2d');
      cctx.scale(2, 2);
      CW = r.width; CH = r.height;
    };
    fitC();

    const V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    let angle = 0, cubeX = 0, cubeY = 0, cubeR = 60, cubeOp = 1;

    const drawCube = () => {
      if (!alive) return;
      cctx.clearRect(0, 0, CW, CH);
      angle += 0.008;
      [[1, angle, 0.5], [0.62, -angle * 1.4, 0.8], [0.3, angle * 2, 1]].forEach(([sc, ang, op]) => {
        const cA = Math.cos(ang), sA = Math.sin(ang), cB = Math.cos(ang * 0.7), sB = Math.sin(ang * 0.7);
        const pr = V.map(v => {
          let [X, Y, Z] = v.map(q => q * sc);
          const y2 = Y * cA - Z * sA, z2 = Y * sA + Z * cA;
          const x3 = X * cB + z2 * sB, z3 = -X * sB + z2 * cB;
          const s = (cubeR / (3.5 + z3)) * 3.2;
          return { x: cubeX + x3 * s, y: cubeY + y2 * s, z: z3 };
        });
        E.forEach(([a, b]) => {
          const p = pr[a], q = pr[b];
          const d = ((p.z + q.z) / 2 + 1.5) / 2.5;
          cctx.beginPath();
          cctx.moveTo(p.x, p.y);
          cctx.lineTo(q.x, q.y);
          cctx.strokeStyle = `rgba(167,139,250,${d * 0.65 * op * cubeOp})`;
          cctx.lineWidth = 1.2 + cubeR / 300;
          cctx.stroke();
        });
      });
      requestAnimationFrame(drawCube);
    };
    drawCube();

    // ---- scroll choreography (short + snappy) ----
    const update = () => {
      const pin = pinRef.current, stage = stageRef.current;
      if (!pin || !stage) return;
      const rect = pin.getBoundingClientRect();
      const travel = pin.offsetHeight - window.innerHeight;
      const p = cl(-rect.top / Math.max(travel, 1));

      const a = ease(cl(p / 0.3));
      if (textRef.current) {
        textRef.current.style.opacity = 1 - a;
        textRef.current.style.transform = `translateY(${-a * 40}px)`;
      }
      if (lanyardRef.current) lanyardRef.current.style.opacity = 1 - a;
      if (cueRef.current) cueRef.current.style.opacity = p > 0.05 ? 0 : 1;

      cubeX = lerp(CW - Math.min(CW * 0.22, 190), CW / 2, a);
      cubeY = lerp(Math.min(CH * 0.28, 200), CH / 2, a);

      const b = ease(cl((p - 0.3) / 0.55));
      cubeR = 60 + b * CW * 1.4;

      const c = ease(cl((p - 0.8) / 0.2));
      if (flashRef.current) flashRef.current.style.opacity = b > 0.4 ? ease(cl((b - 0.4) / 0.4)) * (1 - c) : 0;
      cubeOp = 1 - c;
      stage.style.opacity = 1 - c * 0.9;
    };
    const onResize = () => { fitT(); fitC(); update(); };
    window.addEventListener('scroll', update);
    window.addEventListener('resize', onResize);
    update();

    return () => {
      alive = false;
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
      if (fitComet) window.removeEventListener('resize', fitComet);
      if (onCometMove) window.removeEventListener('mousemove', onCometMove);
      if (onHeroInteract) {
        document.removeEventListener('click', onHeroInteract);
        document.removeEventListener('keydown', onHeroInteract);
        document.removeEventListener('touchstart', onHeroInteract);
        document.removeEventListener('scroll', onHeroInteract);
      }
      const vid = stageRef.current?.querySelector('.hero-float-video');
      if (vid) vid.remove();
    };
  }, []);

  return (
    <div className="pin-wrap" id="top" ref={pinRef}>
      <div className="stage" ref={stageRef}>
        <canvas className="hero-wave" ref={terrainRef} />
        <div className="flash" ref={flashRef} />

        <div className="hero-text" ref={textRef}>
          <p className="hero-eyebrow">
            <span ref={typedRef} />
            <span className="type-cursor">▌</span>
          </p>
          <h1 className="hero-name">
            ANUSHA<br />
            <span className="out">CHANDRA</span>
          </h1>
          <p className="hero-role">// developer&nbsp;&nbsp;·&nbsp;&nbsp;fintech&nbsp;&nbsp;·&nbsp;&nbsp;ml&nbsp;&nbsp;·&nbsp;&nbsp;full stack</p>
        </div>

        {/* Physics ID card hanging on the right, like the sketch */}
        <div className="lanyard-slot" ref={lanyardRef}>
          <Lanyard
            position={[0, 0, 20]}
            gravity={[0, -40, 0]}
            frontImage="/card-front.jpg"
            backImage="/card-back.jpg"
            imageFit="cover"
            lanyardWidth={1}
          />
        </div>

        <canvas className="cube-canvas" ref={cubeRef} />
        <p className="scroll-cue" ref={cueRef}>scroll to enter ↓</p>
      </div>
    </div>
  );
}
