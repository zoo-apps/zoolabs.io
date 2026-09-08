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
/** What the foundation has published, as its own site counts it. */
export type Corpus = { papers: number; proposals: number; models: number }

export type Arrival = { embedded: boolean; seed: string; corpus: Corpus | null }

// A count arrives as a number or it does not arrive. Anything a URL can carry
// reaches a prompt, so nothing here is passed through as text: three integers in
// a plausible range, or nothing.
const counted = (q: URLSearchParams): Corpus | null => {
  const n = (k: string) => {
    const v = Number(q.get(k))
    return Number.isInteger(v) && v > 0 && v < 100_000 ? v : null
  }
  const papers = n('papers'), proposals = n('proposals'), models = n('models')
  return papers && proposals && models ? { papers, proposals, models } : null
}

export function useArrival(): Arrival {
  const [it, set] = useState<Arrival>({ embedded: false, seed: '', corpus: null })
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    set({ embedded: q.has('embed'), seed: (q.get('q') ?? '').slice(0, 400), corpus: counted(q) })
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
