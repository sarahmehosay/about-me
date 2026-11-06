import Section from './Section'

// Live demos, embedded. Only projects whose site is up are passed in (see useLiveProjects).
export default function Projects({ projects }) {
  if (!projects?.length) return null
  return (
    <Section id="projects" eyebrow="Live demos" title="Projects">
      <div className="projects">
        {projects.map((p) => (
          <article key={p.url} className="card project">
            <div className="project-info">
              <h3>{p.name}</h3>
              <p className="card-text">{p.description}</p>
              <dl className="project-stack">
                {p.stack.map(([label, items]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      <ul className="chips small">
                        {items.map((i) => <li key={i}>{i}</li>)}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
              <a className="btn" href={p.url} target="_blank" rel="noreferrer">Open in new tab ↗</a>
            </div>
            <div className="project-frame">
              <iframe src={p.url} title={`${p.name} live demo`} loading="lazy" allow="fullscreen" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
