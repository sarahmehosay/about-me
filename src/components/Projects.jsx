import { useEffect, useRef, useState } from 'react'
import Icon from './Icons'
import Section from './Section'

const FRAME_W = 1280 // the demo is rendered at desktop width, then scaled down into the card

// Non-interactive, scaled-down live preview of a demo.
function Preview({ project }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.3)
  useEffect(() => {
    const el = box.current
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / FRAME_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="preview" ref={box}>
      <iframe src={project.url} title={`${project.name} preview`} loading="lazy" tabIndex={-1} aria-hidden="true"
        style={{ width: FRAME_W, height: FRAME_W * 0.625, transform: `scale(${scale})` }} />
    </div>
  )
}

// Only projects whose site is up are passed in (see useLiveProjects).
export default function Projects({ projects }) {
  const dialog = useRef(null)
  const [open, setOpen] = useState(null)

  useEffect(() => { if (open) dialog.current?.showModal() }, [open])

  if (!projects?.length) return null
  return (
    <Section id="projects" eyebrow="Live demos" title="Selected work">
      <div className="work-grid">
        {projects.map((p) => (
          <article key={p.url} className="work-card">
            <Preview project={p} />
            <div className="work-body">
              <h3>
                {p.name}
                <a href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.name} in a new tab`}><Icon name="external" size={17} /></a>
              </h3>
              <p className="card-text">{p.description}</p>
              <dl className="project-stack">
                {p.stack.map(([label, items]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{items.join(' · ')}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" className="btn primary small" onClick={() => setOpen(p)}>
                <Icon name="play" size={15} /> Try it here
              </button>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dialog} className="demo-dialog" onClose={() => setOpen(null)} aria-label={open ? `${open.name} live demo` : undefined}>
        {open && (
          <>
            <div className="demo-bar">
              <strong>{open.name}</strong>
              <a href={open.url} target="_blank" rel="noreferrer">Open<span className="long"> in new tab</span> <Icon name="external" size={15} /></a>
              <button type="button" className="icon-btn" onClick={() => dialog.current.close()} aria-label="Close demo"><Icon name="close" /></button>
            </div>
            <iframe src={open.url} title={`${open.name} live demo`} allow="fullscreen" />
          </>
        )}
      </dialog>
    </Section>
  )
}
