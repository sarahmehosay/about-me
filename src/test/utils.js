// Shared test helpers.
import { vi } from 'vitest'

// --- System colour scheme (window.matchMedia) --------------------------------------------------
// jsdom has no matchMedia. This stand-in answers "(prefers-color-scheme: dark)" from a switch the
// tests control, and tells listeners when the switch changes.
const media = { dark: false, listeners: new Set() }

export function installMatchMedia() {
  window.matchMedia = vi.fn((query) => ({
    media: query,
    get matches() { return query.includes('prefers-color-scheme: dark') ? media.dark : false },
    addEventListener: (_type, fn) => media.listeners.add(fn),
    removeEventListener: (_type, fn) => media.listeners.delete(fn),
    addListener: (fn) => media.listeners.add(fn),
    removeListener: (fn) => media.listeners.delete(fn),
    onchange: null,
    dispatchEvent: () => false,
  }))
}

export function setSystemDark(isDark) {
  media.dark = isDark
  media.listeners.forEach((fn) => fn({ matches: isDark }))
}

export function resetSystemTheme() {
  media.dark = false
  media.listeners.clear()
}

// --- fetch -------------------------------------------------------------------------------------
// Replaces fetch with a fake that answers per address: true = HTTP 200, false = HTTP 500,
// 'error' = the request fails (as when a site is down or blocked).
export function mockFetch(answers) {
  const fn = vi.fn((url) => {
    const answer = answers[url] ?? answers['*']
    if (answer === 'error' || answer === undefined) return Promise.reject(new TypeError('Failed to fetch'))
    return Promise.resolve({ ok: !!answer, status: answer ? 200 : 500 })
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

// A promise you resolve by hand, to test what the page shows while a request is still pending.
export function deferred() {
  let resolve
  const promise = new Promise((r) => { resolve = r })
  return { promise, resolve }
}

// --- layout ------------------------------------------------------------------------------------
// jsdom does no layout, so every element is 0 px tall. This gives sections fake positions
// (top of each section, in px from the top of the window) and fakes the page height.
export function fakeSections(tops, { scrollHeight = 5000, scrollY = 0 } = {}) {
  const els = Object.entries(tops).map(([id, top]) => {
    const el = document.createElement('section')
    el.id = id
    el.getBoundingClientRect = () => ({ top, bottom: top + 400, left: 0, right: 0, width: 0, height: 400, x: 0, y: top })
    document.body.appendChild(el)
    return el
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: scrollHeight })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY })
  return () => {
    els.forEach((el) => el.remove())
    delete document.documentElement.scrollHeight
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  }
}

// A mouse move as the menu sees it (jsdom has no PointerEvent).
export function mouseMove(clientY, pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { clientY, bubbles: true })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  window.dispatchEvent(event)
}
