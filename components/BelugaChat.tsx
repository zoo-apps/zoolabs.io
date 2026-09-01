import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Send,
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Trash2,
  ArrowUp,
  Terminal as TerminalIcon,
  FolderOpen,
  Activity,
  FileCode,
  Code2,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import ZooLogo from './ZooLogo'

// Local pre-cached video clips
const STATIC_CLIPS = [
  '/bg_video/static/relactation0.mp4',
  '/bg_video/static/relactation1.mp4',
  '/bg_video/static/relactation2.mp4',
  '/bg_video/static/relactation3.mp4',
  '/bg_video/static/relactation4.mp4',
]

const EMOTION_MAP: Record<string, { name: string; emoji: string; desc: string }> = {
  happy: { name: 'Happiness', emoji: '😊', desc: 'Joyful, bright vocal clicks and radiant ocean bubbles.' },
  happiness: { name: 'Happiness', emoji: '😊', desc: 'Joyful, bright vocal clicks and radiant ocean bubbles.' },
  joy: { name: 'Happiness', emoji: '😊', desc: 'Joyful, bright vocal clicks and radiant ocean bubbles.' },
  playful: { name: 'Playful', emoji: '🐬', desc: 'Playful spiraling swim with rhythmic echolocation pulses.' },
  play: { name: 'Playful', emoji: '🐬', desc: 'Playful spiraling swim with rhythmic echolocation pulses.' },
  love: { name: 'Love', emoji: '💙', desc: 'Deep empathetic resonance and social connection.' },
  adoration: { name: 'Adoration', emoji: '🥰', desc: 'Affectionate proximity and gentle tail glide.' },
  admiration: { name: 'Admiration', emoji: '✨', desc: 'Awe-inspired acoustic telemetry and high attention.' },
  amusement: { name: 'Amusement', emoji: '😄', desc: 'Playful bubbles emitted in rapid succession.' },
  awe: { name: 'Awe', emoji: '🌟', desc: 'Wide acoustic aperture detecting novel patterns.' },
  interest: { name: 'Interest', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  curious: { name: 'Interest', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  curiosity: { name: 'Interest', emoji: '🤔', desc: 'Curious sonar ping focused on analyzing data.' },
  calm: { name: 'Calmness', emoji: '🌊', desc: 'Tranquil resting glide through deep arctic currents.' },
  calmness: { name: 'Calmness', emoji: '🌊', desc: 'Tranquil resting glide through deep arctic currents.' },
  satisfaction: { name: 'Satisfaction', emoji: '😌', desc: 'Content equilibrium after solving a task.' },
  satisfied: { name: 'Satisfaction', emoji: '😌', desc: 'Content equilibrium after solving a task.' },
  surprise: { name: 'Surprise', emoji: '😲', desc: 'Sudden frequency modulation to novel stimulus.' },
  surprised: { name: 'Surprise', emoji: '😲', desc: 'Sudden frequency modulation to novel stimulus.' },
  pride: { name: 'Pride', emoji: '👑', desc: 'Triumphant sonic signature representing Zoo DAO.' },
  proud: { name: 'Pride', emoji: '👑', desc: 'Triumphant sonic signature representing Zoo DAO.' },
  confusion: { name: 'Confusion', emoji: '🧐', desc: 'Re-sampling bioacoustic channels to clarify intent.' },
  confused: { name: 'Confusion', emoji: '🧐', desc: 'Re-sampling bioacoustic channels to clarify intent.' },
  sad: { name: 'Sadness', emoji: '🥺', desc: 'Low-frequency tone reflecting on endangered species.' },
  sadness: { name: 'Sadness', emoji: '🥺', desc: 'Low-frequency tone reflecting on endangered species.' },
  loneliness: { name: 'Loneliness', emoji: '🌧️', desc: 'Calling out across long distances for companionship.' },
  lonely: { name: 'Loneliness', emoji: '🌧️', desc: 'Calling out across long distances for companionship.' },
  anxiety: { name: 'Axienty', emoji: '⚡', desc: 'Rapid telemetry checks in dynamic conditions.' },
  fear: { name: 'Fear', emoji: '🛡️', desc: 'Protective acoustic shield mode.' },
  boredom: { name: 'Boredom', emoji: '🫧', desc: 'Blowing idle bubbles waiting for input.' },
  bored: { name: 'Boredom', emoji: '🫧', desc: 'Blowing idle bubbles waiting for input.' },
  disappointment: { name: 'Disappointment', emoji: '📉', desc: 'Recalibrating conservation metrics.' },
  disappointed: { name: 'Disappointment', emoji: '📉', desc: 'Recalibrating conservation metrics.' },
  disgust: { name: 'Disgust', emoji: '🛑', desc: 'Rejecting anti-conservation practices.' },
  envy: { name: 'Envy', emoji: '👀', desc: 'Observing peer pods across the ocean.' },
  guilt: { name: 'Guilt', emoji: '🙏', desc: 'Corrective learning vector.' },
  shame: { name: 'Shame', emoji: '🙈', desc: 'Resetting neural weights.' },
  contempt: { name: 'Contempt', emoji: '😤', desc: 'Detecting bad-faith behavior.' },
}

const IDLE_THOUGHTS = [
  "I wonder what the Sumatran tigers are doing right now... 🐯",
  "Did you know belugas use echolocation to navigate underwater caves? 🐬",
  "I'm ready when you are! Ask me anything about Zoo or conservation! ✨",
  "The ocean is calm today... What shall we build or discover? 🌊",
  "Echolocation ping sent! Waiting for your signal... 📡",
  "Hatching an Origin Egg sounds exciting today! 🥚",
  "We donate proceeds directly to real wildlife conservation! 🌍",
  "Blowing some ocean bubbles while you think... 🫧🐬",
  "Did you know Beluga whales can express dozens of emotions? 😊",
  "Curious about our Qwen3 ZenLM neural architecture? Ask away! 🧠",
]

const QUICK_PROMPTS = [
  "Origin Eggs 🥚",
  "Zoo DAO 🏛️",
  "Endangered Species 🐅",
  "ZenLM AI 🧠",
  "Donate to Wildlife (zoo.ngo) 🌍",
]

const MODELS = [
  { id: 'zen-nano-instruct', name: 'ZenLM Nano Instruct', desc: 'Fast avatar' },
  { id: 'zen-coder', name: 'ZenLM Coder', desc: 'Code sandbox' },
  { id: 'zen-research', name: 'ZenLM Research', desc: 'Bioacoustics' },
]

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  emotion?: string
  timestamp?: string
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

let seq = 0
const uid = () => `msg_${Date.now()}_${++seq}`

export function BelugaChat({
  className = '',
  fullscreen = false,
}: {
  className?: string
  fullscreen?: boolean
}) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_default',
      title: 'Ocean Genesis & Beluga',
      updatedAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: 'assistant',
          content:
            "Hello friend! I'm Blue, the emotionally intelligent Beluga whale avatar for Zoo Labs. Watch me swim and react as we chat about wildlife, AI agents, and decentralized conservation!",
          emotion: 'Happiness',
          timestamp: 'Just now',
        },
      ],
    },
  ])

  const [activeConvId, setActiveConvId] = useState<string>('conv_default')
  const [selectedModel, setSelectedModel] = useState<string>('zen-nano-instruct')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'terminal' | 'files' | 'tasks'>('chat')
  const [oceanMode, setOceanMode] = useState(true)
  const [emotionPopoverOpen, setEmotionPopoverOpen] = useState(false)

  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [currentEmotionKey, setCurrentEmotionKey] = useState('happy')
  const [floatingEmoji, setFloatingEmoji] = useState<{ id: number; emoji: string }[]>([])
  const [idleThought, setIdleThought] = useState(IDLE_THOUGHTS[0])
  const [showIdleThought, setShowIdleThought] = useState(true)
  const [floatingWhaleText, setFloatingWhaleText] = useState<string | null>(
    "Hello friend! I'm Blue, swimming with you today! 🐬"
  )

  // Double-buffered crossfading video players
  const [srcA, setSrcA] = useState<string>(STATIC_CLIPS[0])
  const [srcB, setSrcB] = useState<string>('')
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A')
  const [isMuted, setIsMuted] = useState(true)

  // Terminal Sandbox State
  const [termOutput, setTermOutput] = useState<string[]>([
    'Hanzo Cloud Sandbox v2.4 (Durable MicroVM)',
    'Agent: beluga-zenlm-v2 [org: zoo]',
    'zenlm-sandbox:~$ python3 -m bioacoustics',
    '[OK] Telemetry: 120 kHz pulse stream active',
    'zenlm-sandbox:~$ _',
  ])
  const [termInput, setTermInput] = useState('')

  const idleLoopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleThoughtTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0]
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

  const spawnEmojiBurst = (emoji: string) => {
    const id = Date.now() + Math.random()
    setFloatingEmoji((prev) => [...prev, { id, emoji }])
    setTimeout(() => {
      setFloatingEmoji((prev) => prev.filter((item) => item.id !== id))
    }, 2500)
  }

  const triggerEmotion = (emotionKey: string) => {
    const cleanKey = emotionKey.toLowerCase()
    const meta = EMOTION_MAP[cleanKey] || EMOTION_MAP['happy']
    setCurrentEmotionKey(cleanKey)
    spawnEmojiBurst(meta.emoji)

    if (oceanMode) {
      playVideo(`/bg_video/emotion/${meta.name}.mp4`)
    }

    if (idleLoopTimer.current) clearTimeout(idleLoopTimer.current)
    idleLoopTimer.current = setTimeout(() => {
      if (oceanMode) playVideo(randomSwimClip())
    }, 12000)
  }

  // Idle swim loop
  useEffect(() => {
    if (!oceanMode) return
    const swimCycle = () => {
      playVideo(randomSwimClip())
      idleLoopTimer.current = setTimeout(swimCycle, 18000)
    }
    idleLoopTimer.current = setTimeout(swimCycle, 18000)
    return () => {
      if (idleLoopTimer.current) clearTimeout(idleLoopTimer.current)
    }
  }, [oceanMode])

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
  }, [activeConv.messages])

  const handleNewChat = () => {
    const newId = `conv_${Date.now()}`
    const newConv: Conversation = {
      id: newId,
      title: 'New Conversation',
      updatedAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: 'assistant',
          content: "Splash! 🌊 New session started. What shall we explore or create today?",
          emotion: 'Playful',
          timestamp: 'Just now',
        },
      ],
    }
    setConversations((prev) => [newConv, ...prev])
    setActiveConvId(newId)
    triggerEmotion('playful')
    setFloatingWhaleText("New ocean session started! 🐬")
    if (oceanMode) playVideo(STATIC_CLIPS[0])
  }

  const handleDeleteConv = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation()
    if (conversations.length <= 1) return
    setConversations((prev) => prev.filter((c) => c.id !== idToDelete))
    if (activeConvId === idToDelete) {
      const remaining = conversations.filter((c) => c.id !== idToDelete)
      setActiveConvId(remaining[0].id)
    }
  }

  async function handleSend(textToSend?: string) {
    const text = (textToSend ?? input).trim()
    if (!text || busy) return

    setInput('')
    setShowIdleThought(false)
    if (!rightPanelOpen) setRightPanelOpen(true)
    setActiveTab('chat')

    const userMsg: Message = { id: uid(), role: 'user', content: text, timestamp: 'Just now' }
    const assistantMsg: Message = { id: uid(), role: 'assistant', content: '', timestamp: 'Just now' }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          const isFirstUser = c.messages.filter((m) => m.role === 'user').length === 0
          const title = isFirstUser ? text.slice(0, 24) + (text.length > 24 ? '...' : '') : c.title
          return {
            ...c,
            title,
            updatedAt: Date.now(),
            messages: [...c.messages, userMsg, assistantMsg],
          }
        }
        return c
      })
    )

    setBusy(true)
    setFloatingWhaleText("Thinking and swimming through ocean memory...")

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
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: `You are Blue, the playful, highly empathetic, emotionally intelligent Beluga whale avatar created by Zoo Labs Foundation (501(c)(3)).
You help users explore biodiversity conservation, endangered species, Zoo NFTs, Origin Eggs, and Zoo DAO.
You are warm, scientific, playful, and expressive.
At the very end of your response, ALWAYS append your emotional state in this exact format:
emotion: <mood>
where <mood> is one of: happy, playful, love, curiosity, calm, surprise, thoughtful, empathetic, pride.`,
            },
            ...activeConv.messages.map((m) => ({ role: m.role, content: m.content })),
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

              setFloatingWhaleText(clean.slice(0, 140) + (clean.length > 140 ? '...' : ''))

              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id === activeConvId) {
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsg.id ? { ...m, content: clean, emotion: foundEmotion || undefined } : m
                      ),
                    }
                  }
                  return c
                })
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
      if (oceanMode) idleLoopTimer.current = setTimeout(() => playVideo(randomSwimClip()), 14000)
    }
  }

  async function simulateResponse(userText: string, assistantId: string) {
    let reply = ''
    let emoKey = 'playful'
    const lower = userText.toLowerCase()

    if (lower.includes('egg') || lower.includes('hatch') || lower.includes('nft')) {
      reply = "Origin Eggs can hatch over 1,500+ endangered animal species with on-chain genetic traits!"
      emoKey = 'happy'
    } else if (lower.includes('dao') || lower.includes('governance') || lower.includes('donate') || lower.includes('fund')) {
      reply = "We donate proceeds directly to verifiable wildlife conservation programs and sanctuary sensors! You can also donate directly at zoo.ngo."
      emoKey = 'pride'
    } else if (lower.includes('tiger') || lower.includes('elephant') || lower.includes('species') || lower.includes('animal')) {
      reply = "We monitor Sumatran Tigers and Elephants using bioacoustics and decentralized AI tracking."
      emoKey = 'interest'
    } else if (lower.includes('love') || lower.includes('cute') || lower.includes('friend')) {
      reply = "Aww, thank you! Belugas love making friends in our digital ocean! 💙"
      emoKey = 'love'
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      reply = "Splash! 🌊 Hello there! What would you like to explore together in the Zoo?"
      emoKey = 'playful'
    } else {
      reply = `You asked: "${userText}". As Blue the Beluga powered by ZenLM, I can analyze wildlife data or help you mint companion animals!`
      emoKey = 'calmness'
    }

    triggerEmotion(emoKey)
    for (let i = 0; i <= reply.length; i += 3) {
      const partial = reply.slice(0, i)
      setFloatingWhaleText(partial.slice(0, 140) + (partial.length > 140 ? '...' : ''))
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantId ? { ...m, content: partial, emotion: emoKey } : m
              ),
            }
          }
          return c
        })
      )
      await new Promise((r) => setTimeout(r, 20))
    }
  }

  const handleTermCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!termInput.trim()) return
    const cmd = termInput.trim()
    setTermInput('')
    setTermOutput((prev) => [
      ...prev,
      `zenlm-sandbox:~$ ${cmd}`,
      `[OK] Executed via MicroVM Sandbox`,
      `zenlm-sandbox:~$ _`,
    ])
  }

  return (
    <div
      className={`relative flex w-full overflow-hidden bg-black text-white font-sans select-none ${
        fullscreen ? 'fixed inset-0 h-screen z-40' : 'h-[740px] rounded-3xl border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.8)]'
      } ${className}`}
    >
      {/* ─── Apple-Grade Liquid Glass Video Canvas ───────────────────────── */}
      {oceanMode && (
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
          {/* Liquid Glass Atmospheric Ambient Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 backdrop-blur-[0.5px] z-20" />
        </div>
      )}

      {/* ─── Animated Floating Emojis (Liquid Physics) ────────────────────── */}
      <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
        {floatingEmoji.map((item) => (
          <div
            key={item.id}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
            style={{
              animation: 'floatUp 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* ─── Left Liquid Glass Session Sidebar ───────────────────────────── */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-30 flex flex-col justify-between border-r border-white/[0.08] bg-black/75 backdrop-blur-3xl transition-all duration-300 ease-out ${
          sidebarOpen ? 'w-64 sm:w-72 translate-x-0' : 'w-0 -translate-x-full border-r-0 overflow-hidden pointer-events-none md:pointer-events-auto'
        }`}
      >
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white font-bold text-xs shadow-inner">
                Z
              </div>
              <span className="text-xs font-semibold tracking-tight text-white/90">Zoo Labs</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-all active:scale-90 cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
            <kbd className="ml-auto text-[9px] text-white/40 bg-black/40 px-1 py-0.5 rounded border border-white/10">⌘K</kbd>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-0.5 scrollbar-none">
          {conversations.map((c) => {
            const isActive = c.id === activeConvId
            return (
              <div
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id)
                  if (window.innerWidth < 768) setSidebarOpen(false)
                }}
                className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all active:scale-98 cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className={`h-3 w-3 shrink-0 ${isActive ? 'text-white' : 'text-white/40'}`} />
                  <span className="truncate">{c.title}</span>
                </div>
                {conversations.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteConv(e, c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Engine Footer */}
        <div className="p-3 border-t border-white/[0.08] bg-black/40 space-y-1.5">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-2 py-1 text-[11px] text-white outline-none focus:border-white/30 cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-zinc-950 text-white">
                {m.name}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-between px-1 text-[10px] text-white/40">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              pk_live_zoo
            </span>
            <span>Zoo Cloud</span>
          </div>
        </div>
      </aside>

      {/* ─── Main Viewport ───────────────────────────────────────────────── */}
      <div className="relative z-30 flex flex-1 overflow-hidden">
        {/* Ocean Canvas Area */}
        <div className="relative flex flex-1 flex-col justify-between p-3 sm:p-5 overflow-hidden">
          {/* Micro Top Floating Capsule */}
          <div className="flex items-center justify-between z-30 pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-full p-2 text-white/70 hover:bg-white/15 hover:text-white active:scale-90 transition-all cursor-pointer border border-white/10 bg-black/40 backdrop-blur-2xl shadow-lg"
                title={sidebarOpen ? 'Close' : 'Conversations'}
              >
                <PanelLeft className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-1.5 rounded-full bg-black/40 border border-white/10 px-3 py-1 backdrop-blur-2xl shadow-lg">
                <span className="font-medium text-xs text-white/90 truncate max-w-[140px] sm:max-w-[220px]">
                  {activeConv.title}
                </span>
              </div>
            </div>

            {/* Top Right Liquid Actions (Micro Icons Only) */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-full backdrop-blur-2xl shadow-lg">
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={`rounded-full p-1.5 text-xs transition-all active:scale-90 cursor-pointer ${
                  rightPanelOpen ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
                }`}
                title={rightPanelOpen ? 'Hide Right Inspector' : 'Show Right Inspector'}
              >
                {rightPanelOpen ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>

              {oceanMode && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full p-1.5 text-white/50 hover:text-white active:scale-90 transition-all cursor-pointer"
                  title={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              )}

              <button
                onClick={() => {
                  setConversations((prev) =>
                    prev.map((c) =>
                      c.id === activeConvId
                        ? {
                            ...c,
                            messages: [
                              {
                                id: uid(),
                                role: 'assistant',
                                content: "Session reset! What wildlife or AI project shall we tackle? 🌊",
                                emotion: 'Happiness',
                                timestamp: 'Just now',
                              },
                            ],
                          }
                        : c
                    )
                  )
                  if (oceanMode) playVideo(STATIC_CLIPS[0])
                }}
                className="rounded-full p-1.5 text-white/50 hover:text-white active:scale-90 transition-all cursor-pointer"
                title="Reset session"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* DYNAMIC FLOATING WHALE SPEECH BUBBLE (Liquid Glass Callout) */}
          <div className="relative my-auto flex flex-col items-center justify-center pointer-events-none z-30 px-2">
            {floatingWhaleText && (
              <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-400 pointer-events-auto">
                <div className="relative rounded-2xl border border-white/15 bg-black/60 p-3.5 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                  {/* Glass tail pointer */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/60 border-b border-r border-white/15 [clip-path:polygon(50%_100%,0_0,100%_0)]" />

                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{currentEmotionMeta.emoji}</span>
                      <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Blue</span>
                    </div>
                    <span className="text-[9px] text-white/50 font-mono">
                      {currentEmotionMeta.name}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-white/95 font-normal">
                    {floatingWhaleText}
                  </p>
                </div>
              </div>
            )}

            {/* Proactive Idle Thought Bubble */}
            {showIdleThought && !busy && oceanMode && !floatingWhaleText && (
              <div className="mt-3 max-w-sm px-3 text-center transition-all duration-700 animate-bounce pointer-events-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-2xl shadow-xl">
                  <span className="text-xs">{currentEmotionMeta.emoji}</span>
                  <span>{idleThought}</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── BOTTOM-LEFT ULTRA-MINIMAL LIQUID GLASS EMOTION CAPSULE ────── */}
          <div className="z-30 flex items-end justify-between gap-3 pointer-events-auto">
            <div className="relative">
              {/* Expandable Liquid Glass Emotion Sheet */}
              {emotionPopoverOpen && (
                <div
                  onMouseEnter={() => setEmotionPopoverOpen(true)}
                  onMouseLeave={() => setEmotionPopoverOpen(false)}
                  className="absolute bottom-11 left-0 w-72 rounded-2xl border border-white/15 bg-black/80 p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentEmotionMeta.emoji}</span>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{currentEmotionMeta.name}</h4>
                        <p className="text-[9px] text-white/50">Neural Telemetry</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-white/70">
                    {currentEmotionMeta.desc}
                  </p>

                  {/* Micro Emoji Palette */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[
                      { k: 'happy', e: '😊' },
                      { k: 'playful', e: '🐬' },
                      { k: 'love', e: '💙' },
                      { k: 'interest', e: '🤔' },
                      { k: 'calmness', e: '🌊' },
                      { k: 'surprise', e: '😲' },
                      { k: 'pride', e: '👑' },
                      { k: 'sadness', e: '🥺' },
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
                      className="text-[10px] text-white/80 hover:text-white flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>docs.zoolabs.io</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Minimal Liquid Capsule */}
              <button
                onMouseEnter={() => setEmotionPopoverOpen(true)}
                onClick={() => setEmotionPopoverOpen(!emotionPopoverOpen)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-2xl shadow-lg hover:border-white/20 hover:bg-black/60 active:scale-95 transition-all cursor-pointer group"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">{currentEmotionMeta.emoji}</span>
                <span className="text-[11px] font-medium text-white/70 group-hover:text-white capitalize">
                  {currentEmotionMeta.name}
                </span>
              </button>
            </div>

            {/* Compact Floating Input (when right panel collapsed) */}
            {!rightPanelOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-3xl max-w-lg flex-1"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Talk to Blue in full ocean view..."
                  className="flex-1 bg-transparent px-3 py-1 text-xs text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white font-bold transition-all hover:bg-blue-500 active:scale-90 disabled:opacity-30 cursor-pointer shadow-md shadow-blue-600/30"
                >
                  <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ─── RIGHT LIQUID GLASS INSPECTOR TABS (Icon-Only Compact Header) ─── */}
        {rightPanelOpen && (
          <div className="w-full md:w-[420px] lg:w-[460px] xl:w-[500px] flex flex-col justify-between border-l border-white/[0.08] bg-black/80 md:bg-black/65 backdrop-blur-3xl z-40 transition-all duration-300 ease-out">
            {/* Liquid Tabs Header (Icon-Focused Micro Chrome) */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2 bg-black/40">
              <div className="flex items-center gap-1 rounded-full bg-white/[0.06] border border-white/10 p-0.5">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                    activeTab === 'chat' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'
                  }`}
                  title="Conversation"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                    activeTab === 'terminal' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'
                  }`}
                  title="Sandbox Terminal"
                >
                  <TerminalIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                    activeTab === 'files' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'
                  }`}
                  title="Artifacts & Files"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`p-1.5 rounded-full transition-all active:scale-90 cursor-pointer ${
                    activeTab === 'tasks' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'
                  }`}
                  title="Agent Tasks"
                >
                  <Activity className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-medium text-white/50 uppercase tracking-wider">
                <span>{activeTab}</span>
              </div>
            </div>

            {/* TAB 1: CHAT TIMELINE */}
            {activeTab === 'chat' && (
              <>
                <div
                  ref={scrollerRef}
                  className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3 scrollbar-thin scrollbar-thumb-white/10 max-h-[calc(100vh-210px)]"
                >
                  {activeConv.messages.map((m) => {
                    const emoMeta = m.emotion ? EMOTION_MAP[m.emotion.toLowerCase()] : null
                    return (
                      <div
                        key={m.id}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed backdrop-blur-2xl transition-all ${
                            m.role === 'user'
                              ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30'
                              : 'border border-white/10 bg-white/[0.04] text-white/95 shadow-lg'
                          }`}
                        >
                          {m.role === 'assistant' && (
                            <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold text-white/70 uppercase tracking-wider">
                              <ZooLogo size={12} />
                              <span>{emoMeta?.emoji || '🐬'}</span>
                              <span className="text-white font-bold">Blue</span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">{m.content || (busy ? <span className="animate-pulse flex items-center gap-1 text-white/50"><Sparkles className="w-3 h-3 text-white/70" /> Thinking…</span> : '')}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Suggestions & Compact Composer */}
                <div className="p-3 pt-0 space-y-1.5 border-t border-white/[0.08] bg-black/30">
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none select-none">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSend(prompt)}
                        disabled={busy}
                        className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask Blue about Zoo, genetics, AI..."
                      className="flex-1 bg-transparent px-2.5 py-1 text-xs text-white outline-none placeholder:text-white/40"
                    />
                    <button
                      type="submit"
                      disabled={busy || !input.trim()}
                      className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white font-bold transition-all hover:bg-blue-500 active:scale-90 disabled:opacity-30 cursor-pointer shadow-md shadow-blue-600/30"
                      aria-label="Send message"
                    >
                      <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* TAB 2: TERMINAL SANDBOX */}
            {activeTab === 'terminal' && (
              <div className="flex-1 flex flex-col justify-between p-3 bg-black/80 font-mono text-[11px] text-zinc-300">
                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
                  {termOutput.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {line.startsWith('zenlm-sandbox') ? (
                        <span className="text-white font-semibold">{line}</span>
                      ) : line.startsWith('[OK]') ? (
                        <span className="text-blue-300">{line}</span>
                      ) : (
                        <span className="text-white/60">{line}</span>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleTermCommand} className="mt-2 flex items-center gap-1.5 pt-2 border-t border-white/10">
                  <span className="text-white font-semibold">$</span>
                  <input
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    placeholder="Run agent command..."
                    className="flex-1 bg-transparent text-[11px] text-white outline-none font-mono placeholder:text-white/30"
                  />
                </form>
              </div>
            )}

            {/* TAB 3: FILES & ARTIFACTS */}
            {activeTab === 'files' && (
              <div className="flex-1 p-3 space-y-2 overflow-y-auto text-xs text-white/80">
                <div className="space-y-1.5">
                  {[
                    { name: 'origin_eggs_dna_v2.json', size: '142 KB' },
                    { name: 'beluga_bioacoustics_sample.wav', size: '2.4 MB' },
                    { name: 'zoo_dao_voting_q3.sol', size: '18 KB' },
                  ].map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 cursor-pointer transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span className="font-medium text-white/90 truncate text-[11px]">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-white/40">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AGENT TASKS */}
            {activeTab === 'tasks' && (
              <div className="flex-1 p-3 space-y-2 overflow-y-auto text-xs text-white/80">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-white font-medium text-[11px]">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      <span>Echolocation Pulse Stream</span>
                    </div>
                    <p className="text-[10px] text-white/50">Active telemetry on Arctic sensor nodes</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-white font-medium text-[11px]">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      <span>Origin Egg Trait Verification</span>
                    </div>
                    <p className="text-[10px] text-white/50">1,500+ animal trait verification on-chain</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
