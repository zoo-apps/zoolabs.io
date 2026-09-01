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
  Mic,
  MicOff,
  Radio,
  Compass,
  FileCode,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'

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
  'Arctic Beluga Bioacoustics',
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
        "Hello friend! I'm Blue, the sovereign AI familiar and open-source foundation avatar for Zoo Labs. Powered by Zen weights, BitDelta parameter soup, and Hanzo Cloud microVMs. What mission shall we explore today?",
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
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [isBlueSpeaking, setIsBlueSpeaking] = useState(false)

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

  // Listen to agent speaking state
  useEffect(() => {
    if (typeof window !== 'undefined' && zooAudio.onAgentSpeaking) {
      const unsub = zooAudio.onAgentSpeaking((agentId, speaking) => {
        if (agentId === 'blue' || agentId === 'all') {
          setIsBlueSpeaking(speaking)
        }
      })
      return unsub
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

  const toggleVoiceInput = async () => {
    if (isVoiceListening) {
      setIsVoiceListening(false)
      zooAudio.stopMicrophone()
    } else {
      const ok = await zooAudio.startMicrophone((speaking) => {
        if (speaking) {
          triggerEmotion('curious')
        }
      })
      if (ok) {
        setIsVoiceListening(true)
        // Check if Web Speech Recognition is available
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRec) {
          const rec = new SpeechRec()
          rec.continuous = false
          rec.interimResults = true
          rec.onresult = (e: any) => {
            const transcript = Array.from(e.results)
              .map((r: any) => r[0].transcript)
              .join('')
            setInput(transcript)
          }
          rec.onend = () => {
            setIsVoiceListening(false)
            zooAudio.stopMicrophone()
          }
          rec.start()
        }
      }
    }
  }

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
    } else if (lower.includes('arctic') || lower.includes('beluga') || lower.includes('mission') || lower.includes('sound')) {
      reply =
        "In our Arctic Mission, we correlate 10 years of Beaufort Sea hydrophone spectrograms with sea-ice loss. Raven synthesizes papers, Elephant cleans 1.4TB of audio, and Beaver builds the live chart!"
      emoKey = 'playful'
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

    // Stream response
    for (let i = 0; i <= reply.length; i += 3) {
      const partial = reply.slice(0, i)
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: partial, emotion: emoKey } : m))
      )
      await new Promise((r) => setTimeout(r, 16))
    }

    // Speak response with animal bioacoustics voice
    zooAudio.speakAgent('blue', reply)
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Living World of Humans & AI Animals</title>
        <meta
          name="description"
          content="Sovereign AI Foundation with Blue the Beluga, living agent missions, DeltaSoup personalization, and multiplayer sandboxes."
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
            src={srcA}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              activePlayer === 'A' ? 'opacity-90' : 'opacity-0'
            }`}
          />
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => handleVideoLoaded('B')}
            src={srcB}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              activePlayer === 'B' ? 'opacity-90' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />
        </div>

        {/* ─── Unified App Chrome Navigation ─── */}
        <ZooAppChrome minimal={true} />

        {/* ─── Left Side: Blue's Live Emotion & Agent Presence HUD ─── */}
        <div className="absolute top-20 left-6 z-40 hidden md:flex flex-col gap-3 pointer-events-auto max-w-xs">
          {/* Blue the Beluga Living Status Card */}
          <div className="relative rounded-2xl border border-white/15 bg-black/60 p-3.5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] ring-1 ring-white/10 group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`h-12 w-12 rounded-full overflow-hidden border-2 transition-all ${
                    isBlueSpeaking
                      ? 'border-cyan-400 ring-4 ring-cyan-500/40 animate-pulse'
                      : 'border-white/20'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80"
                    alt="Blue the Beluga"
                    className="h-full w-full object-cover"
                  />
                </div>
                {isBlueSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px]">
                    <Radio className="h-2.5 w-2.5 animate-spin" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🐋 Blue</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-normal">Beluga</span>
                  </h3>
                  <button
                    onClick={() => setEmotionPopoverOpen(!emotionPopoverOpen)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-cyan-300 font-medium transition-all"
                  >
                    <span>{currentEmotionMeta.emoji}</span>
                    <span>{currentEmotionMeta.name}</span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-300 truncate mt-0.5">
                  {busy ? '🐬 Processing neural vectors…' : isBlueSpeaking ? '🔊 Speaking…' : '🌊 Swimming in Arctic Ocean'}
                </p>
              </div>
            </div>

            {/* Live Bioacoustic Frequency Waveform */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Radio className="h-2.5 w-2.5 animate-pulse" /> 120 kHz Echolocation
              </span>
              <span>ZenLM 70B · BitDelta</span>
            </div>
          </div>

          {/* Quick Mission Link Pill */}
          <Link
            href="/vibe"
            className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50 text-xs text-cyan-200 backdrop-blur-xl transition-all shadow-lg hover:border-cyan-400/50"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span>🤝</span> Active Mission: Arctic Belugas
            </span>
            <span className="text-[10px] font-mono bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300">
              68% · 5 Agents
            </span>
          </Link>
        </div>

        {/* ─── Floating Feelings Animation ─── */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {floatingFeelings.map((item) => (
            <div
              key={item.id}
              className="absolute text-3xl sm:text-4xl animate-float-up pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              style={{
                left: `${35 + Math.random() * 30}%`,
                bottom: '120px',
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* ─── Center: Main Conversation Stream ─── */}
        <main className="relative z-20 flex h-full flex-col justify-between pt-16 pb-32 px-4 sm:px-6 pointer-events-none max-w-5xl mx-auto w-full">
          {/* Subtle Ambient Idle Thought Banner */}
          {showIdleThought && (
            <div className="mx-auto mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs text-white/80 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-500 shadow-xl pointer-events-auto">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>{idleThought}</span>
            </div>
          )}

          {/* Conversation Bubbles */}
          <div
            ref={scrollerRef}
            className="flex-1 my-auto space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] px-2 scrollbar-none pointer-events-auto max-w-3xl mx-auto w-full"
          >
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant'

              return (
                <div
                  key={m.id}
                  className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-top-3 duration-500 ease-out`}
                >
                  <div
                    className={`relative max-w-[92%] sm:max-w-md md:max-w-lg rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed backdrop-blur-3xl transition-all shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
                      isAssistant
                        ? 'border border-white/20 bg-black/55 text-white/95 ring-1 ring-white/10 overflow-hidden'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium border border-blue-400/30 shadow-[0_8px_32px_rgba(0,102,255,0.4)]'
                    }`}
                  >
                    {isAssistant && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 relative z-10">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90 flex items-center gap-1.5">
                          <span className="text-sm">🐋</span> Blue the Beluga
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          {m.emotion || currentEmotionMeta.name}
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap font-normal text-zinc-100 relative z-10">
                      {m.content ||
                        (busy ? (
                          <span className="animate-pulse flex items-center gap-2 text-cyan-300 font-mono text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" /> Thinking & exploring…
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

        {/* ─── Bottom Floating Minimalist Liquid Glass Composer ─── */}
        <div className="absolute bottom-5 left-0 right-0 z-50 px-4 sm:px-6 flex flex-col items-center pointer-events-auto">
          {/* Suggestion Prompt Chips */}
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

          {/* Clean, Elegant Floating Bar with Voice Mic & Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/75 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.85)] backdrop-blur-3xl max-w-2xl w-full ring-1 ring-white/10"
          >
            {/* Real Audio Voice Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isVoiceListening ? 'Stop listening' : 'Start voice input'}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer ${
                isVoiceListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {isVoiceListening ? <Mic className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                if (e.target.value.length > 0 && currentEmotionKey === 'calm') {
                  setCurrentEmotionKey('curious')
                }
              }}
              placeholder="Ask Blue anything about marine biology, BitDelta, 3D avatars, or cloud..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/40 font-normal"
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

        {/* ─── Emotion Selector Modal ─── */}
        {emotionPopoverOpen && (
          <div
            className="absolute w-80 rounded-2xl border border-white/15 bg-black/95 p-4 shadow-2xl backdrop-blur-3xl z-50 space-y-3"
            style={{ left: '24px', top: '230px' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentEmotionMeta.emoji}</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">{currentEmotionMeta.name}</h4>
                  <p className="text-[10px] text-blue-400 font-mono">Zen 70B · BitDelta LoRA</p>
                </div>
              </div>
              <button
                onClick={() => setEmotionPopoverOpen(false)}
                className="text-zinc-400 hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
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
