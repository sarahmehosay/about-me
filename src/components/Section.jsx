export default function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  )
}
