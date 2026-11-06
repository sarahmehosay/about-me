import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useLiveProjects from '../hooks/useLiveProjects'
import { deferred, mockFetch } from './utils'

const A = { name: 'A', url: 'https://example.test/a/' }
const B = { name: 'B', url: 'https://example.test/b/' }
const projects = [A, B]

describe('useLiveProjects', () => {
  it('returns null while it is still checking', () => {
    const wait = deferred()
    const fetchMock = mockFetch({})
    fetchMock.mockImplementation(() => wait.promise)
    const { result } = renderHook(() => useLiveProjects(projects))
    expect(result.current).toBeNull()
  })

  it('keeps only the demos that answer with a success status', async () => {
    mockFetch({ [A.url]: true, [B.url]: false })
    const { result } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(result.current).toEqual([A])
  })

  it('treats a failed request (site down, blocked, offline) as "not live"', async () => {
    mockFetch({ [A.url]: 'error', [B.url]: true })
    const { result } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(result.current).toEqual([B])
  })

  it('returns an empty list when every demo is down', async () => {
    mockFetch({ '*': 'error' })
    const { result } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).toEqual([]))
  })

  it('returns every project when all demos are up, in the original order', async () => {
    mockFetch({ '*': true })
    const { result } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).toEqual([A, B]))
  })

  it('sends a light HEAD request, never cached, with a time limit', async () => {
    const fetchMock = mockFetch({ '*': true })
    const { result } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).not.toBeNull())
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(A.url)
    expect(options.method).toBe('HEAD')
    expect(options.cache).toBe('no-store')
    expect(options.signal).toBeInstanceOf(AbortSignal)
  })

  it('does not check again when the page re-renders with the same list', async () => {
    const fetchMock = mockFetch({ '*': true })
    const { result, rerender } = renderHook(() => useLiveProjects(projects))
    await waitFor(() => expect(result.current).not.toBeNull())
    rerender()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('ignores a late answer after the page was left (no update after unmount)', async () => {
    const wait = deferred()
    mockFetch({}).mockImplementation(() => wait.promise)
    const { result, unmount } = renderHook(() => useLiveProjects(projects))
    unmount()
    wait.resolve({ ok: true })
    await Promise.resolve()
    expect(result.current).toBeNull()
  })
})
