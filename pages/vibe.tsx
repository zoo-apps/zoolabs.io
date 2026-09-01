import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  PhoneOff,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Terminal as TerminalIcon,
  MessageSquare,
  Activity,
  Plus,
  ArrowUp,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Bot,
  Lock,
  RotateCcw,
  Smartphone,
  Monitor,
  Share,
  Sliders,
  Code2,
  FileCode,
  FolderOpen,
  Send,
  Heart,
  ThumbsUp,
  Flame,
  Search,
  UploadCloud,
  FileText,
  Layers,
  Settings,
  Volume2,
  VolumeX,
  Smile,
  Paperclip,
  CheckCircle2,
  Circle,
  HelpCircle,
  Radio,
  Cast,
  Layout,
  Cpu,
  Server,
  Zap,
  Globe,
  Database,
  BarChart3,
  Rocket,
  Shield,
  Crown,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

// Anonymous animal list for Google Docs-style anon participants
const ANONYMOUS_ANIMALS = [
  { name: 'Anonymous Otter', emoji: '🦦', color: 'bg-amber-600' },
  { name: 'Anonymous Beluga', emoji: '🐬', color: 'bg-cyan-600' },
  { name: 'Anonymous Fox', emoji: '🦊', color: 'bg-orange-600' },
  { name: 'Anonymous Axolotl', emoji: '🦎', color: 'bg-pink-600' },
  { name: 'Anonymous Tiger', emoji: '🐅', color: 'bg-amber-500' },
  { name: 'Anonymous Elephant', emoji: '🐘', color: 'bg-blue-600' },
  { name: 'Anonymous Owl', emoji: '🦉', color: 'bg-indigo-600' },
  { name: 'Anonymous Penguin', emoji: '🐧', color: 'bg-slate-600' },
  { name: 'Anonymous Panda', emoji: '🐼', color: 'bg-emerald-600' },
  { name: 'Anonymous Koala', emoji: '🐨', color: 'bg-teal-600' },
  { name: 'Anonymous Narwhal', emoji: '🦄', color: 'bg-purple-600' },
  { name: 'Anonymous Cheetah', emoji: '🐆', color: 'bg-yellow-600' },
]

export type Participant = {
  id: string
  name: string
  avatar: string
  initial?: string
  emoji?: string
  role: 'human' | 'agent'
  isYou?: boolean
  isHost?: boolean
  isMuted: boolean
  isSpeaking: boolean
  badge?: string
  isAnon?: boolean
}

type ChatItem = {
  id: string
  sender: {
    name: string
    avatar?: string
    emoji?: string
    role?: 'human' | 'agent'
    badge?: string
    initial?: string
    color?: string
  }
  time: string
  content: string
  reactions?: { emoji: string; count: number; active?: boolean }[]
  agentCard?: {
    isThinking?: boolean
    thinkingWave?: boolean
    message: string
    editedTag?: string
  }
  poll?: {
    question: string
    options: { text: string; votes: number; percent: number }[]
    totalVotes: number
    closesIn: string
    userVoted?: number
  }
}

