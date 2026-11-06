import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import About from '../components/About'
import Contact from '../components/Contact'
import Education from '../components/Education'
import Experience from '../components/Experience'
import Process from '../components/Process'
import Rich from '../components/Rich'
import Section from '../components/Section'
import Skills from '../components/Skills'
import Tools from '../components/Tools'

describe('Rich (bold text)', () => {
  it('turns **text** into bold and leaves the rest as plain text', () => {
    const { container } = render(<p><Rich text="Built **100+ features** for **two** teams." /></p>)
    const bold = container.querySelectorAll('strong')
    expect([...bold].map((b) => b.textContent)).toEqual(['100+ features', 'two'])
    expect(container.textContent).toBe('Built 100+ features for two teams.')
  })

  it('leaves text without markers untouched', () => {
    const { container } = render(<p><Rich text="Nothing special here." /></p>)
    expect(container.querySelector('strong')).toBeNull()
    expect(container).toHaveTextContent('Nothing special here.')
  })
})

describe('Section', () => {
  it('is a labelled region with an eyebrow, a heading and its content', () => {
    render(<Section id="demo" eyebrow="Small label" title="Big title"><p>Content</p></Section>)
    const region = screen.getByRole('region', { name: 'Big title' })
    expect(region).toHaveAttribute('id', 'demo')
    expect(within(region).getByText('Small label')).toBeInTheDocument()
    expect(within(region).getByRole('heading', { level: 2, name: 'Big title' })).toBeInTheDocument()
    expect(within(region).getByText('Content')).toBeInTheDocument()
  })
})

