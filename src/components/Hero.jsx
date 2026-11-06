export default function Hero({ profile, highlights }) {
  const { name, title, summary, contact } = profile
  return (
    <section id="about" className="hero" aria-labelledby="about-title">
      <p className="eyebrow">About me</p>
      <h1 id="about-title">{name}</h1>
      <p className="role">{title}</p>
      <p className="summary">{summary}</p>
      <div className="cta">
        <a className="btn primary" href={`mailto:${contact.email}`}>Get in touch</a>
        {contact.github && <a className="btn" href={contact.github} target="_blank" rel="noreferrer">GitHub</a>}
        {contact.linkedin && <a className="btn" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
      </div>
      <dl className="stats">
        {highlights.map((h) => (
          <div key={h.label}>
            <dt>{h.label}</dt>
            <dd>{h.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
