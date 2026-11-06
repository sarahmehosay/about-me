// Checks index.html: the page shell, the saved-theme script and the Google Analytics (gtag.js) snippet.
// The snippets are never loaded from Google: the config script runs in a simulated browser, and the
// external gtag.js file is not fetched.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])
const themeScript = inlineScripts.find((s) => s.includes("getItem('theme')"))
const gaScript = inlineScripts.find((s) => s.includes('gtag('))
const gaLoader = html.match(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=([^"]+)"><\/script>/)

describe('index.html: page shell', () => {
  it('is English, mobile-friendly and has a title, description and icon', () => {
    expect(html).toMatch(/<html lang="en">/)
    expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1\.0" \/>/)
    expect(html).toMatch(/<title>[^<]+<\/title>/)
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/)
    expect(html).toMatch(/<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg/)
  })

  it('has the empty #root that React fills, and loads the app', () => {
    expect(html).toContain('<div id="root"></div>')
    expect(html).toMatch(/<script type="module" src="\/src\/main\.jsx"><\/script>/)
  })
})

describe('index.html: saved theme script', () => {
  const run = () => new Function(themeScript)()

  it('exists and runs before the page is drawn (in <head>)', () => {
    expect(themeScript).toBeTruthy()
    expect(html.indexOf(themeScript)).toBeLessThan(html.indexOf('<body>'))
  })

  it.each(['dark', 'light'])('applies a saved "%s" choice', (choice) => {
    localStorage.setItem('theme', choice)
    run()
    expect(document.documentElement.dataset.theme).toBe(choice)
  })

  it.each([[null], ['blue'], ['']])('ignores anything that is not light or dark (%s)', (value) => {
    if (value !== null) localStorage.setItem('theme', value)
    run()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('does not break the page when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    expect(run).not.toThrow()
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})

describe('index.html: Google Analytics', () => {
  const ID = 'G-9J464XPMRB'
  const cleanUp = () => { delete globalThis.dataLayer; delete window.dataLayer }
  const run = () => new Function(gaScript)()
  beforeEach(cleanUp)
  afterEach(cleanUp)

  it('loads gtag.js from Google asynchronously, in <head>, before the config script', () => {
    expect(gaLoader, 'the <script async src=".../gtag/js?id=..."> tag').toBeTruthy()
    expect(html.indexOf(gaLoader[0])).toBeLessThan(html.indexOf('</head>'))
    expect(html.indexOf(gaLoader[0])).toBeLessThan(html.indexOf(gaScript))
    expect(html.indexOf(gaScript)).toBeLessThan(html.indexOf('</head>'))
  })

  it('has a real measurement ID, not the placeholder from the setup instructions', () => {
    expect(gaLoader[1]).toMatch(/^G-[A-Z0-9]{10}$/)
    expect(html).not.toContain('G-XXXXXXXXXX')
    expect(gaLoader[1]).toBe(ID)
  })

  it('uses the same ID to load the script and to configure it, and nowhere else', () => {
    expect(html.match(/G-[A-Z0-9]+/g)).toEqual([ID, ID])
    expect(gaScript).toContain(`gtag("config", "${ID}")`)
  })

  it('no longer contains the old Google Tag Manager snippet', () => {
    expect(html).not.toMatch(/GTM-[A-Z0-9]+/)
    expect(html).not.toContain('gtm.js')
    expect(html).not.toContain('ns.html')
    expect(html).not.toMatch(/<noscript>/)
  })

  it('records the start time and the configuration, in that order', () => {
    run()
    const entries = window.dataLayer.map((e) => Array.from(e))
    expect(entries).toHaveLength(2)
    expect(entries[0][0]).toBe('js')
    expect(entries[0][1]).toBeInstanceOf(Date)
    expect(entries[1]).toEqual(['config', ID])
  })

  it('keeps anything already in the dataLayer', () => {
    const earlier = { event: 'earlier' }
    window.dataLayer = [earlier]
    run()
    expect(window.dataLayer[0]).toBe(earlier)
    expect(window.dataLayer).toHaveLength(3)
  })

  it('does not load anything from Google when run (the script only queues commands)', () => {
    const before = document.querySelectorAll('script').length
    run()
    expect(document.querySelectorAll('script')).toHaveLength(before)
  })
})
