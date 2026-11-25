import { useCallback, useEffect, useState } from 'react'

/** Keeps the active tab in the URL hash (#pantry, #cook, #insights) so views are linkable. */
export function useHashTab(tabs, fallback) {
  const read = useCallback(() => {
    const hash = window.location.hash.slice(1)
    return tabs.includes(hash) ? hash : fallback
  }, [tabs, fallback])

  const [tab, setTab] = useState(read)

  useEffect(() => {
    const onHash = () => setTab(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [read])

  const go = useCallback((next) => {
    window.history.replaceState(null, '', `#${next}`)
    setTab(next)
    window.scrollTo({ top: 0 })
  }, [])

  return [tab, go]
}
