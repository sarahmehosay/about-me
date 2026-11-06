import { useState } from 'react'
import Icon from './Icons'
import { HeroIllustration } from './Illustrations'
import PublicationsDialog from './PublicationsDialog'

export default function Hero({ profile, highlights, hasProjects, publications }) {
  const [pubsOpen, setPubsOpen] = useState(false)
  const [first, ...rest] = profile.name.split(' ')
  return (
    <section id="home" className="hero" aria-labelledby="home-title">
      <div className="hero-text">
        <p className="hello">Hi, I&apos;m</p>
        <h1 id="home-title">
          {first} <span className="grad-text">{rest.join(' ')}</span>
        </h1>
        <p className="role">{profile.title}</p>
        <p className="tagline">{profile.tagline}</p>
        <div className="cta">
          <a className="btn primary" href={hasProjects ? '#projects' : '#experience'}>
            {hasProjects ? 'View my work' : 'See my experience'} <Icon name="arrowRight" size={18} />
          </a>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
      </div>
      <div className="hero-art">
        <HeroIllustration />
      </div>
      <dl className="stats">
        {highlights.map((h) => (
          <div key={h.label}>
            <dt>
              {h.label}
              {h.publications && publications && (
                <button type="button" className="stat-link" onClick={() => setPubsOpen(true)} aria-haspopup="dialog">
                  View publications <Icon name="arrowRight" size={14} />
                </button>
              )}
            </dt>
            <dd>{h.value}</dd>
          </div>
        ))}
      </dl>
      {publications && <PublicationsDialog publications={publications} open={pubsOpen} onClose={() => setPubsOpen(false)} />}
    </section>
  )
}