export default function VibeRoomPage() {
  // Auth & Anonymous User state
  const [currentUser, setCurrentUser] = useState<{
    name: string
    avatar: string
    emoji: string
    isLoggedIn: boolean
  }>({
    name: 'Anonymous Otter',
    avatar: '🦦',
    emoji: '🦦',
    isLoggedIn: false,
  })

  // Room state
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'database' | 'analytics' | 'deploys' | 'settings'>('preview')
  const [leftTab, setLeftTab] = useState<'chat' | 'activity' | 'files' | 'polls'>('chat')
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop')
  const [habitatMode, setHabitatMode] = useState<'2d' | '3d'>('2d')
  const [invertedPiP, setInvertedPiP] = useState(false)

  // Call Controls
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(false)
  const [screenShareOn, setScreenShareOn] = useState(false)
  const [blueListening, setBlueListening] = useState(true)

  // Live Coding & Site Headline edits
  const [siteHeadline, setSiteHeadline] = useState('Build more.')
  const [siteAccent, setSiteAccent] = useState('Together.')
  const [siteTagline, setSiteTagline] = useState('The AI OS for Creators')
  const [siteDesc, setSiteDesc] = useState('ZOO helps teams and AI agents build, ship, and scale together in real time.')
  const [isBlueEditing, setIsBlueEditing] = useState(false)
  const [editorLine, setEditorLine] = useState(42)

  // Human Participants & AI Agents
  const [humanParticipants, setHumanParticipants] = useState<Participant[]>([
    { id: 'h1', name: 'Richard Kaminsky', avatar: 'R', initial: 'R', role: 'human', isHost: true, isMuted: false, isSpeaking: false },
    { id: 'h2', name: 'Sarah Chen', avatar: 'S', initial: 'S', role: 'human', isMuted: false, isSpeaking: false },
    { id: 'h3', name: 'Anonymous Fox', avatar: '🦊', emoji: '🦊', role: 'human', isAnon: true, isMuted: false, isSpeaking: false },
    { id: 'h4', name: 'You (Anonymous Otter)', avatar: '🦦', emoji: '🦦', role: 'human', isYou: true, isMuted: false, isSpeaking: false },
  ])

  const [aiAgents, setAiAgents] = useState<Participant[]>([
    { id: 'a1', name: 'Blue the Beluga', avatar: '🐬', role: 'agent', isMuted: false, isSpeaking: true, badge: 'Agent' },
    { id: 'a2', name: 'Codey', avatar: '>_', role: 'agent', isMuted: false, isSpeaking: false, badge: 'Coding Agent' },
    { id: 'a3', name: 'Researcher', avatar: '🔍', role: 'agent', isMuted: false, isSpeaking: false, badge: 'Research Agent' },
  ])

  // Chat Feed
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([
    {
      id: 'c1',
      sender: { name: 'Richard Kaminsky', initial: 'R', color: 'bg-blue-600', role: 'human' },
      time: '6:39 PM',
      content: "Hey team! Let's ship the new landing page for zoo.ai today.",
      reactions: [
        { emoji: '❤️', count: 3 },
        { emoji: '🔥', count: 2 },
        { emoji: '✨', count: 1 },
      ],
    },
    {
      id: 'c2',
      sender: { name: 'Sarah Chen', initial: 'S', color: 'bg-emerald-600', role: 'human' },
      time: '6:42 PM',
      content: 'Love the new direction. Blue, can we make the headline bigger?',
      reactions: [{ emoji: '❤️', count: 2 }],
    },
    {
      id: 'c3',
      sender: { name: 'Blue (AI Agent)', emoji: '🐬', role: 'agent', badge: 'Agent' },
      time: '6:42 PM',
      content: '',
      agentCard: {
        isThinking: true,
        thinkingWave: true,
        message: 'Sure thing! Updating the headline size to 72px and tightening spacing.',
        editedTag: 'Edited Hero.tsx',
      },
    },
    {
      id: 'c4',
      sender: { name: 'Anonymous Fox', emoji: '🦊', color: 'bg-orange-600', role: 'human' },
      time: '6:44 PM',
      content: 'Can we try a softer gradient behind the CTA?',
    },
  ])

  const [chatInput, setChatInput] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const chatScrollerRef = useRef<HTMLDivElement>(null)

  // Initialize random anonymous animal if not logged in
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('zoo_vibe_user')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        setCurrentUser(parsed)
      } else {
        const rand = ANONYMOUS_ANIMALS[Math.floor(Math.random() * ANONYMOUS_ANIMALS.length)]
        const anon = {
          name: rand.name,
          avatar: rand.emoji,
          emoji: rand.emoji,
          isLoggedIn: false,
        }
        setCurrentUser(anon)
        localStorage.setItem('zoo_vibe_user', JSON.stringify(anon))
      }
    } catch {
      // ignore
    }
  }, [])

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollerRef.current) {
      chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Draggable PiP State
  const [pipPos, setPipPos] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pipPos.x,
      posY: pipPos.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.mouseX
    const dy = e.clientY - dragStartRef.current.mouseY
    setPipPos({
      x: dragStartRef.current.posX + dx,
      y: dragStartRef.current.posY + dy,
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  // Active file for Code Editor
  const [activeFile, setActiveFile] = useState('Hero.tsx')
  const [codeContent, setCodeContent] = useState<Record<string, string>>({
    'Hero.tsx': `export default function Hero() {\n  return (\n    <section className="py-20 text-center">\n      <div className="badge">The AI OS for Creators</div>\n      <h1 className="text-7xl font-extrabold tracking-tight text-white">\n        Build more. <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Together.</span>\n      </h1>\n      <p className="text-zinc-400 max-w-xl mx-auto mt-4">\n        ZOO helps teams and AI agents build, ship, and scale together in real time.\n      </p>\n      <div className="mt-8 flex justify-center gap-4">\n        <button className="btn-primary">Start Building</button>\n        <button className="btn-secondary">Watch Demo</button>\n      </div>\n    </section>\n  )\n}`,
    'App.tsx': `import React from 'react'\nimport Hero from './Hero'\n\nexport default function App() {\n  return (\n    <main className="min-h-screen bg-black text-white">\n      <Hero />\n    </main>\n  )\n}`,
    'server.py': `# Hanzo Cloud MicroVM Agent Sandbox\nimport time\nfrom hanzo import agent\n\nbot = agent.create("Blue-Beluga-70B", memory="vector_state")\n\n@bot.on_message\ndef handle(event):\n    print(f"[Agent Event] {event.user}: {event.prompt}")\n    return bot.patch_code(event.target_file, diff=event.instructions)\n`,
  })
  const [vmStatus, setVmStatus] = useState<'idle' | 'running' | 'hot-reloaded'>('idle')

  // Handle sending message with Autonomous Agent Patching
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMsg: ChatItem = {
      id: `chat_${Date.now()}`,
      sender: {
        name: currentUser.name,
        emoji: currentUser.emoji,
        initial: currentUser.name.charAt(0),
        color: 'bg-purple-600',
        role: 'human',
      },
      time: 'Just now',
      content: text,
      reactions: [],
    }

    setChatMessages((prev) => [...prev, newMsg])
    setChatInput('')

    // Autonomous Agent Action Simulation
    setTimeout(() => {
      setIsBlueEditing(true)
      setVmStatus('running')

      let responseMsg = 'On it! Hot-reloading live preview and executing code patch in Hanzo Cloud microVM...'
      const lower = text.toLowerCase()

      if (lower.includes('headline') || lower.includes('bigger') || lower.includes('title')) {
        setSiteHeadline('Create Faster.')
        setSiteAccent('Sovereign AI.')
        responseMsg = 'Updated headline to "Create Faster. Sovereign AI." in Hero.tsx!'
      } else if (lower.includes('gradient') || lower.includes('color') || lower.includes('cta')) {
        setSiteAccent('Infinite Ocean.')
        responseMsg = 'Updated CTA accent gradients and adjusted typography!'
      } else if (lower.includes('tagline') || lower.includes('desc')) {
        setSiteDesc('Decentralized open weights, BitDelta parameter soup, and real-time multiplayer agents.')
        responseMsg = 'Refreshed platform description and synced with pod state.'
      }

      const agentMsg: ChatItem = {
        id: `agent_${Date.now()}`,
        sender: { name: 'Blue (AI Agent)', emoji: '🐬', role: 'agent', badge: 'Agent' },
        time: 'Just now',
        content: '',
        agentCard: {
          isThinking: true,
          thinkingWave: true,
          message: responseMsg,
          editedTag: 'Edited Hero.tsx',
        },
      }
      setChatMessages((prev) => [...prev, agentMsg])

      setTimeout(() => {
        setIsBlueEditing(false)
        setVmStatus('hot-reloaded')
        setEditorLine((l) => l + 3)
      }, 1800)
    }, 800)
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Vibe with Friends (Multimodal AI Room)</title>
        <meta
          name="description"
          content="Multiplayer collaborative room with live canvas, code editor, and persistent embodied AI agent Blue the Beluga."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#090b0e] text-zinc-100 font-sans select-none flex flex-col">
        {/* ─── Top Global App Chrome ────────────────────────────────────────── */}
        <div className="z-50 shrink-0">
          <ZooAppChrome />
        </div>

        {/* ─── Room Sub-Header Bar ─────────────────────────────────────────── */}
        <div className="h-11 border-b border-white/[0.08] bg-[#0c0f14] px-4 flex items-center justify-between shrink-0 z-40 text-xs">
          {/* Left: Room Title & Live Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Back to Chat"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-base">🐬</span>
              <button className="flex items-center gap-1 font-semibold text-white hover:text-blue-400 transition-colors">
                <span>Ocean Deep Dive (Genesis Pod)</span>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
              <span className="text-blue-400 font-sans pl-1">
                Blue is listening and coding
              </span>
            </span>
          </div>

          {/* Right: 2D/3D Mode Pills + Invite Button + Menu */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
              <button
                onClick={() => setHabitatMode('2d')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  habitatMode === '2d'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>2D Habitat</span>
              </button>
              <button
                onClick={() => setHabitatMode('3d')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  habitatMode === '3d'
                    ? 'bg-zinc-800 text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>3D Splat</span>
              </button>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold px-3 py-1 rounded-lg text-xs transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Invite</span>
            </button>

            <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors">
              <span className="font-bold tracking-widest text-sm">···</span>
            </button>
          </div>
        </div>

        {/* ─── Main 3-Column Studio Layout ──────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* ════ LEFT COLUMN: Chat, Activity, Files, Polls ════ */}
          {leftPanelOpen && (
            <aside className="w-80 border-r border-white/[0.08] bg-[#0c0f14]/95 flex flex-col justify-between shrink-0 overflow-hidden z-30">
              {/* Left Column Tabs */}
              <div className="flex items-center border-b border-white/[0.08] px-3 text-xs bg-zinc-950/40">
                {(['chat', 'activity', 'files', 'polls'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeftTab(tab)}
                    className={`px-3 py-2 font-medium capitalize transition-all border-b-2 ${
                      leftTab === tab
                        ? 'border-blue-500 text-white font-semibold'
                        : 'border-transparent text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Chat Stream */}
              {leftTab === 'chat' && (
                <div ref={chatScrollerRef} className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-none">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1.5 text-xs">
                      {/* Header: Sender + Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {msg.sender.emoji ? (
                            <span className="text-sm">{msg.sender.emoji}</span>
                          ) : (
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                msg.sender.color || 'bg-blue-600'
                              }`}
                            >
                              {msg.sender.initial || msg.sender.name.charAt(0)}
                            </span>
                          )}
                          <span className="font-semibold text-white">{msg.sender.name}</span>
                          {msg.sender.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                              {msg.sender.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500">{msg.time}</span>
                      </div>

                      {/* Content */}
                      {msg.content && (
                        <div className="pl-6 text-zinc-300 leading-relaxed">
                          {msg.content}
                        </div>
                      )}

                      {/* AI Agent Thinking & Action Card */}
                      {msg.agentCard && (
                        <div className="ml-6 p-2.5 rounded-xl bg-zinc-900 border border-blue-500/30 space-y-2 shadow-lg">
                          {msg.agentCard.isThinking && (
                            <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px]">
                              <Sparkles className="h-3 w-3 animate-spin" />
                              <span>Thinking...</span>
                            </div>
                          )}
                          <p className="text-zinc-300 leading-relaxed text-[11px]">
                            {msg.agentCard.message}
                          </p>
                          {msg.agentCard.editedTag && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                              <span>&lt;/&gt;{msg.agentCard.editedTag}</span>
                              <Check className="h-2.5 w-2.5 text-emerald-400" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reactions */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1.5 pl-6 pt-1">
                          {msg.reactions.map((r, i) => (
                            <button
                              key={i}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {isBlueEditing && (
                    <div className="text-zinc-500 text-xs italic pl-6 animate-pulse flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                      <span>Blue is typing and editing code…</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Activity Stream */}
              {leftTab === 'activity' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-semibold text-white">Blue (Agent)</span>
                      <span>2m ago</span>
                    </div>
                    <p className="text-zinc-300">Hot-reloaded <code className="text-blue-400">Hero.tsx</code> via Pyodide MicroVM.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="font-semibold text-white">Sarah Chen</span>
                      <span>5m ago</span>
                    </div>
                    <p className="text-zinc-300">Joined the Genesis Pod audio room.</p>
                  </div>
                </div>
              )}

              {/* Tab 3: Files Stream */}
              {leftTab === 'files' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
                  {['Hero.tsx', 'App.tsx', 'server.py'].map((file) => (
                    <button
                      key={file}
                      onClick={() => {
                        setActiveFile(file)
                        setActiveTab('code')
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                        activeFile === file ? 'bg-blue-600/20 border border-blue-500/40 text-white font-medium' : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-blue-400" />
                        <span>{file}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">TSX</span>
                    </button>
                  ))}
                  <div className="p-3 border border-dashed border-white/15 rounded-xl text-center text-zinc-400 text-[11px]">
                    Drag & Drop files here to mount in MicroVM
                  </div>
                </div>
              )}

              {/* Tab 4: Polls Stream */}
              {leftTab === 'polls' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                    <h4 className="font-semibold text-white">Ship 3D Splat or 2D Habitat first?</h4>
                    <div className="space-y-1.5 pt-1">
                      <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 flex justify-between text-zinc-300">
                        <span>3D Splat Shader</span>
                        <span className="font-mono text-blue-400">75%</span>
                      </button>
                      <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 flex justify-between text-zinc-300">
                        <span>2D Realtime Canvas</span>
                        <span className="font-mono text-zinc-400">25%</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Chat Composer Bar */}
              <div className="p-3 border-t border-white/[0.08] bg-zinc-950/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage(chatInput)
                  }}
                  className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message the room..."
                    className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
                  />
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <button type="button" className="hover:text-white"><Plus className="h-4 w-4" /></button>
                    <button type="button" className="hover:text-white text-xs font-mono">@</button>
                    <button type="button" className="hover:text-white text-[10px] font-bold">GIF</button>
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          )}

          {/* ════ CENTER CANVAS: The Work Canvas + Draggable Blue PiP ════ */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#07090c] relative">
            {/* Top Canvas Navigation Bar */}
            <div className="h-10 bg-[#0d1016] border-b border-white/[0.08] flex items-center justify-between px-3 shrink-0 text-xs z-20">
              {/* Canvas Modes */}
              <div className="flex items-center gap-1">
                {(['preview', 'code', 'database', 'analytics', 'deploys', 'settings'] as const).map((mode) => {
                  const labels = {
                    preview: 'Live Preview',
                    code: 'Code',
                    database: 'Database',
                    analytics: 'Analytics',
                    deploys: 'Deploys',
                    settings: 'Settings',
                  }
                  return (
                    <button
                      key={mode}
                      onClick={() => setActiveTab(mode)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                        activeTab === mode
                          ? 'bg-zinc-800 text-white font-medium shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <span>{labels[mode]}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right Share button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copyRoomLink}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
                <Globe className="h-3.5 w-3.5 text-zinc-500" />
              </div>
            </div>

            {/* TAB 1: Live Preview (The Work) */}
            {activeTab === 'preview' && (
              <>
                {/* Browser Navigation Bar (URL + Viewport) */}
                <div className="h-9 bg-[#0a0c10] border-b border-white/[0.06] flex items-center justify-between px-4 text-xs text-zinc-400 shrink-0">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-emerald-400" />
                    <span className="font-mono text-zinc-300">https://zoo.ai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="hover:text-white transition-colors"><RotateCcw className="h-3 w-3" /></button>
                    <button
                      onClick={() => setViewportMode('desktop')}
                      className={`hover:text-white ${viewportMode === 'desktop' ? 'text-white' : ''}`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setViewportMode('mobile')}
                      className={`hover:text-white ${viewportMode === 'mobile' ? 'text-white' : ''}`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* The Live Website Surface (The Work) */}
                <div className="flex-1 overflow-y-auto bg-[#040609] p-6 sm:p-12 relative flex flex-col items-center">
                  <div
                    className={`w-full transition-all duration-300 ${
                      viewportMode === 'mobile'
                        ? 'max-w-sm border border-zinc-800 rounded-3xl p-4 shadow-2xl bg-zinc-950 my-auto'
                        : 'max-w-4xl'
                    }`}
                  >
                    {/* Navbar inside the rendered site */}
                    <div className="flex items-center justify-between pb-8 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold tracking-wider text-xl text-white">ZOO</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-400">
                        <span className="hover:text-white cursor-pointer">Product ▾</span>
                        <span className="hover:text-white cursor-pointer">Solutions ▾</span>
                        <span className="hover:text-white cursor-pointer">Resources ▾</span>
                        <span className="hover:text-white cursor-pointer">Pricing</span>
                      </div>
                      <button className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all">
                        Get Started
                      </button>
                    </div>

                    {/* Hero section inside the rendered site */}
                    <div className="py-12 sm:py-20 space-y-6">
                      <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-medium">
                        {siteTagline}
                      </span>

                      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                        {siteHeadline} <br />
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          {siteAccent}
                        </span>
                      </h1>

                      <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
                        {siteDesc}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <button className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-zinc-200 transition-all shadow-lg">
                          Start Building
                        </button>
                        <button className="px-6 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2">
                          <span>▷</span>
                          <span>Watch Demo</span>
                        </button>
                      </div>

                      {/* Social Proof Logos inside preview */}
                      <div className="pt-16 space-y-4">
                        <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                          Trusted by teams building the future
                        </div>
                        <div className="flex items-center gap-8 text-zinc-500 text-sm font-semibold opacity-70">
                          <span>Aurora</span>
                          <span>LayerZero.</span>
                          <span>▲ Caldera</span>
                          <span>SYNTHETIX</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: Interactive Code Editor */}
            {activeTab === 'code' && (
              <div className="flex-1 flex overflow-hidden">
                {/* File Sidebar */}
                <div className="w-48 bg-[#090b0e] border-r border-white/10 p-3 space-y-1 text-xs">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase pb-1">Files</div>
                  {Object.keys(codeContent).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setActiveFile(filename)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                        activeFile === filename ? 'bg-blue-600 text-white font-medium' : 'text-zinc-400 hover:bg-white/5'
                      }`}
                    >
                      <FileCode className="h-3.5 w-3.5" />
                      <span>{filename}</span>
                    </button>
                  ))}
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 flex flex-col bg-[#05070a] overflow-hidden">
                  <div className="h-8 bg-[#0b0e14] border-b border-white/10 px-4 flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono text-zinc-200">{activeFile}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-400 font-mono">MicroVM: 8ms</span>
                      <button
                        onClick={() => {
                          setVmStatus('running')
                          setTimeout(() => setVmStatus('hot-reloaded'), 800)
                        }}
                        className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold"
                      >
                        Run MicroVM
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-200 leading-relaxed">
                    <pre className="whitespace-pre-wrap">{codeContent[activeFile] || ''}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Database Explorer */}
            {activeTab === 'database' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white">Hanzo Datastore · ClickHouse Replica</h3>
                  <span className="text-xs text-emerald-400 font-mono">● Active Connected</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { table: 'users', rows: '1,420,890', size: '142 MB' },
                    { table: 'agent_sessions', rows: '89,200', size: '48 MB' },
                    { table: 'microvm_snapshots', rows: '12,400', size: '1.2 GB' },
                  ].map((t) => (
                    <div key={t.table} className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                      <div className="font-mono text-sm text-blue-400 font-bold">{t.table}</div>
                      <div className="text-xs text-zinc-400 flex justify-between">
                        <span>Rows: {t.rows}</span>
                        <span>Size: {t.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Analytics */}
            {activeTab === 'analytics' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <h3 className="text-sm font-semibold text-white">Genesis Pod Real-Time Telemetry</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Token Throughput', val: '142 tok/s' },
                    { label: 'MicroVM Latency', val: '8.4 ms' },
                    { label: 'Acoustic Audio Sync', val: '120 kHz' },
                    { label: 'DeltaSoup Weights', val: '1-bit Active' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1">
                      <div className="text-xs text-zinc-500 font-medium">{stat.label}</div>
                      <div className="text-xl font-bold font-mono text-white">{stat.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Deploys */}
            {activeTab === 'deploys' && (
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <h3 className="text-sm font-semibold text-white">Hanzo Cloud MicroVM Deployments</h3>
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-400">● pod-genesis-0921.hanzo.cloud</span>
                    <span className="text-xs text-zinc-400">Deployed 1m ago</span>
                  </div>
                  <p className="text-xs text-zinc-300">Live edge container deployed with ZenLM 70B & BitDelta LoRA soup.</p>
                </div>
              </div>
            )}

            {/* TAB 6: Settings */}
            {activeTab === 'settings' && (
              <div className="flex-1 p-6 overflow-y-auto max-w-xl space-y-4">
                <h3 className="text-sm font-semibold text-white">Pod & Agent Settings</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                    <label className="text-xs font-semibold text-white">Agent Foundation Model</label>
                    <select className="w-full p-2 rounded-xl bg-black border border-white/15 text-xs text-white">
                      <option>ZenLM Frontier 70B · BitDelta LoRA</option>
                      <option>Zoo Sovereign Edge · MicroVM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ─── Draggable / Floating PiP: Blue the Beluga Avatar (FaceTime Style) ─── */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute z-40 w-72 sm:w-80 rounded-2xl border border-white/20 bg-black/85 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden group cursor-grab active:cursor-grabbing select-none transition-shadow"
              style={{
                top: `${24 + pipPos.y}px`,
                right: `${24 - pipPos.x}px`,
              }}
            >
              {/* PiP Header (Drag Handle) */}
              <div className="p-2.5 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs">⠿</span>
                  <span className="text-xs font-semibold text-white">Blue the Beluga</span>
                  <span className="flex items-center gap-0.5 text-blue-400">
                    <span className="h-2 w-0.5 bg-blue-400 rounded-full animate-pulse" />
                    <span className="h-3 w-0.5 bg-blue-400 rounded-full animate-pulse delay-75" />
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">
                  ✦ Speaking
                </span>
              </div>

              {/* PiP Video Habitat */}
              <div className="relative aspect-video w-full overflow-hidden bg-black pointer-events-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/bg_video/static/relactation0.mp4"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              </div>

              {/* PiP Action Controls */}
              <div className="p-2 bg-zinc-950/90 border-t border-white/10 flex items-center justify-center gap-3">
                <button className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white">···</button>
                <button className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white"><Mic className="h-3.5 w-3.5" /></button>
                <button className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white"><Video className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            {/* ─── Blue is Editing Status Pill at Bottom Right of Canvas ─── */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs backdrop-blur-xl shadow-lg">
              <span className="text-blue-400 font-medium">&lt;/&gt; Blue is editing</span>
              <span className="text-zinc-400 font-mono text-[11px]">&lt;/&gt; Hero.tsx</span>
              <span className="text-zinc-500 font-mono text-[11px]">Line {editorLine}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </main>

          {/* ════ RIGHT COLUMN: In Room (Humans & AI Agents & Room Info) ════ */}
          {rightPanelOpen && (
            <aside className="w-64 border-l border-white/[0.08] bg-[#0c0f14]/95 flex flex-col justify-between shrink-0 overflow-hidden z-30">
              <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">In Room</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{humanParticipants.length + aiAgents.length}</span>
                  </div>
                  <button
                    onClick={() => setRightPanelOpen(false)}
                    className="text-zinc-500 hover:text-white p-1 rounded"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Humans List */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                    <span>Humans ▾</span>
                  </div>

                  <div className="space-y-1">
                    {humanParticipants.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {h.emoji ? (
                            <span className="text-sm">{h.emoji}</span>
                          ) : (
                            <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                              {h.initial || h.name.charAt(0)}
                            </span>
                          )}
                          <span className={`truncate font-medium ${h.isYou ? 'text-white' : 'text-zinc-300'}`}>
                            {h.name}
                          </span>
                          {h.isHost && <Crown className="h-3 w-3 text-amber-400" />}
                          {h.isHost && <span className="text-[9px] text-amber-400 font-medium">Host</span>}
                        </div>

                        <Mic className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                    ))}

                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Invite people</span>
                    </button>
                  </div>
                </div>

                {/* 2. AI Agents List */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                    <span>AI Agents ▾</span>
                  </div>

                  <div className="space-y-1">
                    {aiAgents.map((ag) => (
                      <div
                        key={ag.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm shrink-0">{ag.avatar}</span>
                          <div className="truncate flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-200 text-xs">{ag.name}</span>
                            {ag.badge && ag.badge !== 'Agent' && (
                              <span className="text-[10px] text-zinc-400 font-normal">{ag.badge}</span>
                            )}
                          </div>
                        </div>

                        {ag.isSpeaking ? (
                          <span className="flex items-center gap-0.5 text-purple-400 animate-pulse">
                            <span className="h-2 w-0.5 bg-purple-400 rounded-full animate-bounce" />
                            <span className="h-3 w-0.5 bg-purple-400 rounded-full animate-bounce delay-75" />
                            <span className="h-2 w-0.5 bg-purple-400 rounded-full animate-bounce delay-150" />
                          </span>
                        ) : (
                          <Mic className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const newAgent: Participant = {
                          id: `agent_${Date.now()}`,
                          name: 'Designer Agent',
                          avatar: '🎨',
                          role: 'agent',
                          badge: 'Design Agent',
                          isMuted: false,
                          isSpeaking: false,
                        }
                        setAiAgents((prev) => [...prev, newAgent])
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Agent</span>
                    </button>
                  </div>
                </div>

                {/* 3. Room Info Section */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px]">
                  <div className="font-semibold text-zinc-400">Room Info ▾</div>
                  <div className="space-y-1 text-zinc-400">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Pod ID</span>
                      <span className="font-mono text-zinc-300">genesis-pod-0921</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Environment</span>
                      <span className="text-zinc-300">Ocean Habitat</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Latency</span>
                      <span className="text-emerald-400 font-mono">● 12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Audio Quality</span>
                      <span className="text-emerald-400 font-mono">● High |||</span>
                    </div>
                  </div>

                  <button
                    onClick={copyRoomLink}
                    className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* ─── BOTTOM CENTER FLOATING CALL DOCK (Google Meet + Video Avatars) ─── */}
        <div
          className="absolute z-50 flex items-center gap-3 pointer-events-auto"
          style={{ bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Live Video Avatars of Humans on the call */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/90 border border-white/15 backdrop-blur-2xl shadow-2xl">
            {/* Richard */}
            <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 flex flex-col justify-end p-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 flex items-center justify-between text-[9px] font-semibold text-white">
                <span>Richard</span>
                <span className="text-blue-400">|||</span>
              </div>
            </div>

            {/* Sarah */}
            <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 flex flex-col justify-end p-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 flex items-center justify-between text-[9px] font-semibold text-white">
                <span>Sarah</span>
                <span className="text-blue-400">|||</span>
              </div>
            </div>

            {/* You (or Anonymous Otter) */}
            <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-blue-500/50 flex flex-col justify-end p-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="relative z-20 flex items-center justify-between text-[9px] font-semibold text-white">
                <span>{currentUser.isLoggedIn ? 'You' : currentUser.emoji}</span>
                <span className="text-blue-400">|||</span>
              </div>
            </div>
          </div>

          {/* Unified Call Controls Pill */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-950/95 border border-white/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            {/* Mic Toggle */}
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                micOn
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="hidden sm:inline">Mic</span>
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                cameraOn
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="hidden sm:inline">Camera</span>
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setScreenShareOn(!screenShareOn)}
              className={`flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                screenShareOn
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              <Cast className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Blue Agent Active Glow Pill */}
            <button
              onClick={() => setBlueListening(!blueListening)}
              className={`flex flex-col sm:flex-row items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-lg cursor-pointer ${
                blueListening
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/40 ring-2 ring-blue-400/50'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <span className="text-sm">🐬</span>
              <span>Blue</span>
            </button>

            {/* People Panel Toggle */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">People</span>
            </button>

            {/* Chat Panel Toggle */}
            <button
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="flex flex-col sm:flex-row items-center gap-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            {/* Leave Room Red Button */}
            <Link
              href="/"
              className="flex flex-col sm:flex-row items-center gap-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <PhoneOff className="h-4 w-4" />
              <span>Leave</span>
            </Link>
          </div>
        </div>

        {/* ─── INVITE MODAL ─────────────────────────────────────────────────── */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl backdrop-blur-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Invite to Ocean Genesis Pod</h3>
                </div>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="rounded-full p-1 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Share this multiplayer room link. Guests will join automatically as anonymous animal avatars (like in Google Docs) until they sign in!
              </p>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-white/10 text-xs">
                <input
                  type="text"
                  readOnly
                  value="https://zoolabs.io/vibe?room=ocean-genesis-pod"
                  className="flex-1 bg-transparent font-mono text-[11px] text-zinc-200 outline-none"
                />
                <button
                  onClick={copyRoomLink}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all"
                >
                  {copiedLink ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
