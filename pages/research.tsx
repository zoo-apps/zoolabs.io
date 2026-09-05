import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { Paragraph, XStack, YStack } from '@hanzo/ui'
import Chrome, { MEASURE } from '../components/Chrome'
import { BRAND, Label, Panel, Press } from '../components/kit'
import type { Colour } from '../lib/brand'
import { load, search, type Corpus, type Work } from '../lib/research'

const SHELVES = [
  { key: 'papers', label: 'Papers', hue: BRAND.magenta },
  { key: 'zips', label: 'Proposals', hue: BRAND.cyan },
] as const

const field: React.CSSProperties = {
  flex: 1,
  minWidth: 220,
  maxWidth: 380,
  height: 46,
  padding: '0 14px',
  font: 'inherit',
  /* After the shorthand, which resets size. A field you type into sits a rung
     above the page, here and on the door, and it is the rung that clears iOS
     Safari's zoom-on-focus. */
  fontSize: 'var(--text-xl)',
  color: BRAND.ink,
  background: 'white',
  border: `2px solid ${BRAND.ink}`,
  borderRadius: 0,
  boxShadow: `6px 6px 0 0 ${BRAND.ink}`,
  outlineColor: BRAND.cyan,
  marginLeft: 'auto',
}

export default function Research() {
  const [corpus, setCorpus] = useState<Corpus | null>(null)
  const [problem, setProblem] = useState('')
  const [shelf, setShelf] = useState<(typeof SHELVES)[number]['key']>('papers')
  const [query, setQuery] = useState('')

  useEffect(() => {
    load()
      .then(setCorpus)
      .catch((err) => setProblem(err.message))
  }, [])

  const works = corpus?.[shelf] ?? []
  const found = useMemo(() => search(works, query), [works, query])
  const hue = SHELVES.find((s) => s.key === shelf)!.hue

  return (
    <Chrome>
      <Head>
        <title>Research — Zoo Labs</title>
        <meta
          name="description"
          content="Every paper and improvement proposal published by Zoo Labs Foundation, searchable in one place."
        />
      </Head>

      <YStack maxW={MEASURE} width="100%" mx="auto" px="$4" py="$5" gap="$4">
        <h1>Everything we have published.</h1>
        <Paragraph maxW={640}>
          Zoo Labs Foundation publishes its research in the open. This page is built straight
          from those documents — titles and abstracts are the authors&rsquo; own.
        </Paragraph>

        <XStack flexWrap="wrap" items="center" gap="$2">
          {SHELVES.map((s) => (
            <Press key={s.key} onPress={() => setShelf(s.key)} tone={shelf === s.key ? s.hue : undefined}>
              <Label color={shelf === s.key ? 'white' : BRAND.ink}>
                {s.label} {corpus ? corpus[s.key].length : ''}
              </Label>
            </Press>
          ))}

          <input
            id="find"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles and abstracts…"
            aria-label="Search the corpus"
            autoComplete="off"
            style={field}
          />
        </XStack>

        {problem ? (
          <div role="alert">
            <Panel borderColor={BRAND.red}>
              <Paragraph>{problem}</Paragraph>
            </Panel>
          </div>
        ) : null}

        {!corpus && !problem && <Paragraph>Loading the corpus…</Paragraph>}

        {corpus && (
          <>
            <Label opacity={0.7}>
              {found.length} {found.length === 1 ? 'document' : 'documents'}
              {query ? ' matching' : ''}
            </Label>

            <XStack flexWrap="wrap" gap="$4">
              {found.map((work) => (
                <Card key={work.id} work={work} hue={hue} />
              ))}
            </XStack>

            {found.length === 0 && (
              <Panel>
                <Paragraph>Nothing matches “{query}”. Try a broader word.</Paragraph>
              </Panel>
            )}
          </>
        )}
      </YStack>
    </Chrome>
  )
}

function Card({ work, hue }: { work: Work; hue: Colour }) {
  return (
    <Panel grow={1} flexBasis={300} maxW={520} gap="$2" spine={hue}>
      <Label color={hue}>
        {work.kind === 'zip' ? work.id : 'Paper'}
        {work.status ? ` · ${work.status}` : ''}
      </Label>
      {/* A plain anchor, because a gui one carries the body weight and the body
          size as classes of its own and the title would render at neither its
          own weight nor its own size. */}
      <h2>
        <a href={work.url}>{work.title}</a>
      </h2>
      {work.summary ? <Paragraph opacity={0.8}>{work.summary}</Paragraph> : null}
    </Panel>
  )
}
