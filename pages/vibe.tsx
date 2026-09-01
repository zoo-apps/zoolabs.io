import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Terminal as TerminalIcon,
  ChevronDown,
  Check,
  Send,
  MessageSquare,
  Activity,
  Box,
  RotateCcw,
  Sliders,
  Share2,
  Cpu,
  Monitor,
  Maximize2,
  Play,
  Pause,
  Rotate3d,
  PanelLeft,
  PanelRight,
  Filter,
  Copy,
  Bot,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import ZooLogo from '../components/ZooLogo'
import { streamChatCompletion, ChatMessage, getBackendBaseUrl } from '../lib/hanzo-ai-service'

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
    desc: 'Sovereign frontier AI research & Blue the Beluga familiar',
    habitatVideo: '/bg_video/static/relactation0.mp4',
    familiar: 'Blue the Beluga',
    model3D: 'Beluga Whale Rig',
    activeUsers: 3,
    activeBots: 2,
  },
  {
    id: 'arctic-tundra-sanctuary',
    name: 'Arctic Tundra Sanctuary',
    icon: '🐅',
    desc: 'Siberian Tiger pod & high-throughput neural inference',
    habitatVideo: '/bg_video/static/relactation2.mp4',
    familiar: 'Siberian Tiger',
    model3D: 'Siberian Tiger Avatar',
    activeUsers: 5,
    activeBots: 3,
  },
  {
    id: 'sumatra-rainforest-lab',
    name: 'Sumatran Rainforest Research Lab',
    icon: '🐘',
    desc: 'Zoo Gym reinforcement learning & vision diffusion models',
    habitatVideo: '/bg_video/static/relactation3.mp4',
    familiar: 'Sumatran Elephant',
    model3D: 'Sumatran Elephant Mesh',
    activeUsers: 8,
    activeBots: 4,
  },
  {
    id: 'amur-leopard-station',
    name: 'Amur Leopard Mountain Station',
    icon: '🐆',
    desc: 'PoUW AI mining clusters & real-time reasoning models',
    habitatVideo: '/bg_video/emotion/Playful.mp4',
    familiar: 'Amur Leopard',
    model3D: 'Origin Crystalline Egg',
    activeUsers: 4,
    activeBots: 2,
  },
]

type CollaborativeFeedItem = {
  id: string
  kind: 'teammate_message' | 'agent_turn'
  timestamp: string
  sender?: {
    name: string
    avatar: string
    color: string
    isBot?: boolean
  }
  content?: string
  reactions?: { emoji: string; count: number }[]
  poll?: {
    question: string
    options: { text: string; votes: number }[]
    voted?: number
  }
  user?: {
    name: string
    avatar: string
    model: string
  }
  prompt?: string
  agent?: {
    name: string
    avatar: string
  }
  thought?: string
  toolCalls?: { type: 'Bash' | 'Write' | 'Edit' | 'Search'; cmd?: string; target?: string; duration?: string }[]
  response?: string
  stats?: {
    model: string
    totalTime: string
    modelTime: string
    cost: string
    files: string
    lines: string
  }
}

