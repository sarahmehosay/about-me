import Icon from './Icons'
import Section from './Section'

export default function Process({ steps }) {
  return (
    <Section id="process" eyebrow="Workflow" title="How I work">
      <ol className="process">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="step-icon"><Icon name={s.icon} size={22} /></span>
            <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
