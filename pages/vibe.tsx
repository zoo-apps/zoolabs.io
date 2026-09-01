import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit2,
  Square,
  Play,
  Share2,
  Users,
  Tv,
  BookOpen,
  Folder,
  MessageCircle,
  Settings,
  PanelRight,
  Plus,
  ArrowUp,
  RotateCw,
  X,
  Copy,
  Check,
  Smile,
  Terminal as TerminalIcon,
  ChevronDown,
  ExternalLink,
  Code2,
  Sparkles,
  Heart,
  ThumbsUp,
  Box,
  Rotate3d,
  Layers,
  Activity,
  Maximize2,
  Eye,
  Wand2,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import ZooLogo from '../components/ZooLogo'
import { getBackendBaseUrl, streamChatCompletion, ChatMessage } from '../lib/hanzo-ai-service'

type VibeRoom = {
  id: string
  name: string
  icon: string
  desc: string
  habitatVideo: string
  familiar: string
  model3D: string
  activeUsers: number
  activeBots: number
}

const VIBE_ROOMS: VibeRoom[] = [
  {
    id: 'ocean-genesis-room',
    name: 'Ocean Deep Dive (Genesis Pod)',
    icon: '🐬',
    desc: '120kHz underwater acoustics & Blue the Beluga familiar',
    habitatVideo: '/bg_video/static/relactation0.mp4',
    familiar: 'Blue the Beluga',
    model3D: 'Beluga Whale Avatar Rig',
    activeUsers: 3,
    activeBots: 2,
  },
  {
    id: 'arctic-tundra-sanctuary',
    name: 'Arctic Tundra & Forest Sanctuary',
    icon: '🐅',
    desc: 'Siberian Tiger pod & wildlife telemetry sensors',
    habitatVideo: '/bg_video/static/relactation2.mp4',
    familiar: 'Siberian Tiger',
    model3D: 'Siberian Tiger Companion',
    activeUsers: 5,
    activeBots: 3,
  },
  {
    id: 'sumatra-rainforest-lab',
    name: 'Sumatran Rainforest Research Lab',
    icon: '🐘',
    desc: 'Bioacoustic species tracking & acoustic AI models',
    habitatVideo: '/bg_video/static/relactation3.mp4',
    familiar: 'Sumatran Elephant',
    model3D: 'Sumatran Elephant Sensor Node',
    activeUsers: 8,
    activeBots: 4,
  },
  {
    id: 'amur-leopard-station',
    name: 'Amur Leopard Mountain Station',
    icon: '🐆',
    desc: 'Anti-poaching camera traps & vision diffusion models',
    habitatVideo: '/bg_video/emotion/Playful.mp4',
    familiar: 'Amur Leopard',
    model3D: 'Origin Endangered Egg 3D',
    activeUsers: 4,
    activeBots: 2,
  },
]

type TeammateMessage = {
  id: string
  sender: string
  avatar: string
  time: string
  content: string
  reactions?: { emoji: string; count: number }[]
  poll?: {
    question: string
    options: { text: string; votes: number }[]
    voted?: number
  }
}

type AgentTurn = {
  id: string
  user: { name: string; handle: string; time: string; avatar: string; model: string }
  prompt: string
  agent: { name: string; time: string; avatar: string }
  thought?: string
  toolCalls?: { type: 'Bash' | 'Write' | 'Edit' | 'AskUserQuestion'; cmd?: string; target?: string; duration?: string }[]
  response: string
  stats?: { model: string; totalTime: string; modelTime: string; cost: string; files: string; lines: string }
}

