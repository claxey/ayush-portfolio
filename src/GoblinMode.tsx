import React from 'react'
import './goblin.css'

type GoblinModeProps = {
  audioPlaying: boolean
  audioMessage: string
  reduceMotion: boolean
  onExit: () => void
  onToggleAudio: () => void
  onToggleMotion: () => void
}

export default function GoblinMode({ audioPlaying, audioMessage, reduceMotion, onExit, onToggleAudio, onToggleMotion }: GoblinModeProps) {
  const [notificationOpen, setNotificationOpen] = React.useState(true)
  return <div className={`goblin-view${audioPlaying ? ' audio-live' : ''}`}>
    {!reduceMotion && <video className="goblin-video-bg" autoPlay loop muted playsInline preload="none" aria-hidden="true" tabIndex={-1}><source src="/goblin-background.mp4" type="video/mp4" /></video>}
    {notificationOpen && <aside className="goblin-toast" role="status" aria-live="polite"><div><span>NEW NOTIFICATION</span><p>market soo cooked hitting founders with adhd with this one</p></div><button type="button" aria-label="Dismiss notification" onClick={() => setNotificationOpen(false)}>×</button></aside>}
    <header className="goblin-topbar">
      <a className="goblin-brand" href="#goblin-home">AYUSH<span>.EXE</span></a>
      <div className="goblin-controls">
        <button type="button" className="goblin-control" onClick={onToggleAudio} aria-pressed={audioPlaying}>{audioPlaying ? 'Ⅱ Pause music' : '▶ Play music'}</button>
        <button type="button" className="goblin-control goblin-motion" onClick={onToggleMotion} aria-pressed={reduceMotion}>Motion: {reduceMotion ? 'chill' : 'chaotic'}</button>
        <button type="button" className="goblin-exit" onClick={onExit}>Return to calm mode <span aria-hidden="true">↗</span></button>
      </div>
    </header>

    <main className="goblin-main" id="goblin-home">
      <section className="goblin-hero">
        <div className="goblin-hero-copy">
          <p className="goblin-eyebrow"><span className="goblin-live-dot" /> GOBLIN EDITION · VOL. 01</p>
          <h1>BACKEND<br />BUT MAKE IT <span>FERAL.</span></h1>
          <p className="goblin-intro">APIs, data systems, and AI builds. Same real skills, now wearing tiny goblin shoes.</p>
          <div className="goblin-hero-actions"><a href="#goblin-skills">See the skill tree <span aria-hidden="true">↓</span></a><a href="#goblin-projects">Jump to projects <span aria-hidden="true">↘</span></a></div>
        </div>
        <div className="goblin-sticker goblin-sticker-main" aria-label="I made this for you">i made thiss<br />for yo bored ahh</div>
        <div className="goblin-sticker goblin-sticker-small">100% LOCALLY SOURCED GOBLIN ENERGY</div>
        <span className="goblin-rose rose-float rose-one" aria-hidden="true"><span>🌹</span><i>☹</i></span><span className="goblin-rose rose-float rose-two" aria-hidden="true"><span>🌹</span><i>☹</i></span>
        <div className="goblin-hero-art" aria-hidden="true"><span className="goblin-orbit g-orbit-one"/><span className="goblin-orbit g-orbit-two"/><span className="goblin-core">{'{ }'}<small>AYUSH.EXE</small></span><span className="goblin-art-label">RUNNING ON<br />QUESTIONABLE VIBES</span></div>
      </section>

      <div className="goblin-ticker" aria-label="I made this for you bored ahh"><div className="goblin-ticker-track"><span>i made thiss for yo bored ahh ✳</span><span>i made thiss for yo bored ahh ✳</span><span>i made thiss for yo bored ahh ✳</span><span>i made thiss for yo bored ahh ✳</span></div></div>

      <section className="goblin-section" id="goblin-skills">
        <div className="goblin-section-head"><p className="goblin-eyebrow">01 / THE TOOLKIT</p><h2>Original skills.<br /><span>Goblin packaging.</span></h2><p className="goblin-section-deck">Same tools as the calm portfolio. Now with bonus flowers that look mildly disappointed.</p></div>
        <div className="goblin-code-grid goblin-skills-grid">
          <article className="goblin-code-card"><span className="goblin-file">01 · MAKE THE API DO THINGS</span><span className="goblin-card-emoji">🐍</span><span className="goblin-rose card-rose" aria-hidden="true"><span>🌹</span><i>☹</i></span><h3>Backend & APIs</h3><div className="goblin-pills"><span>Python</span><span>FastAPI</span><span>Django</span><span>Flask</span><span>Express.js</span><span>REST API design</span><span>Authentication</span></div><span className="goblin-caption">requests enter. useful responses leave.</span></article>
          <article className="goblin-code-card"><span className="goblin-file">02 · THE DATA HOARD</span><span className="goblin-card-emoji">🗄️</span><span className="goblin-rose card-rose" aria-hidden="true"><span>🌹</span><i>☹</i></span><h3>Data & storage</h3><div className="goblin-pills"><span>PostgreSQL</span><span>MySQL</span><span>SQLite</span><span>Redis</span><span>Query optimization</span><span>Relational design</span></div><span className="goblin-caption">indexes so you can go home on time</span></article>
          <article className="goblin-code-card"><span className="goblin-file">03 · ROBOTS, BUT POLITE</span><span className="goblin-card-emoji">🤖</span><span className="goblin-rose card-rose" aria-hidden="true"><span>🌹</span><i>☹</i></span><h3>AI & data science</h3><div className="goblin-pills"><span>Claude</span><span>Codex</span><span>Context engineering</span><span>Ollama</span><span>Multi-agent systems</span><span>RAG</span><span>Model quantization</span><span>Pandas</span><span>NumPy</span><span>Scikit-learn</span></div><span className="goblin-caption">the prompt has entered its engineering era</span></article>
          <article className="goblin-code-card"><span className="goblin-file">04 · SHIP IT, THEN SLEEP</span><span className="goblin-card-emoji">🚢</span><span className="goblin-rose card-rose" aria-hidden="true"><span>🌹</span><i>☹</i></span><h3>Tools & reliability</h3><div className="goblin-pills"><span>Docker</span><span>CI/CD</span><span>Node.js</span><span>Electron</span><span>Request validation</span><span>AES-256-CBC</span><span>Session management</span></div><span className="goblin-caption">works on my container, respectfully</span></article>
        </div>
      </section>

      <section className="goblin-projects" id="goblin-projects">
        <div className="goblin-section-head"><p className="goblin-eyebrow">02 / SIDE QUESTS THAT SHIPPED</p><h2>Actual projects.<br /><span>Unreal vibes.</span></h2></div>
        <div className="goblin-project-grid">
          <article className="goblin-project-card"><div className="goblin-project-top"><span>BOSS FIGHT 01</span><span>LOCAL INFERENCE</span></div><h3>LocalOPS</h3><p className="goblin-project-tagline">works on my machine final boss</p><p>A FastAPI multi-agent setup with Ollama, Redis state, async batching, streaming, and RAG memory. Profiled on a GTX 1650 with 4GB VRAM. The GPU did its best.</p><div className="goblin-pills"><span>FastAPI</span><span>Ollama</span><span>Redis</span><span>Docker</span></div></article>
          <article className="goblin-project-card goblin-project-alt"><div className="goblin-project-top"><span>BOSS FIGHT 02</span><span>OFFLINE MODE</span></div><h3>Proctorium</h3><p className="goblin-project-tagline">“the Wi-Fi is not invited” arc</p><p>Electron and Node.js app to compile C++, Java, and Python offline, plus a LAN contest platform. The Docker version was used in two college hackathons.</p><div className="goblin-pills"><span>Electron</span><span>Node.js</span><span>Docker</span><span>AES-256-CBC</span></div></article>
        </div>
      </section>

      <section className="goblin-stack goblin-contact"><p className="goblin-eyebrow">03 / OKAY BYE, LOVE YOU</p><h2>Need the resume?<br /><span>Need to say hi?</span></h2><div className="goblin-contact-links"><a href="/ayush-chaudhary-resume.pdf" target="_blank" rel="noreferrer">Open resume ↗</a><a href="mailto:ayush8dchaudhary@gmail.com">Email Ayush ↗</a><a href="https://github.com/claxey" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/ayush-chaudhary-834136289/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><div className="goblin-equalizer" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--bar': `${18 + (index * 17 % 58)}px` } as React.CSSProperties} />)}</div><p className="goblin-audio-note" aria-live="polite">{audioMessage || (audioPlaying ? 'THE SOUNDTRACK IS PLAYING · LOOP ENABLED' : 'SOUND IS PAUSED · YOUR EARS ARE SAFE')}</p><span className="goblin-rose rose-float rose-three" aria-hidden="true"><span>🌹</span><i>☹</i></span></section>
    </main>

    <footer className="goblin-footer"><span>GITAM · COMPUTER SCIENCE · 2022—2026</span><button type="button" onClick={onExit}>Return to the calm portfolio ↑</button></footer>
  </div>
}
