import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Anchor, H1, Paragraph, XStack, YStack } from '@hanzo/ui'
import { Label } from '../components/kit'
import ZooLogo from '../components/ZooLogo'
import { reply, type Message } from '../lib/chat'
import { clipFor, OPENERS, RESTING, read, systemPrompt, visible, type Feeling } from '../lib/companion'
import { hush, say } from '../lib/voice'

/**
 * The logged-out door: Blue, full bleed, and one thing to do.
 *
 * This screen is deliberately not the lab. It is dark because it is underwater
 * — the clip IS the page, not an illustration on it — and it holds a single
 * question box, because someone arriving for the first time should not have to
 * choose between eleven surfaces. The lab behind the sign-in is the light,
 * hard-edged system every other Zoo surface uses; the two are different rooms
 * and are meant to look it.
 */

type Turn = { role: 'user' | 'assistant'; text: string }

export default function Blue() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [streaming, setStreaming] = useState('')
  const [thinking, setThinking] = useState(false)
  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const [problem, setProblem] = useState('')
  const [voice, setVoice] = useState(false)
  const [rest, setRest] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const tail = useRef<HTMLDivElement>(null)

  const src = feeling ? clipFor(feeling) : RESTING[rest]

  useEffect(() => {
    video.current?.load()
  }, [src])

  useEffect(() => {
    if (turns.length || streaming) tail.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
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

  const spoken = turns.length > 0 || Boolean(streaming) || Boolean(problem)

  return (
    <>
      <Head>
        <title>Blue — Zoo Labs</title>
        <meta
          name="description"
          content="Blue is a beluga whale and a marine scientist at Zoo Labs Foundation. Ask about the ocean, endangered species, or how research actually gets done."
        />
        {/* This page paints its own dark ground rather than the site's paper. */}
        <meta name="theme-color" content="#06202c" />
      </Head>

      <div className="deep">
        <video
          ref={video}
          className="deep-film"
          src={src}
          autoPlay
          muted
          playsInline
          loop={Boolean(feeling)}
          onEnded={() => !feeling && setRest((n) => (n + 1) % RESTING.length)}
        />
        <div className="deep-veil" />

        <div className="deep-stage">
          <XStack items="center" gap="$3" px="$4" py="$3">
            <XStack items="center" gap="$2">
              <ZooLogo size={22} />
              <Label color="rgba(255,255,255,0.92)">Blue · Zoo</Label>
            </XStack>

            <YStack flex={1} />

            <Link href="/research">
              <Label color="rgba(255,255,255,0.62)">Research</Label>
            </Link>
            <Anchor href="https://zoolabs.id" textDecorationLine="none">
              <Label color="rgba(255,255,255,0.62)">Sign in</Label>
            </Anchor>
          </XStack>

          <YStack flex={1} justify="center" items="center" px="$4" gap="$4">
            {!spoken && (
              <YStack items="center" gap="$3" maxW={560} style={{ textAlign: 'center' }}>
                <H1 fontSize={34} lineHeight={40} fontWeight="800" color="white">
                  Hi, I&rsquo;m Blue the beluga.
                </H1>
                <Paragraph color="rgba(255,255,255,0.72)">
                  Ask me about the ocean, endangered species, or how scientists actually find
                  things out. Watch how I feel as we talk.
                </Paragraph>
                <XStack flexWrap="wrap" justify="center" gap="$2" mt="$2">
                  {OPENERS.slice(0, 3).map((opener) => (
                    <button key={opener} className="deep-chip" onClick={() => ask(opener)}>
                      {opener}
                    </button>
                  ))}
                </XStack>
              </YStack>
            )}

            {spoken && (
              <div className="deep-thread">
                {turns.map((turn, i) => (
                  <div key={i} className={turn.role === 'user' ? 'deep-said deep-mine' : 'deep-said'}>
                    {turn.text}
                  </div>
                ))}
                {streaming ? <div className="deep-said">{streaming}</div> : null}
                {problem ? (
                  <div className="deep-said deep-wrong" role="alert">
                    Blue could not answer — {problem}. Nothing was made up in its place.
                  </div>
                ) : null}
                <div ref={tail} />
              </div>
            )}
          </YStack>

          <YStack items="center" px="$4" pb="$5" gap="$2">
            <form
              className="deep-ask"
              onSubmit={(e) => {
                e.preventDefault()
                ask(draft)
              }}
            >
              <input
                id="question"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Talk to Blue…"
                aria-label="Talk to Blue"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => {
                  const on = !voice
                  setVoice(on)
                  if (!on) hush()
                  else if (turns.length) say(turns[turns.length - 1].text)
                }}
                aria-pressed={voice}
                aria-label={voice ? 'Stop reading answers aloud' : 'Read answers aloud'}
                className="deep-voice"
              >
                {voice ? '🔊' : '🔈'}
              </button>
              <button type="submit" disabled={thinking || !draft.trim()} aria-label="Ask Blue">
                {thinking ? '…' : '↑'}
              </button>
            </form>
            <Label color="rgba(255,255,255,0.45)">
              {thinking ? 'Blue is thinking' : feeling ? `Blue feels ${feeling}` : 'Open source · 501(c)(3)'}
            </Label>
          </YStack>
        </div>
      </div>
    </>
  )
}
