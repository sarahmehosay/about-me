import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import Nav from '../components/Nav'
import { fakeSections, mouseMove, setSystemDark } from './utils'

// Where each section starts, in px from the top of the window (the window is 768 px tall, so the
// "middle of the screen" line is at 45% = about 346 px). Tools starts at 500 px: below that line
// but above 90% of the height, so a wrong line position would highlight Tools instead of Skills.
const TOPS = { home: -900, about: -200, skills: 300, tools: 500, projects: 1300, experience: 1800, process: 2300, education: 2800, contact: 3300 }

let restore = () => {}
afterEach(() => restore())

function setup(props = {}, layout = {}) {
  restore = fakeSections(TOPS, layout)
  const utils = render(<Nav name="Sarah Meh Osay" page="home" docsHref="#/docs" {...props} />)
  // Give the header a height, so "mouse over the menu bar" can be told apart from "over the page".
  utils.container.querySelector('.nav').getBoundingClientRect = () => ({ top: 0, bottom: 64, height: 64, left: 0, right: 0, width: 0, x: 0, y: 0 })
  return utils
}
const link = (name) => screen.getByRole('link', { name })
const menu = () => screen.getByRole('navigation', { name: 'Sections' })

describe('Nav: links', () => {
  it('shows the brand initials, labelled for screen readers, linking to the top', () => {
    setup()
    const brand = screen.getByRole('link', { name: 'Sarah Meh Osay – back to top' })
    expect(brand).toHaveTextContent('SMO')
    expect(brand).toHaveAttribute('href', '#home')
  })

  it('has a link for each section, in page order, plus Docs and "Let\'s talk"', () => {
    setup()
    const labels = within(menu()).getAllByRole('link').map((a) => a.textContent)
    expect(labels).toEqual(['Home', 'About', 'Skills', 'Tools', 'Work', 'Experience', 'Education', 'Docs'])
    expect(link('Work')).toHaveAttribute('href', '#projects')
    expect(link('Docs')).toHaveAttribute('href', '#/docs')
    expect(link("Let's talk")).toHaveAttribute('href', '#contact')
  })

  it('can hide a link (the Work link is hidden when no demo is online)', () => {
    setup({ hide: ['projects'] })
    expect(screen.queryByRole('link', { name: 'Work' })).not.toBeInTheDocument()
    expect(link('Experience')).toBeInTheDocument()
  })

  it('on the Docs page only Docs is highlighted, and it is marked as the current page', () => {
    setup({ page: 'docs' })
    expect(link('Docs')).toHaveClass('active')
    expect(link('Docs')).toHaveAttribute('aria-current', 'page')
    expect(within(menu()).getAllByRole('link').filter((a) => a.classList.contains('active'))).toHaveLength(1)
    expect(link("Let's talk")).not.toHaveClass('active')
  })
})

describe('Nav: which link is highlighted', () => {
  it('uses the section at 45% of the screen height when there is no mouse', () => {
    setup()
    // Sections starting above the 346 px line: home, about and skills. The last one wins.
    // (Tools starts at 500 px, below the line, so it must not be chosen.)
    expect(link('Skills')).toHaveClass('active')
    expect(link('Tools')).not.toHaveClass('active')
    expect(link('Home')).not.toHaveClass('active')
  })

  it('updates when the page scrolls', async () => {
    setup()
    restore()
    restore = fakeSections({ ...TOPS, skills: -400, tools: -100, projects: 300, experience: 900 })
    act(() => { window.dispatchEvent(new Event('scroll')) })
    await waitFor(() => expect(link('Work')).toHaveClass('active'))
  })

  it('follows the mouse: the section under the pointer wins over the middle of the screen', async () => {
    setup()
    act(() => mouseMove(900))
    await waitFor(() => expect(link('Tools')).toHaveClass('active'))
    expect(link('Skills')).not.toHaveClass('active')
  })

  it('ignores touch pointers (only a real mouse counts)', async () => {
    setup()
    act(() => mouseMove(900, 'touch'))
    await new Promise((r) => setTimeout(r, 50))
    expect(link('Skills')).toHaveClass('active')
  })

  it('falls back to the middle of the screen when the mouse is over the menu bar', async () => {
    setup()
    act(() => mouseMove(900))
    await waitFor(() => expect(link('Tools')).toHaveClass('active'))
    act(() => mouseMove(30)) // 30 px is inside the 64 px menu bar
    await waitFor(() => expect(link('Skills')).toHaveClass('active'))
  })

  it('goes back to the middle-of-screen rule when the mouse leaves the window', async () => {
    setup()
    act(() => mouseMove(900))
    await waitFor(() => expect(link('Tools')).toHaveClass('active'))
    act(() => { document.documentElement.dispatchEvent(new Event('mouseleave')) })
    await waitFor(() => expect(link('Skills')).toHaveClass('active'))
  })

  it('highlights "How I work" as part of Experience (it has no link of its own)', async () => {
    setup()
    act(() => mouseMove(2500)) // inside the Process section
    await waitFor(() => expect(link('Experience')).toHaveClass('active'))
  })

  it('highlights "Let\'s talk" when the page is scrolled to the very bottom', () => {
    setup({}, { scrollHeight: 5000, scrollY: 4300 }) // 768 + 4300 >= 5000 - 2
    expect(link("Let's talk")).toHaveClass('active')
    expect(within(menu()).getAllByRole('link').some((a) => a.classList.contains('active'))).toBe(false)
  })

  it('at the bottom, pointing at a section still wins over "Let\'s talk"', async () => {
    setup({}, { scrollHeight: 5000, scrollY: 4300 })
    act(() => mouseMove(450)) // inside Skills (300 px to 500 px)
    await waitFor(() => expect(link('Skills')).toHaveClass('active'))
    expect(link("Let's talk")).not.toHaveClass('active')
  })

  it('stops listening when the menu is removed', () => {
    const { unmount } = setup()
    unmount()
    expect(() => {
      window.dispatchEvent(new Event('scroll'))
      mouseMove(900)
    }).not.toThrow()
  })
})

describe('Nav: sideways menu on small screens', () => {
  it('scrolls the menu to keep the highlighted link in view when the menu is wider than the screen', async () => {
    setup()
    const nav = menu()
    Object.defineProperty(nav, 'scrollWidth', { configurable: true, value: 900 })
    Object.defineProperty(nav, 'clientWidth', { configurable: true, value: 300 })
    act(() => mouseMove(900)) // highlight changes from Skills to Tools
    await waitFor(() => expect(Element.prototype.scrollTo).toHaveBeenCalled())
    expect(Element.prototype.scrollTo.mock.calls.at(-1)[0]).toMatchObject({ behavior: 'smooth' })
  })

  it('does not scroll the menu when everything fits', async () => {
    setup()
    act(() => mouseMove(900))
    await waitFor(() => expect(link('Tools')).toHaveClass('active'))
    expect(Element.prototype.scrollTo).not.toHaveBeenCalled()
  })
})

describe('Nav: theme switch', () => {
  it('offers dark mode when the page is light, and switches when clicked', () => {
    setup()
    const button = screen.getByRole('button', { name: 'Switch to dark theme' })
    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('offers light mode when the system is dark', () => {
    setSystemDark(true)
    setup()
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })

  it('shows a moon icon in light mode and a sun in dark mode', () => {
    setup()
    const before = screen.getByRole('button', { name: 'Switch to dark theme' }).innerHTML
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(screen.getByRole('button', { name: 'Switch to light theme' }).innerHTML).not.toBe(before)
  })
})
