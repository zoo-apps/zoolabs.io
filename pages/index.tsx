import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Search,
  Bell,
  Sparkles,
  Plus,
  Edit2,
  ChevronDown,
  UserPlus,
  Layers,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Database,
  Globe,
  Image as ImageIcon,
  File,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Heart,
  Smile,
  Mic,
  MicOff,
  Maximize2,
  Play,
  Share2,
  AtSign,
  Paperclip,
  Settings2,
  X,
  Send,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions } from '../lib/zoo-missions-context'

interface ChatHistoryItem {
  id: string
  title: string
  time: string
  avatar: string
  active?: boolean
}

interface ChatMessage {
  id: string
  sender: 'user' | 'blue'
  senderName: string
  avatar: string
  timestamp: string
  content: string
  plan?: {
    text: string
    status: 'done' | 'in_progress' | 'queued'
  }[]
  reactions?: { emoji: string; count: number }[]
  previewChart?: boolean
  tasksCard?: {
    agentName: string
    tasks: { name: string; progress?: number; timeLeft?: string; status?: string }[]
  }
}

const CHAT_HISTORY: { section: string; items: ChatHistoryItem[] }[] = [
  {
    section: 'Today',
    items: [
      {
        id: 'c1',
        title: 'Investigate declining beluga populations',
        time: '2m ago',
        avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
        active: true,
      },
      {
        id: 'c2',
        title: 'What do belugas eat?',
        time: '45m ago',
        avatar: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c3',
        title: 'Create kids infographic',
        time: '1h ago',
        avatar: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c4',
        title: 'Ocean noise impact',
        time: '3h ago',
        avatar: 'https://images.unsplash.com/photo-1520637736862-4d197d1e855a?w=100&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    section: 'Yesterday',
    items: [
      {
        id: 'c5',
        title: 'Interview Dr. Moore',
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c6',
        title: 'Generate report outline',
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c7',
        title: 'Best time to see whales?',
        time: 'Yesterday',
        avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    section: 'This week',
    items: [
      {
        id: 'c8',
        title: 'Arctic sea ice trends',
        time: '2d ago',
        avatar: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c9',
        title: 'Shipping traffic data',
        time: '2d ago',
        avatar: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=100&auto=format&fit=crop&q=80',
      },
      {
        id: 'c10',
        title: 'Explain echolocation',
        time: '3d ago',
        avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
      },
    ],
  },
]

export default function ChatPage() {
  const router = useRouter()
  const { activeMission, agents } = useZooMissions()

  const [activeChatId, setActiveChatId] = useState('c1')
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [webSearchEnabled, setWebSearchEnabled] = useState(true)
  const [researchMode, setResearchMode] = useState('Deep Research')
  const [showMentionMenu, setShowMentionMenu] = useState(false)

  // Messages in conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      senderName: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: '10:21 AM',
      content:
        'Blue, investigate why beluga populations are declining in the Cook Inlet and create an interactive report that kids can understand.',
    },
    {
      id: 'm2',
      sender: 'blue',
      senderName: 'Blue',
      avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
      timestamp: '10:21 AM',
      content:
        "On it! I'll research the key factors affecting beluga populations in Cook Inlet and build an interactive report that's engaging and easy for kids to understand.\n\nHere's my plan:",
      plan: [
        { text: 'Gather population data and trends', status: 'done' },
        { text: 'Identify threats and human impact', status: 'in_progress' },
        { text: 'Find conservation efforts', status: 'queued' },
        { text: 'Create kid-friendly interactive report', status: 'queued' },
      ],
      reactions: [
        { emoji: '👍', count: 12 },
        { emoji: '❤️', count: 3 },
      ],
      tasksCard: {
        agentName: 'Blue is working...',
        tasks: [
          { name: 'Analyzing population data (NOAA)', progress: 72, timeLeft: '2m left' },
          { name: 'Searching recent research papers', progress: 45, timeLeft: '3m left' },
          { name: 'Compiling human impact factors', status: 'Queued' },
        ],
      },
    },
    {
      id: 'm3',
      sender: 'blue',
      senderName: 'Blue',
      avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
      timestamp: '10:27 AM',
      content:
        "I found some surprising trends in the population data. Here's a quick preview while I keep working.",
      previewChart: true,
    },
  ])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
  }, [messages, busy])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = input.trim()
    if (!text || busy) return

    setInput('')
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text,
    }

    setMessages((prev) => [...prev, userMsg])
    setBusy(true)

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: 'blue',
        senderName: 'Blue',
        avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `I've delegated this query across Raven (scholar RAG) and Elephant (ClickHouse datastore). I'm integrating this into our live Cook Inlet mission report now!`,
      }
      setMessages((prev) => [...prev, replyMsg])
      setBusy(false)
      zooAudio.speakAgent('blue', replyMsg.content)
    }, 1400)
  }

  const toggleVoice = async () => {
    if (isVoiceListening) {
      setIsVoiceListening(false)
      zooAudio.stopMicrophone()
    } else {
      const ok = await zooAudio.startMicrophone(() => {})
      if (ok) {
        setIsVoiceListening(true)
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SpeechRec) {
          const rec = new SpeechRec()
          rec.onresult = (ev: any) => {
            const transcript = Array.from(ev.results)
              .map((r: any) => r[0].transcript)
              .join('')
            setInput(transcript)
          }
          rec.onend = () => setIsVoiceListening(false)
          rec.start()
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Chat — ZOO Labs</title>
        <meta name="description" content="Talk to sovereign AI animal agents. One context, four views." />
      </Head>

      <div className="h-screen w-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans select-none overflow-hidden">
        {/* Top App Chrome (Restrained Global Header) */}
        <ZooAppChrome minimal={true} />

        {/* ─── 3-COLUMN LIVING CHAT LAYOUT ─── */}
        <div className="flex-1 flex overflow-hidden">
          {/* ═══ COLUMN 1: LEFT SIDEBAR (History & Meet Blue) ═══ */}
          <aside className="w-64 bg-[#090c13] border-r border-white/[0.08] flex flex-col justify-between shrink-0 p-3 hidden md:flex">
            {/* Top: + New Chat Button */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMessages([])
                  setInput('')
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New chat</span>
              </button>

              {/* History List Sections */}
              <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 text-xs">
                {CHAT_HISTORY.map((sec) => (
                  <div key={sec.section} className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2">
                      {sec.section}
                    </span>
                    <div className="space-y-0.5">
                      {sec.items.map((item) => {
                        const isSelected = item.id === activeChatId
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveChatId(item.id)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#121826] text-white font-medium border border-blue-500/30'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                            }`}
                          >
                            <img
                              src={item.avatar}
                              alt=""
                              className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                            />
                            <div className="truncate flex-1">
                              <p className="truncate text-xs text-zinc-200">{item.title}</p>
                            </div>
                            <span className="text-[9px] text-zinc-600 shrink-0">{item.time}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card: Meet Blue & Footer */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 border border-cyan-400/30">
                    <img
                      src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&auto=format&fit=crop&q=80"
                      alt="Blue"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Meet Blue</h4>
                    <p className="text-[10px] text-zinc-400">Your AI ocean partner</p>
                  </div>
                </div>
                <Link
                  href="/animals"
                  className="w-full block py-1.5 text-center rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-zinc-200 font-medium transition-all"
                >
                  Learn more
                </Link>
              </div>

              <div className="flex items-center justify-between px-2 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span>💜</span> ZOO Labs
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-600" />
              </div>
            </div>
          </aside>

          {/* ═══ COLUMN 2: CENTER CONVERSATION & MISSION CANVAS ═══ */}
          <main className="flex-1 bg-[#07090e] flex flex-col overflow-hidden relative">
            {/* Top Mission Header Strip */}
            <div className="h-14 border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between shrink-0 bg-[#090c13]/70 backdrop-blur-md">
              {/* Mission Title & Status */}
              <div className="flex items-center gap-3 truncate">
                <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 ring-1 ring-cyan-500/30">
                  <img
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80"
                    alt="Blue"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                      Beluga Population Research
                    </h2>
                    <Edit2 className="h-3 w-3 text-zinc-500 hover:text-white cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span>Started 2m ago by you</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-medium flex items-center gap-1">
                      <span>🐅</span> Blue is working on this (3 agents • 3 tasks running)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: + Invite & ✨ Switch to Vibe */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('Invite link copied to clipboard!')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Invite</span>
                </button>

                <Link
                  href="/vibe"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Switch to Vibe</span>
                </Link>
              </div>
            </div>

            {/* Conversation Messages Feed */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full scrollbar-none"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === 'user'

                if (isUser) {
                  return (
                    <div key={msg.id} className="flex items-start gap-3 justify-end">
                      <div className="max-w-xl p-4 rounded-3xl bg-[#141b2d] border border-blue-500/20 text-zinc-100 text-xs sm:text-sm leading-relaxed shadow-lg">
                        <div className="flex items-center justify-between pb-1 mb-1 text-[10px] text-zinc-400 font-medium">
                          <span>{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p>{msg.content}</p>
                      </div>
                      <img
                        src={msg.avatar}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-blue-400/40"
                      />
                    </div>
                  )
                }

                // Assistant (Blue)
                return (
                  <div key={msg.id} className="flex items-start gap-3 justify-start">
                    <img
                      src={msg.avatar}
                      alt="Blue"
                      className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-cyan-400/40"
                    />

                    <div className="max-w-2xl space-y-3">
                      <div className="p-5 rounded-3xl bg-[#0c101a] border border-white/10 text-zinc-200 text-xs sm:text-sm leading-relaxed shadow-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">Blue</span>
                            <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                              <Radio className="h-2.5 w-2.5 animate-pulse" /> 120 kHz
                            </span>
                          </div>
                        </div>

                        <p className="whitespace-pre-line text-zinc-200">{msg.content}</p>

                        {/* Plan Checklist */}
                        {msg.plan && (
                          <div className="space-y-1.5 pt-1">
                            {msg.plan.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 rounded-xl bg-black/30 border border-white/5 text-xs"
                              >
                                <div className="flex items-center gap-2 text-zinc-300">
                                  <CheckCircle2
                                    className={`h-4 w-4 ${
                                      item.status === 'done'
                                        ? 'text-emerald-400'
                                        : item.status === 'in_progress'
                                        ? 'text-cyan-400 animate-pulse'
                                        : 'text-zinc-600'
                                    }`}
                                  />
                                  <span>{item.text}</span>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono capitalize ${
                                    item.status === 'done'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                      : item.status === 'in_progress'
                                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                                      : 'bg-zinc-900 text-zinc-500'
                                  }`}
                                >
                                  {item.status.replace('_', ' ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reactions Bar */}
                        {msg.reactions && (
                          <div className="flex items-center gap-2 pt-1">
                            {msg.reactions.map((r, i) => (
                              <button
                                key={i}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all cursor-pointer"
                              >
                                <span>{r.emoji}</span>
                                <span className="font-mono text-[10px]">{r.count}</span>
                              </button>
                            ))}
                            <button className="p-1 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all">
                              <Smile className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Live Multi-Agent Tasks Card ("Blue is working...") */}
                      {msg.tasksCard && (
                        <div className="p-4 rounded-3xl bg-[#0a0f1c] border border-cyan-500/30 space-y-3 shadow-2xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                              <span className="text-xs font-bold text-white">{msg.tasksCard.agentName}</span>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400">Autonomous loop</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            {msg.tasksCard.tasks.map((task, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-zinc-400">⌕</span>
                                  <span className="text-zinc-200 truncate">{task.name}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {task.progress !== undefined ? (
                                    <>
                                      <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                          style={{ width: `${task.progress}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-mono text-cyan-400">{task.progress}%</span>
                                      <span className="text-[10px] font-mono text-zinc-500">{task.timeLeft}</span>
                                    </>
                                  ) : (
                                    <span className="text-[10px] font-mono text-zinc-500">Queued</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-1 flex justify-end">
                            <Link
                              href="/work"
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>View all tasks (3)</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Embedded Interactive Chart Card */}
                      {msg.previewChart && (
                        <div className="p-4 rounded-3xl bg-[#090d17] border border-white/10 space-y-3 shadow-2xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">Cook Inlet Beluga Population (1979–2024)</h4>
                              <p className="text-[10px] text-zinc-400">Estimated population count</p>
                            </div>
                            <button className="text-zinc-500 hover:text-white p-1">
                              <Maximize2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* SVG Population Decline Timeline */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 h-32 bg-black/50 rounded-2xl p-2 border border-white/5 flex flex-col justify-between">
                              <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                                <path
                                  d="M0,20 Q60,18 100,35 T200,60 T300,70"
                                  fill="none"
                                  stroke="#06b6d4"
                                  strokeWidth="2.5"
                                />
                                <circle cx="300" cy="70" r="4" fill="#38bdf8" className="animate-ping" />
                              </svg>
                              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                                <span>1979 (1,300 whales)</span>
                                <span>2000 (350)</span>
                                <span className="text-rose-400">2024 (279)</span>
                              </div>
                            </div>

                            <div className="relative h-32 rounded-2xl overflow-hidden border border-white/10 group">
                              <img
                                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80"
                                alt="Thermal map"
                                className="h-full w-full object-cover group-hover:scale-105 transition-all"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <button className="h-8 w-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg">
                                  <Play className="h-4 w-4 ml-0.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {busy && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse pl-11">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Blue is coordinating with Raven and Elephant…</span>
                </div>
              )}
            </div>

            {/* Bottom Floating Composer */}
            <div className="p-4 max-w-4xl mx-auto w-full">
              <form
                onSubmit={handleSendMessage}
                className="p-3 rounded-3xl bg-[#0c101a] border border-white/15 shadow-2xl space-y-2.5 focus-within:border-cyan-500/50 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Blue..."
                  className="w-full bg-transparent px-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none"
                />

                {/* Composer Toolbar */}
                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMentionMenu(!showMentionMenu)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <AtSign className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        webSearchEnabled
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Globe className="h-3 w-3" />
                      <span>Web</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResearchMode(researchMode === 'Deep Research' ? 'Standard' : 'Deep Research')
                      }
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white text-[11px] transition-all cursor-pointer"
                    >
                      <Settings2 className="h-3 w-3 text-purple-400" />
                      <span>{researchMode}</span>
                      <ChevronDown className="h-2.5 w-2.5 text-zinc-500" />
                    </button>
                  </div>

                  {/* Right Voice & Send Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`p-2 rounded-full transition-all cursor-pointer ${
                        isVoiceListening
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-zinc-300'
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || busy}
                      className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-[10px] text-center text-zinc-600 mt-2">
                Blue can make mistakes. Check important info.
              </p>
            </div>
          </main>

          {/* ═══ COLUMN 3: RIGHT SIDEBAR (Agents, Resources, Context, Artifacts) ═══ */}
          <aside className="w-80 bg-[#090c13] border-l border-white/[0.08] flex flex-col justify-between shrink-0 p-4 overflow-y-auto space-y-5 hidden lg:flex">
            {/* 1. Agents Working On This */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Agents working on this</span>
              </div>
              <div className="space-y-2 text-xs">
                {/* Blue */}
                <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🐋</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">Blue</h4>
                      <p className="text-[10px] text-zinc-400">Lead researcher</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Working</span>
                </div>

                {/* Elephant */}
                <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🐘</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">Elephant</h4>
                      <p className="text-[10px] text-zinc-400">Processing data</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Working</span>
                </div>

                {/* Raven */}
                <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🐦</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">Raven</h4>
                      <p className="text-[10px] text-zinc-400">Literature review</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Working</span>
                </div>

                {/* Giraffe */}
                <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🦒</span>
                    <div>
                      <h4 className="font-bold text-white text-xs">Giraffe</h4>
                      <p className="text-[10px] text-zinc-400">Big picture analysis</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Queued</span>
                </div>
              </div>

              <Link
                href="/animals"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium pt-1"
              >
                <span>View all agents</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 2. Resources */}
            <div className="space-y-2.5 pt-3 border-t border-white/[0.06] text-xs">
              <span className="text-xs font-bold text-zinc-300">Resources</span>
              <div className="space-y-1 text-zinc-400">
                <div className="flex items-center justify-between p-1.5 hover:bg-white/[0.04] rounded-lg">
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-zinc-400" /> Documents
                  </span>
                  <span className="font-mono text-zinc-500">18</span>
                </div>
                <div className="flex items-center justify-between p-1.5 hover:bg-white/[0.04] rounded-lg">
                  <span className="flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-zinc-400" /> Datasets
                  </span>
                  <span className="font-mono text-zinc-500">5</span>
                </div>
                <div className="flex items-center justify-between p-1.5 hover:bg-white/[0.04] rounded-lg">
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-zinc-400" /> Web links
                  </span>
                  <span className="font-mono text-zinc-500">27</span>
                </div>
                <div className="flex items-center justify-between p-1.5 hover:bg-white/[0.04] rounded-lg">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="h-3.5 w-3.5 text-zinc-400" /> Images
                  </span>
                  <span className="font-mono text-zinc-500">12</span>
                </div>
                <div className="flex items-center justify-between p-1.5 hover:bg-white/[0.04] rounded-lg">
                  <span className="flex items-center gap-2">
                    <File className="h-3.5 w-3.5 text-zinc-400" /> Notes
                  </span>
                  <span className="font-mono text-zinc-500">7</span>
                </div>
              </div>
            </div>

            {/* 3. Context Tags */}
            <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
              <span className="text-xs font-bold text-zinc-300">Context</span>
              <div className="flex flex-wrap gap-1.5">
                {['Cook Inlet', 'Belugas', 'Conservation', 'Climate Change', 'Noise Pollution'].map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 text-[10px]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <button className="text-[11px] text-zinc-500 hover:text-zinc-300 pt-0.5">View more</button>
            </div>

            {/* 4. Recent Artifacts */}
            <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
              <span className="text-xs font-bold text-zinc-300">Recent artifacts</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#0c101a] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">📊</span>
                    <h5 className="font-bold text-white text-xs truncate">Beluga Report (Draft)</h5>
                  </div>
                  <p className="text-[10px] text-zinc-500">Interactive • Updated just now</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0c101a] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">📈</span>
                    <h5 className="font-bold text-white text-xs truncate">Population Trends Chart</h5>
                  </div>
                  <p className="text-[10px] text-zinc-500">Image • 10m ago</p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0c101a] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">📄</span>
                    <h5 className="font-bold text-white text-xs truncate">Threats Overview</h5>
                  </div>
                  <p className="text-[10px] text-zinc-500">Document • 25m ago</p>
                </div>
              </div>

              <Link
                href="/work"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium pt-1"
              >
                <span>View all artifacts</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