describe('Skills', () => {
  const featured = [['Vue', 'Vue.js'], ['Py', 'Python']]
  const skills = [
    { group: 'Frontend', items: ['Vue.js', 'CSS'] },
    { group: 'Backend', items: ['Python'] },
  ]
  const allSkills = (c) => c.querySelector('#all-skills')

  it('shows the featured skill tiles with their short marks', () => {
    const { container } = render(<Skills featured={featured} skills={skills} />)
    const tiles = within(container.querySelector('.skill-tiles'))
    expect(tiles.getByText('Vue.js')).toBeInTheDocument()
    expect(tiles.getByText('Vue')).toBeInTheDocument() // the short mark
    expect(tiles.getByText('Python')).toBeInTheDocument()
    expect(tiles.getByText('Py')).toBeInTheDocument()
  })

  it('keeps the full list hidden until "All skills" is clicked', () => {
    const { container } = render(<Skills featured={featured} skills={skills} />)
    const button = screen.getByRole('button', { name: /All skills/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'all-skills')
    expect(allSkills(container)).toHaveAttribute('hidden')
  })

  it('shows every group when opened, and hides them again when closed', () => {
    const { container } = render(<Skills featured={featured} skills={skills} />)
    fireEvent.click(screen.getByRole('button', { name: /All skills/ }))
    expect(allSkills(container)).not.toHaveAttribute('hidden')
    const open = screen.getByRole('button', { name: /Hide list/ })
    expect(open).toHaveAttribute('aria-expanded', 'true')
    expect(within(allSkills(container)).getByRole('heading', { name: 'Frontend' })).toBeInTheDocument()
    expect(within(allSkills(container)).getByRole('heading', { name: 'Backend' })).toBeInTheDocument()
    expect(within(allSkills(container)).getByText('CSS')).toBeInTheDocument()

    fireEvent.click(open)
    expect(allSkills(container)).toHaveAttribute('hidden')
    expect(screen.getByRole('button', { name: /All skills/ })).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Tools', () => {
  it('lists each group with every tool and what it is used for', () => {
    const tools = [
      { group: 'Planning', items: [['ClickUp', 'Sprint tickets'], ['Figma', 'Design review']] },
      { group: 'Code', items: [['VS Code', 'Editing']] },
    ]
    render(<Tools tools={tools} />)
    expect(screen.getByRole('heading', { name: 'Tools I use' })).toBeInTheDocument()
    const planning = screen.getByRole('heading', { name: 'Planning' }).closest('.card')
    expect(within(planning).getByText('ClickUp')).toBeInTheDocument()
    expect(within(planning).getByText('Sprint tickets')).toBeInTheDocument()
    expect(within(planning).queryByText('VS Code')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})

describe('Process ("How I work")', () => {
  it('numbers the steps 01, 02, ... in order', () => {
    const steps = [
      { icon: 'search', title: 'Understand', text: 'Ask questions.' },
      { icon: 'pen', title: 'Design', text: 'Sketch it.' },
      { icon: 'code', title: 'Build', text: 'Write it.' },
    ]
    render(<Process steps={steps} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent(/01\s*Understand\s*Ask questions\./)
    expect(items[1]).toHaveTextContent(/02\s*Design/)
    expect(items[2]).toHaveTextContent(/03\s*Build/)
  })
})

describe('About', () => {
  it('shows the summary, the traits and the drawing', () => {
    render(<About summary="I build things." traits={[{ icon: 'globe', label: 'GIS' }, { icon: 'bug', label: 'Bug hunter' }]} />)
    expect(screen.getByRole('heading', { name: 'About me' })).toBeInTheDocument()
    expect(screen.getByText('I build things.')).toBeInTheDocument()
    expect(screen.getByText('GIS')).toBeInTheDocument()
    expect(screen.getByText('Bug hunter')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /illustration/i })).toBeInTheDocument()
  })
})

describe('Education', () => {
  const education = [{ school: 'Some University', degree: 'BSc Computer Science', date: 'Jun 2015' }]
  const training = [
    { course: 'With certificate', provider: 'Coursera', date: 'Oct 2026', url: 'https://example.test/cert' },
    { course: 'Without certificate', provider: 'IBM', date: 'Aug 2026' },
  ]

  it('shows the degree, school and date', () => {
    render(<Education education={education} training={training} />)
    expect(screen.getByRole('heading', { name: 'BSc Computer Science' })).toBeInTheDocument()
    expect(screen.getByText('Some University')).toBeInTheDocument()
    expect(screen.getByText('Jun 2015')).toBeInTheDocument()
  })

  it('links a course to its certificate only when it has one', () => {
    render(<Education education={education} training={training} />)
    const link = screen.getByRole('link', { name: 'With certificate' })
    expect(link).toHaveAttribute('href', 'https://example.test/cert')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    expect(screen.getByText('Without certificate')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Without certificate' })).not.toBeInTheDocument()
  })
})

describe('Experience', () => {
  const jobs = [
    { role: 'GIS Engineer', company: 'Locus Blue', period: 'Nov 2022 – Present', location: 'Tokyo', icon: 'briefcase', summary: 'Builds viewers.',
      publication: 'Paper One', points: ['Shipped **100+ features**.', 'Fixed bugs.'], tags: ['Vue 3', 'CesiumJS'] },
    { role: 'Developer', company: 'Apollo', period: '2017 – 2022', location: 'Davao', icon: 'laptop', summary: 'Built ERP.',
      points: ['Made modules.'], tags: ['Python'] },
    { role: 'Assistant', company: 'Phil-LiDAR', period: '2016', location: 'Davao', icon: 'map', summary: 'Surveys.',
      publication: 'A paper that is not in the list', points: ['Surveyed.'], tags: ['ArcGIS'] },
  ]
  const publications = [{ title: 'Paper One', year: 2025, authors: ['Yaginuma, H.', 'Osay, S. M.'], venue: 'Journal of Things', detail: '6(3), 559–572' }]

  it('shows every job with role, company, dates, place and summary', () => {
    render(<Experience experience={jobs} publications={publications} />)
    const items = screen.getAllByRole('listitem').filter((li) => li.querySelector('h3'))
    expect(items).toHaveLength(3)
    expect(within(items[0]).getByRole('heading', { name: 'GIS Engineer' })).toBeInTheDocument()
    expect(items[0]).toHaveTextContent('Locus Blue')
    expect(items[0]).toHaveTextContent('Nov 2022 – Present')
    expect(items[0]).toHaveTextContent('Tokyo')
    expect(items[0]).toHaveTextContent('Builds viewers.')
  })

  it('keeps the bullet points inside a collapsed "Highlights" section, with bold text', () => {
    const { container } = render(<Experience experience={jobs} publications={publications} />)
    const first = container.querySelector('details')
    expect(first).not.toHaveAttribute('open')
    expect(within(first).getByText('Highlights')).toBeInTheDocument()
    expect(within(first).getByText('100+ features').tagName).toBe('STRONG')
    expect(within(first).getByText('CesiumJS')).toBeInTheDocument()
  })

  it('shows the publication box inside Highlights for a job that names a known paper', () => {
    const { container } = render(<Experience experience={jobs} publications={publications} />)
    const box = container.querySelector('.xp-pub')
    expect(box).toBeInTheDocument()
    expect(box.closest('details')).toBeInTheDocument()
    expect(box).toHaveTextContent('Publication · 2025')
    expect(box).toHaveTextContent('Paper One')
    expect(box).toHaveTextContent('Yaginuma, H. et al.')
    expect(box).toHaveTextContent('Journal of Things, 6(3), 559–572')
  })

  it('shows no publication box for jobs without a paper, or whose paper cannot be found', () => {
    const { container } = render(<Experience experience={jobs} publications={publications} />)
    expect(container.querySelectorAll('.xp-pub')).toHaveLength(1)
  })

  it('works when no publications list is given at all', () => {
    const { container } = render(<Experience experience={jobs} />)
    expect(container.querySelector('.xp-pub')).toBeNull()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })
})

describe('Contact', () => {
  const contact = { email: 'me@example.test', phone: null, github: 'https://github.com/someone', linkedin: 'https://www.linkedin.com/in/someone-123/' }
  const renderContact = (c = contact) => render(<Contact contact={c} name="Sarah Meh Osay" docsHref="#/docs" />)

  it('links the email, LinkedIn and GitHub, showing tidy addresses', () => {
    renderContact()
    expect(screen.getByRole('link', { name: /me@example\.test/ })).toHaveAttribute('href', 'mailto:me@example.test')
    expect(screen.getByRole('link', { name: /linkedin\.com\/in\/someone-123$/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/someone-123/')
    expect(screen.getByRole('link', { name: /github\.com\/someone/ })).toHaveAttribute('href', 'https://github.com/someone')
  })

  it('opens websites in a new tab safely, but not the email link', () => {
    renderContact()
    const github = screen.getByRole('link', { name: /github\.com/ })
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    expect(screen.getByRole('link', { name: /me@example\.test/ })).not.toHaveAttribute('target')
  })

  it('leaves out anything that is not set (a null value hides it)', () => {
    renderContact({ ...contact, linkedin: null })
    expect(screen.queryByText(/linkedin/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github\.com/ })).toBeInTheDocument()
  })

  it('never shows a phone number when it is null', () => {
    renderContact()
    expect(screen.queryByText(/phone/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /tel:/ })).not.toBeInTheDocument()
  })

  it('has a footer with the year and name, and a link to the Docs page', () => {
    const { container } = renderContact()
    expect(container.querySelector('footer')).toHaveTextContent(`© ${new Date().getFullYear()} Sarah Meh Osay`)
    expect(screen.getByRole('link', { name: /How this page is built/ })).toHaveAttribute('href', '#/docs')
  })

  it('lists the technologies the site is built with, with versions', () => {
    const { container } = renderContact()
    const built = container.querySelector('#built-with')
    expect(built).toHaveTextContent('This site is built with')
    expect(built).toHaveTextContent('JavaScript')
    expect(built).toHaveTextContent(/React \d+\.\d+/)
    expect(built).toHaveTextContent(/Vite \d+\.\d+/)
  })
})
