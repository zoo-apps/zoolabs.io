import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { H1, Paragraph, Strong, XStack, YStack } from '@hanzo/ui'
import Chrome from '../components/Chrome'
import Companion from '../components/Companion'
import { BRAND, Label, Panel, Press } from '../components/kit'
import { reply, type Message } from '../lib/chat'
import { OPENERS, read, systemPrompt, visible, type Feeling } from '../lib/companion'
import { hush, say } from '../lib/voice'

type Turn = { role: 'user' | 'assistant'; text: string }

const SPINES = [BRAND.magenta, BRAND.cyan, BRAND.green, BRAND.yellow]

const field: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: 50,
  padding: '0 14px',
  font: 'inherit',
  color: BRAND.ink,
  background: 'white',
  border: `2px solid ${BRAND.ink}`,
  borderRadius: 0,
  boxShadow: `6px 6px 0 0 ${BRAND.ink}`,
  outlineColor: BRAND.cyan,
}

export default function Ask() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [streaming, setStreaming] = useState('')
  const [thinking, setThinking] = useState(false)
  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const [problem, setProblem] = useState('')
  const [voice, setVoice] = useState(false)
  const tail = useRef<HTMLDivElement>(null)

  // Follow the conversation as it grows — but not on first paint, or the page
  // opens already scrolled past the whale.
  useEffect(() => {
    if (!turns.length && !streaming) return
    tail.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns, streaming])

  async function ask(question: string) {
    if (!question.trim() || thinking) return

    const asked: Turn = { role: 'user', text: question.trim() }
    const history: Message[] = [
      { role: 'system', content: systemPrompt() },
      ...turns.map((t) => ({ role: t.role, content: t.text })),
      { role: 'user', content: asked.text },
    ]

    setTurns((t) => [...t, asked])
    setDraft('')
    setProblem('')
    setThinking(true)
    hush()

    let buffer = ''
    try {
      for await (const token of reply(history)) {
        buffer += token
        setStreaming(visible(buffer))
      }
      const { text, feeling: felt } = read(buffer)
      setTurns((t) => [...t, { role: 'assistant', text }])
      if (felt) setFeeling(felt)
      if (voice) say(text)
    } catch (err) {
      setProblem(err instanceof Error ? err.message : String(err))
    } finally {
      setStreaming('')
      setThinking(false)
    }
  }

  return (
    <Chrome>
      <Head>
        <title>Ask Blue — Zoo Labs</title>
        <meta
          name="description"
          content="Ask Blue, a beluga whale and marine scientist at Zoo Labs Foundation, about ocean science, wildlife and how research gets done."
        />
      </Head>

      <XStack flexWrap="wrap" gap="$6" maxW={1120} width="100%" mx="auto" px="$4" py="$5" items="flex-start">
        <YStack width="100%" $sm={{ width: 300 }} gap="$3">
          <Companion
            feeling={feeling}
            thinking={thinking}
            voice={voice}
            onVoice={(on) => {
              setVoice(on)
              if (!on) hush()
              else if (turns.length) say(turns[turns.length - 1].text)
            }}
          />
          <Paragraph fontSize={14}>
            <Strong>Blue</Strong> is a beluga whale and a marine
            scientist. Blue answers in plain words, says when something is uncertain, and
            never makes up a number.
          </Paragraph>
        </YStack>

        <YStack flex={1} minW={300} gap="$4">
          {turns.length === 0 && !thinking && (
            <Panel gap="$4" p="$5">
              <H1 fontSize={36} lineHeight={40} fontWeight="800">
                Ask a whale a real question.
              </H1>
              <Paragraph>
                Blue works at Zoo Labs Foundation, an open research non-profit. Ask about
                oceans, animals, or how scientists actually find things out.
              </Paragraph>
              <YStack gap="$2">
                {OPENERS.map((opener, i) => (
                  <Press
                    key={opener}
                    onPress={() => ask(opener)}
                    justify="flex-start"
                    borderLeftWidth={10}
                    borderLeftColor={SPINES[i % SPINES.length]}
                  >
                    <Paragraph fontSize={14} fontWeight="700" text="left">
                      {opener}
                    </Paragraph>
                  </Press>
                ))}
              </YStack>
            </Panel>
          )}

          {turns.map((turn, i) => (
            <article key={i}>
              <Panel
                self={turn.role === 'user' ? 'flex-end' : 'stretch'}
                maxW={turn.role === 'user' ? '85%' : undefined}
                bg={turn.role === 'user' ? BRAND.blue : 'rgba(255,255,255,0.82)'}
                gap="$2"
              >
                <Label color={turn.role === 'user' ? BRAND.yellow : BRAND.magenta}>
                  {turn.role === 'user' ? 'You' : 'Blue'}
                </Label>
                <Paragraph
                  color={turn.role === 'user' ? 'white' : BRAND.ink}
                  whiteSpace="pre-wrap"
                >
                  {turn.text}
                </Paragraph>
              </Panel>
            </article>
          ))}

          {streaming ? (
            <article>
              <Panel gap="$2">
                <Label color={BRAND.magenta}>Blue</Label>
                <Paragraph whiteSpace="pre-wrap">{streaming}</Paragraph>
              </Panel>
            </article>
          ) : null}

          {problem ? (
            <div role="alert">
              <Panel borderColor={BRAND.red} gap="$2">
                <Label color={BRAND.red}>Blue could not answer</Label>
                <Paragraph>{problem}</Paragraph>
                <Paragraph fontSize={14}>
                  Nothing was made up in place of an answer. Try again in a moment.
                </Paragraph>
              </Panel>
            </div>
          ) : null}

          <div ref={tail} />

          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(draft)
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              id="question"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Blue anything about the ocean…"
              aria-label="Ask Blue a question"
              autoComplete="off"
              style={field}
            />
            <Press onPress={() => ask(draft)} tone={BRAND.magenta} disabled={thinking || !draft.trim()}>
              <Label color="white">{thinking ? 'Asking…' : 'Ask'}</Label>
            </Press>
          </form>
        </YStack>
      </XStack>
    </Chrome>
  )
}
