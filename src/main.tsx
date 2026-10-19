import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './github.css'
import './interactions.css'
import './accessibility.css'
import GoblinMode from './GoblinMode'

const resume = '/ayush-chaudhary-resume.pdf'
const githubUsername = 'claxey'
type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  fork: boolean
  archived: boolean
}

const skills = [
  ['Backend & APIs', 'Python', 'FastAPI', 'Django', 'Flask', 'Express.js', 'REST API design', 'Authentication'],
  ['Data & storage', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Query optimization', 'Relational design'],
  ['AI & data science', 'Claude', 'Codex', 'Context engineering', 'Ollama', 'Multi-agent systems', 'RAG', 'Model quantization', 'Pandas', 'NumPy', 'Scikit-learn'],
  ['Tools & reliability', 'Docker', 'CI/CD', 'Node.js', 'Electron', 'Request validation', 'AES-256-CBC', 'Session management'],
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [goblinMode, setGoblinMode] = React.useState(false)
  const [audioPlaying, setAudioPlaying] = React.useState(false)
  const [audioMessage, setAudioMessage] = React.useState('')
  const [reduceMotion, setReduceMotion] = React.useState(() => {
    const savedPreference = localStorage.getItem('portfolio-reduce-motion')
    return savedPreference === null ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : savedPreference === 'true'
  })
  const [goblinReduceMotion, setGoblinReduceMotion] = React.useState(() => localStorage.getItem('goblin-reduce-motion') === 'true')
  const [repos, setRepos] = React.useState<GithubRepo[]>([])
  const [reposLoading, setReposLoading] = React.useState(true)
  const [reposError, setReposError] = React.useState('')
  const progressRef = React.useRef<HTMLDivElement>(null)
  const goblinAudioRef = React.useRef<HTMLAudioElement>(null)
  const closeMenu = () => setMenuOpen(false)

  const enterGoblinMode = () => {
    setGoblinMode(true)
    setAudioMessage('')
    const playback = goblinAudioRef.current?.play()
    if (playback) {
      void playback.then(() => setAudioPlaying(true)).catch(() => {
        setAudioPlaying(false)
        setAudioMessage('Tap “Play music” to start the soundtrack.')
      })
    }
  }

  const exitGoblinMode = () => {
    const audio = goblinAudioRef.current
    audio?.pause()
    if (audio) audio.currentTime = 0
    setAudioPlaying(false)
    setAudioMessage('')
    setGoblinMode(false)
  }

  const toggleGoblinAudio = () => {
    const audio = goblinAudioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play().then(() => {
        setAudioPlaying(true)
        setAudioMessage('')
      }).catch(() => {
        setAudioPlaying(false)
        setAudioMessage('The browser blocked playback. Tap Play again to allow it.')
      })
    } else {
      audio.pause()
      setAudioPlaying(false)
      setAudioMessage('')
    }
  }

  React.useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', goblinMode ? goblinReduceMotion : reduceMotion)
    localStorage.setItem('portfolio-reduce-motion', String(reduceMotion))
    localStorage.setItem('goblin-reduce-motion', String(goblinReduceMotion))
  }, [reduceMotion, goblinMode, goblinReduceMotion])

  React.useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
        if (progressRef.current) progressRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
      })
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => {
      window.removeEventListener('scroll', updateProgress)
      cancelAnimationFrame(frame)
    }
  }, [])

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || reduceMotion || !('IntersectionObserver' in window)) return
    document.documentElement.classList.add('reveal-ready')
    const targets = document.querySelectorAll<HTMLElement>('.section, .contact-section, .experience-row, .project-card, .skill-group, .education-row, .repo-card')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' })
    targets.forEach(target => observer.observe(target))
    return () => observer.disconnect()
  }, [repos, reduceMotion])

  React.useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.github.com/users/${githubUsername}/repos?type=owner&sort=updated&per_page=100`, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      signal: controller.signal,
    })
      .then(async response => {
        if (!response.ok) throw new Error(response.status === 404 ? 'GitHub account not found.' : `GitHub returned ${response.status}.`)
        return response.json() as Promise<GithubRepo[]>
      })
      .then(data => setRepos(data.filter(repo => !repo.fork && !repo.archived).slice(0, 6)))
      .catch(error => {
        if (error.name !== 'AbortError') setReposError('Could not load repositories right now. You can browse all public repositories on GitHub.')
      })
      .finally(() => setReposLoading(false))
    return () => controller.abort()
  }, [])
  return <>
    <audio ref={goblinAudioRef} src="/goblin-mode.mp3" loop preload="none" />
{goblinMode ? <GoblinMode audioPlaying={audioPlaying} audioMessage={audioMessage} reduceMotion={goblinReduceMotion} onExit={exitGoblinMode} onToggleAudio={toggleGoblinAudio} onToggleMotion={() => setGoblinReduceMotion(value => !value)} /> : <>
    <div className="reading-progress" ref={progressRef} role="progressbar" aria-label="Page reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} />
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="topbar"><a className="brand" href="#home" aria-label="Ayush Chaudhary home">AC<span>.</span></a>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '×' : '☰'}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
        {[['About', '#about'], ['Experience', '#experience'], ['Projects', '#projects'], ['Skills', '#skills']].map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}</a>)}
        <button className="motion-toggle" type="button" aria-pressed={reduceMotion} onClick={() => setReduceMotion(value => !value)}>Reduce motion: {reduceMotion ? 'On' : 'Off'}</button>
        <a className="nav-contact" href="mailto:ayush8dchaudhary@gmail.com" onClick={closeMenu}>Let’s talk <Arrow diagonal /></a>
      </nav>
    </header>

    <main id="main-content" tabIndex={-1}>
      <section className="hero wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> AVAILABLE FOR DEVELOPMENT ROLES <span className="eyebrow-location">· HYDERABAD, INDIA</span></div>
          <h1>Building the<br /><span className="accent">systems</span> behind<br />the product.</h1>
          <p className="hero-intro">I’m Ayush, a backend developer focused on reliable APIs, data systems, and practical AI infrastructure.</p>
          <div className="hero-actions"><a className="button primary" href="mailto:ayush8dchaudhary@gmail.com">Get in touch <Arrow diagonal /></a><a className="button secondary" href={resume} target="_blank" rel="noreferrer">View résumé <Arrow diagonal /></a><button className="button goblin-button" type="button" onClick={enterGoblinMode}>🧌 Goblin mode</button></div>
          <div className="social-links"><a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /></a><span>·</span><a href="https://www.linkedin.com/in/ayush-chaudhary-834136289/" target="_blank" rel="noreferrer">LINKEDIN <Arrow diagonal /></a><span>·</span><a href="mailto:ayush8dchaudhary@gmail.com">EMAIL <Arrow diagonal /></a></div>
        </div>
        <div className="hero-art" aria-label="Decorative backend systems illustration">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
          <div className="core"><span className="core-bracket">{'{ }'}</span><span>API</span></div>
          <div className="node node-db"><span className="node-icon">◉</span><span>POSTGRES</span></div>
          <div className="node node-cache"><span className="node-icon">▦</span><span>REDIS</span></div>
          <div className="node node-ai"><span className="node-icon">✳</span><span>LLM / RAG</span></div>
          <div className="art-caption">SYSTEMS THAT<br />SCALE WITH INTENT <span>01 — 03</span></div>
          <div className="art-grid" />
        </div>
        <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section className="section about wrap" id="about">
        <div className="section-label"><span>01</span> / ABOUT</div>
        <div className="about-content"><h2>Thoughtful engineering.<br /><span className="muted">Useful outcomes.</span></h2><div className="about-text"><p>Backend developer with hands-on experience across Python, FastAPI, Django, Flask, PostgreSQL, Redis, and Docker. I build REST APIs, improve slow queries through indexing and caching, and ship containerized projects with CI/CD.</p><p>I’ve also built multi-agent and RAG systems with Ollama, and led research on digital payments and consumer spending in India. I’m looking to build features and APIs with a product-minded engineering team.</p><a className="text-link" href={resume} download>Download résumé <Arrow /></a></div></div>
      </section>

      <section className="section wrap" id="experience">
        <div className="section-label"><span>02</span> / EXPERIENCE</div>
        <div className="section-heading"><h2>Where I’ve<br /><span className="muted">made an impact.</span></h2><span className="heading-note">LEARNING BY BUILDING<br />2024 — 2025</span></div>
        <div className="timeline">
          <article className="experience-row"><div className="time">MAY 2025 — JUL 2025</div><div className="role"><h3>Data Engineering & ML Infrastructure Intern</h3><div className="company">Labmentix <span>· Internship</span></div><ul><li>Automated categorical encoding, normalization, and scaling with Python, Pandas, and NumPy to remove manual dataset preparation.</li><li>Added validation for schema mismatches, data types, and missing values ahead of model training.</li><li>Set up monitoring to flag data inconsistencies, redundant features, and drift.</li></ul><div className="tags"><span>Python</span><span>Pandas</span><span>NumPy</span><span>Data quality</span></div></div></article>
          <article className="experience-row"><div className="time">MAY 2024 — AUG 2024</div><div className="role"><h3>Machine Learning Intern · Backend & Data Systems</h3><div className="company">CodeBeat Placement <span>· Internship</span></div><ul><li>Built and deployed a Flask REST API for live model predictions, with request validation, error handling, and connection pooling; it powered a Streamlit dashboard.</li><li>Optimized PostgreSQL queries by removing N+1 patterns and adding indexes, then introduced Redis caching for data pipelines.</li><li>Reduced dashboard load time by caching query results and limiting data sent to the frontend.</li></ul><div className="tags"><span>Flask</span><span>PostgreSQL</span><span>Redis</span><span>Streamlit</span></div></div></article>
          <article className="experience-row"><div className="time">RESEARCH</div><div className="role"><h3>Research Intern · Team Lead</h3><div className="company">IISPR <span>· 8-member team</span></div><ul><li>Led an 8-member team studying digital payments and consumer spending in India for “From Cash to UPI: Reconfiguring Consumer Spending Behaviour in India, 2016–2025.”</li><li>Analyzed NPCI and RBI UPI data across FY2016–17 to FY2024–25, including average transaction size, year-on-year growth, and P2P/P2M split.</li></ul><div className="tags"><span>Research</span><span>NPCI & RBI data</span><span>Team leadership</span></div></div></article>
        </div>
      </section>

      <section className="section projects-section" id="projects"><div className="wrap"><div className="section-label"><span>03</span> / SELECTED PROJECTS</div><div className="section-heading"><h2>Built to solve<br /><span className="muted">real problems.</span></h2><span className="heading-note">A FEW THINGS<br />I’VE WORKED ON</span></div>
        <div className="project-grid">
          <article className="project-card project-dark"><div className="project-top"><span>01 / AI SYSTEMS</span><span className="project-mark">↗</span></div><div className="project-visual localops"><div className="localops-orbit"><span className="agent a1">ROUTER</span><span className="agent a2">RAG</span><span className="agent a3">MODEL</span><span className="agent-core">LO</span><i className="orbit-line"/></div><div className="visual-caption">LOCAL INFERENCE · ASYNC PIPELINE</div></div><h3>LocalOPS</h3><p className="project-subtitle">Multi-agent AI inference system</p><p className="project-desc">A FastAPI service coordinating concurrent requests with Redis-backed state, async batching, streaming, and RAG memory. Profiled and tuned for a GTX 1650 with 4GB VRAM.</p><div className="tags"><span>FastAPI</span><span>Ollama</span><span>Redis</span><span>Docker</span></div></article>
          <article className="project-card project-light"><div className="project-top"><span>02 / DEVELOPER TOOLS</span><span className="project-mark">↗</span></div><div className="project-visual compiler"><div className="terminal"><div className="terminal-bar"><i/><i/><i/><span>contest-runner</span></div><div className="terminal-code"><span className="code-muted">01</span> <b>compile</b>(<em>submission</em>)<br/><span className="code-muted">02</span> {'{'}<br/><span className="code-muted">03</span> &nbsp;run_test_cases()<br/><span className="code-muted">04</span> &nbsp;return <strong>feedback</strong><br/><span className="code-muted">05</span> {'}'}</div></div><div className="visual-caption">OFFLINE FIRST · SANDBOXED RUNS</div></div><h3>Proctorium</h3><p className="project-subtitle">Offline compiler & secure contest platform</p><p className="project-desc">Led a team of four building an Electron desktop app to compile C++, Java, and Python offline. The Docker version and LAN contest platform were used in two college hackathons.</p><div className="tags"><span>Electron</span><span>Node.js</span><span>Docker</span><span>AES-256-CBC</span></div></article>
        </div>
        <div className="github-heading"><div><span className="github-kicker">LIVE FROM GITHUB</span><h3>More in the workshop.</h3></div><a className="text-link" href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer">All repositories <Arrow diagonal /></a></div>
        {reposLoading ? <p className="github-status" role="status">Loading public repositories…</p> : reposError ? <div className="github-status github-error" role="status"><span>{reposError}</span><a href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer">Browse GitHub <Arrow diagonal /></a></div> : repos.length === 0 ? <div className="github-status">No public repositories to show yet. <a href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer">Visit GitHub <Arrow diagonal /></a></div> : <div className="repo-grid">{repos.map(repo => <article className="repo-card" key={repo.id}><div className="repo-card-top"><span className="repo-icon">⌘</span><span className="repo-updated">UPDATED {new Date(repo.updated_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase()}</span></div><h4><a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}<Arrow diagonal /></a></h4><p>{repo.description || 'A public repository by Ayush Chaudhary.'}</p><div className="repo-meta">{repo.language && <span><i className="language-dot" />{repo.language}</span>}<span>★ {repo.stargazers_count}</span><span>⑂ {repo.forks_count}</span></div></article>)}</div>}
      </div></section>

      <section className="section wrap" id="skills"><div className="section-label"><span>04</span> / TOOLKIT</div><div className="section-heading"><h2>Tools for the<br /><span className="muted">job at hand.</span></h2><span className="heading-note">PRACTICAL SKILLS<br />BUILT THROUGH WORK</span></div><div className="skill-grid">{skills.map(([title, ...items]) => <div className="skill-group" key={title}><h3>{title}</h3><div className="skill-list">{items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div></section>

      <section className="section education wrap"><div className="section-label"><span>05</span> / EDUCATION</div><div className="education-row"><div><h2>GITAM Deemed University</h2><p>B.Tech in Computer Science</p></div><div className="education-year">2022 — 2026</div></div></section>

      <section className="contact-section" id="contact"><div className="wrap contact-inner"><div className="section-label"><span>06</span> / CONTACT</div><div className="contact-main"><div><h2>Let’s build<br /><span>something useful.</span></h2><p>Open to backend engineering opportunities and thoughtful conversations about systems.</p></div><a className="contact-arrow" href="mailto:ayush8dchaudhary@gmail.com" aria-label="Email Ayush">↗</a></div><div className="contact-bottom"><a href="mailto:ayush8dchaudhary@gmail.com">AYUSH8DCHAUDHARY@GMAIL.COM <Arrow diagonal /></a><a href="tel:+916901271679">+91 69012 71679</a><div className="contact-social"><a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /></a><a href="https://www.linkedin.com/in/ayush-chaudhary-834136289/" target="_blank" rel="noreferrer">LINKEDIN <Arrow diagonal /></a></div></div></div></section>
    </main>
    <footer className="footer wrap"><a className="brand" href="#home">AC<span>.</span></a><span>DESIGNED & BUILT WITH CARE · 2026</span><a href="#home">BACK TO TOP ↑</a></footer>
    </>}
  </>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
