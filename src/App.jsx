import GooeyNav from './components/GooeyNav/GooeyNav.jsx';
import CircularGallery from './components/CircularGallery/CircularGallery.jsx';
import HeroCubeZoom from './components/HeroCubeZoom.jsx';
import Orb from './components/Orb.jsx';
import DotMatrix from './components/DotMatrix.jsx';
import ContactForm from './components/ContactForm.jsx';
import sigcseImg from './assets/sigcse.jpg';
import tendImg from './assets/tend-logo.jpg';
import sigcsePdf from './assets/SIGCSE_Poster_Learning_Outcomes_LLM.pdf?url';

const galleryItems = [
  { image: 'https://raw.githubusercontent.com/a77chand/wildfire-risk-prediction/main/wildfire_risk_map.png', text: 'Wildfire Risk Predictor', href: 'https://github.com/a77chand/wildfire-risk-prediction' },
  { image: 'https://raw.githubusercontent.com/a77chand/ethicura-ai/main/assets/summary.png', text: 'Ethicura AI', href: 'https://github.com/a77chand/ethicura-ai' },
  { image: sigcseImg, text: 'AI Bias Research — SIGCSE 2025', href: sigcsePdf },
  { image: tendImg, text: 'Tend — NGO Work', href: 'https://tend-daily-care.base44.app' },
];

export default function App() {
  return (
    <>
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/BG-code.mp4" type="video/mp4" />
      </video>

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

      <section className="sec sec-full" id="projects">
        <h2 className="code-head">PROJECTS <span className="br">{'{'}</span></h2>
        <div className="gallery-holder">
          <CircularGallery
            items={galleryItems}
            bend={2}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={0.5}
            scrollEase={0.005}
          />
        </div>
        <div className="proj-links-row">
          <a href="https://github.com/a77chand/wildfire-risk-prediction" target="_blank" rel="noopener noreferrer">→ wildfire-risk-predictor</a>
          <a href="https://github.com/a77chand/ethicura-ai" target="_blank" rel="noopener noreferrer">→ ethicura-ai</a>
          <a href={sigcsePdf} target="_blank" rel="noopener noreferrer">→ SIGCSE 2025 paper</a>
          <a href="https://tend-daily-care.base44.app" target="_blank" rel="noopener noreferrer">→ tend-daily-care</a>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="about">
        <h2 className="code-head">ABOUT <span className="br">{'{'}</span></h2>
        <div className="about-grid">
          <Orb size={200} />
          <div className="about-text">
            <p>Hi, I'm <span className="hi">Anusha Chandra</span> — CS student at the <span className="hi">University of Waterloo</span>.</p>
            <p>I build things at the intersection of <span className="vi">software, finance, and ethics</span>. Research contributor at <span className="vi">SIGCSE 2025</span>, co-creator of <span className="vi">Ethicura AI</span> at NYAS, and builder of <span className="vi">Tend</span>, a wellness app for unpaid caregivers — passionate about responsible AI throughout.</p>
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
          </div>
          <div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="" /><span className="sk-name">React</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="" /><span className="sk-name">Node.js</span></div>
            <div className="sk-row"><img className="sk-logo sk-invert" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="" /><span className="sk-name">Flask</span></div>
            <div className="sk-row"><img className="sk-logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="" /><span className="sk-name">Git</span></div>
            <div className="sk-row"><img className="sk-logo sk-invert" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" alt="" /><span className="sk-name">Vercel</span></div>
          </div>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="interests">
        <h2 className="code-head">INTERESTS <span className="br">{'{'}</span></h2>
        <div className="int-strip">
          <div className="int-cell"><span className="int-name">FinTech</span></div>
          <div className="int-cell"><span className="int-name">ML / AI</span></div>
          <div className="int-cell"><span className="int-name">Game Dev</span></div>
          <div className="int-cell"><span className="int-name">Open Source</span></div>
        </div>
        <p className="code-close">{'}'}</p>
      </section>

      <section className="sec" id="contact">
        <h2 className="code-head">CONTACT <span className="br">{'{'}</span></h2>
        <DotMatrix text="LET'S CONNECT" height={110} />
        <p className="contact-line">Have a project in mind? My inbox is always open.</p>
        <ContactForm />
        <div className="c-side">
          <a className="c-row" href="https://github.com/a77chand" target="_blank" rel="noopener noreferrer"><span className="c-ic">⌥</span>github.com/a77chand</a>
          <a className="c-row" href="mailto:a77chand@uwaterloo.ca"><span className="c-ic">✉</span>a77chand@uwaterloo.ca</a>
          <a className="c-row" href="#"><span className="c-ic">in</span>linkedin.com/in/yourname</a>{/* TODO */}
        </div>
        <p className="code-close">{'}'}</p>
        <p className="closing">// thanks for visiting&nbsp;<span className="type-cursor vi">█</span></p>
      </section>
    </>
  );
}
