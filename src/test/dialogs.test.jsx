import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import PublicationsDialog from '../components/PublicationsDialog'

const dialogEl = (container) => container.querySelector('dialog')

// ---------------------------------------------------------------------------------------------
const pubs = [
  { type: 'Journal article', title: 'Paper One', titleJa: '論文その一', authors: ['Yaginuma, H.', 'Osay, S. M.'], me: 'Osay, S. M.', year: 2025,
    venue: 'Journal of Things', venueJa: '物事論文集', detail: '6(3), 559–572', keywords: ['Point Cloud', 'CSF'], role: 'I did the labelling.',
    links: [['Read it', 'https://example.test/read', true], ['Open PDF', 'https://example.test/pdf', false]], note: 'Peer-reviewed.' },
  { type: 'Conference paper', title: 'Paper Two', authors: ['Osay, S. M.', 'De Leon, R. K. L.', 'Acosta, J. E.'], me: 'Osay, S. M.', year: 2017,
    venue: 'LiDAR Conference', detail: 'Cebu City · January 2017', links: [], note: '会議録に掲載。' },
]

describe('PublicationsDialog', () => {
  it('stays closed until asked to open', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open={false} onClose={() => {}} />)
    expect(dialogEl(container).open).toBe(false)
  })

  it('opens as a modal when open becomes true', () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const { container, rerender } = render(<PublicationsDialog publications={pubs} open={false} onClose={() => {}} />)
    rerender(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    expect(showModal).toHaveBeenCalledTimes(1)
    expect(dialogEl(container).open).toBe(true)
  })

  it('has a title, and is labelled by it for screen readers', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    expect(dialogEl(container)).toHaveAttribute('aria-labelledby', 'pubs-title')
    expect(container.querySelector('#pubs-title')).toHaveTextContent('Publications')
  })

  it('lists every publication with type, year, title, venue and details', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    const articles = container.querySelectorAll('article')
    expect(articles).toHaveLength(2)
    expect(articles[0]).toHaveTextContent('Journal article · 2025')
    expect(within(articles[0]).getByRole('heading', { name: 'Paper One' })).toBeInTheDocument()
    expect(articles[0]).toHaveTextContent('Journal of Things')
    expect(articles[0]).toHaveTextContent('6(3), 559–572')
    expect(articles[1]).toHaveTextContent('Conference paper · 2017')
  })

  it('marks Japanese text as Japanese (for pronunciation by screen readers)', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    expect(screen.getByText('論文その一')).toHaveAttribute('lang', 'ja')
    expect(screen.getByText('物事論文集')).toHaveAttribute('lang', 'ja')
    const notes = container.querySelectorAll('.pub-note')
    expect(notes[0]).not.toHaveAttribute('lang') // English note
    expect(notes[1]).toHaveAttribute('lang', 'ja') // Japanese note
  })

  it('highlights the owner among the authors and separates authors with semicolons', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    const mine = container.querySelectorAll('strong.me')
    expect(mine).toHaveLength(2)
    expect([...mine].every((m) => m.textContent === 'Osay, S. M.')).toBe(true)
    expect(container.querySelectorAll('.pub-authors')[0]).toHaveTextContent('Yaginuma, H.; Osay, S. M.')
  })

  it('shows "First author" only on a paper where the owner is listed first', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    const tags = container.querySelectorAll('.pub-tag')
    expect(tags).toHaveLength(1)
    expect(container.querySelectorAll('article')[1]).toContainElement(tags[0])
    expect(tags[0]).toHaveTextContent('First author')
  })

  it('shows the role, keywords and links only when a paper has them', () => {
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    const [one, two] = container.querySelectorAll('article')
    expect(one.querySelector('.pub-role')).toHaveTextContent('I did the labelling.')
    expect(within(one).getByRole('list', { name: 'Keywords' })).toHaveTextContent('Point CloudCSF')
    expect(one.querySelectorAll('.pub-links a')).toHaveLength(2)
    expect(two.querySelector('.pub-role')).toBeNull()
    expect(within(two).queryByRole('list', { name: 'Keywords' })).toBeNull()
    expect(two.querySelector('.pub-links')).toBeNull()
  })

  it('opens links in a new tab safely; the main link is styled as primary', () => {
    render(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    const read = screen.getByRole('link', { name: /Read it/ })
    const pdf = screen.getByRole('link', { name: /Open PDF/ })
    for (const a of [read, pdf]) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    }
    expect(read).toHaveAttribute('href', 'https://example.test/read')
    expect(read).toHaveClass('primary')
    expect(pdf).not.toHaveClass('primary')
  })

  it('closes with the close button and tells its parent', () => {
    const onClose = vi.fn()
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(dialogEl(container).open).toBe(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the dimmed background is clicked, but not when the content is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={onClose} />)
    fireEvent.click(screen.getByRole('heading', { name: 'Paper One' }))
    expect(dialogEl(container).open).toBe(true)
    fireEvent.click(dialogEl(container)) // the click lands on the dialog itself = the background
    expect(dialogEl(container).open).toBe(false)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('tells its parent when the browser closes it (for example with the Esc key)', () => {
    const onClose = vi.fn()
    const { container } = render(<PublicationsDialog publications={pubs} open onClose={onClose} />)
    fireEvent(dialogEl(container), new Event('close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('can be opened again after it was closed', () => {
    const { container, rerender } = render(<PublicationsDialog publications={pubs} open={false} onClose={() => {}} />)
    rerender(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    rerender(<PublicationsDialog publications={pubs} open={false} onClose={() => {}} />)
    rerender(<PublicationsDialog publications={pubs} open onClose={() => {}} />)
    expect(dialogEl(container).open).toBe(true)
  })
})

// ---------------------------------------------------------------------------------------------
describe('Hero', () => {
  const profile = { name: 'Sarah Meh Osay', title: 'Full-Stack Developer', tagline: 'I build GIS tools.' }
  const highlights = [
    { value: '9+', label: 'years in software' },
    { value: '2', label: 'research publications', publications: true },
  ]
  const renderHero = (props = {}) => render(<Hero profile={profile} highlights={highlights} hasProjects publications={pubs} {...props} />)

  it('shows the greeting, the name (first name, then the rest), role and tagline', () => {
    const { container } = renderHero()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Sarah Meh Osay')
    expect(h1.querySelector('.grad-text')).toHaveTextContent('Meh Osay')
    expect(container).toHaveTextContent("Hi, I'm")
    expect(screen.getByText('Full-Stack Developer')).toBeInTheDocument()
    expect(screen.getByText('I build GIS tools.')).toBeInTheDocument()
  })

  it('points the main button to the demos when there are some', () => {
    renderHero({ hasProjects: true })
    expect(screen.getByRole('link', { name: /View my work/ })).toHaveAttribute('href', '#projects')
    expect(screen.queryByRole('link', { name: /See my experience/ })).not.toBeInTheDocument()
  })

  it('points the main button to the experience when there are no demos', () => {
    renderHero({ hasProjects: false })
    expect(screen.getByRole('link', { name: /See my experience/ })).toHaveAttribute('href', '#experience')
    expect(screen.queryByRole('link', { name: /View my work/ })).not.toBeInTheDocument()
  })

  it('has a "Get in touch" button that goes to the contact section', () => {
    renderHero()
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact')
  })

  it('shows each headline number with its label', () => {
    renderHero()
    const stats = screen.getByText('years in software').closest('div')
    expect(stats).toHaveTextContent('9+')
    expect(screen.getByText('research publications').closest('div')).toHaveTextContent('2')
  })

  it('offers "View publications" on the flagged number only, and opens the pop-up', () => {
    const { container } = renderHero()
    const buttons = screen.getAllByRole('button', { name: /View publications/ })
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAttribute('aria-haspopup', 'dialog')
    expect(buttons[0].closest('div')).toHaveTextContent('research publications')
    expect(dialogEl(container).open).toBe(false)
    fireEvent.click(buttons[0])
    expect(dialogEl(container).open).toBe(true)
    expect(dialogEl(container)).toHaveTextContent('Paper One')
  })

  it('can open the pop-up again after closing it', () => {
    const { container } = renderHero()
    fireEvent.click(screen.getByRole('button', { name: /View publications/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(dialogEl(container).open).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: /View publications/ }))
    expect(dialogEl(container).open).toBe(true)
  })

  it('has no publications button or pop-up without a publications list', () => {
    const { container } = renderHero({ publications: undefined })
    expect(screen.queryByRole('button', { name: /View publications/ })).not.toBeInTheDocument()
    expect(dialogEl(container)).toBeNull()
  })

  it('has no publications button when no number is flagged for it', () => {
    renderHero({ highlights: [{ value: '9+', label: 'years in software' }] })
    expect(screen.queryByRole('button', { name: /View publications/ })).not.toBeInTheDocument()
  })
})

// ---------------------------------------------------------------------------------------------
describe('Projects (live demos)', () => {
  const projects = [
    { name: 'Inventory system', url: 'https://example.test/inventory/', description: 'Manage stock.', stack: [['Frontend', ['Vue 3', 'Vite']], ['Languages', ['JavaScript', 'CSS']]] },
    { name: 'Point cloud viewer', url: 'https://example.test/viewer/', description: 'View LiDAR.', stack: [['Frontend', ['CesiumJS']]] },
  ]

  it.each([[null], [undefined], [[]]])('renders nothing when there are no live demos (%s)', (value) => {
    const { container } = render(<Projects projects={value} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows a card for each demo, with description and frameworks', () => {
    const { container } = render(<Projects projects={projects} />)
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
    const cards = container.querySelectorAll('article')
    expect(cards).toHaveLength(2)
    expect(within(cards[0]).getByRole('heading', { name: /^Inventory system/ })).toBeInTheDocument()
    expect(cards[0]).toHaveTextContent('Manage stock.')
    expect(cards[0]).toHaveTextContent('Vue 3 · Vite')
    expect(cards[0]).toHaveTextContent('JavaScript · CSS')
    expect(cards[1]).toHaveTextContent('CesiumJS')
  })

  it('links each demo to open in a new tab, safely', () => {
    render(<Projects projects={projects} />)
    const link = screen.getByRole('link', { name: 'Open Inventory system in a new tab' })
    expect(link).toHaveAttribute('href', 'https://example.test/inventory/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('shows a live preview that is hidden from keyboards and screen readers and loads lazily', () => {
    const { container } = render(<Projects projects={projects} />)
    const preview = container.querySelector('.preview iframe')
    expect(preview).toHaveAttribute('src', 'https://example.test/inventory/')
    expect(preview).toHaveAttribute('title', 'Inventory system preview')
    expect(preview).toHaveAttribute('loading', 'lazy')
    expect(preview).toHaveAttribute('aria-hidden', 'true')
    expect(preview).toHaveAttribute('tabindex', '-1')
  })

  it('keeps the pop-up empty until "Try it here" is clicked', () => {
    const { container } = render(<Projects projects={projects} />)
    expect(dialogEl(container).open).toBe(false)
    expect(dialogEl(container).querySelector('iframe')).toBeNull()
  })

  it('opens the full-size demo in a pop-up when "Try it here" is clicked', () => {
    const { container } = render(<Projects projects={projects} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Try it here/ })[1])
    const dialog = dialogEl(container)
    expect(dialog.open).toBe(true)
    expect(dialog).toHaveAttribute('aria-label', 'Point cloud viewer live demo')
    expect(within(dialog).getByText('Point cloud viewer')).toBeInTheDocument()
    const frame = dialog.querySelector('iframe')
    expect(frame).toHaveAttribute('src', 'https://example.test/viewer/')
    expect(frame).toHaveAttribute('title', 'Point cloud viewer live demo')
    expect(within(dialog).getByRole('link', { name: /Open/ })).toHaveAttribute('href', 'https://example.test/viewer/')
  })

  it('closes the pop-up and removes the demo frame (so it stops running)', () => {
    const { container } = render(<Projects projects={projects} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Try it here/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Close demo' }))
    const dialog = dialogEl(container)
    expect(dialog.open).toBe(false)
    expect(dialog.querySelector('iframe')).toBeNull()
    expect(dialog).not.toHaveAttribute('aria-label')
  })

  it('shows the other demo after closing one and opening another', () => {
    const { container } = render(<Projects projects={projects} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Try it here/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Close demo' }))
    fireEvent.click(screen.getAllByRole('button', { name: /Try it here/ })[1])
    expect(dialogEl(container).querySelector('iframe')).toHaveAttribute('src', 'https://example.test/viewer/')
  })

  it('does not break when the pop-up is closed by the browser (Esc key)', () => {
    const { container } = render(<Projects projects={projects} />)
    fireEvent.click(screen.getAllByRole('button', { name: /Try it here/ })[0])
    act(() => { dialogEl(container).close() })
    expect(dialogEl(container).querySelector('iframe')).toBeNull()
  })
})