export default function VibeRoomPage() {
  const [activeRoom, setActiveRoom] = useState<VibeRoom>(VIBE_ROOMS[0])
  const [showRoomSelector, setShowRoomSelector] = useState(false)
  const [viewMode, setViewMode] = useState<'video' | '3d_metaverse'>('video')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'idle' | 'working'>('idle')
  const [busy, setBusy] = useState(false)
  const [previewUpdated, setPreviewUpdated] = useState(false)
  const [filterMode, setFilterMode] = useState<'all' | 'agents' | 'chat'>('all')

  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(false)

  const [mesh3DRotation, setMesh3DRotation] = useState(1)
  const [wireframe3D, setWireframe3D] = useState(false)

  const [feedInput, setFeedInput] = useState('')
  const [feedItems, setFeedItems] = useState<CollaborativeFeedItem[]>([
    {
      id: 'f_1',
      kind: 'teammate_message',
      timestamp: '6:39 PM',
      sender: { name: 'Richard Kaminsky', avatar: 'R', color: '#3B82F6' },
      content: "Hey team! I'm in the Genesis Pod room. Let's build out the new sovereign AI interface.",
      reactions: [{ emoji: '🔥', count: 2 }],
    },
    {
      id: 'f_2',
      kind: 'agent_turn',
      timestamp: '6:40 PM',
      user: {
        name: 'demo-user',
        avatar: 'D',
        model: 'Zen 5',
      },
      prompt: 'Hey Blue, can you inspect the repository and build us a responsive habitat preview with real-time audio controls?',
      agent: {
        name: 'Blue (Zen 5)',
        avatar: '🐬',
      },
      thought: "Analyzing repository architecture and audio stem synthesizers in Zoo Cloud microVM...",
      toolCalls: [
        { type: 'Bash', cmd: 'ls -la && find . -maxdepth 2 | head -30', duration: '0.4s' },
        { type: 'Write', target: 'pages/index.tsx', duration: '1.2s' },
      ],
      response: "I've wired the Web Audio synthesizer and Canvas 3D projection engine directly to the stage. You can now toggle between 2D live habitat and 3D metaverse in real-time!",
      stats: {
        model: 'Zen 5',
        totalTime: '1.8s',
        modelTime: '1.4s',
        cost: '$0.00',
        files: '2 files',
        lines: '+48 -2',
      },
    },
    {
      id: 'f_3',
      kind: 'teammate_message',
      timestamp: '6:42 PM',
      sender: { name: 'Sarah Chen', avatar: 'S', color: '#10B981' },
      content: 'The 3D Canvas orbit engine is working super smoothly now!',
      reactions: [{ emoji: '❤️', count: 3 }],
    },
    {
      id: 'f_4',
      kind: 'teammate_message',
      timestamp: '6:44 PM',
      sender: { name: 'Richard Kaminsky', avatar: 'R', color: '#3B82F6' },
      content: 'Quick poll: should we add live GPU cluster telemetry to the right inspector pane?',
      poll: {
        question: 'Should we add live GPU cluster telemetry to the right inspector pane?',
        options: [
          { text: 'Yes, full cluster metrics', votes: 4 },
          { text: 'No, keep it minimal', votes: 0 },
        ],
        voted: 0,
      },
    },
  ])

  const feedScrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    feedScrollerRef.current?.scrollTo({ top: feedScrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [feedItems])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedInput.trim() || busy) return

    const text = feedInput.trim()
    setFeedInput('')

    const isAgentPrompt =
      text.toLowerCase().includes('@blue') ||
      text.toLowerCase().includes('@agent') ||
      text.toLowerCase().includes('@zen') ||
      text.startsWith('/') ||
      text.toLowerCase().startsWith('build') ||
      text.toLowerCase().startsWith('create') ||
      text.toLowerCase().startsWith('generate') ||
      text.toLowerCase().startsWith('fix') ||
      text.toLowerCase().startsWith('can you') ||
      text.toLowerCase().startsWith('how')

    if (isAgentPrompt) {
      setBusy(true)
      setAgentStatus('working')

      const turnId = `agent_${Date.now()}`
      const newTurn: CollaborativeFeedItem = {
        id: turnId,
        kind: 'agent_turn',
        timestamp: 'Just now',
        user: {
          name: 'demo-user',
          avatar: 'D',
          model: 'Zen 5',
        },
        prompt: text,
        agent: {
          name: `${activeRoom.familiar} (Zoo AI)`,
          avatar: activeRoom.icon,
        },
        thought: `Executing prompt with Hanzo Cloud microVM for ${activeRoom.name}...`,
        toolCalls: [{ type: 'Edit', target: 'pages/index.tsx', duration: '0.8s' }],
        response: '',
        stats: {
          model: 'Zen 5',
          totalTime: '1.2s',
          modelTime: '0.9s',
          cost: '$0.00',
          files: '1 file',
          lines: '+18 -2',
        },
      }

      setFeedItems((prev) => [...prev, newTurn])
      setPreviewUpdated(true)

      const chatHistory: ChatMessage[] = [
        {
          role: 'system',
          content: `You are ${activeRoom.familiar} in the Zoo Labs /vibe collaborative room (${activeRoom.name}). You help human teammates build applications, reasoning pipelines, and 3D generative art with persistent Zoo Cloud microVMs.`,
        },
        ...feedItems
          .filter((f) => f.kind === 'agent_turn' && f.prompt)
          .map((f) => ({ role: 'user' as const, content: f.prompt! })),
        { role: 'user', content: text },
      ]

      await streamChatCompletion({
        messages: chatHistory,
        onToken: (token) => {
          setFeedItems((prev) =>
            prev.map((item) => (item.id === turnId ? { ...item, response: (item.response || '') + token } : item))
          )
        },
        onDone: (full) => {
          setFeedItems((prev) =>
            prev.map((item) => (item.id === turnId ? { ...item, response: full } : item))
          )
          setBusy(false)
          setAgentStatus('idle')
        },
      })
    } else {
      const newMsg: CollaborativeFeedItem = {
        id: `chat_${Date.now()}`,
        kind: 'teammate_message',
        timestamp: 'Just now',
        sender: {
          name: 'demo-user',
          avatar: 'D',
          color: '#EA580C',
        },
        content: text,
      }
      setFeedItems((prev) => [...prev, newMsg])
    }
  }

  const handleVotePoll = (msgId: string, optionIdx: number) => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id !== msgId || !item.poll) return item
        const oldVoted = item.poll.voted
        const updatedOptions = item.poll.options.map((opt, idx) => {
          if (idx === optionIdx) return { ...opt, votes: opt.votes + (oldVoted === optionIdx ? 0 : 1) }
          if (idx === oldVoted) return { ...opt, votes: Math.max(0, opt.votes - 1) }
          return opt
        })
        return {
          ...item,
          poll: {
            ...item.poll,
            options: updatedOptions,
            voted: optionIdx,
          },
        }
      })
    )
  }

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setFeedItems((prev) =>
      prev.map((item) => {
        if (item.id !== msgId) return item
        const currentReactions = item.reactions || []
        const existing = currentReactions.find((r) => r.emoji === emoji)
        let updated: { emoji: string; count: number }[]
        if (existing) {
          updated = currentReactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
        } else {
          updated = [...currentReactions, { emoji, count: 1 }]
        }
        return { ...item, reactions: updated }
      })
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const filteredFeed = feedItems.filter((item) => {
    if (filterMode === 'agents') return item.kind === 'agent_turn'
    if (filterMode === 'chat') return item.kind === 'teammate_message'
    return true
  })

  return (
    <>
      <Head>
        <title>Zoo Labs — Vibe With Friends & Multi-Agent Pods</title>
        <meta
          name="description"
          content="Collaborative multi-human and multi-agent frontier AI workspace with 3D metaverse, code generation, and live audio stems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#09090B] text-[#FAFAFA] font-sans select-none flex flex-col">
        <ZooAppChrome />

        <header className="h-11 border-b border-white/[0.08] bg-[#121214]/90 backdrop-blur-xl px-3.5 flex items-center justify-between z-40 shrink-0 text-xs">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Back to ocean"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                showLeftSidebar
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-zinc-400 hover:text-white'
              }`}
              title={showLeftSidebar ? 'Collapse Collaboration Feed' : 'Expand Collaboration Feed'}
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoomSelector(!showRoomSelector)}
                className="flex items-center gap-1.5 font-bold text-white px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              >
                <span>{activeRoom.icon}</span>
                <span className="truncate max-w-[160px] sm:max-w-[220px]">{activeRoom.name}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

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

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span
                className={`h-2 w-2 rounded-full ${
                  agentStatus === 'working' ? 'bg-blue-500 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span>
                {agentStatus === 'working'
                  ? `${activeRoom.familiar} is executing...`
                  : `${activeRoom.familiar} is active`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/50 p-0.5 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('video')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'video' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
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

            <button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white px-3 py-1 font-semibold transition-colors cursor-pointer text-xs shadow-md shadow-orange-950/40"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Invite</span>
            </button>

            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer hidden md:flex ${
                showRightSidebar
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-transparent border-white/10 text-zinc-400 hover:text-white'
              }`}
              title={showRightSidebar ? 'Hide Pod Telemetry' : 'Show Pod Telemetry'}
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div
          className="flex-1 flex overflow-hidden"
        >
          {showLeftSidebar && (
            <div className="w-[360px] lg:w-[400px] flex flex-col justify-between border-r border-white/[0.08] bg-[#121214] shrink-0 overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] px-3.5 flex items-center justify-between text-xs text-zinc-400 bg-white/[0.02]">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ZooLogo size={14} />
                  <span>{activeRoom.icon}</span>
                  <span>Collaborative Room</span>
                </span>

                <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      filterMode === 'all' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterMode('agents')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      filterMode === 'agents' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🤖 Agents
                  </button>
                  <button
                    onClick={() => setFilterMode('chat')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      filterMode === 'chat' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    💬 Team
                  </button>
                </div>
              </div>

              <div ref={feedScrollerRef} className="flex-1 p-3.5 space-y-4 overflow-y-auto no-scrollbar">
                {filteredFeed.map((item) => {
                  if (item.kind === 'teammate_message') {
                    return (
                      <div key={item.id} className="space-y-1.5 animate-in fade-in duration-150">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: item.sender?.color || '#3B82F6' }}
                            >
                              {item.sender?.avatar}
                            </div>
                            <span className="font-semibold text-xs text-white">{item.sender?.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp}</span>
                        </div>

                        <div className="space-y-2 pl-6">
                          <p className="text-xs text-zinc-200 bg-white/[0.04] p-2.5 rounded-2xl border border-white/[0.06] leading-relaxed">
                            {item.content}
                          </p>

                          {item.poll && (
                            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                              <p className="font-semibold text-white flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5 text-blue-400" />
                                <span>{item.poll.question}</span>
                              </p>
                              <div className="space-y-1.5">
                                {item.poll.options.map((opt, idx) => {
                                  const isVoted = item.poll?.voted === idx
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleVotePoll(item.id, idx)}
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

                          <div className="flex items-center gap-1.5 pt-0.5">
                            {item.reactions?.map((r, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleToggleReaction(item.id, r.emoji)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/10 text-[11px] transition-all cursor-pointer active:scale-90"
                              >
                                <span>{r.emoji}</span>
                                <span className="font-mono text-[10px] text-zinc-400">{r.count}</span>
                              </button>
                            ))}
                            <button
                              onClick={() => handleToggleReaction(item.id, '❤️')}
                              className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                              title="React Heart"
                            >
                              ❤️
                            </button>
                            <button
                              onClick={() => handleToggleReaction(item.id, '🔥')}
                              className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                              title="React Fire"
                            >
                              🔥
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={item.id} className="space-y-3 p-3 rounded-2xl bg-black/40 border border-white/[0.08] animate-in fade-in duration-200">
                      <div className="flex items-start gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EA580C] text-[10px] font-bold text-white shrink-0 mt-0.5 shadow-sm">
                          {item.user?.avatar}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-baseline justify-between">
                            <span className="font-semibold text-xs text-white">{item.user?.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp}</span>
                          </div>
                          <p className="text-zinc-200 text-xs leading-relaxed bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                            {item.prompt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pl-2 border-l border-blue-500/30">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] shrink-0 shadow-md">
                          {item.agent?.avatar || activeRoom.icon}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-baseline justify-between">
                            <span className="font-semibold text-xs text-white flex items-center gap-1">
                              <ZooLogo size={12} />
                              <span>{item.agent?.name}</span>
                            </span>
                          </div>

                          {item.toolCalls && item.toolCalls.length > 0 && (
                            <div className="space-y-1">
                              {item.toolCalls.map((tc, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-xl bg-black/60 border border-white/[0.08] p-2 text-[10px] font-mono space-y-0.5"
                                >
                                  <div className="flex items-center justify-between text-zinc-400">
                                    <span className="text-blue-400 font-bold flex items-center gap-1">
                                      <TerminalIcon className="h-3 w-3" />
                                      <span>{tc.type}</span>
                                    </span>
                                    {tc.duration && <span className="text-[9px] text-zinc-500">{tc.duration}</span>}
                                  </div>
                                  <p className="text-zinc-300 truncate">{tc.cmd || tc.target}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-zinc-200 text-xs leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
                            {item.response || (
                              <span className="text-zinc-500 animate-pulse flex items-center gap-1.5">
                                <Bot className="h-3.5 w-3.5 animate-spin" />
                                <span>Generating response with Zoo Cloud MicroVM...</span>
                              </span>
                            )}
                          </p>

                          {item.stats && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                              <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                                {item.stats.model}
                              </span>
                              <span>•</span>
                              <span>{item.stats.totalTime}</span>
                              <span>•</span>
                              <span className="text-emerald-400">{item.stats.lines}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-3 border-t border-white/[0.08] bg-[#18181B]/80 space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                  <button
                    onClick={() => setFeedInput(`@${activeRoom.familiar.split(' ')[0]} `)}
                    className="px-2 py-0.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 cursor-pointer shrink-0"
                  >
                    @{activeRoom.familiar.split(' ')[0]}
                  </button>
                  <button
                    onClick={() => setFeedInput('Generate ambient synth stems for habitat')}
                    className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer shrink-0"
                  >
                    🎵 Audio Stems
                  </button>
                  <button
                    onClick={() => setFeedInput('Synthesize 3D splat avatar mesh')}
                    className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer shrink-0"
                  >
                    🧊 3D Splat
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 focus-within:border-blue-500 transition-colors">
                  <input
                    type="text"
                    value={feedInput}
                    onChange={(e) => setFeedInput(e.target.value)}
                    placeholder={`Chat with team or ask @${activeRoom.familiar.split(' ')[0]}...`}
                    className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600 px-2"
                  />
                  <button
                    type="submit"
                    disabled={busy || !feedInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs active:scale-95 disabled:opacity-30 transition-all cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-[#09090B] overflow-hidden">
            <div className="h-10 border-b border-white/[0.08] bg-[#121214]/80 px-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>{viewMode === 'video' ? 'LIVE 2D HABITAT & MEDIA STAGE' : '3D GAUSSIAN SPLAT METAVERSE'}</span>
              </div>

              <div className="flex items-center gap-2">
                {previewUpdated && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    ● Node Active
                  </span>
                )}
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeRoom.model3D}
                </span>
              </div>
            </div>

            {viewMode === 'video' ? (
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
                  <span>LATENCY: 12ms · HANZO CLOUD MICROVM</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between p-6 bg-[#050508] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 space-y-1 text-xs">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Rotate3d className="h-4 w-4 text-blue-400" />
                      <span>3D Splat Spatial Metaverse</span>
                    </p>
                    <p className="text-[10px] text-zinc-400">Collaborative spatial avatars & geometry shaders</p>
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
                    Open 3D Mesh Studio &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {showRightSidebar && (
            <div className="w-72 border-l border-white/[0.08] bg-[#121214] flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto text-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-blue-400" />
                    <span>Pod Telemetry</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Connected Teammates</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#EA580C] text-[10px] font-bold text-white flex items-center justify-center">
                          D
                        </div>
                        <span className="text-zinc-200">demo-user (You)</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#3B82F6] text-[10px] font-bold text-white flex items-center justify-center">
                          R
                        </div>
                        <span className="text-zinc-200">Richard Kaminsky</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#10B981] text-[10px] font-bold text-white flex items-center justify-center">
                          S
                        </div>
                        <span className="text-zinc-200">Sarah Chen</span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Active AI Models</span>
                  <div className="p-3 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-300 flex items-center gap-1">
                        <span>🐬</span>
                        <span>{activeRoom.familiar}</span>
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">Zen 5</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Persistent sandbox agent connected to Hanzo Cloud MicroVM cluster.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <Link
                  href="/music"
                  className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <span>🎵 Open Music DAW</span>
                </Link>
                <Link
                  href="/3d"
                  className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <span>🧊 Open 3D Studio</span>
                </Link>
              </div>
            </div>
          )}
        </div>

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
