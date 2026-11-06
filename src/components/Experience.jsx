import Rich from './Rich'
import Section from './Section'

export default function Experience({ experience }) {
  return (
    <Section id="experience" eyebrow="Career" title="Professional experience">
      <ol className="timeline">
        {experience.map((job) => (
          <li key={job.company} className="job">
            <div className="job-head">
              <div>
                <h3>{job.role}</h3>
                <p className="company">{job.company}</p>
              </div>
              <p className="meta">
                <span>{job.period}</span>
                <span>{job.location}</span>
              </p>
            </div>
            <ul className="points">
              {job.points.map((p) => <li key={p}><Rich text={p} /></li>)}
            </ul>
            <ul className="chips small">
              {job.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  )
}
