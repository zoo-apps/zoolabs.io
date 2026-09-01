import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  ArrowUp,
  Sparkles,
  Users,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Bot,
  Zap,
  Layers,
  Smile,
  Maximize2,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

const STATIC_CLIPS = [
  '/bg_video/static/relactation0.mp4',
  '/bg_video/static/relactation1.mp4',
  '/bg_video/static/relactation2.mp4',
  '/bg_video/static/relactation3.mp4',
]

const EMOTION_MAP: Record<string, { name: string; emoji: string; desc: string; clip?: string }> = {
  happy: { name: 'Happy', emoji: '😊', desc: 'Positive neural state · High reward convergence.' },
  playful: { name: 'Playful', emoji: '🐬', desc: 'Submerged acoustic echolocation ping active.' },
  love: { name: 'Empathetic', emoji: '💙', desc: 'Synchronized multi-agent attention weight matrix.' },
  curious: { name: 'Curious', emoji: '🤔', desc: 'Dynamic parameter exploration and frontier reasoning.' },
  calm: { name: 'Serene', emoji: '🌊', desc: 'Baseline steady-state inference over 120kHz stream.' },
  surprise: { name: 'Astonished', emoji: '😲', desc: 'High-entropy input detected across Hanzo Cloud.' },
  proud: { name: 'Proud', emoji: '👑', desc: 'Decentralized open weights benchmark completed.' },
  sad: { name: 'Gentle', emoji: '🥺', desc: 'Reflective deep acoustic tone monitoring pod state.' },
}

const CLEAN_PROMPTS = [
  'Sovereign AI Foundation',
  'BitDelta & DeltaSoup',
  'Zoo Desktop Familiar',
  'Live Python MicroVM',
  '3D Character Avatars',
]

