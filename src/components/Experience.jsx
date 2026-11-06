import Icon from './Icons'
import Rich from './Rich'
import Section from './Section'

export default function Experience({ experience, publications = [] }) {
  return (
    <Section id="experience" eyebrow="Career" title="Experience">
      <ol className="xp">
        {experience.map((job) => {
          const pub = publications.find((p) => p.title === job.publication)
          return (
          <li key={job.company}>
            <span className="xp-icon"><Icon name={job.icon} size={22} /></span>
            <p className="xp-period">{job.period}</p>
            <h3>{job.role}</h3>
            <p className="xp-company">{job.company}</p>
            <p className="xp-location">{job.location}</p>
            <p className="xp-summary">{job.summary}</p>
            <details>
              <summary>Highlights <Icon name="chevronDown" size={16} /></summary>
              <ul className="points">
                {job.points.map((pt) => <li key={pt}><Rich text={pt} /></li>)}
              </ul>
              {pub && (
                <p className="xp-pub">
                  <span>Publication · {pub.year}</span>
                  <strong>{pub.title}</strong>
                  {pub.authors[0]} et al. · {pub.venue}, {pub.detail}
                </p>
              )}
              <ul className="chips small">
                {job.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </details>
          </li>
          )
        })}
      </ol>
    </Section>
  )
}
