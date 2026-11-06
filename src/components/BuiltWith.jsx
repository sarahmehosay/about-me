import { languages, stack } from '../data/docs'
import Section from './Section'

// Short summary of the tech stack on the profile page; full details live on #/docs.
export default function BuiltWith({ docsHref }) {
  return (
    <Section id="built-with" eyebrow="This site" title="Built with">
      <div className="skill-grid">
        <div className="card">
          <h3>Languages</h3>
          <ul className="chips">
            {languages.map((l) => <li key={l.name}>{l.name}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Frameworks & tools</h3>
          <ul className="chips">
            {stack.map((s) => (
              <li key={s.name}>{s.name}{s.version && /^\d/.test(s.version) ? ` ${s.version}` : ''}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="note">
        A static single-page site: React components styled with plain CSS, bundled by Vite, with no backend.{' '}
        <a href={docsHref}>Read how this page is built →</a>
      </p>
    </Section>
  )
}
