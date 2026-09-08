import { useEffect, useRef, useState } from 'react'

/**
 * How a reader got here, and where they go next.
 *
 * Blue is one page. zoo.ngo puts that same page in its hero rather than growing
 * a second Blue, so this file is the whole of the difference between the two:
 * `?embed` drops the chrome the host already draws, and `?q` is a question
 * asked somewhere else that should be answered here rather than forgotten.
 *
 * Read after mount, from location — the site is a static export, so the query
 * is not known at build time and reading it during render would hydrate wrong.
 */
export type Arrival = { embedded: boolean; seed: string }

export function useArrival(): Arrival {
  const [it, set] = useState<Arrival>({ embedded: false, seed: '' })
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    set({ embedded: q.has('embed'), seed: (q.get('q') ?? '').slice(0, 400) })
  }, [])
  return it
}

/** Ask `question` once, whenever it arrives, and never again. */
export function useSeed(seed: string, ask: (q: string) => void) {
  const done = useRef(false)
  useEffect(() => {
    if (!seed || done.current) return
    done.current = true
    ask(seed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed])
}

/** This page, at the top of a window, carrying the question already asked. */
export const full = (question?: string) =>
  'https://zoolabs.io/' + (question ? '?q=' + encodeURIComponent(question) : '')
