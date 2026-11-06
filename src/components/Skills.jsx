import { useState } from 'react'
import Icon from './Icons'
import Section from './Section'

export default function Skills({ featured, skills }) {
  const [showAll, setShowAll] = useState(false)
  return (
    <Section id="skills" eyebrow="Toolbox" title="Skills & technologies">
      <ul className="skill-tiles">
        {featured.map(([mark, name]) => (
          <li key={name}>
            <span className="mono">{mark}</span>
            {name}
          </li>
        ))}
        <li>
          <button type="button" className="tile-btn" aria-expanded={showAll} aria-controls="all-skills" onClick={() => setShowAll((v) => !v)}>
            <span className="mono"><Icon name={showAll ? 'close' : 'grid'} size={20} /></span>
            {showAll ? 'Hide list' : 'All skills'}
          </button>
        </li>
      </ul>
      <div id="all-skills" className="skill-grid all-skills" hidden={!showAll}>
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
