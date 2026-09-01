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
  PanelLeft,
  X,
  MoreHorizontal,
  Folder,
  File,
  Terminal,
  BarChart,
  Lightbulb,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions } from '../lib/zoo-missions-context'

export interface VibeChatMessage {
  id: string
  sender: string
  avatar?: string
  initial?: string
  color?: string
  time: string
  text: string
  reactions?: { emoji: string; count: number }[]
  agentTask?: {
    title: string
    desc: string
    progress: number
    doneText: string
  }
  isAgent?: boolean
}

export type Participant = {
  id: string
  name: string
  avatar?: string
  initial?: string
  color?: string
  role: 'human' | 'agent'
  isYou?: boolean
  isMuted: boolean
  isSpeaking: boolean
}

export default function VibeRoomPage() {
  const { activeMission, agents } = useZooMissions()

  // Room state
  const [roomTitle, setRoomTitle] = useState('Ocean Deep Dive (Genesis Pod)')
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'preview' | 'index' | 'styles' | 'header' | 'layout'>('preview')
  const [activeFile, setActiveFile] = useState('HeroSection.tsx')
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'polls' | 'notes' | 'files'>('chat')
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop')

  // Audio / Call controls
  const [micOn, setMicOn] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [screenShareOn, setScreenShareOn] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)

  // Poll state
  const [pollVoted, setPollVoted] = useState<number | null>(0)
  const [pollOptions, setPollOptions] = useState([
    { id: 0, text: 'Yes, full cluster metrics', votes: 4, pct: 80 },
    { id: 1, text: 'No, keep it minimal', votes: 1, pct: 20 },
  ])

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p1', name: 'Richard Kaminsky', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'human', isYou: true, isMuted: false, isSpeaking: false },
    { id: 'p2', name: 'Sarah Chen', initial: 'S', color: 'bg-emerald-600', role: 'human', isMuted: false, isSpeaking: false },
    { id: 'p3', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: 'human', isMuted: false, isSpeaking: false },
    { id: 'p4', name: 'Blue the Beluga', avatar: '🐋', role: 'agent', isMuted: false, isSpeaking: true },
    { id: 'p5', name: 'Ocean Bot', avatar: '🤖', role: 'agent', isMuted: false, isSpeaking: false },
    { id: 'p6', name: 'demo-user', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: 'human', isMuted: true, isSpeaking: false },
  ])

  // Chat message thread
  const [messages, setMessages] = useState<VibeChatMessage[]>([
    {
      id: 'm1',
      sender: 'Richard Kaminsky',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '6:39 PM',
      text: "Hey team! I'm in the Genesis Pod room. Let's build out the new sovereign AI interface.",
      reactions: [{ emoji: '❤️', count: 3 }, { emoji: '💡', count: 2 }, { emoji: '🚀', count: 1 }],
      isAgent: false,
    },
    {
      id: 'm2',
      sender: 'Blue the Beluga',
      avatar: '🐋',
      time: '6:40 PM',
      text: "Got it! I'll scaffold the new landing section and hook up the API. 🐋",
      agentTask: {
        title: 'Working on it...',
        desc: 'Editing HeroSection.tsx',
        progress: 78,
        doneText: 'Generating copy ✓',
      },
      isAgent: true,
    },
    {
      id: 'm3',
      sender: 'Sarah Chen',
      initial: 'S',
      color: 'bg-emerald-600',
      time: '6:42 PM',
      text: 'The 3D Canvas orbit engine is working super smoothly now! 🎨',
      reactions: [{ emoji: '❤️', count: 2 }, { emoji: '🚀', count: 1 }],
      isAgent: false,
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [roomChatInput, setRoomChatInput] = useState('')

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: 'Richard Kaminsky',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        time: 'Just now',
        text: chatInput.trim(),
        isAgent: false,
      },
    ])
    setChatInput('')
  }

  const handleVote = (id: number) => {
    setPollVoted(id)
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    )
  }

  const toggleMic = async () => {
    if (micOn) {
      zooAudio.toggleMute()
      setMicOn(false)
    } else {
      const ok = await zooAudio.startMicrophone()
      if (ok) setMicOn(true)
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07090e] text-white select-none font-sans">
      <Head>
        <title>Vibe Studio · Ocean Deep Dive · ZOO</title>
      </Head>

      {/* Global Top Navbar */}
      <ZooAppChrome />

      {/* ─── 2. SUBHEADER BAR ─── */}
      <div className="h-12 border-b border-white/[0.08] bg-[#0a0e17] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            title="Toggle Left Sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">🐋</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white tracking-wide">{roomTitle}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 cursor-pointer" />
            </div>
            <span className="text-[11px] text-zinc-500">Blue the Beluga is in the room</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE 120kHz</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 font-medium">
            <span>🪟</span>
            <span>2D Habitat</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 font-medium">
            <span>🧊</span>
            <span>3D Splat</span>
          </button>

          <button
            onClick={() => {
              if (typeof navigator !== 'undefined') {
                navigator.clipboard.writeText(window.location.href)
                setCopiedLink(true)
                setTimeout(() => setCopiedLink(false), 2000)
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{copiedLink ? 'Copied Link!' : 'Invite'}</span>
          </button>

          <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── 3. MAIN WORKBENCH BODY ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: In the room + Room tools + Live activity */}
        {leftPanelOpen && (
          <aside className="w-64 border-r border-white/[0.08] bg-[#090d16] flex flex-col shrink-0">
            {/* Participants */}
            <div className="p-3 border-b border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">
                  In the Room <span className="text-zinc-500 font-normal">{participants.length}</span>
                </span>
                <button className="text-[11px] text-zinc-400 hover:text-white">Mute all</button>
              </div>

              <div className="space-y-1.5">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.04] text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {p.avatar && p.avatar.startsWith('http') ? (
                        <img src={p.avatar} alt={p.name} className="h-5 w-5 rounded-full object-cover" />
                      ) : p.avatar ? (
                        <span className="text-sm">{p.avatar}</span>
                      ) : (
                        <div
                          className={`h-5 w-5 rounded-full ${p.color || 'bg-blue-600'} text-white font-bold text-[10px] flex items-center justify-center`}
                        >
                          {p.initial}
                        </div>
                      )}
                      <span className="text-zinc-200 font-medium truncate">
                        {p.name} {p.isYou && <span className="text-zinc-500 font-normal">You</span>}
                      </span>
                      {p.role === 'agent' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                          Agent
                        </span>
                      )}
                    </div>
                    <div>
                      {p.isSpeaking ? (
                        <span className="text-cyan-400 font-mono text-xs animate-pulse">ılı</span>
                      ) : p.isMuted ? (
                        <MicOff className="h-3.5 w-3.5 text-rose-400" />
                      ) : (
                        <Mic className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Tools */}
            <div className="p-3 border-b border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-300">Room Tools</span>
                <button className="text-zinc-400 hover:text-white">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                {[
                  { name: 'Share Screen', icon: Monitor },
                  { name: 'Upload', icon: UploadCloud },
                  { name: 'Whiteboard', icon: Layout },
                  { name: 'Docs', icon: FileText },
                  { name: 'Terminal', icon: TerminalIcon },
                  { name: 'Notion', icon: BookOpen },
                ].map((tool, idx) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={idx}
                      className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 flex flex-col items-center gap-1 transition-all"
                    >
                      <Icon className="h-4 w-4 text-zinc-400" />
                      <span className="text-[10px] text-zinc-300">{tool.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Activity Stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-zinc-300">Activity</span>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1 cursor-pointer">
                  Live <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-zinc-200">
                    <span className="font-semibold flex items-center gap-1">
                      <span>🐋</span> Blue the Beluga
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">6:42 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Edited Header.tsx</span>
                    <span className="text-emerald-400 font-mono text-[10px]">+142 -24</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-zinc-200">
                    <span className="font-semibold flex items-center gap-1">
                      <span>🐋</span> Blue the Beluga
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">6:42 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Deployed preview</span>
                    <span className="text-blue-400 font-mono text-[10px] flex items-center gap-0.5">
                      Open <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-zinc-200">
                    <span className="font-semibold flex items-center gap-1">
                      <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 text-[8px] flex items-center justify-center font-bold text-white">
                        S
                      </span>
                      Sarah Chen
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">6:41 PM</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Created Figma frame: Hero Section</p>
                </div>

                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between text-zinc-200">
                    <span className="font-semibold flex items-center gap-1">
                      <span>👤</span> Alex Rivera
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">6:41 PM</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Pushed to main (Commit a1b2c3d)</p>
                </div>
              </div>
            </div>

            {/* Quick room message input */}
            <div className="p-2.5 border-t border-white/[0.08] bg-[#07090e]">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
                <input
                  type="text"
                  value={roomChatInput}
                  onChange={(e) => setRoomChatInput(e.target.value)}
                  placeholder="Message the room..."
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
                />
                <button className="text-zinc-400 hover:text-white">
                  <Smile className="h-3.5 w-3.5" />
                </button>
                <button className="text-zinc-400 hover:text-white">
                  <Paperclip className="h-3.5 w-3.5" />
                </button>
                <button className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500">
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* CENTER STAGE: Tab Bar + Browser & Code Split Workbench */}
        <main className="flex-1 flex flex-col bg-[#07090e] overflow-hidden min-w-0">
          {/* Tabs Bar */}
          <div className="h-9 border-b border-white/[0.08] bg-[#0a0e17] flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1 text-xs">
              {[
                { id: 'preview', label: 'Preview' },
                { id: 'index', label: 'index.tsx' },
                { id: 'styles', label: 'styles.css' },
                { id: 'header', label: 'Header.tsx' },
                { id: 'layout', label: 'layout.tsx' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-t-lg transition-all font-medium text-xs flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-[#111726] text-white border-t-2 border-blue-500'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
              <button className="p-1 text-zinc-500 hover:text-white rounded">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Upper Preview Canvas Area */}
          <div className="flex-1 flex flex-col border-b border-white/[0.08] relative overflow-hidden bg-[#0a0e1a]">
            {/* Browser Header Bar */}
            <div className="h-8 border-b border-white/[0.08] bg-[#0d121f] flex items-center justify-between px-3 text-xs">
              <div className="flex items-center gap-2">
                <button className="text-zinc-500 hover:text-white">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="text-zinc-500 hover:text-white">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button className="text-zinc-500 hover:text-white">
                  <RefreshCw className="h-3 w-3" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/10 text-[11px] text-zinc-300 font-mono">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>https://zoo.ai</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1 rounded ${viewportMode === 'mobile' ? 'text-cyan-400 bg-white/10' : 'hover:text-white'}`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1 rounded ${viewportMode === 'desktop' ? 'text-cyan-400 bg-white/10' : 'hover:text-white'}`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <span className="text-[11px] text-zinc-400">100% ⌄</span>
              </div>
            </div>

            {/* Live Rendered Canvas inside Browser */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between relative bg-gradient-to-b from-[#07090e] via-[#090e1f] to-[#05070c]">
              {/* Floating PiP Blue Agent Card in corner */}
              <div className="absolute top-6 right-6 w-72 rounded-2xl overflow-hidden border border-blue-500/40 bg-black/80 shadow-2xl z-20 backdrop-blur-xl">
                <div className="h-7 bg-blue-950/80 px-2.5 flex items-center justify-between border-b border-blue-500/20">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <span>Blue</span> ✦
                  </span>
                  <Maximize2 className="h-3 w-3 text-zinc-400 cursor-pointer" />
                </div>
                <div className="h-36 relative overflow-hidden bg-black flex items-center justify-center">
                  <video
                    src="/bg_video/static/94263e80-7711-4191-8848-18e470fcf147.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-400/30 flex items-center justify-between">
                    <span className="text-[10px] text-cyan-300 font-medium flex items-center gap-1">
                      <span className="animate-pulse">ılı</span> Blue is listening
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">120kHz</span>
                  </div>
                </div>
              </div>

              {/* Zoo AI Landing Page Mock */}
              <div className="max-w-3xl space-y-6">
                <div className="flex items-center gap-6 text-xs text-zinc-400 font-medium">
                  <span className="font-bold text-white text-base font-mono">ZOO</span>
                  <span className="text-zinc-200">Product ⌄</span>
                  <span>Pricing</span>
                  <span>Docs ⌄</span>
                  <span>Resources ⌄</span>
                </div>

                <div className="space-y-3 pt-4">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    The Sovereign <br />
                    <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                      AI Cloud
                    </span>{' '}
                    for Builders
                  </h1>
                  <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
                    Deploy, scale and own your AI. Privacy first. Open always.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all">
                    Start Building
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-xs transition-all">
                    View Docs
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10 max-w-xl">
                  <div>
                    <p className="text-lg font-bold text-white font-mono">120k+</p>
                    <p className="text-[11px] text-zinc-400">Builders</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white font-mono">99.99%</p>
                    <p className="text-[11px] text-zinc-400">Uptime</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white font-mono">42</p>
                    <p className="text-[11px] text-zinc-400">Regions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white font-mono">∞</p>
                    <p className="text-[11px] text-zinc-400">Possibilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Split: Code Editor & Dev Server Logs */}
          <div className="h-56 flex border-t border-white/[0.08] bg-[#080c16]">
            {/* Files Tree */}
            <div className="w-44 border-r border-white/[0.08] p-2.5 overflow-y-auto text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">
                Files
              </span>
              <div className="space-y-0.5 text-zinc-400">
                <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                  <ChevronDown className="h-3 w-3" /> app
                </div>
                <div className="pl-3 space-y-0.5">
                  <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                    <ChevronDown className="h-3 w-3" /> (site)
                  </div>
                  <div className="pl-3 space-y-0.5">
                    <div className="flex items-center gap-1 text-zinc-300 font-semibold">
                      <ChevronDown className="h-3 w-3" /> components
                    </div>
                    <div className="pl-3 space-y-0.5 text-[11px]">
                      <div className="text-cyan-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">
                        HeroSection.tsx
                      </div>
                      <div className="text-zinc-400 px-1.5 py-0.5">Header.tsx</div>
                      <div className="text-zinc-400 px-1.5 py-0.5">Footer.tsx</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <ChevronRight className="h-3 w-3" /> lib
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <ChevronRight className="h-3 w-3" /> styles
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 border-r border-white/[0.08] flex flex-col bg-[#0b101d]">
              <div className="h-7 bg-[#0d1322] px-3 flex items-center justify-between border-b border-white/[0.08] text-xs">
                <span className="font-mono text-zinc-300">HeroSection.tsx</span>
                <span className="text-[10px] text-zinc-500 font-mono">TypeScript React</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-zinc-300 space-y-0.5 leading-relaxed">
                <div><span className="text-purple-400">export default function</span> <span className="text-blue-400">HeroSection</span>() &#123;</div>
                <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                <div className="pl-8">&lt;<span className="text-cyan-400">section</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;relative overflow-hidden&quot;</span>&gt;</div>
                <div className="pl-12">&lt;<span className="text-cyan-400">div</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;mx-auto max-w-7xl px-6 py-24&quot;</span>&gt;</div>
                <div className="pl-16">&lt;<span className="text-cyan-400">h1</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;text-5xl md:text-7xl font-bold tracking-tight text-white&quot;</span>&gt;</div>
                <div className="pl-20">The Sovereign &lt;<span className="text-cyan-400">span</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;text-gradient&quot;</span>&gt;AI Cloud&lt;/<span className="text-cyan-400">span</span>&gt; for Builders</div>
                <div className="pl-16">&lt;/<span className="text-cyan-400">h1</span>&gt;</div>
                <div className="pl-16">&lt;<span className="text-cyan-400">p</span> <span className="text-amber-300">className</span>=<span className="text-emerald-300">&quot;mt-6 text-lg text-zinc-300 max-w-2xl&quot;</span>&gt;</div>
                <div className="pl-20">Deploy, scale and own your AI. Privacy first. Open always.</div>
                <div className="pl-16">&lt;/<span className="text-cyan-400">p</span>&gt;</div>
                <div className="pl-8">&lt;/<span className="text-cyan-400">section</span>&gt;</div>
                <div className="pl-4">)</div>
                <div>&#125;</div>
              </div>
            </div>

            {/* Terminal / Live Server */}
            <div className="w-80 flex flex-col bg-[#07090e]">
              <div className="h-7 bg-[#0a0e17] px-3 flex items-center justify-between border-b border-white/[0.08] text-xs">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-bold text-white border-b-2 border-blue-500 pb-0.5">Terminal</span>
                  <span className="text-zinc-400">Git</span>
                  <span className="text-zinc-400">AI Logs</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Plus className="h-3 w-3 cursor-pointer hover:text-white" />
                  <X className="h-3 w-3 cursor-pointer hover:text-white" />
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-zinc-400 space-y-1">
                <p className="text-emerald-400">✓ Compiled successfully in 842ms</p>
                <p>| Local:   http://localhost:3000</p>
                <p>| Network: http://192.168.1.42:3000</p>
                <p className="text-cyan-400">✓ Hot reloading...</p>
                <p>✓ 1 file changed</p>
                <p className="text-emerald-400">✓ Recompiled in 191ms</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL: Vibe with Friends + Live Polls + Chat */}
        {rightPanelOpen && (
          <aside className="w-80 border-l border-white/[0.08] bg-[#090d16] flex flex-col shrink-0">
            {/* Header */}
            <div className="h-10 border-b border-white/[0.08] px-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span>Vibe with Friends</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </div>

              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-xs flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> 6
                </span>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="p-1 hover:text-white rounded"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-tabs: Chat, Polls, Notes, Files */}
            <div className="h-8 border-b border-white/[0.08] bg-[#070a12] px-3 flex items-center gap-4 text-xs">
              {['Chat', 'Polls', 'Notes', 'Files'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveRightTab(t.toLowerCase() as any)}
                  className={`py-1 font-semibold transition-all ${
                    activeRightTab === t.toLowerCase()
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div key={m.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {m.avatar && m.avatar.startsWith('http') ? (
                        <img src={m.avatar} alt={m.sender} className="h-5 w-5 rounded-full object-cover" />
                      ) : m.avatar ? (
                        <span className="text-xs">{m.avatar}</span>
                      ) : (
                        <div
                          className={`h-5 w-5 rounded-full ${m.color || 'bg-emerald-600'} text-white font-bold text-[10px] flex items-center justify-center`}
                        >
                          {m.initial}
                        </div>
                      )}
                      <span className="font-bold text-white text-[11px]">{m.sender}</span>
                      {m.isAgent && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">
                          Agent
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{m.time}</span>
                  </div>

                  <p className="text-zinc-300 text-xs pl-6 leading-relaxed">{m.text}</p>

                  {/* Agent Task Card */}
                  {m.agentTask && (
                    <div className="ml-6 p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-blue-300 font-medium">{m.agentTask.title}</span>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          {m.agentTask.doneText}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{m.agentTask.desc}</p>
                      <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${m.agentTask.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Reactions */}
                  {m.reactions && (
                    <div className="flex items-center gap-1 pl-6 pt-0.5">
                      {m.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-zinc-300 flex items-center gap-1 cursor-pointer hover:bg-white/10"
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Interactive Poll Card */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Richard"
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="text-zinc-300 text-xs font-medium">
                    Richard Kaminsky <span className="text-zinc-500">started a poll</span>
                  </span>
                </div>

                <p className="font-bold text-white text-xs">
                  Should we add live GPU cluster telemetry to the right inspector pane?
                </p>

                <div className="space-y-1.5">
                  {pollOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(opt.id)}
                      className={`w-full p-2 rounded-xl text-left border transition-all relative overflow-hidden ${
                        pollVoted === opt.id
                          ? 'bg-blue-950/60 border-blue-500 text-white'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-blue-500/20"
                        style={{ width: `${opt.pct}%` }}
                      />
                      <div className="relative flex items-center justify-between text-xs font-medium">
                        <span>{opt.text}</span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {opt.votes} votes {opt.pct}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                  <span>5 votes · Poll closes in 1m</span>
                  <button className="px-2 py-0.5 rounded bg-white/10 text-white hover:bg-white/20">
                    Vote
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>demo-user is typing...</span>
              </div>
            </div>

            {/* Chat Composer */}
            <div className="p-3 border-t border-white/[0.08] bg-[#07090e]">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Message the room..."
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none"
                />
                <button className="text-zinc-400 hover:text-white">
                  <Smile className="h-4 w-4" />
                </button>
                <button className="text-zinc-400 hover:text-white">
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSendChat}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ─── 4. BOTTOM AUDIO & CALL CONTROL BAR ─── */}
      <footer className="h-14 border-t border-white/[0.08] bg-[#07090e] px-4 flex items-center justify-between shrink-0">
        {/* Left: Spatial Audio status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span>🐋</span>
            <span className="font-semibold text-white">Room Audio</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400 font-mono text-xs">
            <span className="animate-pulse">ılılılı</span>
            <span className="text-[11px] text-zinc-400">120kHz Spatial</span>
          </div>
        </div>

        {/* Center Call Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              micOn
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {micOn ? <Mic className="h-4 w-4 text-emerald-400" /> : <Mic className="h-4 w-4" />}
            <span>Mic</span>
          </button>

          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              cameraOn
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Video className="h-4 w-4" />
            <span>Camera</span>
          </button>

          <button
            onClick={() => setScreenShareOn(!screenShareOn)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              screenShareOn
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                : 'bg-white/[0.04] text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Share</span>
          </button>

          {/* Blue + Action Button */}
          <Link
            href="/beluga"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all"
          >
            <span>🐋</span>
            <span>Blue +</span>
          </Link>
        </div>

        {/* Right Attendees & Leave */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <Users className="h-3.5 w-3.5" />
            <span>{participants.length}</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>Leave</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
