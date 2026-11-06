import Section from './Section'

export default function Contact({ contact }) {
  const rows = [
    ['Email', contact.email, `mailto:${contact.email}`],
    ['Phone', contact.phone, contact.phone && `tel:${contact.phone.replace(/[^\d+]/g, '')}`],
    ['GitHub', contact.github?.replace('https://', ''), contact.github],
    ['LinkedIn', contact.linkedin?.replace(/^https:\/\/(www\.)?/, ''), contact.linkedin],
  ].filter(([, value]) => value)

  return (
    <Section id="contact" eyebrow="Say hello" title="Contact">
      <p className="lead">Open to full-stack, frontend and GIS development opportunities.</p>
      <ul className="contact">
        {rows.map(([label, value, href]) => (
          <li key={label}>
            <span>{label}</span>
            <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{value}</a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
