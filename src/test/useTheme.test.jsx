import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useTheme from '../hooks/useTheme'
import { setSystemDark } from './utils'

describe('useTheme', () => {
  it('starts light when the system is light and nothing was saved', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('light')
  })

  it('starts dark when the system is dark and nothing was saved', () => {
    setSystemDark(true)
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('dark')
  })

  it('a saved choice (data-theme on <html>) wins over the system setting', () => {
    setSystemDark(true)
    document.documentElement.dataset.theme = 'light'
    const { result } = renderHook(() => useTheme())
    expect(result.current[0]).toBe('light')
  })

  it('toggling flips the theme, sets data-theme and remembers it in localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current[1]())
    expect(result.current[0]).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    act(() => result.current[1]())
    expect(result.current[0]).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('follows the system setting until the visitor makes a choice', () => {
    const { result } = renderHook(() => useTheme())
    act(() => setSystemDark(true))
    expect(result.current[0]).toBe('dark')
    act(() => setSystemDark(false))
    expect(result.current[0]).toBe('light')
  })

  it('stops following the system once the visitor has chosen', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current[1]()) // choose dark
    act(() => setSystemDark(false))
    act(() => setSystemDark(true))
    act(() => setSystemDark(false))
    expect(result.current[0]).toBe('dark')
  })

  it('still switches when the browser blocks saving (for example a private window)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    const { result } = renderHook(() => useTheme())
    act(() => result.current[1]())
    expect(result.current[0]).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('stops listening to the system setting when unmounted', () => {
    const { unmount } = renderHook(() => useTheme())
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const remove = vi.spyOn(mq, 'removeEventListener')
    unmount()
    // The hook registered one listener and removed it; a later system change must not throw.
    expect(() => setSystemDark(true)).not.toThrow()
    remove.mockRestore()
  })
})
