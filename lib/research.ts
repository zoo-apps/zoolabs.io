// The Zoo Labs corpus. public/research.json is generated from the papers and
// proposals themselves by scripts/research.mjs — re-run it when either moves.

export type Work = {
  kind: 'paper' | 'zip'
  id: string
  title: string
  summary: string
  url: string
  topic?: string
  status?: string
}

export type Corpus = { papers: Work[]; zips: Work[] }

export const load = async (): Promise<Corpus> => {
  const res = await fetch('/research.json')
  if (!res.ok) throw new Error(`Could not load the corpus (${res.status})`)
  return res.json()
}

/** Ranks title matches above summary matches; every term must appear. */
export function search(works: Work[], query: string): Work[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return works

  return works
    .flatMap((w) => {
      const title = w.title.toLowerCase()
      const body = `${title} ${w.summary.toLowerCase()} ${w.id.toLowerCase()}`
      if (!terms.every((t) => body.includes(t))) return []
      return [{ work: w, rank: terms.filter((t) => title.includes(t)).length }]
    })
    .sort((a, b) => b.rank - a.rank)
    .map(({ work }) => work)
}
