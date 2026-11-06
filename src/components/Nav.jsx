import { useEffect, useRef, useState } from 'react'
import useTheme from '../hooks/useTheme'
import Icon from './Icons'

// Menu links.
const LINKS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['tools', 'Tools'],
  ['projects', 'Work'],
  ['experience', 'Experience'],
  ['education', 'Education'],
]
// Every section in page order, with the menu item it highlights.
const SECTIONS = [
  ['home', 'home'],
  ['about', 'about'],
  ['skills', 'skills'],
  ['tools', 'tools'],
  ['projects', 'projects'],
  ['experience', 'experience'],
  ['process', 'experience'],
  ['education', 'education'],
  ['contact', 'contact'],
]

export default function Nav({ name, page, docsHref, hide = [] }) {
  const [active, setActive] = useState('home')
  const navRef = useRef(null)
  const [theme, toggleTheme] = useTheme()

  // On the profile page, highlight the section being looked at:
  // - with a mouse over the page, the section under the cursor (so when two sections
  //   are on screen, the one you point at wins);
  // - otherwise (touch screens, cursor on the menu bar or outside the window), the section
  //   at the middle of the screen, or the last section once the page is scrolled to the bottom.
  useEffect(() => {
    if (page !== 'home') return
    const cursor = { y: null } // last mouse position (viewport y), null when not over the page
    const raf = { id: 0 } // pending animation frame, so updates run at most once per frame

    const update = () => {
      raf.id = 0
      const headerBottom = navRef.current?.closest('.nav')?.getBoundingClientRect().bottom ?? 0
      const useCursor = cursor.y !== null && cursor.y > headerBottom
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (!useCursor && atBottom) return setActive('contact')
      const y = useCursor ? cursor.y : window.innerHeight * 0.45
      // The last section whose top is above the line; covers gaps between sections and the footer.
      let found = SECTIONS[0][1]
      for (const [id, nav] of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= y) found = nav
      }
      setActive(found)
    }
    const schedule = () => { if (!raf.id) raf.id = requestAnimationFrame(update) }
    const onPointerMove = (e) => {
      if (e.pointerType !== 'mouse') return
      cursor.y = e.clientY
      schedule()
    }
    const onLeave = () => { cursor.y = null; schedule() }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf.id)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [page])

  // When the menu is wider than the screen (phones), scroll it sideways to keep the highlighted link visible.
  const current = page === 'docs' ? 'docs' : active
  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector('.active')
    if (!link || nav.scrollWidth <= nav.clientWidth) return
    const left = link.offsetLeft - nav.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2
    nav.scrollTo({ left, behavior: 'smooth' })
  }, [current])

  const initials = name.split(' ').map((w) => w[0]).join('')

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#home" className="brand" aria-label={`${name} – back to top`}>{initials}</a>
        <nav ref={navRef} aria-label="Sections">
          {LINKS.filter(([id]) => !hide.includes(id)).map(([id, label]) => (
            <a key={id} href={`#${id}`} className={current === id ? 'active' : undefined}>{label}</a>
          ))}
          <a href={docsHref} className={current === 'docs' ? 'active' : undefined} aria-current={current === 'docs' ? 'page' : undefined}>Docs</a>
        </nav>
        <button type="button" className="theme-toggle" onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
        <a href="#contact" className={`btn primary small talk${current === 'contact' ? ' active' : ''}`}>Let&apos;s talk</a>
      </div>
    </header>
  )
}
