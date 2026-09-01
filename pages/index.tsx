import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Send,
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowUp,
  ExternalLink,
  Github,
  ChevronRight,
  Users,
  Monitor,
  Code2,
  Layers,
  Sparkle,
  Share2,
  Copy,
  Check,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

// Local pre-cached video clips
const STATIC_CLIPS = [
  '/bg_video/static/relactation0.mp4',
  '/bg_video/static/relactation1.mp4',
  '/bg_video/static/relactation2.mp4',
  '/bg_video/static/relactation3.mp4',
  '/bg_video/static/relactation4.mp4',
]

const EMOTION_MAP: Record<string, { name: string; emoji: string; desc: string }> = {
  happy: { name: 'Happy', emoji: '😊', desc: 'Joyful acoustic telemetry and radiant ocean bubbles.' },
  happiness: { name: 'Happy', emoji: '😊', desc: 'Joyful acoustic telemetry and radiant ocean bubbles.' },
  joy: { name: 'Happy', emoji: '😊', desc: 'Joyful acoustic telemetry and radiant ocean bubbles.' },
  playful: { name: 'Playful', emoji: '🐬', desc: 'Playful spiraling swim with rhythmic echolocation pulses.' },
  play: { name: 'Playful', emoji: '🐬', desc: 'Playful spiraling swim with rhythmic echolocation pulses.' },
  love: { name: 'Love', emoji: '💙', desc: 'Deep empathetic resonance and social pod connection.' },
  adoration: { name: 'Love', emoji: '🥰', desc: 'Affectionate proximity and gentle tail glide.' },
  admiration: { name: 'Admiration', emoji: '✨', desc: 'Awe-inspired acoustic telemetry and high attention.' },
  amusement: { name: 'Amusement', emoji: '😄', desc: 'Playful bubbles emitted in rapid succession.' },
  awe: { name: 'Wonder', emoji: '🌟', desc: 'Wide acoustic aperture detecting novel patterns.' },
  interest: { name: 'Curious', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  curious: { name: 'Curious', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  curiosity: { name: 'Curious', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  calm: { name: 'Calm', emoji: '🌊', desc: 'Tranquil resting glide through deep arctic currents.' },
  calmness: { name: 'Calm', emoji: '🌊', desc: 'Tranquil resting glide through deep arctic currents.' },
  satisfaction: { name: 'Content', emoji: '😌', desc: 'Content equilibrium after solving a task.' },
  surprise: { name: 'Surprise', emoji: '😲', desc: 'Sudden frequency modulation to novel stimulus.' },
  surprised: { name: 'Surprise', emoji: '😲', desc: 'Sudden frequency modulation to novel stimulus.' },
  pride: { name: 'Proud', emoji: '👑', desc: 'Triumphant sonic signature representing Zoo DAO.' },
  proud: { name: 'Proud', emoji: '👑', desc: 'Triumphant sonic signature representing Zoo DAO.' },
  sad: { name: 'Gentle', emoji: '🥺', desc: 'Low-frequency tone reflecting on endangered species.' },
}

const CLEAN_PROMPTS = [
  "Origin Eggs & 1,500+ Species",
  "Donate to Wildlife (zoo.ngo)",
  "Blue as Desktop Familiar / Bot",
  "Vibe with Friends Sandbox",
  "Endangered Wildlife Telemetry",
]

const IDLE_THOUGHTS = [
  "I wonder what the Sumatran tigers are doing right now...",
  "Did you know beluga whales use echolocation to navigate underwater caves?",
  "Ready when you are! Ask me anything about wildlife or AI agents.",
  "The ocean is calm today... What shall we build or explore together?",
  "Echolocation ping sent. Waiting for your signal...",
  "Hatching an Origin Egg with 1,500+ species is coming to the metaverse.",
  "We donate proceeds directly to real wildlife conservation on Earth.",
  "Blowing some ocean bubbles while you think...",
  "Blue the Beluga is free and open-source for everyone to vibe with.",
]

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  emotion?: string
  timestamp?: string
}

let seq = 0
const uid = () => `msg_${Date.now()}_${++seq}`

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: 'assistant',
      content:
        "Hello friend. I'm Blue, the open-source emotionally intelligent Beluga whale avatar for Zoo Labs. Watch me swim and react as we chat about wildlife, AI agents, and our decentralized sandbox.",
      emotion: 'Happiness',
      timestamp: 'Just now',
    },
  ])

  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [currentEmotionKey, setCurrentEmotionKey] = useState('happy')
  const [floatingFeelings, setFloatingFeelings] = useState<{ id: number; emoji: string }[]>([])
  const [idleThought, setIdleThought] = useState(IDLE_THOUGHTS[0])
  const [showIdleThought, setShowIdleThought] = useState(true)
  const [emotionPopoverOpen, setEmotionPopoverOpen] = useState(false)
  const [vibeModalOpen, setVibeModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Double-buffered crossfading video players
  const [srcA, setSrcA] = useState<string>(STATIC_CLIPS[0])
  const [srcB, setSrcB] = useState<string>('')
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A')
  const [isMuted, setIsMuted] = useState(true)

  const idleLoopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleThoughtTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const currentEmotionMeta = EMOTION_MAP[currentEmotionKey.toLowerCase()] || EMOTION_MAP['happy']
  const randomSwimClip = () => STATIC_CLIPS[Math.floor(Math.random() * STATIC_CLIPS.length)]

  const playVideo = (url: string) => {
    if (activePlayer === 'A') {
      setSrcB(url)
    } else {
      setSrcA(url)
    }
  }

  const handleVideoLoaded = (player: 'A' | 'B') => {
    setActivePlayer(player)
  }

  // Animate small emoji floating up gently strictly from bottom-left to denote feelings
  const spawnBottomLeftFeeling = (emoji: string) => {
    const id = Date.now() + Math.random()
    setFloatingFeelings((prev) => [...prev, { id, emoji }])
    setTimeout(() => {
      setFloatingFeelings((prev) => prev.filter((item) => item.id !== id))
    }, 2200)
  }

  const triggerEmotion = (emotionKey: string) => {
    const cleanKey = emotionKey.toLowerCase()
    const meta = EMOTION_MAP[cleanKey] || EMOTION_MAP['happy']
    setCurrentEmotionKey(cleanKey)
    spawnBottomLeftFeeling(meta.emoji)

    const videoName = meta.name === 'Happy' ? 'Happiness' : meta.name === 'Proud' ? 'Pride' : meta.name === 'Calm' ? 'Calmness' : meta.name
    playVideo(`/bg_video/emotion/${videoName}.mp4`)

    if (idleLoopTimer.current) clearTimeout(idleLoopTimer.current)
    idleLoopTimer.current = setTimeout(() => {
      playVideo(randomSwimClip())
    }, 12000)
  }

  // Idle swim loop
  useEffect(() => {
    const swimCycle = () => {
      playVideo(randomSwimClip())
      idleLoopTimer.current = setTimeout(swimCycle, 18000)
    }
    idleLoopTimer.current = setTimeout(swimCycle, 18000)
    return () => {
      if (idleLoopTimer.current) clearTimeout(idleLoopTimer.current)
    }
  }, [])

  // Idle thought rotator
  useEffect(() => {
    const rotateThought = () => {
      setShowIdleThought(false)
      setTimeout(() => {
        const next = IDLE_THOUGHTS[Math.floor(Math.random() * IDLE_THOUGHTS.length)]
        setIdleThought(next)
        setShowIdleThought(true)
      }, 600)
      idleThoughtTimer.current = setTimeout(rotateThought, 10000)
    }
    idleThoughtTimer.current = setTimeout(rotateThought, 10000)
    return () => {
      if (idleThoughtTimer.current) clearTimeout(idleThoughtTimer.current)
    }
  }, [])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleSend(textToSend?: string) {
    const text = (textToSend ?? input).trim()
    if (!text || busy) return

    setInput('')
    setShowIdleThought(false)

    const userMsg: Message = { id: uid(), role: 'user', content: text, timestamp: 'Just now' }
    const assistantMsg: Message = { id: uid(), role: 'assistant', content: '', timestamp: 'Just now' }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setBusy(true)

    const publishableKey = process.env.NEXT_PUBLIC_HANZO_PUBLISHABLE_KEY || 'pk_live_zoo_beluga'
    const gatewayUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'https://api.hanzo.ai'

    try {
      const res = await fetch(`${gatewayUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publishableKey}`,
          'X-Org-Id': 'zoo',
        },
        body: JSON.stringify({
          model: 'zen-nano-instruct',
          messages: [
            {
              role: 'system',
              content: `You are Blue, the empathetic, emotionally intelligent Beluga whale familiar created by Zoo Labs and Hanzo AI.
You help users vibe with friends, protect endangered wildlife, explore Origin Eggs, and run durable agent tasks in Hanzo Cloud sandbox.
At the very end of your response, ALWAYS append your emotional state in this exact format:
emotion: <mood>
where <mood> is one of: happy, playful, love, curious, calm, surprise, pride.`,
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          stream: true,
        }),
      })

      if (!res.ok) {
        await simulateResponse(text, assistantMsg.id)
        return
      }

      if (!res.body) throw new Error('No stream body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.slice(6))
              const delta = data.choices?.[0]?.delta?.content || ''
              fullText += delta

              let clean = fullText
              let foundEmotion: string | null = null
              const emoIdx = fullText.lastIndexOf('emotion:')
              if (emoIdx !== -1) {
                clean = fullText.slice(0, emoIdx).trimEnd()
                const emoRaw = fullText.slice(emoIdx + 8).trim().split(/[\s\n\]]/)[0]
                if (emoRaw) foundEmotion = emoRaw
              }

              if (foundEmotion && foundEmotion.toLowerCase() !== currentEmotionKey.toLowerCase()) {
                triggerEmotion(foundEmotion)
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: clean, emotion: foundEmotion || undefined } : m
                )
              )
            } catch {
              // Non JSON line
            }
          }
        }
      }
    } catch {
      await simulateResponse(text, assistantMsg.id)
    } finally {
      setBusy(false)
      if (idleLoopTimer.current) clearTimeout(idleLoopTimer.current)
      idleLoopTimer.current = setTimeout(() => playVideo(randomSwimClip()), 14000)
    }
  }

  async function simulateResponse(userText: string, assistantId: string) {
    let reply = ''
    let emoKey = 'playful'
    const lower = userText.toLowerCase()

    if (lower.includes('egg') || lower.includes('hatch') || lower.includes('species')) {
      reply = "Origin Eggs are the genesis for over 1,500+ unique endangered animal familiars that will enter our shared metaverse. Blue is free for everyone, with full on-chain trait verification!"
      emoKey = 'happy'
    } else if (lower.includes('dao') || lower.includes('fund') || lower.includes('donate')) {
      reply = "We donate proceeds directly to real wildlife conservation programs and anti-poaching sensor networks on Earth! You can also support directly at zoo.ngo."
      emoKey = 'pride'
    } else if (lower.includes('desktop') || lower.includes('bot') || lower.includes('clippy')) {
      reply = "Blue runs directly on your computer with @hanzo/bot and the Zoo Desktop App! You can pin Blue as an interactive desktop animal familiar or agentic copilot."
      emoKey = 'playful'
    } else if (lower.includes('vibe') || lower.includes('friend') || lower.includes('sandbox')) {
      reply = "In 'Vibe with Friends' mode, you can invite your pod to chat with Blue simultaneously while executing shared agent workflows and python sandboxes via Hanzo Cloud."
      emoKey = 'love'
    } else {
      reply = `You asked: "${userText}". As Blue the Beluga, I'm here to vibe with your pod, protect wildlife, and run agent tasks across the digital ocean!`
      emoKey = 'calm'
    }

    triggerEmotion(emoKey)
    for (let i = 0; i <= reply.length; i += 3) {
      const partial = reply.slice(0, i)
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: partial, emotion: emoKey } : m))
      )
      await new Promise((r) => setTimeout(r, 20))
    }
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Vibe with Friends x Blue the Beluga</title>
        <meta
          name="description"
          content="Vibe with friends in a shared ocean sandbox with Blue the Beluga, the open-source emotionally intelligent AI animal familiar."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans select-none">
        {/* ─── Apple-Grade Liquid Glass Ocean Video Canvas (Centered Whale) ─── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => handleVideoLoaded('A')}
            onError={() => playVideo(STATIC_CLIPS[0])}
            src={srcA}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
              activePlayer === 'A' ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => handleVideoLoaded('B')}
            onError={() => playVideo(STATIC_CLIPS[0])}
            src={srcB}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
              activePlayer === 'B' ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 backdrop-blur-[0.5px] z-20" />
        </div>

        {/* ─── Apple Unified Floating Chrome ───────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-auto">
          <ZooAppChrome />
        </div>

        {/* ─── Main Viewport: Centered Whale + Sided Chat Bubbles ───────────── */}
        <main className="relative z-30 flex h-full w-full flex-col justify-between pt-16 pb-28 px-4 sm:px-8 overflow-hidden pointer-events-none">
          {/* Proactive Floating Thought Bubble above the Whale in Center */}
          {showIdleThought && !busy && (
            <div className="mx-auto mt-2 max-w-md px-4 text-center transition-all duration-700 animate-bounce pointer-events-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-xs text-white/85 backdrop-blur-2xl shadow-2xl">
                <span>{idleThought}</span>
              </div>
            </div>
          )}

          {/* Sided Conversation Stream (Left & Right Split) */}
          <div
            ref={scrollerRef}
            className="flex-1 my-auto space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] px-2 scrollbar-none pointer-events-auto"
          >
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'

              return (
                <div
                  key={m.id}
                  className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed backdrop-blur-3xl transition-all ${
                      isAssistant
                        ? 'border border-white/15 bg-black/60 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                        : 'bg-blue-600/90 text-white font-medium border border-blue-400/30 shadow-[0_8px_32px_rgba(0,102,255,0.3)]'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          Blue the Beluga
                        </span>
                        <span className="text-[9px] font-mono text-white/50">
                          ● {m.emotion || currentEmotionMeta.name}
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-normal">
                      {m.content || (busy ? <span className="animate-pulse flex items-center gap-1.5 text-white/60"><Sparkles className="w-3.5 h-3.5 text-blue-400" /> Thinking & swimming…</span> : '')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* ─── Bottom Floating Apple-Grade Composer ─────────────────────────── */}
        <div className="absolute bottom-5 left-0 right-0 z-50 px-4 sm:px-6 flex flex-col items-center pointer-events-auto">
          {/* Clean Prompt Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none max-w-2xl w-full justify-center">
            {CLEAN_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={busy}
                className="shrink-0 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/70 hover:border-white/25 hover:bg-black/75 hover:text-white backdrop-blur-2xl active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* ChatGPT-Style Floating Liquid Glass Composer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/65 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.8)] backdrop-blur-3xl max-w-2xl w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Blue anything about Zoo, endangered species, Origin Eggs..."
              className="flex-1 bg-transparent px-4 py-1.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/40 font-normal"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold transition-all hover:bg-blue-500 active:scale-90 disabled:opacity-30 cursor-pointer shadow-md shadow-blue-600/30"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* ─── BOTTOM-LEFT FEELINGS INDICATOR WITH GENTLE UPWARD FLOATING EMOJI ─── */}
        <div className="absolute bottom-6 left-4 sm:left-6 z-50 pointer-events-auto">
          <div className="relative">
            {/* Animated Small Emoji Floating Gently Strictly Upward from Bottom-Left */}
            <div className="absolute -top-10 left-3 pointer-events-none overflow-visible">
              {floatingFeelings.map((item) => (
                <div
                  key={item.id}
                  className="text-2xl transition-all"
                  style={{
                    animation: 'floatFeelingsUp 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                  }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>

            {/* Expandable Liquid Glass Emotion Card */}
            {emotionPopoverOpen && (
              <div
                onMouseEnter={() => setEmotionPopoverOpen(true)}
                onMouseLeave={() => setEmotionPopoverOpen(false)}
                className="absolute bottom-11 left-0 w-72 rounded-2xl border border-white/15 bg-black/85 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.9)] backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{currentEmotionMeta.emoji}</span>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{currentEmotionMeta.name}</h4>
                      <p className="text-[9px] text-white/50">Neural Vector · Qwen3</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-white/70">
                  {currentEmotionMeta.desc}
                </p>

                {/* Micro Emotion Buttons */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[
                    { k: 'happy', e: '😊' },
                    { k: 'playful', e: '🐬' },
                    { k: 'love', e: '💙' },
                    { k: 'curious', e: '🤔' },
                    { k: 'calm', e: '🌊' },
                    { k: 'surprise', e: '😲' },
                    { k: 'pride', e: '👑' },
                  ].map((emo) => (
                    <button
                      key={emo.k}
                      onClick={() => triggerEmotion(emo.k)}
                      className="h-6 w-6 rounded-md bg-white/[0.06] border border-white/10 hover:border-white/30 hover:bg-white/15 flex items-center justify-center text-xs transition-all active:scale-90 cursor-pointer"
                      title={emo.k}
                    >
                      {emo.e}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-1.5 flex items-center justify-between">
                  <Link
                    href="https://docs.zoolabs.io"
                    target="_blank"
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>docs.zoolabs.io</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Clean, Small Feelings Capsule Button */}
            <button
              onMouseEnter={() => setEmotionPopoverOpen(true)}
              onClick={() => setEmotionPopoverOpen(!emotionPopoverOpen)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-2xl shadow-lg hover:border-white/20 hover:bg-black/60 active:scale-95 transition-all cursor-pointer group"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">{currentEmotionMeta.emoji}</span>
              <span className="text-[11px] font-medium text-white/70 group-hover:text-white capitalize">
                {currentEmotionMeta.name}
              </span>
            </button>
          </div>
        </div>

        {/* ─── VIBE WITH FRIENDS MODAL ─────────────────────────────────────── */}
        {vibeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Vibe with Friends Sandbox</h3>
                </div>
                <button
                  onClick={() => setVibeModalOpen(false)}
                  className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs leading-relaxed text-white/70">
                Invite friends or teammates into your shared ocean sandbox. Everyone can chat with Blue simultaneously, run Python commands in the microVM, and trigger animal animations!
              </p>

              <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 p-2 text-xs">
                <input
                  type="text"
                  readOnly
                  value="https://zoolabs.io/#room=ocean_genesis_pod"
                  className="flex-1 bg-transparent text-white/80 outline-none font-mono text-[11px]"
                />
                <button
                  onClick={copyRoomLink}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 active:scale-95 transition-all text-xs"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <span>Free open-source familiar</span>
                <span>Powered by Hanzo Cloud</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes floatFeelingsUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.9);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-24px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-48px) scale(0.8);
          }
        }
      `}</style>
    </>
  )
}
