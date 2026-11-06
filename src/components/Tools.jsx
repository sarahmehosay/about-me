import Section from './Section'

export default function Tools({ tools }) {
  return (
    <Section id="tools" eyebrow="Workflow" title="Tools I use">
      <div className="tools-grid">
        {tools.map((t) => (
          <div key={t.group} className="card">
            <h3>{t.group}</h3>
            <ul className="tool-list">
              {t.items.map(([name, use]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
