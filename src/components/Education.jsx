import Section from './Section'

export default function Education({ education, training }) {
  return (
    <Section id="education" eyebrow="Learning" title="Education & training">
      {education.map((e) => (
        <div key={e.school} className="card edu">
          <div>
            <h3>{e.degree}</h3>
            <p className="company">{e.school}</p>
          </div>
          <p className="meta"><span>{e.date}</span></p>
        </div>
      ))}
      <h3 className="sub">Professional training</h3>
      <ul className="training">
        {training.map((t) => (
          <li key={t.course}>
            <div>
              {t.url ? <a href={t.url} target="_blank" rel="noreferrer">{t.course}</a> : <span className="course">{t.course}</span>}
              <span className="provider">{t.provider}</span>
            </div>
            <time>{t.date}</time>
          </li>
        ))}
      </ul>
    </Section>
  )
}
