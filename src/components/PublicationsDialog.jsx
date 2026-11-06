import { useEffect, useRef } from 'react'
import Icon from './Icons'

const isJa = (text) => /[\u0080-￿]/.test(text)

function Publication({ pub }) {
  const first = pub.authors[0] === pub.me
  return (
    <article className="pub">
      <p className="pub-type">
        {pub.type} · {pub.year}
        {first && <span className="pub-tag">First author</span>}
      </p>
      <h3>{pub.title}</h3>
      {pub.titleJa && <p className="pub-ja" lang="ja">{pub.titleJa}</p>}
      <p className="pub-authors">
        {pub.authors.map((a, i) => (
          <span key={a}>
            {a === pub.me ? <strong className="me">{a}</strong> : a}
            {i < pub.authors.length - 1 && '; '}
          </span>
        ))}
      </p>
      <p className="pub-venue">
        <i>{pub.venue}</i>
        {pub.venueJa && <> (<span lang="ja">{pub.venueJa}</span>)</>}
        <br />
        <span>{pub.detail}</span>
      </p>
      {pub.role && <p className="pub-role">{pub.role}</p>}
      {pub.keywords && (
        <ul className="chips small" aria-label="Keywords">
          {pub.keywords.map((k) => <li key={k}>{k}</li>)}
        </ul>
      )}
      {pub.links.length > 0 && (
        <div className="pub-links">
          {pub.links.map(([label, href, primary]) => (
            <a key={href} className={primary ? 'btn primary small' : 'btn small'} href={href} target="_blank" rel="noreferrer">
              {label} <Icon name="external" size={14} />
            </a>
          ))}
        </div>
      )}
      <p className="pub-note" lang={isJa(pub.note) ? 'ja' : undefined}>{pub.note}</p>
    </article>
  )
}

// Pop-up listing the research publications. Newest first, as given in the data file.
export default function PublicationsDialog({ publications, open, onClose }) {
  const dialog = useRef(null)

  useEffect(() => {
    const d = dialog.current
    if (open && d && !d.open) d.showModal()
  }, [open])

  return (
    <dialog
      ref={dialog}
      className="paper-dialog"
      aria-labelledby="pubs-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) dialog.current.close() }}
    >
      <div className="paper-head">
        <div>
          <p className="eyebrow">Research</p>
          <h2 id="pubs-title">Publications</h2>
        </div>
        <button type="button" className="icon-btn" onClick={() => dialog.current.close()} aria-label="Close"><Icon name="close" /></button>
      </div>
      <div className="paper-body">
        {publications.map((p) => <Publication key={p.title} pub={p} />)}
      </div>
    </dialog>
  )
}
