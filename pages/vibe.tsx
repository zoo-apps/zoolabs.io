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
  BookOpen,
  MapPin,
  Play,
  Pause,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions, AnimalAgent } from '../lib/zoo-missions-context'

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
    progress?: number
  }
}

export default function VibeRoomPage() {
  const { activeMission, missions, setActiveMissionId, agents, updateTaskStatus } = useZooMissions()

  // Auth & User State
  const [currentUser, setCurrentUser] = useState<{
    name: string
    avatar: string
    emoji: string
    isLoggedIn: boolean
  }>({
    name: 'Sarah Chen (Marine Biologist)',
    avatar: '👩‍🔬',
    emoji: '👩‍🔬',
    isLoggedIn: true,
  })

  // Canvas Mode: Chart, Story, Habitat, Preview/Code, Map
  const [canvasMode, setCanvasMode] = useState<'chart' | 'story' | 'habitat' | 'preview' | 'code' | 'map'>('chart')
  const [leftTab, setLeftTab] = useState<'chat' | 'agents' | 'activity' | 'files'>('chat')
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop')

  // Voice & Audio Room State (Discord-style)
  const [micOn, setMicOn] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [screenShareOn, setScreenShareOn] = useState(false)
  const [isVoiceConnected, setIsVoiceConnected] = useState(true)
  const [userSpeakingLevel, setUserSpeakingLevel] = useState(0)
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  // Participants (Unified with living agents fleet)
  const [humanParticipants, setHumanParticipants] = useState<Participant[]>([
    { id: 'h1', name: 'Dr. Sarah Lin', avatar: '👩‍🔬', emoji: '👩‍🔬', role: 'human', isHost: true, isMuted: false, isSpeaking: false, isYou: true },
    { id: 'h2', name: 'Richard Kaminsky', avatar: 'R', initial: 'R', role: 'human', isMuted: false, isSpeaking: false },
    { id: 'h3', name: 'Anonymous Otter', avatar: '🦦', emoji: '🦦', role: 'human', isAnon: true, isMuted: true, isSpeaking: false },
    { id: 'h4', name: 'Anonymous Arctic Fox', avatar: '🦊', emoji: '🦊', role: 'human', isAnon: true, isMuted: false, isSpeaking: false },
  ])

  // Chat Feed
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([
    {
      id: 'c1',
      sender: { name: 'Dr. Sarah Lin', emoji: '👩‍🔬', color: 'bg-blue-600', role: 'human' },
      time: '6:30 PM',
      content: 'Blue, pull the last ten years of Beaufort Sea beluga population and acoustic data.',
      reactions: [{ emoji: '🐋', count: 4 }, { emoji: '❄️', count: 2 }],
    },
    {
      id: 'c2',
      sender: { name: 'Blue the Beluga', emoji: '🐋', role: 'agent', badge: 'Lead Scientist' },
      time: '6:30 PM',
      content: 'On it! Delegating dataset extraction to Elephant and literature review to Raven.',
      agentCard: {
        isThinking: false,
        message: 'Dispatched 2 subagents: Elephant (Datastore) & Raven (Scholar). Hot-swapping center canvas to Population & Spectrogram Chart.',
        editedTag: 'Swapped Canvas -> Chart',
      },
    },
    {
      id: 'c3',
      sender: { name: 'Ganesha the Elephant', emoji: '🐘', role: 'agent', badge: 'Data Custodian' },
      time: '6:31 PM',
      content: 'Downloading NOAA Beaufort Sea hydrophone dataset (1.4 TB)... Ingesting into ClickHouse datastore.',
      agentCard: {
        isThinking: true,
        message: 'Cleaning and applying bandpass notch filter (120-450 Hz) to eliminate propeller noise.',
        progress: 72,
        editedTag: 'Elephant -> cleaning -> 72%',
      },
    },
    {
      id: 'c4',
      sender: { name: 'Corvus the Raven', emoji: '🐦', role: 'agent', badge: 'Research Scholar' },
      time: '6:32 PM',
      content: 'Synthesized 32 peer-reviewed papers on Arctic ice loss vs whale calving. Statistically significant correlation confirmed (p < 0.001).',
      reactions: [{ emoji: '👏', count: 3 }, { emoji: '🔥', count: 3 }],
    },
    {
      id: 'c5',
      sender: { name: 'Anonymous Otter', emoji: '🦦', color: 'bg-amber-600', role: 'human' },
      time: '6:33 PM',
      content: 'Can we turn this into something kids and classrooms can understand?',
      reactions: [{ emoji: '🎨', count: 2 }],
    },
    {
      id: 'c6',
      sender: { name: 'Blue the Beluga', emoji: '🐋', role: 'agent', badge: 'Lead Scientist' },
      time: '6:34 PM',
      content: "Castor the Beaver is generating an illustrated storybook card series for K-12 students! Check out the 'Story' tab.",
      agentCard: {
        isThinking: false,
        message: 'Published Beluga Storybook: "The Whale Who Sang Through the Ice". Ready for classroom exploration.',
        editedTag: 'Created Storybook.pdf',
      },
    },
  ])

  const [chatInput, setChatInput] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const chatScrollerRef = useRef<HTMLDivElement>(null)

  // Draggable PiP State
  const [pipPos, setPipPos] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 })

  // Initialize Discord Audio Engine
  useEffect(() => {
    if (typeof window !== 'undefined' && zooAudio) {
      // Subscribe to user VAD speaking events
      const unsubUser = zooAudio.onUserSpeaking((speaking, level) => {
        setUserSpeakingLevel(level)
        setHumanParticipants((prev) =>
          prev.map((p) => (p.isYou ? { ...p, isSpeaking: speaking } : p))
        )
      })

      // Subscribe to agent speaking events
      const unsubAgent = zooAudio.onAgentSpeaking((agentId, speaking) => {
        setActiveSpeakerId(speaking ? agentId : null)
      })

      return () => {
        unsubUser()
        unsubAgent()
      }
    }
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollerRef.current) {
      chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Toggle Microphone
  const toggleMicrophone = async () => {
    if (micOn) {
      zooAudio.toggleMute()
      setMicOn(false)
      setHumanParticipants((prev) =>
        prev.map((p) => (p.isYou ? { ...p, isMuted: true, isSpeaking: false } : p))
      )
    } else {
      const ok = await zooAudio.startMicrophone()
      if (ok) {
        setMicOn(true)
        setHumanParticipants((prev) =>
          prev.map((p) => (p.isYou ? { ...p, isMuted: false } : p))
        )
      }
    }
  }

  // Toggle Deafen
  const toggleDeafen = () => {
    const isDef = zooAudio.toggleDeafen()
    setDeafened(isDef)
  }

  // Handle Dragging of Blue PiP
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

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMsg: ChatItem = {
      id: `c_${Date.now()}`,
      sender: {
        name: currentUser.name,
        emoji: currentUser.emoji,
        color: 'bg-blue-600',
        role: 'human',
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
      reactions: [],
    }

    setChatMessages((prev) => [...prev, newMsg])
    setChatInput('')

    // Play subtle send cue
    zooAudio.playCue('ping')

    // AI Response orchestration
    setTimeout(() => {
      const lower = text.toLowerCase()
      let agentId = 'blue'
      let replyContent = ''
      let agentName = 'Blue the Beluga'
      let agentEmoji = '🐋'
      let badge = 'Lead Scientist'

      if (lower.includes('data') || lower.includes('dataset') || lower.includes('clickhouse') || lower.includes('filter')) {
        agentId = 'elephant'
        agentName = 'Ganesha the Elephant'
        agentEmoji = '🐘'
        badge = 'Data Custodian'
        replyContent = 'Indexed 14,280 hours of acoustic recordings into ClickHouse. Applying notch filter at 120-450 Hz eliminated ship cavitation noise!'
      } else if (lower.includes('research') || lower.includes('paper') || lower.includes('study') || lower.includes('cite')) {
        agentId = 'raven'
        agentName = 'Corvus the Raven'
        agentEmoji = '🐦'
        badge = 'Research Scholar'
        replyContent = 'Found 32 matching studies on arXiv & PubMed. Migration speed drops by 40% when ice pack density decreases below 15%.'
      } else if (lower.includes('story') || lower.includes('kid') || lower.includes('school') || lower.includes('chart')) {
        agentId = 'beaver'
        agentName = 'Castor the Beaver'
        agentEmoji = '🦫'
        badge = 'App Builder'
        replyContent = 'I updated the interactive canvas with the illustrated storybook and spectrogram player!'
      } else {
        replyContent = `Understood! Coordinating with the pod to analyze ${text}. All telemetry is streaming live from the Beaufort Sea.`
      }

      const agentMsg: ChatItem = {
        id: `c_${Date.now() + 1}`,
        sender: {
          name: agentName,
          emoji: agentEmoji,
          role: 'agent',
          badge,
        },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: replyContent,
        agentCard: {
          isThinking: false,
          message: `Executed in Hanzo Cloud microVM (${agentId}.hanzo.cloud).`,
          editedTag: `Synced ${agentName}`,
        },
      }

      setChatMessages((prev) => [...prev, agentMsg])

      // Speak aloud in species-specific voice!
      zooAudio.speakAgent(agentId, replyContent)
    }, 900)
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Vibe Room — Live Multiplayer World | Zoo Labs</title>
        <meta
          name="description"
          content="Live multiplayer room where scientists, creators, kids, and autonomous AI animals work on real missions together."
        />
      </Head>

      <div className="h-screen w-screen flex flex-col bg-[#05070a] text-zinc-100 font-sans select-none overflow-hidden">
        {/* ─── Top Chrome Navigation ─── */}
        <ZooAppChrome minimal={true} />

        {/* ─── Mission Context Subheader Bar ─── */}
        <header className="h-12 bg-[#090c12] border-b border-white/[0.08] flex items-center justify-between px-4 shrink-0 text-xs z-30">
          <div className="flex items-center gap-3">
            {/* Active Mission Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-200">
              <span className="text-sm">🎯</span>
              <span className="font-semibold text-white">Mission:</span>
              <span className="truncate max-w-xs sm:max-w-md font-medium text-cyan-300">
                {activeMission.title}
              </span>
            </div>

            {/* Mission Progress Pill */}
            <div className="hidden md:flex items-center gap-2 text-zinc-400 font-mono text-[11px] bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-white/5">
              <span>Progress:</span>
              <div className="w-16 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${activeMission.progress}%` }} />
              </div>
              <span className="text-cyan-400 font-bold">{activeMission.progress}%</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Discord-Style Voice Status Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice Live (24ms)</span>
            </div>

            <button
              onClick={copyRoomLink}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-all border border-white/10 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Invite'}</span>
            </button>
          </div>
        </header>

        {/* ─── Main Room Layout: 3 Columns (Left Feed + Center Canvas + Right Pod) ─── */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* ════ LEFT COLUMN: Chat, Living Agents, Activity, Files ════ */}
          {leftPanelOpen && (
            <aside className="w-80 lg:w-96 bg-[#080b10] border-r border-white/[0.08] flex flex-col shrink-0 z-20">
              {/* Left Sub-tabs */}
              <div className="h-10 border-b border-white/[0.08] flex items-center px-2 gap-1 bg-[#0a0d14] shrink-0 text-xs">
                {[
                  { id: 'chat', label: 'Room Chat', icon: MessageSquare },
                  { id: 'agents', label: 'Active Animals', icon: Bot },
                  { id: 'activity', label: 'Mission Log', icon: Activity },
                  { id: 'files', label: 'Datasets & Files', icon: FolderOpen },
                ].map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setLeftTab(t.id as any)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        leftTab === t.id
                          ? 'bg-zinc-800 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{t.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab 1: Room Chat */}
              {leftTab === 'chat' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div ref={chatScrollerRef} className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
                    {chatMessages.map((msg) => {
                      const isAgent = msg.sender.role === 'agent'

                      return (
                        <div key={msg.id} className="space-y-1 group">
                          {/* Sender Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className="text-base">{msg.sender.emoji || '👤'}</span>
                              <span className="text-white font-semibold">{msg.sender.name}</span>
                              {msg.sender.badge && (
                                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/30 text-[9px] text-cyan-300 font-mono">
                                  {msg.sender.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">{msg.time}</span>
                          </div>

                          {/* Content */}
                          {msg.content && (
                            <div className="pl-6 text-zinc-300 leading-relaxed">
                              {msg.content}
                            </div>
                          )}

                          {/* AI Agent Delegation & Action Card */}
                          {msg.agentCard && (
                            <div className="ml-6 p-2.5 rounded-xl bg-zinc-900/90 border border-cyan-500/30 space-y-1.5 shadow-lg">
                              {msg.agentCard.isThinking && (
                                <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
                                  <Sparkles className="h-3 w-3 animate-spin" />
                                  <span>Active Subagent Task…</span>
                                </div>
                              )}
                              <p className="text-zinc-300 leading-relaxed text-[11px]">
                                {msg.agentCard.message}
                              </p>
                              {msg.agentCard.editedTag && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-400">
                                  <Check className="h-2.5 w-2.5 text-emerald-400" />
                                  <span>{msg.agentCard.editedTag}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex items-center gap-1.5 pl-6 pt-0.5">
                              {msg.reactions.map((r, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/80 text-[10px] text-zinc-300"
                                >
                                  <span>{r.emoji}</span>
                                  <span>{r.count}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Chat Composer */}
                  <div className="p-3 border-t border-white/[0.08] bg-[#07090e]">
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
                        placeholder="Ask Blue, Elephant, or Raven..."
                        className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 2: Active Animals in the Mission */}
              {leftTab === 'agents' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1.5 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{agent.emoji}</span>
                          <div>
                            <h4 className="font-semibold text-white">{agent.name}</h4>
                            <p className="text-[10px] text-cyan-400 font-mono">{agent.role}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                            agent.status === 'active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : agent.status === 'busy'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">{agent.currentJob}</p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/5 font-mono">
                        <span>{agent.brain.split('·')[0]}</span>
                        <button
                          onClick={() => {
                            zooAudio.speakAgent(agent.id, `Hello! I am ${agent.name}, handling ${agent.currentJob}`)
                          }}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                          <Volume2 className="h-3 w-3" /> Voice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Mission Log */}
              {leftTab === 'activity' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                  {activeMission.decisions.map((dec) => (
                    <div key={dec.id} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-cyan-300">{dec.decidedBy}</span>
                        <span className="text-zinc-500 text-[10px]">{dec.timestamp}</span>
                      </div>
                      <p className="text-zinc-300 text-[11px]">{dec.scenario}</p>
                      <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] text-emerald-300 font-mono">
                        ✓ {dec.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Datasets & Files */}
              {leftTab === 'files' && (
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                  {activeMission.evidence.datasets.map((ds) => (
                    <div key={ds.name} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate">{ds.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{ds.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <span>{ds.records}</span>
                        <span>{ds.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          )}

          {/* ════ CENTER CANVAS: The Work (Chart / Story / Habitat / App) ════ */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#040609] relative">
            {/* Center Canvas Mode Selector Bar */}
            <div className="h-10 bg-[#0a0d14] border-b border-white/[0.08] flex items-center justify-between px-4 shrink-0 text-xs z-20">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'chart', label: '📊 Acoustics & Population Chart' },
                  { id: 'story', label: '🎨 Illustrated Storybook' },
                  { id: 'map', label: '🗺️ Beaufort Sea Telemetry Map' },
                  { id: 'habitat', label: '🌊 3D Ocean Habitat' },
                  { id: 'preview', label: '💻 Interactive App Preview' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setCanvasMode(mode.id as any)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
                      canvasMode === mode.id
                        ? 'bg-zinc-800 text-white font-medium shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                  title="Toggle Left Panel"
                >
                  <Layout className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CANVAS 1: Interactive Acoustics & Population Chart */}
            {canvasMode === 'chart' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center space-y-6">
                <div className="max-w-4xl w-full rounded-3xl border border-white/15 bg-zinc-950/80 p-6 backdrop-blur-3xl shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>📊</span> Beaufort Sea Beluga Population & Acoustic Density (2016–2026)
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Correlating 14,280 hours of hydrophone recording spectrograms with seasonal sea-ice loss.
                      </p>
                    </div>

                    {/* Audio Playback Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAudioPlaying(!isAudioPlaying)
                          zooAudio.playCue('echolocation')
                        }}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                      >
                        {isAudioPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isAudioPlaying ? 'Mute Bioacoustics' : 'Play Whistle Audio'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Synthetic Interactive Multi-Year Spectrogram & Population Curves */}
                  <div className="h-64 w-full bg-black/60 rounded-2xl border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 z-10">
                      <span>Population Count (Est. Pod Size)</span>
                      <span className="text-cyan-400">96 kHz Whistle Harmonics</span>
                      <span className="text-amber-400">Shipping Corridor Noise (dB)</span>
                    </div>

                    {/* SVG Graphic with dynamic wave curves */}
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Population curve */}
                      <path
                        d="M0,140 Q150,110 300,120 T600,60 T800,40 L800,200 L0,200 Z"
                        fill="url(#chartGrad)"
                      />
                      <path
                        d="M0,140 Q150,110 300,120 T600,60 T800,40"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="3"
                      />
                      {/* Ship noise spikes */}
                      <path
                        d="M0,180 Q100,170 200,140 T400,110 T600,160 T800,120"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Timeline Axis */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/10 z-10">
                      <span>2016</span>
                      <span>2018</span>
                      <span>2020</span>
                      <span>2022</span>
                      <span>2024</span>
                      <span className="text-white font-bold">2026 (Current)</span>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10">
                      <span className="text-[11px] text-zinc-400">Total Classified Whistles</span>
                      <p className="text-xl font-bold text-white mt-1">142,800</p>
                      <span className="text-[10px] text-emerald-400 font-mono">+18% with Elephant clean</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10">
                      <span className="text-[11px] text-zinc-400">Vocal Separation Factor</span>
                      <p className="text-xl font-bold text-cyan-400 mt-1">4.2x</p>
                      <span className="text-[10px] text-zinc-400 font-mono">During heavy icebreaker transit</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10">
                      <span className="text-[11px] text-zinc-400">Proposed Speed Buffer</span>
                      <p className="text-xl font-bold text-amber-400 mt-1">15 Knots</p>
                      <span className="text-[10px] text-zinc-400 font-mono">Submitting to Arctic Council</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS 2: Illustrated Storybook for K-12 Classrooms */}
            {canvasMode === 'story' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center space-y-6">
                <div className="max-w-3xl w-full rounded-3xl border border-white/15 bg-zinc-950/90 p-8 shadow-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-3xl">🐋 📖</span>
                    <h2 className="text-2xl font-extrabold text-white">
                      The Whale Who Sang Through the Ice
                    </h2>
                    <p className="text-xs text-cyan-400 font-medium">
                      Citizen Science & Classroom Edition · Created by Blue & Castor the Beaver
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                      <h4 className="font-bold text-white text-sm">Chapter 1: The Ocean’s Canaries</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Beluga whales are famous for their chirps, whistles, and clicks. They use sound like natural flashlights in the dark icy Arctic sea!
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                      <h4 className="font-bold text-white text-sm">Chapter 2: Listening Underwater</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        Scientists place hydrophones (underwater microphones) deep under the ice to listen without disturbing the pods.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-300 text-sm">Classroom Action: Schoolyard Listening</h4>
                      <p className="text-xs text-zinc-300">
                        Record bird and wildlife sounds in your schoolyard with the Zoo App!
                      </p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all">
                      Start Activity
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS 3: 3D Ocean Habitat */}
            {canvasMode === 'habitat' && (
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/bg_video/static/relactation0.mp4"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
                <div className="relative z-10 text-center space-y-3 p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                  <span className="text-4xl">🐋</span>
                  <h3 className="text-lg font-bold text-white">Blue is swimming in the Beaufort Sea</h3>
                  <p className="text-xs text-zinc-400">Listening to hydrophone arrays HYD-BF-01 through 03.</p>
                </div>
              </div>
            )}

            {/* CANVAS 4: Interactive App Preview */}
            {canvasMode === 'preview' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
                <div className="max-w-4xl w-full rounded-2xl border border-white/15 bg-black/80 p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-mono text-xs text-emerald-400">https://arctic.zoo.ngo</span>
                    <span className="text-xs text-zinc-400">Live MicroVM Container</span>
                  </div>
                  <div className="py-12 text-center space-y-3">
                    <h1 className="text-3xl font-extrabold text-white">Arctic Marine Protection Portal</h1>
                    <p className="text-sm text-zinc-300 max-w-lg mx-auto">
                      Powered by Zoo Labs Sovereign AI Foundation and real-time bioacoustics telemetry.
                    </p>
                    <button className="px-5 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg">
                      Explore Public Findings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CANVAS 5: Telemetry Map */}
            {canvasMode === 'map' && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl space-y-4">
                  <h3 className="font-bold text-white text-base">🗺️ Beaufort Sea Hydrophone Network</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeMission.evidence.hydrophones.map((h) => (
                      <div key={h.id} className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-cyan-400 text-xs font-bold">{h.id}</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-xs text-zinc-200">{h.location}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{h.freq}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Persistent Draggable FaceTime-style Blue PiP ─── */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="absolute z-40 rounded-2xl overflow-hidden border-2 border-cyan-400/80 bg-black/90 shadow-[0_20px_50px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing backdrop-blur-2xl touch-none"
              style={{
                width: '260px',
                height: '170px',
                right: '24px',
                bottom: '80px',
                transform: `translate3d(${pipPos.x}px, ${pipPos.y}px, 0px)`,
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                src="/bg_video/static/relactation1.mp4"
                className="h-full w-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-semibold text-white flex items-center gap-1 border border-white/20">
                  <span>🐋</span> Blue PiP
                </span>
                {activeSpeakerId === 'blue' && (
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] text-cyan-300 font-mono">
                  {activeSpeakerId === 'blue' ? '🔊 Speaking…' : '🌊 Listening…'}
                </span>
              </div>
            </div>
          </main>

          {/* ════ RIGHT COLUMN: Living Pod & Multi-Agent Participants ════ */}
          {rightPanelOpen && (
            <aside className="w-64 lg:w-72 bg-[#080b10] border-l border-white/[0.08] flex flex-col shrink-0 z-20">
              {/* Voice Room Header */}
              <div className="h-10 border-b border-white/[0.08] flex items-center justify-between px-3 bg-[#0a0d14] shrink-0 text-xs font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Voice Channel (Pod)</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {humanParticipants.length + agents.length} in room
                </span>
              </div>

              {/* Participants List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
                {/* Humans */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Humans ({humanParticipants.length})
                  </span>
                  {humanParticipants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            p.isSpeaking
                              ? 'border-2 border-emerald-400 ring-4 ring-emerald-500/40 bg-emerald-950'
                              : 'bg-zinc-800 border border-white/10'
                          }`}
                        >
                          {p.emoji || p.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs leading-tight">
                            {p.name} {p.isYou && '(You)'}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {p.isHost ? 'Host' : 'Member'}
                          </p>
                        </div>
                      </div>
                      <div>
                        {p.isMuted ? (
                          <MicOff className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <Mic className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Animals */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Bot className="h-3 w-3" /> AI Animals ({agents.length})
                  </span>
                  {agents.map((a) => {
                    const isSpeaking = activeSpeakerId === a.id

                    return (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              isSpeaking
                                ? 'border-2 border-cyan-400 ring-4 ring-cyan-500/40 bg-cyan-950 animate-pulse'
                                : 'bg-zinc-800 border border-white/10'
                            }`}
                          >
                            {a.emoji}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-xs leading-tight truncate max-w-[120px]">
                              {a.name}
                            </p>
                            <p className="text-[10px] text-cyan-400 font-mono truncate max-w-[120px]">
                              {a.role.split('&')[0]}
                            </p>
                          </div>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bottom Voice Control Bar (Discord-style) */}
              <div className="p-3 border-t border-white/[0.08] bg-[#06080d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMicrophone}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      micOn ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-rose-600/30 text-rose-400 border border-rose-500/30'
                    }`}
                    title={micOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleDeafen}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      deafened ? 'bg-rose-600/30 text-rose-400 border border-rose-500/30' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                    title={deafened ? 'Undeafen' : 'Deafen'}
                  >
                    {deafened ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      zooAudio.playCue('leave')
                      setIsVoiceConnected(!isVoiceConnected)
                    }}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
                    title="Disconnect"
                  >
                    <PhoneOff className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
