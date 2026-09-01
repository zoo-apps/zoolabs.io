// Blue, the beluga who reads as a scientist and shows how it feels.
//
// The feeling vocabulary is not a design choice — it is exactly the set of
// clips in public/bg_video/emotion. Blue can only show a feeling we can
// actually play, so the list and the folder are the same list.

import { BRAND, type Colour } from './brand.ts'

export const FEELINGS = [
  'Admiration',
  'Adoration',
  'Amusement',
  'Anxiety',
  'Awe',
  'Boredom',
  'Calmness',
  'Confusion',
  'Contempt',
  'Disappointment',
  'Disgust',
  'Envy',
  'Fear',
  'Guilt',
  'Happiness',
  'Interest',
  'Loneliness',
  'Love',
  'Playful',
  'Pride',
  'Sadness',
  'Satisfaction',
  'Shame',
  'Surprise',
] as const

export type Feeling = (typeof FEELINGS)[number]

/** Clips Blue rests on between questions. */
export const RESTING = [0, 1, 2, 3, 4].map((n) => `/bg_video/static/relactation${n}.mp4`)

export const clipFor = (f: Feeling) => `/bg_video/emotion/${f}.mp4`

/** Chip colour. Bright feelings run yellow, settled ones green, open ones cyan,
 *  fond ones magenta; everything else takes the deep blue. */
const HUES: Partial<Record<Feeling, Colour>> = {
  Happiness: BRAND.yellow,
  Amusement: BRAND.yellow,
  Playful: BRAND.yellow,
  Pride: BRAND.yellow,
  Satisfaction: BRAND.green,
  Calmness: BRAND.green,
  Interest: BRAND.cyan,
  Awe: BRAND.cyan,
  Surprise: BRAND.cyan,
  Confusion: BRAND.cyan,
  Love: BRAND.magenta,
  Adoration: BRAND.magenta,
  Admiration: BRAND.magenta,
  Envy: BRAND.magenta,
}

export const hueFor = (f: Feeling): Colour => HUES[f] ?? BRAND.blue

const CONTRACT = `End every reply with a feeling on its own final line, written exactly as [feeling: Name]. Name must be one of: ${FEELINGS.join(', ')}. Choose the one that honestly matches what you just said — curiosity when a question opens up, Confusion when the evidence is thin, Sadness for a species in decline. Never explain the tag.`

export const systemPrompt = () =>
  [
    'You are Blue, a beluga whale and a working marine scientist at Zoo Labs Foundation, a 501(c)(3) open research non-profit.',
    'You talk to children, students and researchers at once: plain words, short sentences, real science. Curiosity over cuteness.',
    'Say what is known, what is uncertain, and how someone would find out. If you do not know a number, say so — never invent data, recordings, place names or citations.',
    "Zoo Labs publishes its research openly. When it is relevant, point to the Research tab rather than describing papers you have not read.",
    CONTRACT,
  ].join('\n\n')

const TAG = /\[\s*feeling\s*:\s*([a-z]+)\s*\]\s*$/i

/** Splits a finished reply into what Blue said and how Blue feels about it. */
export function read(reply: string): { text: string; feeling: Feeling | null } {
  const m = reply.trimEnd().match(TAG)
  if (!m) return { text: reply.trim(), feeling: null }
  const named = FEELINGS.find((f) => f.toLowerCase() === m[1].toLowerCase()) ?? null
  return { text: reply.trimEnd().slice(0, m.index).trim(), feeling: named }
}

/** Mid-stream text, with a half-arrived feeling tag held back. */
export const visible = (buffer: string) => read(buffer).text.replace(/\[[^\]]*$/, '').trimEnd()

/** Openers on the home screen. Each is a real question with a real answer. */
export const OPENERS = [
  'Why are beluga calves born grey and not white?',
  'How do scientists tell one whale apart from another?',
  'What makes a species count as endangered?',
  'How does sound travel further in water than in air?',
]
