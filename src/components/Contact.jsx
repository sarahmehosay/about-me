import { languages, stack } from '../data/docs'
import Icon from './Icons'

const YEAR = new Date().getFullYear()

// Closing band: call to action, contact links, a short "built with" note, and the footer.
export default function Contact({ contact, name, docsHref }) {
  const links = [
    ['mail', 'Email', contact.email, `mailto:${contact.email}`],
    ['linkedin', 'LinkedIn', contact.linkedin?.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''), contact.linkedin],
    ['github', 'GitHub', contact.github?.replace('https://', ''), contact.github],
  ].filter(([, , value]) => value)
  const ext = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})
  const tech = [...languages.map((l) => l.name.replace(/ \(.*\)/, '')), ...stack.filter((s) => /^\d/.test(s.version ?? '')).map((s) => `${s.name} ${s.version}`)]

  return (
    <section id="contact" className="contact-band" aria-labelledby="contact-title">
      <div className="contact-inner">
        <div>
          <p className="eyebrow">Say hello</p>
          <h2 id="contact-title">Have a project in mind? <span className="grad-text">Let&apos;s talk.</span></h2>
          <p className="lead">Open to full-stack, frontend and GIS development opportunities.</p>
        </div>
        <ul className="contact-list">
          {links.map(([icon, label, value, href]) => (
            <li key={label}>
              <a href={href} {...ext(href)}>
                <span className="icon-badge"><Icon name={icon} size={18} /></span>
                <span><small>{label}</small>{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div id="built-with" className="built-with">
        <span>This site is built with</span>
        <ul className="chips small">{tech.map((t) => <li key={t}>{t}</li>)}</ul>
        <a href={docsHref}>How this page is built <Icon name="arrowRight" size={15} /></a>
      </div>
      <footer>© {YEAR} {name}</footer>
    </section>
  )
}