export default function VibeRoomPage() {
  const [activeRoom, setActiveRoom] = useState<VibeRoom>(VIBE_ROOMS[0])
  const [showRoomSelector, setShowRoomSelector] = useState(false)
  const [viewMode, setViewMode] = useState<'video' | '3d_metaverse'>('video')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'idle' | 'working'>('idle')
  const [busy, setBusy] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewUpdated, setPreviewUpdated] = useState(false)
  const [mobileTab, setMobileTab] = useState<'stream' | 'stage' | 'chat'>('stage')

  // 3D Metaverse Controls
  const [mesh3DRotation, setMesh3DRotation] = useState(1)
  const [wireframe3D, setWireframe3D] = useState(false)

  // Agent Conversation turns
  const [agentInput, setAgentInput] = useState('')
  const [agentTurns, setAgentTurns] = useState<AgentTurn[]>([
    {
      id: 'turn_0',
      user: {
        name: 'demo-user',
        handle: '@demo-user',
        time: '6:40 PM',
        avatar: 'D',
        model: 'ZenLM 3',
      },
      prompt: 'Hey Blue, can you build us a landing page with the swimming whale in the center and Origin Eggs metadata?',
      agent: {
        name: 'Blue (ZenLM)',
        time: '6:40 PM',
        avatar: '🐬',
      },
      thought: "I'll take a quick look at the repository to see what files and video assets we have available.",
      toolCalls: [
        { type: 'Bash', cmd: 'ls -la && find . -maxdepth 2 -not -path "./.git*" | head -50', duration: '' },
        { type: 'Write', target: 'index.html', duration: '66s' },
        { type: 'Edit', target: 'pages/index.tsx', duration: '12s' },
      ],
      response: "I've structured the responsive full-viewport canvas with double-buffered video players and monochrome glass controls. Press Preview to see it in your browser!",
      stats: {
        model: 'ZenLM 3',
        totalTime: '146.0s total',
        modelTime: '120.0s model',
        cost: '$0.0485',
        files: '4 files',
        lines: '+293 -3',
      },
    },
  ])

  // Group chat for human teammates
  const [groupInput, setGroupInput] = useState('')
  const [groupMessages, setGroupMessages] = useState<TeammateMessage[]>([
    { id: 'gm_1', sender: 'Richard Kaminsky', avatar: 'R', time: '6:39 PM', content: "Hey what's up team!" },
    { id: 'gm_2', sender: 'demo-user', avatar: 'D', time: '6:39 PM', content: "Let's get some work done! Check out the ocean preview on the center canvas.", reactions: [{ emoji: '❤️', count: 1 }] },
    { id: 'gm_3', sender: 'Richard Kaminsky', avatar: 'R', time: '6:44 PM', content: 'Dude, awesome preview! The whale swimming in the center looks super clean.', reactions: [{ emoji: '🔥', count: 2 }] },
    {
      id: 'gm_4',
      sender: 'Richard Kaminsky',
      avatar: 'R',
      time: '6:45 PM',
      content: 'Should we add the 120kHz bioacoustic telemetry graph too?',
      poll: {
        question: 'Should we add the 120kHz bioacoustic telemetry graph too?',
        options: [
          { text: 'Yes, full sensor array', votes: 3 },
          { text: 'No, keep it minimal', votes: 0 },
        ],
        voted: 0,
      },
    },
  ])

  const agentScrollerRef = useRef<HTMLDivElement>(null)
  const groupScrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    agentScrollerRef.current?.scrollTo({ top: agentScrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [agentTurns])

  useEffect(() => {
    groupScrollerRef.current?.scrollTo({ top: groupScrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [groupMessages])

  const handleSendAgentPrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentInput.trim() || busy) return

    const text = agentInput.trim()
    setAgentInput('')
    setBusy(true)
    setAgentStatus('working')

    const newTurn: AgentTurn = {
      id: `turn_${Date.now()}`,
      user: {
        name: 'demo-user',
        handle: '@demo-user',
        time: 'Just now',
        avatar: 'D',
        model: 'ZenLM 3',
      },
      prompt: text,
      agent: {
        name: `${activeRoom.familiar} (Zoo AI)`,
        time: 'Just now',
        avatar: activeRoom.icon,
      },
      thought: `Analyzing task with Zoo AI backend for ${activeRoom.name}...`,
      toolCalls: [{ type: 'Edit', target: 'pages/index.tsx', duration: '1.2s' }],
      response: '',
      stats: {
        model: 'ZenLM 3',
        totalTime: '2.1s total',
        modelTime: '1.6s model',
        cost: '$0.00',
        files: '2 files',
        lines: '+32 -4',
      },
    }

    setAgentTurns((prev) => [...prev, newTurn])
    setPreviewUpdated(true)

    const chatHistory: ChatMessage[] = [
      {
        role: 'system',
        content: `You are ${activeRoom.familiar} in the Zoo Labs /vibe collaborative metaverse space (${activeRoom.name}). You help human teammates build applications, bioacoustic telemetry pipelines, and 3D generative art with persistent Zoo Cloud microVMs.`,
      },
      ...agentTurns.map((t) => ({ role: 'user' as const, content: t.prompt })),
      { role: 'user', content: text },
    ]

    await streamChatCompletion({
      messages: chatHistory,
      onToken: (token) => {
        setAgentTurns((prev) =>
          prev.map((t) => (t.id === newTurn.id ? { ...t, response: t.response + token } : t))
        )
      },
      onDone: (full) => {
        setAgentTurns((prev) =>
          prev.map((t) => (t.id === newTurn.id ? { ...t, response: full } : t))
        )
        setBusy(false)
        setAgentStatus('idle')
      },
    })
  }

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupInput.trim()) return

    const newMsg: TeammateMessage = {
      id: `gm_${Date.now()}`,
      sender: 'demo-user',
      avatar: 'D',
      time: 'Just now',
      content: groupInput.trim(),
    }
    setGroupMessages((prev) => [...prev, newMsg])
    setGroupInput('')
  }

  const handleVotePoll = (msgId: string, optionIdx: number) => {
    setGroupMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId || !msg.poll) return msg
        const oldVoted = msg.poll.voted
        const updatedOptions = msg.poll.options.map((opt, idx) => {
          if (idx === optionIdx) return { ...opt, votes: opt.votes + (oldVoted === optionIdx ? 0 : 1) }
          if (idx === oldVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) }
          return opt
        })
        return {
          ...msg,
          poll: {
            ...msg.poll,
            options: updatedOptions,
            voted: optionIdx,
          },
        }
      })
    )
  }

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setGroupMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg
        const currentReactions = msg.reactions || []
        const existing = currentReactions.find((r) => r.emoji === emoji)
        let updated: { emoji: string; count: number }[]
        if (existing) {
          updated = currentReactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
        } else {
          updated = [...currentReactions, { emoji, count: 1 }]
        }
        return { ...msg, reactions: updated }
      })
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Vibe With Friends & Multi-Agent Metaverse Sandbox</title>
        <meta
          name="description"
          content="Multi-human and multi-agent collaborative live workspace with 3D Gaussian splat metaverse and real-time code preview."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#09090B] text-[#FAFAFA] font-sans select-none flex flex-col">
        {/* Global App Chrome */}
        <ZooAppChrome />

        {/* ─── 1. SUB-HEADER: ROOM BAR & METAVERSE VIEW TOGGLES ─────────────── */}
        <header className="h-11 border-b border-white/[0.08] bg-[#121214]/90 backdrop-blur-xl px-3.5 flex items-center justify-between z-40 shrink-0 text-xs">
          {/* Left: Room Selector */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Back to ocean"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowRoomSelector(!showRoomSelector)}
                className="flex items-center gap-1.5 font-bold text-white px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                <span>{activeRoom.icon}</span>
                <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeRoom.name}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {/* Room Selector Dropdown */}
              {showRoomSelector && (
                <div className="absolute top-10 left-0 w-80 rounded-2xl bg-[#18181B] border border-white/10 p-3 shadow-2xl space-y-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Choose Vibe Room</span>
                    <span className="text-[10px] text-blue-400 font-mono">Metaverse Pods</span>
                  </div>

                  <div className="space-y-1.5">
                    {VIBE_ROOMS.map((room) => {
                      const isSel = activeRoom.id === room.id
                      return (
                        <button
                          key={room.id}
                          onClick={() => {
                            setActiveRoom(room)
                            setShowRoomSelector(false)
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                            isSel
                              ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                              : 'bg-black/40 border-white/10 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <span className="text-xl">{room.icon}</span>
                          <div className="truncate flex-1">
                            <p className="font-bold text-white truncate">{room.name}</p>
                            <p className="text-[10px] text-zinc-400 truncate">{room.desc}</p>
                            <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 pt-0.5">
                              <span>👥 {room.activeUsers} humans</span>
                              <span>•</span>
                              <span className="text-blue-400">🤖 {room.activeBots} bots</span>
                            </div>
                          </div>
                          {isSel && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-1" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <span className="text-zinc-700 hidden sm:inline">•</span>

            {/* Agent Live Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span
                className={`h-2 w-2 rounded-full ${
                  agentStatus === 'working' ? 'bg-blue-500 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span>
                {agentStatus === 'working'
                  ? `${activeRoom.familiar} is executing prompt...`
                  : `${activeRoom.familiar} is ready`}
              </span>
            </div>
          </div>

          {/* Right: Mobile Tab Switcher, 2D/3D Toggle & Invite */}
          <div className="flex items-center gap-2">
            {/* Mobile Column View Switcher (Visible on small screens) */}
            <div className="flex md:hidden items-center bg-black/60 border border-white/10 p-0.5 rounded-xl text-[11px] font-semibold">
              <button
                onClick={() => setMobileTab('stream')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  mobileTab === 'stream' ? 'bg-white text-black' : 'text-zinc-400'
                }`}
              >
                Stream
              </button>
              <button
                onClick={() => setMobileTab('stage')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  mobileTab === 'stage' ? 'bg-white text-black' : 'text-zinc-400'
                }`}
              >
                Stage
              </button>
              <button
                onClick={() => setMobileTab('chat')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  mobileTab === 'chat' ? 'bg-white text-black' : 'text-zinc-400'
                }`}
              >
                Chat
              </button>
            </div>

            {/* 2D / 3D Metaverse View Switcher */}
            <div className="hidden sm:flex items-center bg-black/60 border border-white/10 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('video')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'video' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>🎬</span>
                <span>2D Habitat</span>
              </button>
              <button
                onClick={() => setViewMode('3d_metaverse')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === '3d_metaverse' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>🧊</span>
                <span>3D Splat</span>
              </button>
            </div>

            {/* Teammates Avatar Stack */}
            <div className="hidden lg:flex items-center -space-x-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EA580C] text-[10px] font-bold text-white ring-2 ring-[#121214]">
                D
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3B82F6] text-[10px] font-bold text-white ring-2 ring-[#121214]">
                R
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981] text-[10px] font-bold text-white ring-2 ring-[#121214]">
                S
              </div>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white px-3 py-1 font-semibold transition-colors cursor-pointer text-xs shadow-md shadow-orange-950/40"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Invite</span>
            </button>
          </div>
        </header>

        {/* ─── Main Workspace: CSS Grid Multi-Modal Layout ────────────────── */}
        <div className="zoo-vibe-grid flex-1">
          {/* COLUMN 1: AGENT COLLABORATION STREAM (Left Pane) */}
          <div
            className={`flex flex-col justify-between border-r border-white/[0.08] bg-[#121214] overflow-hidden ${
              mobileTab === 'stream' ? 'flex' : 'hidden md:flex'
            }`}
          >
            <div className="h-9 border-b border-white/[0.08] px-3.5 flex items-center justify-between text-xs text-zinc-400 bg-white/[0.02]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <ZooLogo size={14} />
                <span>{activeRoom.icon}</span>
                <span>{activeRoom.familiar}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">24/7 Zoo MicroVM</span>
            </div>

            {/* Conversation Log */}
            <div ref={agentScrollerRef} className="flex-1 p-3.5 space-y-4 overflow-y-auto no-scrollbar">
              {agentTurns.map((turn) => (
                <div key={turn.id} className="space-y-3 animate-in fade-in duration-200">
                  {/* User Turn */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EA580C] text-[11px] font-bold text-white shrink-0 mt-0.5 shadow-sm">
                      {turn.user.avatar}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-xs text-white">{turn.user.name}</span>
                        <span className="text-[10px] text-zinc-500">{turn.user.time}</span>
                      </div>
                      <p className="text-zinc-200 text-xs leading-relaxed bg-white/[0.04] p-3 rounded-2xl border border-white/[0.08]">
                        {turn.prompt}
                      </p>
                    </div>
                  </div>

                  {/* Agent Turn */}
                  <div className="flex items-start gap-2.5 pl-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs shrink-0 shadow-md">
                      {activeRoom.icon}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <ZooLogo size={12} />
                          <span>{turn.agent.name}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500">{turn.agent.time}</span>
                      </div>

                      {/* Tool Call Cards */}
                      {turn.toolCalls && turn.toolCalls.length > 0 && (
                        <div className="space-y-1.5">
                          {turn.toolCalls.map((tc, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl bg-black/40 border border-white/[0.08] p-2 text-[11px] font-mono space-y-1"
                            >
                              <div className="flex items-center justify-between text-zinc-400">
                                <span className="text-blue-400 font-bold flex items-center gap-1">
                                  <TerminalIcon className="h-3 w-3" />
                                  <span>{tc.type}</span>
                                </span>
                                {tc.duration && <span className="text-[10px] text-zinc-500">{tc.duration}</span>}
                              </div>
                              <p className="text-zinc-300 truncate">{tc.cmd || tc.target}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Agent Response */}
                      <p className="text-zinc-200 text-xs leading-relaxed bg-black/50 p-3 rounded-2xl border border-white/10">
                        {turn.response || <span className="text-zinc-500 animate-pulse">Streaming response from Zoo AI...</span>}
                      </p>

                      {/* Turn Telemetry Stats */}
                      {turn.stats && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-zinc-500">
                          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                            {turn.stats.model}
                          </span>
                          <span>•</span>
                          <span>{turn.stats.totalTime}</span>
                          <span>•</span>
                          <span>{turn.stats.cost}</span>
                          <span>•</span>
                          <span className="text-emerald-400">{turn.stats.lines}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Composer */}
            <form onSubmit={handleSendAgentPrompt} className="p-3 border-t border-white/[0.08] bg-[#18181B]/80">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-sm focus-within:border-blue-500">
                <input
                  type="text"
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  placeholder={`Ask ${activeRoom.familiar}...`}
                  className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600 px-2"
                />
                <button
                  type="submit"
                  disabled={busy || !agentInput.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs active:scale-95 disabled:opacity-30 transition-all cursor-pointer shadow-md shadow-blue-600/30"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* COLUMN 2: CENTER STAGE (2D Video or 3D Gaussian Splat Metaverse) */}
          <div
            className={`flex flex-col border-r border-white/[0.08] bg-[#09090B] overflow-hidden ${
              mobileTab === 'stage' ? 'flex' : 'hidden md:flex'
            }`}
          >
            {/* Viewport Top Info Bar */}
            <div className="h-10 border-b border-white/[0.08] bg-[#121214]/80 px-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{viewMode === 'video' ? 'LIVE HABITAT & PREVIEW' : '3D GAUSSIAN SPLAT METAVERSE'}</span>
              </div>

              <div className="flex items-center gap-2">
                {previewUpdated && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    ● Updated
                  </span>
                )}
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeRoom.model3D}
                </span>
              </div>
            </div>

            {/* Viewport Stage Body */}
            {viewMode === 'video' ? (
              /* 2D Video Habitat Mode */
              <div className="flex-1 flex flex-col justify-between p-6 bg-black relative overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  key={activeRoom.habitatVideo}
                  src={activeRoom.habitatVideo}
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-70 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />

                {/* Hero Overlay */}
                <div className="relative z-10 space-y-4 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{activeRoom.icon}</span>
                    <div>
                      <h3 className="text-xl font-black text-white">{activeRoom.name}</h3>
                      <p className="text-xs text-zinc-300">{activeRoom.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setViewMode('3d_metaverse')}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-1.5 cursor-pointer hover:bg-blue-500 transition-colors"
                    >
                      <Box className="h-3.5 w-3.5" />
                      <span>Enter 3D Metaverse Space</span>
                    </button>
                    <Link
                      href="/video"
                      className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs border border-white/15 hover:bg-white/20 transition-colors"
                    >
                      4K Video Maker
                    </Link>
                  </div>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50 font-mono">
                  <span>ZOO LABS MULTI-AGENT POD ROOM</span>
                  <span>LATENCY: 14ms · HANZO CLOUD MICROVM</span>
                </div>
              </div>
            ) : (
              /* 3D Gaussian Splat Metaverse Space Mode */
              <div className="flex-1 flex flex-col justify-between p-6 bg-[#050508] relative overflow-hidden">
                {/* 3D WebGL Space Canvas */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Orbital Crystalline Space Splat */}
                  <div
                    className="relative w-80 h-96 rounded-[50%] flex items-center justify-center transition-all"
                    style={{
                      background: 'radial-gradient(circle at 35% 35%, #60A5FA 0%, #1E40AF 45%, #020617 100%)',
                      boxShadow: '0 0 100px rgba(59, 130, 246, 0.5), inset 0 0 60px rgba(255, 255, 255, 0.4)',
                      border: wireframe3D ? '2px dashed #93C5FD' : '1px solid rgba(255, 255, 255, 0.2)',
                      animation: `spin ${8 / (mesh3DRotation || 1)}s linear infinite`,
                    }}
                  >
                    <div className="text-6xl animate-bounce">{activeRoom.icon}</div>
                  </div>
                </div>

                {/* Top Metaverse Controls */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-1 text-xs">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Rotate3d className="h-4 w-4 text-blue-400" />
                      <span>3D Splat Spatial Metaverse</span>
                    </p>
                    <p className="text-[10px] text-zinc-400">Interactive animal avatar & collaborative science telemetry</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWireframe3D(!wireframe3D)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        wireframe3D ? 'bg-blue-600 text-white border-blue-500' : 'bg-black/60 text-zinc-400 border-white/10'
                      }`}
                    >
                      Wireframe: {wireframe3D ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => setViewMode('video')}
                      className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/15 cursor-pointer hover:bg-white/20"
                    >
                      Return to 2D Habitat
                    </button>
                  </div>
                </div>

                {/* Bottom 3D Telemetry Controls */}
                <div className="relative z-10 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-400">Rotation Velocity:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="range"
                          min="0.5"
                          max="4"
                          step="0.5"
                          value={mesh3DRotation}
                          onChange={(e) => setMesh3DRotation(parseFloat(e.target.value))}
                          className="accent-blue-500 w-24"
                        />
                        <span className="font-mono font-bold text-blue-400 text-xs">{mesh3DRotation}x</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/3d"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Open 3D Mesh Editor &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 3: GROUP CHAT (Right Pane - Side-channel for humans) */}
          <div
            className={`flex flex-col justify-between bg-[#121214] border-l border-white/[0.08] overflow-hidden ${
              mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <div className="h-10 border-b border-white/[0.08] px-4 flex items-center justify-between text-xs text-zinc-400 bg-white/[0.02]">
              <span className="font-semibold text-white">Teammates Group Chat</span>
              <span className="text-[10px] text-zinc-500">Private pod</span>
            </div>

            {/* Chat Stream */}
            <div ref={groupScrollerRef} className="flex-1 p-3.5 space-y-4 overflow-y-auto no-scrollbar">
              {groupMessages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {msg.avatar}
                      </div>
                      <span className="font-semibold text-xs text-white">{msg.sender}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{msg.time}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-zinc-200 bg-white/[0.04] p-3 rounded-2xl border border-white/[0.06] leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Interactive Poll Component */}
                    {msg.poll && (
                      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                        <p className="font-semibold text-white flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-blue-400" />
                          <span>{msg.poll.question}</span>
                        </p>
                        <div className="space-y-1.5">
                          {msg.poll.options.map((opt, idx) => {
                            const isVoted = msg.poll?.voted === idx
                            return (
                              <button
                                key={idx}
                                onClick={() => handleVotePoll(msg.id, idx)}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs cursor-pointer ${
                                  isVoted
                                    ? 'bg-blue-600/30 border border-blue-500/50 text-white font-medium'
                                    : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-zinc-300'
                                }`}
                              >
                                <span>{opt.text}</span>
                                <span className="font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded-md text-zinc-300">
                                  {opt.votes} votes
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Emoji Reaction Badges */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {msg.reactions?.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleToggleReaction(msg.id, r.emoji)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/10 text-[11px] transition-all cursor-pointer active:scale-90"
                        >
                          <span>{r.emoji}</span>
                          <span className="font-mono text-[10px] text-zinc-400">{r.count}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleToggleReaction(msg.id, '❤️')}
                        className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                        title="React with Heart"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={() => handleToggleReaction(msg.id, '🔥')}
                        className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                        title="React with Fire"
                      >
                        🔥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendGroupMessage} className="p-3 border-t border-white/[0.08] bg-[#18181B]/80">
              <div className="flex items-center gap-2 rounded-2xl bg-black/60 border border-white/10 px-3 py-2">
                <input
                  type="text"
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder="Message teammates..."
                  className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={!groupInput.trim()}
                  className="text-blue-400 font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ─── Invite Friends Modal ────────────────────────────────────────── */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Invite Friends to {activeRoom.name}</h3>
                <button onClick={() => setInviteModalOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
              </div>

              <p className="text-zinc-400 leading-relaxed">
                Share this link with your teammates to vibe, build AI, and explore the 3D metaverse room in real-time:
              </p>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value={`https://zoolabs.io/vibe?room=${activeRoom.id}`}
                  className="flex-1 bg-transparent text-xs text-white outline-none font-mono truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
