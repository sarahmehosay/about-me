import { useEffect, useState } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

// The theme in use: the visitor's saved choice (data-theme on <html>), otherwise the system setting.
const current = () => document.documentElement.dataset.theme || (window.matchMedia(QUERY).matches ? 'dark' : 'light')

export default function useTheme() {
  const [theme, setTheme] = useState(current)

  // Until the visitor makes a choice, follow changes of the system setting.
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => { if (!document.documentElement.dataset.theme) setTheme(current()) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('theme', next) } catch { /* private mode: the choice just isn't remembered */ }
    setTheme(next)
  }

  return [theme, toggle]
}
