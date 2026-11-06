import { languages, notUsed, scripts, stack, techniques } from '../data/docs'
import Section from './Section'

export default function Docs() {
  return (
    <>
      <section className="hero docs-hero" aria-labelledby="docs-title">
        <p className="eyebrow">Documentation</p>
        <h1 id="docs-title">How this page is built</h1>
        <p className="summary">
          The frameworks, languages and tools behind this site, and how they fit together.
        </p>
        <a className="btn" href="#about">← Back to profile</a>
      </section>

      <Section id="languages" eyebrow="Languages" title="Languages">
        <div className="skill-grid">
          {languages.map((l) => (
            <div key={l.name} className="card">
              <h3>{l.name}</h3>
              <p className="card-text">{l.use}</p>
              <code className="path">{l.files}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section id="stack" eyebrow="Frameworks & tools" title="Frameworks & tools">
        <ul className="stack">
          {stack.map((s) => (
            <li key={s.name}>
              <div className="stack-head">
                <span className="stack-cat">{s.category}</span>
                <a href={s.url} target="_blank" rel="noreferrer">{s.name}</a>
                {s.version && <span className="version">v{s.version}</span>}
              </div>
              <p>{s.use}</p>
            </li>
          ))}
        </ul>
        <p className="note">{notUsed}</p>
      </Section>

      <Section id="techniques" eyebrow="Under the hood" title="Techniques">
        <dl className="techniques">
          {techniques.map(([term, desc]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="scripts" eyebrow="Run it" title="Scripts">
        <ul className="training">
          {scripts.map(([cmd, desc]) => (
            <li key={cmd}>
              <code className="cmd">{cmd}</code>
              <span className="provider">{desc}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