const IDLE_THOUGHTS = [
  'BitDelta parameter soup is compiling the latest low-rank updates...',
  'Zoo Desktop App runs native Rust and Pyodide microVMs locally.',
  'Ready to execute autonomous agent loops or synthesize 3D character rigs.',
  'The sovereign AI foundation is open-source and decentralized.',
  'Echolocation neural vector aligned. Send your query anytime!',
  'Blowing some ocean bubbles while you think...',
  'Blue the Beluga is free and open-source for everyone to vibe with.',
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
        "Hello friend. I'm Blue, the sovereign AI familiar and open-source foundation avatar for Zoo Labs. Powered by Zen weights, BitDelta parameter soup, and Hanzo Cloud microVMs. What shall we create or deploy today?",
      emotion: 'Happy',
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

  const currentEmotionMeta = EMOTION_MAP[currentEmotionKey] || EMOTION_MAP.happy

  const randomSwimClip = () => {
    const r = STATIC_CLIPS[Math.floor(Math.random() * STATIC_CLIPS.length)]
    return r
  }

  const playVideo = (clipUrl: string) => {
    if (!clipUrl) return
    if (activePlayer === 'A') {
      setSrcB(clipUrl)
    } else {
      setSrcA(clipUrl)
    }
  }

  const handleVideoLoaded = (player: 'A' | 'B') => {
    if (player === 'B' && activePlayer === 'A') {
      setActivePlayer('B')
    } else if (player === 'A' && activePlayer === 'B') {
      setActivePlayer('A')
    }
  }

  useEffect(() => {
    const cycleIdleThoughts = () => {
      idleThoughtTimer.current = setTimeout(() => {
        const next = IDLE_THOUGHTS[Math.floor(Math.random() * IDLE_THOUGHTS.length)]
        setIdleThought(next)
        setShowIdleThought(true)
        setTimeout(() => setShowIdleThought(false), 8000)
        cycleIdleThoughts()
      }, 18000)
    }
    cycleIdleThoughts()
    return () => {
      if (idleThoughtTimer.current) clearTimeout(idleThoughtTimer.current)
    }
  }, [])

  const triggerEmotion = (key: string) => {
    const meta = EMOTION_MAP[key] || EMOTION_MAP.happy
    setCurrentEmotionKey(key)

    const id = Date.now() + Math.random()
    setFloatingFeelings((prev) => [...prev.slice(-3), { id, emoji: meta.emoji }])
    setTimeout(() => {
      setFloatingFeelings((prev) => prev.filter((f) => f.id !== id))
    }, 2400)

    playVideo(randomSwimClip())
  }

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, busy])

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim()
    if (!text || busy) return

    setInput('')
    setShowIdleThought(false)

    const userMsg: Message = { id: uid(), role: 'user', content: text, timestamp: 'Just now' }
    const assistantId = uid()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', timestamp: 'Just now' }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setBusy(true)

    try {
      await simulateResponse(text, assistantId)
    } catch {
      // Fallback
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

    if (lower.includes('sovereign') || lower.includes('foundation') || lower.includes('zen')) {
      reply =
        "Zoo Labs is building the decentralized Sovereign AI Foundation. Open weights, local fine-tuning, and high-performance microVM execution with zero vendor lock-in."
      emoKey = 'proud'
    } else if (lower.includes('bitdelta') || lower.includes('deltasoup') || lower.includes('personalization')) {
      reply =
        "BitDelta and DeltaSoup enable 1-bit quantized parameter personalization. You can blend multiple domain expert LoRAs and task vectors directly in VRAM without retraining!"
      emoKey = 'curious'
    } else if (lower.includes('desktop') || lower.includes('familiar') || lower.includes('app')) {
      reply =
        "The Zoo Desktop App runs native Rust and Pyodide microVMs locally on your Mac, Windows, or Linux. Blue can float as your desktop familiar, listening to audio and executing code in real time."
      emoKey = 'playful'
    } else if (lower.includes('3d') || lower.includes('character') || lower.includes('mesh') || lower.includes('avatar')) {
      reply =
        "Our 3D studio connects ComfyUI generative diffusion, TripoSR, and Trellis mesh synthesis. You can generate textured 3D character rigs and inspect them in real-time WebGL orbit canvases."
      emoKey = 'love'
    } else if (lower.includes('vibe') || lower.includes('room') || lower.includes('friend')) {
      reply =
        "In /vibe, you join a multiplayer studio (like Google Meet + Figma + Cursor). I join the audio call as an embodied PiP avatar while everyone edits code and previews the live app together."
      emoKey = 'happy'
    } else {
      reply = `You asked: "${userText}". As Blue the Beluga, I'm here to vibe with your team, protect open intelligence, and run autonomous agent tasks across the digital ocean!`
      emoKey = 'calm'
    }

    triggerEmotion(emoKey)
    for (let i = 0; i <= reply.length; i += 3) {
      const partial = reply.slice(0, i)
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: partial, emotion: emoKey } : m))
      )
      await new Promise((r) => setTimeout(r, 18))
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
        <title>Zoo Labs — Sovereign AI Foundation x Blue the Beluga</title>
        <meta
          name="description"
          content="Sovereign AI Foundation with Blue the Beluga, open weights, DeltaSoup personalization, and multiplayer agent sandboxes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans select-none">
        {/* ─── Apple-Grade Liquid Glass Ocean Video Canvas ─── */}
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

        {/* ─── Global Top Navigation Chrome ─── */}
        <div className="absolute top-0 left-0 right-0 z-50 pointer-events-auto">
          <ZooAppChrome />
        </div>

        {/* ─── Main Viewport: Centered Ocean + Chat Bubbles ─── */}
        <main className="relative z-30 flex h-full w-full flex-col justify-between pt-16 pb-32 px-4 sm:px-8 overflow-hidden pointer-events-none">
          {/* Proactive Floating Thought Bubble above Whale */}
          {showIdleThought && !busy && (
            <div className="mx-auto mt-2 max-w-md px-4 text-center transition-all duration-700 animate-bounce pointer-events-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-xs text-white/85 backdrop-blur-2xl shadow-2xl">
                <span>{idleThought}</span>
              </div>
            </div>
          )}

          {/* Sided Conversation Stream */}
          <div
            ref={scrollerRef}
            className="flex-1 my-auto space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] px-2 scrollbar-none pointer-events-auto max-w-4xl mx-auto w-full"
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
                        ? 'border border-white/15 bg-black/65 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                        : 'bg-blue-600/90 text-white font-medium border border-blue-400/30 shadow-[0_8px_32px_rgba(0,102,255,0.3)]'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                          <span>🐬</span> Blue the Beluga
                        </span>
                        <span className="text-[9px] font-mono text-white/50">
                          ● {m.emotion || currentEmotionMeta.name}
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-normal">
                      {m.content ||
                        (busy ? (
                          <span className="animate-pulse flex items-center gap-1.5 text-white/60">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Thinking & swimming…
                          </span>
                        ) : (
                          ''
                        ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>

        {/* ─── Bottom Floating Composer & Wrapped Suggestion Chips ─── */}
        <div className="absolute bottom-5 left-0 right-0 z-50 px-4 sm:px-6 flex flex-col items-center pointer-events-auto">
          {/* Wrapped Prompt Chips (Never Truncated) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-2.5 max-w-2xl w-full select-none">
            {CLEAN_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={busy}
                className="rounded-full border border-white/10 bg-black/50 px-3.5 py-1 text-xs text-white/75 hover:border-white/30 hover:bg-black/80 hover:text-white backdrop-blur-2xl active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* ChatGPT-Style Floating Liquid Glass Composer Bar with Emotion Capsule */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-3xl max-w-2xl w-full"
          >
            {/* Embedded Emotion Capsule */}
            <button
              type="button"
              onClick={() => setEmotionPopoverOpen(!emotionPopoverOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/15 text-xs text-white/80 transition-all cursor-pointer"
            >
              <span>{currentEmotionMeta.emoji}</span>
              <span className="text-[11px] font-medium hidden sm:inline">{currentEmotionMeta.name}</span>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Blue about Sovereign AI, BitDelta, 3D Mesh, or Hanzo Cloud..."
              className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/40 font-normal"
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

        {/* ─── Emotion Popover Modal ─── */}
        {emotionPopoverOpen && (
          <div
            className="absolute w-80 rounded-2xl border border-white/15 bg-black/95 p-4 shadow-2xl backdrop-blur-3xl z-50 space-y-3"
            style={{ left: '50%', transform: 'translateX(-50%)', bottom: '90px' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentEmotionMeta.emoji}</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">{currentEmotionMeta.name}</h4>
                  <p className="text-[10px] text-blue-400 font-mono">Zen 70B · BitDelta LoRA</p>
                </div>
              </div>
              <button onClick={() => setEmotionPopoverOpen(false)} className="text-zinc-400 hover:text-white text-xs p-1 cursor-pointer">✕</button>
            </div>

            <p className="text-[11px] leading-relaxed text-white/70">
              {currentEmotionMeta.desc}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { k: 'happy', e: '😊', label: 'Happy' },
                { k: 'playful', e: '🐬', label: 'Playful' },
                { k: 'love', e: '💙', label: 'Empathetic' },
                { k: 'curious', e: '🤔', label: 'Curious' },
                { k: 'calm', e: '🌊', label: 'Serene' },
                { k: 'surprise', e: '😲', label: 'Astonished' },
                { k: 'proud', e: '👑', label: 'Proud' },
              ].map((emo) => (
                <button
                  key={emo.k}
                  onClick={() => {
                    triggerEmotion(emo.k)
                    setEmotionPopoverOpen(false)
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 hover:border-white/30 hover:bg-white/15 text-xs text-white transition-all cursor-pointer"
                >
                  <span>{emo.e}</span>
                  <span className="text-[10px]">{emo.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
