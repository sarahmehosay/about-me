// Runs before every test file. Adds the browser features that jsdom does not have, and cleans up
// between tests so one test can never affect the next.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { installMatchMedia, resetSystemTheme } from './utils'

// <dialog>: jsdom has the element but not showModal() / close().
HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute('open', '') }
HTMLDialogElement.prototype.show = function show() { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function close() {
  if (!this.hasAttribute('open')) return
  this.removeAttribute('open')
  this.dispatchEvent(new Event('close'))
}

// Scrolling is not implemented in jsdom.
window.scrollTo = vi.fn()
Element.prototype.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()

// Used by the live-demo previews to scale the frame to its card.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Used by the live-demo check (8-second limit).
if (typeof AbortSignal.timeout !== 'function') {
  AbortSignal.timeout = (ms) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), ms)
    return controller.signal
  }
}

beforeEach(() => {
  installMatchMedia()
  window.location.hash = ''
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  localStorage.clear()
  delete document.documentElement.dataset.theme
  resetSystemTheme()
  document.title = ''
})
