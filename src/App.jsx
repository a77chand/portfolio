import { useEffect } from 'react';
import { createPlayOnceVideo, heroReady } from './playOnce.js';
import GooeyNav from './components/GooeyNav/GooeyNav.jsx';
import HeroCubeZoom from './components/HeroCubeZoom.jsx';
import Orb from './components/Orb.jsx';
import DotMatrix from './components/DotMatrix.jsx';
import ContactForm from './components/ContactForm.jsx';
import sigcseImg from './assets/sigcse.jpg';
import tendImg from './assets/tend-logo.jpg';
import ethicuraLiveImg from './assets/ethicura-live.jpg';
import sigcsePdf from './assets/SIGCSE_Poster_Learning_Outcomes_LLM.pdf?url';

const galleryItems = [
  { image: 'https://raw.githubusercontent.com/a77chand/wildfire-risk-prediction/main/reports/figures/risk_map_peak_week.png', text: 'Wildfire Risk Predictor', href: 'https://github.com/a77chand/wildfire-risk-prediction' },
  { image: 'https://raw.githubusercontent.com/a77chand/ethicura-ai/main/assets/summary.png', text: 'Ethicura AI', href: 'https://github.com/a77chand/ethicura-ai' },
  { image: ethicuraLiveImg, text: 'Ethicura AI — Live Browser Demo', href: 'https://ethicura-frontend.vercel.app' },
  { image: 'https://raw.githubusercontent.com/a77chand/Pack_Ween1/main/docs/screenshot.jpg', text: 'Pack_Ween — ElleHacks Game', href: 'https://github.com/a77chand/Pack_Ween1' },
  { image: sigcseImg, text: 'AI Bias Research — SIGCSE 2025', href: sigcsePdf },
  { image: tendImg, text: 'Tend — NGO Work', href: 'https://tend-daily-care.base44.app' },
];

export default function App() {
  useEffect(() => {
    const { vid, cleanup } = createPlayOnceVideo('/BG-code.mp4', 'bg-video', { waitFor: heroReady.promise });
    document.body.insertBefore(vid, document.body.firstChild);
    return cleanup;
  }, []);

  return (
    <>
      <canvas id="comet"></canvas>

      <div style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <GooeyNav
          items={[
            { label: 'Home', href: '#top' },
            { label: 'Projects', href: '#projects' },
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Contact', href: '#contact' },
          ]}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      <HeroCubeZoom />

      <section className="sec" id="projects">
        <h2 className="code-head">PROJECTS <span className="br">{'{'}</span></h2>
        <div className="proj-grid">
          {galleryItems.map(it => (
            <a className="proj-card" key={it.text} href={it.href} target="_blank" rel="noopener noreferrer">
              <img src={it.image} alt="" loading="lazy" />
              <span className="proj-title">→ {it.text}</span>
            </a>
          ))}
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="about">
        <h2 className="code-head">ABOUT <span className="br">{'{'}</span></h2>
        <div className="about-grid">
          <Orb size={200} />
          <div className="about-text">
            <p>Hi, I'm <span className="hi">Anusha Chandra</span> — CS student at the <span className="hi">University of Waterloo</span>.</p>
            <p>I build things at the intersection of <span className="vi">software, machine learning, and ethics</span>. Co-creator of <span className="vi">Ethicura AI</span> at NYAS — a deepfake detector (<span className="vi">XceptionNet + MTCNN</span>) that explains every call with Grad-CAM, served through a <span className="vi">FastAPI</span> API.</p>
            <p>I also built a <span className="vi">wildfire risk predictor</span> — a Random Forest on NASA FIRMS satellite data across British Columbia (<span className="vi">ROC-AUC ≈ 0.91</span>). Research contributor at <span className="vi">SIGCSE 2025</span> and builder of <span className="vi">Tend</span>, a wellness app for unpaid caregivers — passionate about responsible AI throughout.</p>
          </div>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="skills">
        <h2 className="code-head">SKILLS <span className="br">{'{'}</span></h2>
        <p className="skills-intro">I break complex problems into manageable pieces and pick up new tools fast — most of what I know is self-taught and project-driven.</p>
        <div className="skills-cols">
          <div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="" /><span className="sk-name">Python</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="" /><span className="sk-name">JavaScript</span></div>
            <div className="sk-row"><span className="sk-logo sk-badge">Rkt</span><span className="sk-name">Racket</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="" /><span className="sk-name">HTML / CSS</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" alt="" /><span className="sk-name">scikit-learn</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" alt="" /><span className="sk-name">TensorFlow / Keras</span></div>
            <div className="sk-row"><img className="sk-logo sk-pandas" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" alt="" /><span className="sk-name">pandas</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" alt="" /><span className="sk-name">NumPy</span></div>
          </div>
          <div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="" /><span className="sk-name">React</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="" /><span className="sk-name">Node.js</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="" /><span className="sk-name">FastAPI</span></div>
            <div className="sk-row"><img className="sk-logo sk-invert" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="" /><span className="sk-name">Flask</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" alt="" /><span className="sk-name">OpenCV</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" alt="" /><span className="sk-name">Jupyter</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="" /><span className="sk-name">Git</span></div>
            <div className="sk-row"><img className="sk-logo sk-invert" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" alt="" /><span className="sk-name">Vercel</span></div>
          </div>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="interests">
        <h2 className="code-head">INTERESTS <span className="br">{'{'}</span></h2>
        <div className="int-strip">
          <div className="int-cell"><span className="int-name">AI / ML</span></div>
          <div className="int-cell"><span className="int-name">Computer Vision</span></div>
          <div className="int-cell"><span className="int-name">Geospatial &amp; Climate</span></div>
          <div className="int-cell"><span className="int-name">Game Dev</span></div>
          <div className="int-cell"><span className="int-name">Open Source</span></div>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="contact">
        <h2 className="code-head">CONTACT <span className="br">{'{'}</span></h2>
        <DotMatrix text="LET'S CONNECT" height={190} />
        <p className="contact-line">Have a project in mind? My inbox is always open.</p>
        <ContactForm />
        <div className="c-side">
          <a className="c-row" href="https://github.com/a77chand" target="_blank" rel="noopener noreferrer"><span className="c-ic">⌥</span>github.com/a77chand</a>
          <a className="c-row" href="mailto:a77chand@uwaterloo.ca"><span className="c-ic">✉</span>a77chand@uwaterloo.ca</a>
          <a className="c-row" href="https://www.linkedin.com/in/anushachandra" target="_blank" rel="noopener noreferrer"><span className="c-ic">in</span>linkedin.com/in/anushachandra</a>
        </div>
        <p className="code-close">{'}'}</p>
        <p className="closing">// thanks for visiting&nbsp;<span className="type-cursor vi">█</span></p>
      </section>
    </>
  );
}
