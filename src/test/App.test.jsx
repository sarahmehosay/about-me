// Whole-page tests: the real App with the real content, in a simulated browser.
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { experience, profile, projects, publications } from '../data/profile'
import { deferred, mockFetch } from './utils'

const sectionIds = (container) => [...container.querySelectorAll('main > section')].map((s) => s.id)
const menuLink = (name) => screen.queryByRole('link', { name })
const goTo = async (hash) => {
  await act(async () => {
    window.location.hash = hash
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

describe('App: home page', () => {
  it('shows the name as the main heading and sets the browser tab title', async () => {
    mockFetch({ '*': true })
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
    expect(document.title).toBe(`${profile.name} · Full-Stack & GIS Developer`)
    await screen.findByRole('region', { name: 'Selected work' }) // let the demo check finish
  })

  it('builds the sections in the right order, with the contact band after them', async () => {
    mockFetch({ '*': true })
    const { container } = render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    expect(sectionIds(container)).toEqual(['home', 'about', 'skills', 'tools', 'projects', 'experience', 'process', 'education'])
    const main = container.querySelector('main')
    expect(main.nextElementSibling).toHaveAttribute('id', 'contact')
  })

  it('has one menu link for every section that has one', async () => {
    mockFetch({ '*': true })
    render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    for (const name of ['Home', 'About', 'Skills', 'Tools', 'Work', 'Experience', 'Education', 'Docs']) {
      expect(menuLink(name), name).toBeInTheDocument()
    }
  })

  it('scrolls to the top when the page loads', async () => {
    mockFetch({ '*': true })
    render(<App />)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    await screen.findByRole('region', { name: 'Selected work' })
  })

  it('jumps to the section named in the address (for example #skills)', async () => {
    window.location.hash = '#skills'
    mockFetch({ '*': true })
    render(<App />)
    const jumped = Element.prototype.scrollIntoView.mock.contexts.map((el) => el.id)
    expect(jumped).toContain('skills')
    await screen.findByRole('region', { name: 'Selected work' })
  })

  it('shows a publication box in every job that names a paper', async () => {
    mockFetch({ '*': true })
    const { container } = render(<App />)
    const expected = experience.filter((j) => publications.some((p) => p.title === j.publication)).length
    expect(expected).toBeGreaterThan(0)
    expect(container.querySelectorAll('.xp-pub')).toHaveLength(expected)
    await screen.findByRole('region', { name: 'Selected work' })
  })

  it('opens the publications pop-up from the headline number', async () => {
    mockFetch({ '*': true })
    const { container } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /View publications/ }))
    const dialog = container.querySelector('dialog.paper-dialog')
    expect(dialog.open).toBe(true)
    for (const p of publications) expect(dialog).toHaveTextContent(p.title)
    await screen.findByRole('region', { name: 'Selected work' })
  })

  it('switches between light and dark from the menu', async () => {
    mockFetch({ '*': true })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    await screen.findByRole('region', { name: 'Selected work' })
  })
})

describe('App: live demos', () => {
  it('shows no Work link and no demos while it is still checking', async () => {
    const wait = deferred()
    mockFetch({}).mockImplementation(() => wait.promise)
    const { container } = render(<App />)
    expect(menuLink('Work')).not.toBeInTheDocument()
    expect(container.querySelector('#projects')).toBeNull()
    expect(screen.getByRole('link', { name: /See my experience/ })).toBeInTheDocument()
    await act(async () => { wait.resolve({ ok: true }); await wait.promise })
    await screen.findByRole('region', { name: 'Selected work' })
  })

  it('shows every demo, the Work link and a "View my work" button when all demos are up', async () => {
    mockFetch({ '*': true })
    const { container } = render(<App />)
    const region = await screen.findByRole('region', { name: 'Selected work' })
    expect(within(region).getAllByRole('button', { name: /Try it here/ })).toHaveLength(projects.length)
    expect(container.querySelectorAll('#projects article')).toHaveLength(projects.length)
    expect(menuLink('Work')).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /View my work/ })).toHaveAttribute('href', '#projects')
  })

  it('hides the whole Projects section, the Work link and the "View my work" button when no demo answers', async () => {
    const fetchMock = mockFetch({ '*': 'error' })
    const { container } = render(<App />)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(projects.length))
    await act(async () => { await Promise.resolve() })
    expect(container.querySelector('#projects')).toBeNull()
    expect(menuLink('Work')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /View my work/ })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /See my experience/ })).toHaveAttribute('href', '#experience')
    expect(sectionIds(container)).not.toContain('projects')
  })

  it('shows only the demos that are online', async () => {
    mockFetch({ [projects[0].url]: true, [projects[1].url]: 'error' })
    const { container } = render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    const cards = container.querySelectorAll('#projects article')
    expect(cards).toHaveLength(1)
    expect(cards[0]).toHaveTextContent(projects[0].name)
    expect(container.querySelector('#projects')).not.toHaveTextContent(projects[1].name)
  })

  it('checks each demo address once', async () => {
    const fetchMock = mockFetch({ '*': true })
    render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    expect(fetchMock.mock.calls.map(([url]) => url).sort()).toEqual(projects.map((p) => p.url).sort())
  })
})

describe('App: docs page', () => {
  it('opens on the Docs page when the address ends in #/docs', async () => {
    window.location.hash = '#/docs'
    const fetchMock = mockFetch({ '*': true })
    const { container } = render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How this page is built')
    expect(document.title).toBe(`Built with · ${profile.name}`)
    expect(container.querySelector('#about')).toBeNull() // no home sections
    expect(container.querySelector('#contact')).toBeInTheDocument() // the contact band is still there
    expect(menuLink('Docs')).toHaveAttribute('aria-current', 'page')
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
  })

  it('lists the languages, tools, AI assistance, techniques and scripts', () => {
    window.location.hash = '#/docs'
    mockFetch({ '*': true })
    render(<App />)
    for (const name of ['Languages', 'Frameworks & tools', 'AI-assisted development', 'Techniques', 'Scripts']) {
      expect(screen.getByRole('heading', { level: 2, name }), name).toBeInTheDocument()
    }
  })

  it('switches pages when the address changes, in both directions', async () => {
    mockFetch({ '*': true })
    const { container } = render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    expect(container.querySelector('#about')).toBeInTheDocument()

    await goTo('#/docs')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How this page is built')
    expect(container.querySelector('#about')).toBeNull()
    expect(document.title).toBe(`Built with · ${profile.name}`)

    await goTo('')
    expect(container.querySelector('#about')).toBeInTheDocument()
    expect(document.title).toBe(`${profile.name} · Full-Stack & GIS Developer`)
  })

  it('goes to the top of the page after switching pages', async () => {
    mockFetch({ '*': true })
    render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    window.scrollTo.mockClear()
    await goTo('#/docs')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('opens the Docs page when the Docs link is clicked', async () => {
    mockFetch({ '*': true })
    render(<App />)
    await screen.findByRole('region', { name: 'Selected work' })
    await act(async () => { fireEvent.click(menuLink('Docs')) })
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('How this page is built'))
  })
})
