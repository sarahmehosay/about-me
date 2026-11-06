import { useEffect, useState } from 'react'

// Checks each project URL once and returns only the ones that respond.
// GitHub Pages allows cross-origin requests, so the real HTTP status can be read.
// Returns null while checking, so nothing is shown until the result is known.
export default function useLiveProjects(projects) {
  const [live, setLive] = useState(null)

  useEffect(() => {
    let cancelled = false
    const check = (p) =>
      fetch(p.url, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(8000) })
        .then((r) => r.ok)
        .catch(() => false)
    Promise.all(projects.map(check)).then((ok) => {
      if (!cancelled) setLive(projects.filter((_, i) => ok[i]))
    })
    return () => { cancelled = true }
  }, [projects])

  return live
}
