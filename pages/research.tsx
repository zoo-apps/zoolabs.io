import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { Anchor, H1, H2, Paragraph, XStack, YStack } from '@hanzo/ui'
import Chrome from '../components/Chrome'
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

      <YStack maxW={1120} width="100%" mx="auto" px="$4" py="$5" gap="$4">
        <H1 fontSize={36} lineHeight={40} fontWeight="800">
          Everything we have published.
        </H1>
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

        {problem && (
          <div role="alert">
            <Panel borderColor={BRAND.red}>
              <Paragraph>{problem}</Paragraph>
            </Panel>
          </div>
        )}

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
      <H2 fontSize={17} lineHeight={22} fontWeight="800">
        <Anchor href={work.url} color={BRAND.ink}>
          {work.title}
        </Anchor>
      </H2>
      {work.summary ? (
        <Paragraph fontSize={14} opacity={0.8}>
          {work.summary}
        </Paragraph>
      ) : null}
    </Panel>
  )
}
