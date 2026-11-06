import Icon from './Icons'
import { AboutIllustration } from './Illustrations'

export default function About({ summary, traits }) {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="about-art">
        <AboutIllustration />
      </div>
      <div>
        <p className="eyebrow">Who I am</p>
        <h2 id="about-title">About me</h2>
        <p className="about-text">{summary}</p>
        <ul className="traits">
          {traits.map((t) => (
            <li key={t.label}>
              <span className="icon-badge"><Icon name={t.icon} size={18} /></span>
              {t.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
