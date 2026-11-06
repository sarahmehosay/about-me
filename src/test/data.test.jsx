// Checks the content files (src/data). These catch typos before they reach the page: a job that
// points to a paper that does not exist, an icon name that was misspelled, a link without https...
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Icon from '../components/Icons'
import { aiAssist, languages, scripts, stack, techniques } from '../data/docs'
import {
  education, experience, featuredSkills, highlights, process, profile, projects, publications, skills, tools, traits, training,
} from '../data/profile'

const isHttps = (url) => /^https:\/\/\S+$/.test(url)
const unique = (list) => new Set(list).size === list.length
const iconDraws = (name) => render(<Icon name={name} />).container.querySelector('svg').childElementCount > 0

describe('profile', () => {
  it('has a name, title, tagline and summary', () => {
    for (const key of ['name', 'title', 'tagline', 'summary']) expect(profile[key], key).toMatch(/\S/)
  })

  it('has valid contact details (hidden ones are null, never empty)', () => {
    const { email, phone, github, linkedin } = profile.contact
    expect(email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
    expect(github === null || isHttps(github)).toBe(true)
    expect(linkedin === null || isHttps(linkedin)).toBe(true)
    expect(phone === null || phone.trim().length > 0).toBe(true)
  })
})

describe('highlights', () => {
  it('each has a value and a label', () => {
    expect(highlights.length).toBeGreaterThan(0)
    for (const h of highlights) {
      expect(h.value).toMatch(/\S/)
      expect(h.label).toMatch(/\S/)
    }
  })

  it('at most one highlight opens the publications pop-up', () => {
    expect(highlights.filter((h) => h.publications).length).toBeLessThanOrEqual(1)
  })
})

describe('skills and tools', () => {
  it('featured skills are [short mark, name] pairs with unique names', () => {
    for (const [mark, name] of featuredSkills) {
      expect(mark).toMatch(/\S/)
      expect(name).toMatch(/\S/)
    }
    expect(unique(featuredSkills.map(([, name]) => name))).toBe(true)
  })

  it('every skill group has a name and unique, non-empty items', () => {
    for (const g of skills) {
      expect(g.group).toMatch(/\S/)
      expect(g.items.length, g.group).toBeGreaterThan(0)
      expect(unique(g.items), `${g.group} has a duplicate`).toBe(true)
    }
    expect(unique(skills.map((g) => g.group))).toBe(true)
  })

  it('every tool is a [name, description] pair and no tool is listed twice', () => {
    const names = []
    for (const g of tools) {
      expect(g.group).toMatch(/\S/)
      for (const [name, use] of g.items) {
        expect(name).toMatch(/\S/)
        expect(use, name).toMatch(/\S/)
        names.push(name)
      }
    }
    expect(unique(names)).toBe(true)
  })
})

describe('experience', () => {
  it('every job is complete', () => {
    expect(experience.length).toBeGreaterThan(0)
    for (const job of experience) {
      for (const key of ['role', 'company', 'period', 'location', 'summary', 'icon']) expect(job[key], `${job.role}: ${key}`).toMatch(/\S/)
      expect(job.points.length, job.role).toBeGreaterThan(0)
      expect(job.tags.length, job.role).toBeGreaterThan(0)
    }
  })

  it('a job that names a publication points to one that exists', () => {
    const titles = publications.map((p) => p.title)
    for (const job of experience.filter((j) => j.publication)) {
      expect(titles, `"${job.publication}" (${job.role})`).toContain(job.publication)
    }
  })

  it('bold markers (**) are balanced in every bullet point', () => {
    for (const job of experience) {
      for (const point of job.points) expect((point.match(/\*\*/g) ?? []).length % 2, point).toBe(0)
    }
  })
})

describe('publications', () => {
  it('each has a type, title, year, venue and authors that include the owner', () => {
    expect(publications.length).toBeGreaterThan(0)
    for (const p of publications) {
      for (const key of ['type', 'title', 'venue', 'detail', 'note']) expect(p[key], `${p.title}: ${key}`).toMatch(/\S/)
      expect(Number.isInteger(p.year)).toBe(true)
      expect(p.authors, p.title).toContain(p.me)
    }
    expect(unique(publications.map((p) => p.title))).toBe(true)
  })

  it('every link is [label, https address, primary?]', () => {
    for (const p of publications) {
      for (const [label, href, primary] of p.links) {
        expect(label).toMatch(/\S/)
        expect(isHttps(href), href).toBe(true)
        expect(typeof primary).toBe('boolean')
      }
    }
  })
})

describe('projects (live demos)', () => {
  it('each has an https address, a description and [label, items] stack lines', () => {
    for (const p of projects) {
      expect(isHttps(p.url), p.url).toBe(true)
      expect(p.name).toMatch(/\S/)
      expect(p.description).toMatch(/\S/)
      expect(p.stack.length).toBeGreaterThan(0)
      for (const [label, items] of p.stack) {
        expect(label).toMatch(/\S/)
        expect(items.length).toBeGreaterThan(0)
      }
    }
    expect(unique(projects.map((p) => p.url))).toBe(true)
  })
})

describe('process, traits, education and training', () => {
  it('every process step and trait has text and an icon', () => {
    for (const s of process) {
      expect(s.title).toMatch(/\S/)
      expect(s.text).toMatch(/\S/)
    }
    for (const t of traits) expect(t.label).toMatch(/\S/)
  })

  it('education and training entries are complete; certificate links use https', () => {
    for (const e of education) for (const key of ['school', 'degree', 'date']) expect(e[key]).toMatch(/\S/)
    for (const t of training) {
      for (const key of ['course', 'provider', 'date']) expect(t[key], t.course).toMatch(/\S/)
      if (t.url) expect(isHttps(t.url), t.url).toBe(true)
    }
    expect(unique(training.map((t) => t.course))).toBe(true)
  })
})

describe('icons', () => {
  it('an unknown icon name draws nothing (so the check below can really fail)', () => {
    expect(iconDraws('definitely-not-an-icon')).toBe(false)
  })

  it('every icon named in the data files exists', () => {
    const names = [...experience.map((j) => j.icon), ...process.map((s) => s.icon), ...traits.map((t) => t.icon)]
    for (const name of new Set(names)) expect(iconDraws(name), `icon "${name}"`).toBe(true)
  })

  it('every icon the components use exists', () => {
    const used = ['arrowRight', 'external', 'play', 'close', 'grid', 'chevronDown', 'sun', 'moon', 'mail', 'linkedin', 'github']
    for (const name of used) expect(iconDraws(name), `icon "${name}"`).toBe(true)
  })
})

describe('docs page data', () => {
  it('every framework or tool has a name, an https link and a description', () => {
    for (const s of stack) {
      expect(s.name).toMatch(/\S/)
      expect(isHttps(s.url), s.url).toBe(true)
      expect(s.use).toMatch(/\S/)
    }
  })

  it('the main tools show a version read from package.json', () => {
    for (const name of ['React', 'Vite', '@vitejs/plugin-react', 'Oxlint']) {
      expect(stack.find((s) => s.name === name)?.version, name).toMatch(/^\d+\.\d+$/)
    }
  })

  it('languages, techniques and scripts are filled in', () => {
    expect(languages.length).toBeGreaterThan(0)
    for (const [term, desc] of techniques) {
      expect(term).toMatch(/\S/)
      expect(desc).toMatch(/\S/)
    }
    expect(scripts.map(([cmd]) => cmd)).toContain('npm run build')
  })

  it('the AI-assistance note names the tool, links to it and lists what it helped with', () => {
    expect(aiAssist.name).toMatch(/\S/)
    expect(isHttps(aiAssist.url)).toBe(true)
    expect(aiAssist.helped.length).toBeGreaterThan(0)
  })
})
