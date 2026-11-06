import Section from './Section'

export default function Skills({ skills }) {
  return (
    <Section id="skills" eyebrow="Toolbox" title="Technical skills">
      <div className="skill-grid">
        {skills.map((s) => (
          <div key={s.group} className="card">
            <h3>{s.group}</h3>
            <ul className="chips">
              {s.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
