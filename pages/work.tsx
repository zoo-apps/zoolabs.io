import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Hash,
  Users,
  Bot,
  Sparkles,
  Plus,
  ArrowUp,
  Search,
  Kanban,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderOpen,
  Terminal as TerminalIcon,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Filter,
  Check,
  Send,
  Code2,
  Paperclip,
  Activity,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Flame,
  Shield,
  CircleDot,
  Trash2,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

type Issue = {
  id: string
  title: string
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  assignee: { name: string; avatar: string; type: 'human' | 'agent' }
  labels: string[]
  createdAt: string
  description?: string
}

type ChannelMessage = {
  id: string
  channelId: string
  senderName: string
  senderAvatar: string
  senderType: 'human' | 'agent'
  role?: string
  content: string
  timestamp: string
  reactions?: { emoji: string; count: number }[]
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ZOO-101',
    title: 'Verify 1,500+ endangered species DNA traits for Origin Egg contract',
    status: 'in_progress',
    priority: 'urgent',
    assignee: { name: 'Siberian Tiger', avatar: '🐅', type: 'agent' },
    labels: ['solidity', 'origin-eggs', 'traits'],
    createdAt: '2h ago',
    description: 'Ensure on-chain deterministic trait hashing against the IUCN Red List database.',
  },
  {
    id: 'ZOO-102',
    title: 'Deploy 120 kHz acoustic sensor array in Arctic Sanctuary 04',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'Blue the Beluga', avatar: '🐬', type: 'agent' },
    labels: ['bioacoustics', 'telemetry', 'hardware'],
    createdAt: '4h ago',
    description: 'Set up low-latency hydrophone streaming node over Hanzo Cloud gateway.',
  },
  {
    id: 'ZOO-103',
    title: 'Build quadratic voting module for wildlife conservation grant fund',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'You (Host)', avatar: '🧑‍💻', type: 'human' },
    labels: ['governance', 'dao', 'smart-contracts'],
    createdAt: '1d ago',
    description: 'Implement holographic consensus contracts for community grant allocations.',
  },
  {
    id: 'ZOO-104',
    title: 'Integrate @hanzo/bot local agent runtime for Desktop Clippy mode',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'Sumatran Elephant', avatar: '🐘', type: 'agent' },
    labels: ['desktop', 'agents', 'hanzo-bot'],
    createdAt: '2d ago',
    description: 'Provide persistent desktop companion window with transparent canvas overlay.',
  },
  {
    id: 'ZOO-105',
    title: 'Setup multi-agent shared sandbox MicroVM in Hanzo Cloud',
    status: 'done',
    priority: 'urgent',
    assignee: { name: 'Siberian Tiger', avatar: '🐅', type: 'agent' },
    labels: ['infra', 'microvm', 'sandbox'],
    createdAt: '3d ago',
    description: 'Allow python agentic task execution inside isolated microVM pods.',
  },
  {
    id: 'ZOO-106',
    title: 'Draft IUCN Red List telemetry dataset export to Parquet',
    status: 'backlog',
    priority: 'low',
    assignee: { name: 'Alex', avatar: '🎨', type: 'human' },
    labels: ['analytics', 'datasets'],
    createdAt: '4d ago',
    description: 'Generate weekly compressed telemetry archives for wildlife researchers.',
  },
]

const CHANNELS = [
  { id: 'general', name: 'general', desc: 'Pod announcements and general collaboration' },
  { id: 'ocean-telemetry', name: 'ocean-telemetry', desc: 'Live hydrophone & bioacoustics stream' },
  { id: 'origin-eggs', name: 'origin-eggs', desc: 'NFT genetic traits and smart contract minting' },
  { id: 'dao-governance', name: 'dao-governance', desc: 'Conservation proposals & quadratic voting' },
  { id: 'sandbox-dev', name: 'sandbox-dev', desc: 'Durable microVM task dispatch and debugging' },
]

export default function WorkWorkspace() {
  const [activeView, setActiveView] = useState<'chat' | 'board' | 'issues'>('board')
  const [activeChannelId, setActiveChannelId] = useState('general')
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(INITIAL_ISSUES[0])

  const [channelMessages, setChannelMessages] = useState<ChannelMessage[]>([
    {
      id: 'cm1',
      channelId: 'general',
      senderName: 'Blue the Beluga',
      senderAvatar: '🐬',
      senderType: 'agent',
      role: 'Bioacoustics Familiar',
      content: "Splash! 🌊 Welcome to the Zoo Labs Work Workspace. Channels, issues, and Kanban boards are fully synchronized with our autonomous AI agents and Hanzo Cloud MicroVMs.",
      timestamp: '9:00 AM',
      reactions: [{ emoji: '🐬', count: 4 }, { emoji: '🚀', count: 2 }],
    },
    {
      id: 'cm2',
      channelId: 'general',
      senderName: 'Siberian Tiger',
      senderAvatar: '🐅',
      senderType: 'agent',
      role: 'Code Sandbox Agent',
      content: "I've started running task ZOO-101 (Origin Egg genetic trait verification). MicroVM is processing 1,500+ animal vectors right now.",
      timestamp: '9:15 AM',
      reactions: [{ emoji: '🔥', count: 3 }],
    },
  ])

  const [msgInput, setMsgInput] = useState('')
  const [newIssueModal, setNewIssueModal] = useState(false)
  const [newIssueTitle, setNewIssueTitle] = useState('')
  const [newIssuePriority, setNewIssuePriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high')

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [channelMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msgInput.trim()) return

    const newMsg: ChannelMessage = {
      id: `cm_${Date.now()}`,
      channelId: activeChannelId,
      senderName: 'You (Host)',
      senderAvatar: '🧑‍💻',
      senderType: 'human',
      content: msgInput.trim(),
      timestamp: 'Just now',
    }

    setChannelMessages((prev) => [...prev, newMsg])
    setMsgInput('')

    // Agent response
    setTimeout(() => {
      const botReply: ChannelMessage = {
        id: `cm_${Date.now() + 1}`,
        channelId: activeChannelId,
        senderName: 'Blue the Beluga',
        senderAvatar: '🐬',
        senderType: 'agent',
        role: 'Bioacoustics Familiar',
        content: `Acknowledged! I logged your note to the ${activeChannelId} stream and linked it to the active Kanban board.`,
        timestamp: 'Just now',
      }
      setChannelMessages((prev) => [...prev, botReply])
    }, 1000)
  }

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIssueTitle.trim()) return

    const newId = `ZOO-${100 + issues.length + 1}`
    const created: Issue = {
      id: newId,
      title: newIssueTitle.trim(),
      status: 'todo',
      priority: newIssuePriority,
      assignee: { name: 'Blue the Beluga', avatar: '🐬', type: 'agent' },
      labels: ['ai-task', activeChannelId],
      createdAt: 'Just now',
      description: 'Created from Work Workspace',
    }

    setIssues((prev) => [created, ...prev])
    setNewIssueTitle('')
    setNewIssueModal(false)
    setSelectedIssue(created)
  }

  const updateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus } : iss))
    )
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const currentChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0]

  return (
    <>
      <Head>
        <title>Zoo Labs Work — Issues, Boards & Channels</title>
        <meta
          name="description"
          content="Slack & Linear style collaborative work interface with issues, Kanban boards, and multi-agent channels for Zoo Labs and Hanzo AI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans select-none flex flex-col">
        {/* Global App Chrome */}
        <ZooAppChrome />

        {/* ─── Top Workspace Bar ───────────────────────────────────────────── */}
        <header className="h-11 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl px-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-black font-extrabold text-[11px]">
                Z
              </div>
              <span className="font-bold text-xs text-white">Zoo Labs · Work</span>
            </Link>

            <span className="text-zinc-600 text-xs">/</span>

            {/* View Switcher: Chat Channels vs Kanban Board vs Issues List */}
            <div className="flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveView('board')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'board' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Board</span>
              </button>

              <button
                onClick={() => setActiveView('issues')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'issues' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ListTodo className="h-3.5 w-3.5" />
                <span>Issues ({issues.length})</span>
              </button>

              <button
                onClick={() => setActiveView('chat')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'chat' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>#{currentChannel.name}</span>
              </button>
            </div>
          </div>

          {/* Right Header: Search & Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewIssueModal(true)}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-semibold active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Issue</span>
            </button>

            <Link
              href="/vibe"
              className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/10 hover:bg-white/10 px-3 py-1 text-xs text-white/80 transition-all"
            >
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span>/vibe Canvas</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md bg-white text-black px-3 py-1 text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-sm"
            >
              <span>Ocean</span>
            </Link>
          </div>
        </header>

        {/* ─── Main Workspace: Left Sidebar + Center View + Right Inspector ─── */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDEBAR: Slack & Linear Workspace Navigation */}
          {sidebarOpen && (
            <aside className="w-60 border-r border-white/[0.08] bg-zinc-950/90 flex flex-col justify-between p-3 space-y-4">
              <div className="space-y-4 overflow-y-auto">
                {/* Org Switcher */}
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">🐬</span>
                    <div className="truncate">
                      <h4 className="text-xs font-semibold text-white truncate">Zoo Labs Org</h4>
                      <p className="text-[10px] text-zinc-400 truncate">zoo.ngo · 5 agents</p>
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                </div>

                {/* Workspace Views */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">Work Views</span>
                  <button
                    onClick={() => setActiveView('board')}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeView === 'board' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <Kanban className="h-3.5 w-3.5 text-blue-400" />
                    <span>Project Board</span>
                  </button>

                  <button
                    onClick={() => setActiveView('issues')}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      activeView === 'issues' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <ListTodo className="h-3.5 w-3.5 text-purple-400" />
                    <span>All Issues</span>
                    <span className="ml-auto text-[10px] bg-zinc-900 px-1.5 py-0.2 rounded text-zinc-400">{issues.length}</span>
                  </button>
                </div>

                {/* Channels (Slack style) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <span>Channels</span>
                    <Plus className="h-3 w-3 hover:text-white cursor-pointer" />
                  </div>
                  {CHANNELS.map((ch) => {
                    const isActive = activeView === 'chat' && activeChannelId === ch.id
                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setActiveChannelId(ch.id)
                          setActiveView('chat')
                        }}
                        className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                      >
                        <Hash className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="truncate">{ch.name}</span>
                      </button>
                    )
                  })}
                </div>

                {/* AI Agents Pod Roster */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">Agent Familiars</span>
                  {[
                    { name: 'Blue the Beluga', emoji: '🐬', status: 'Streaming' },
                    { name: 'Siberian Tiger', emoji: '🐅', status: 'Sandbox' },
                    { name: 'Sumatran Elephant', emoji: '🐘', status: 'Sensors' },
                  ].map((ag) => (
                    <div key={ag.name} className="flex items-center justify-between px-2.5 py-1 text-xs text-zinc-300">
                      <div className="flex items-center gap-2 truncate">
                        <span>{ag.emoji}</span>
                        <span className="truncate">{ag.name}</span>
                      </div>
                      <span className="text-[9px] text-blue-400 font-mono">● {ag.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Hanzo Cloud MicroVM</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </aside>
          )}

          {/* ─── CENTER WORK VIEW ─────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black/60">
            {/* VIEW 1: KANBAN BOARD (Linear Style) */}
            {activeView === 'board' && (
              <div className="flex-1 flex gap-4 p-4 overflow-x-auto">
                {(['backlog', 'todo', 'in_progress', 'done'] as const).map((columnKey) => {
                  const columnIssues = issues.filter((iss) => iss.status === columnKey)
                  const columnLabels = {
                    backlog: { name: 'Backlog', color: 'text-zinc-400' },
                    todo: { name: 'Todo', color: 'text-yellow-400' },
                    in_progress: { name: 'In Progress', color: 'text-blue-400' },
                    done: { name: 'Done', color: 'text-emerald-400' },
                  }

                  return (
                    <div
                      key={columnKey}
                      className="w-72 sm:w-80 flex flex-col rounded-xl bg-zinc-950/80 border border-white/[0.08] p-3 space-y-3 shrink-0 max-h-full"
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <div className="flex items-center gap-2">
                          <CircleDot className={`h-3.5 w-3.5 ${columnLabels[columnKey].color}`} />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                            {columnLabels[columnKey].name}
                          </h3>
                        </div>
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
                          {columnIssues.length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                        {columnIssues.map((iss) => (
                          <div
                            key={iss.id}
                            onClick={() => setSelectedIssue(iss)}
                            className={`p-3 rounded-lg bg-zinc-900/90 border transition-all cursor-pointer space-y-2 ${
                              selectedIssue?.id === iss.id
                                ? 'border-blue-500 bg-zinc-900 shadow-md shadow-blue-900/20'
                                : 'border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono text-zinc-400 font-semibold">{iss.id}</span>
                              <span
                                className={`uppercase font-bold text-[9px] px-1.5 py-0.2 rounded ${
                                  iss.priority === 'urgent'
                                    ? 'bg-red-500/20 text-red-400'
                                    : iss.priority === 'high'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {iss.priority}
                              </span>
                            </div>

                            <h4 className="text-xs font-medium text-white leading-snug">{iss.title}</h4>

                            <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <span>{iss.assignee.avatar}</span>
                                <span className="text-zinc-400 truncate max-w-[100px]">{iss.assignee.name}</span>
                              </div>
                              <span className="text-zinc-500">{iss.createdAt}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setNewIssueModal(true)}
                        className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-dashed border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Issue</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* VIEW 2: ALL ISSUES LIST VIEW (Linear Table Style) */}
            {activeView === 'issues' && (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-purple-400" />
                    <h3 className="text-xs font-semibold text-white">All Project Issues & Backlog</h3>
                  </div>
                  <span className="text-xs text-zinc-400">{issues.length} total</span>
                </div>

                <div className="space-y-1.5">
                  {issues.map((iss) => (
                    <div
                      key={iss.id}
                      onClick={() => setSelectedIssue(iss)}
                      className={`flex items-center justify-between p-3 rounded-lg bg-zinc-950 border transition-all cursor-pointer ${
                        selectedIssue?.id === iss.id
                          ? 'border-blue-500 bg-zinc-900/90'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="font-mono text-xs text-zinc-400 font-semibold">{iss.id}</span>
                        <h4 className="text-xs font-medium text-white truncate">{iss.title}</h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <span className="capitalize text-zinc-400 text-[11px]">{iss.status.replace('_', ' ')}</span>
                        <span className="flex items-center gap-1 text-[11px] text-zinc-300">
                          <span>{iss.assignee.avatar}</span>
                          <span className="hidden sm:inline">{iss.assignee.name}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: CHAT CHANNELS (Slack Style) */}
            {activeView === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Channel Header */}
                <div className="px-4 py-2 border-b border-white/[0.08] bg-zinc-950/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{currentChannel.name}</span>
                    </h3>
                    <p className="text-[10px] text-zinc-400">{currentChannel.desc}</p>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                  {channelMessages
                    .filter((m) => m.channelId === activeChannelId || m.channelId === 'general')
                    .map((m) => (
                      <div key={m.id} className="flex gap-3 text-xs">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-sm shrink-0">
                          {m.senderAvatar}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{m.senderName}</span>
                            {m.role && <span className="text-[10px] text-blue-400 font-mono">[{m.role}]</span>}
                            <span className="text-[10px] text-zinc-500">{m.timestamp}</span>
                          </div>
                          <p className="text-zinc-200 leading-relaxed">{m.content}</p>
                          {m.reactions && (
                            <div className="flex gap-1 pt-1">
                              {m.reactions.map((r, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300"
                                >
                                  <span>{r.emoji}</span>
                                  <span>{r.count}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message Composer */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.08] bg-zinc-950/80">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
                    <input
                      type="text"
                      value={msgInput}
                      onChange={(e) => setMsgInput(e.target.value)}
                      placeholder={`Message #${currentChannel.name}...`}
                      className="flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-zinc-500"
                    />
                    <button
                      type="submit"
                      disabled={!msgInput.trim()}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold transition-all hover:bg-blue-500 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ─── RIGHT INSPECTOR DRAWER (Issue Details & Agent Telemetry) ──── */}
          {selectedIssue && (
            <aside className="w-80 border-l border-white/[0.08] bg-zinc-950 p-4 space-y-4 overflow-y-auto hidden lg:flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-mono text-xs text-blue-400 font-bold">{selectedIssue.id}</span>
                  <span className="text-[10px] text-zinc-500">{selectedIssue.createdAt}</span>
                </div>

                <h3 className="text-sm font-semibold text-white">{selectedIssue.title}</h3>

                {/* Status Switcher */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Status</label>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {(['backlog', 'todo', 'in_progress', 'done'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateIssueStatus(selectedIssue.id, st)}
                        className={`px-2 py-1 rounded text-[11px] font-medium capitalize transition-all cursor-pointer ${
                          selectedIssue.status === st
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assignee & Priority */}
                <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Assignee:</span>
                    <span className="flex items-center gap-1 font-medium text-white">
                      <span>{selectedIssue.assignee.avatar}</span>
                      <span>{selectedIssue.assignee.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Priority:</span>
                    <span className="uppercase text-[10px] font-bold text-yellow-400">{selectedIssue.priority}</span>
                  </div>
                </div>

                {/* Labels */}
                <div className="space-y-1 pt-2 border-t border-zinc-800">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Labels</label>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedIssue.labels.map((lbl) => (
                      <span key={lbl} className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                        #{lbl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {selectedIssue.description && (
                  <div className="space-y-1 pt-2 border-t border-zinc-800 text-xs">
                    <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Details</label>
                    <p className="text-zinc-300 leading-relaxed pt-1">{selectedIssue.description}</p>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <span className="font-semibold text-white flex items-center gap-1">
                  <Bot className="h-3 w-3 text-blue-400" />
                  <span>Agent Autonomous Sync</span>
                </span>
                <p className="text-[10px]">Updates trigger background tasks in Hanzo Cloud MicroVM.</p>
              </div>
            </aside>
          )}
        </div>

        {/* ─── NEW ISSUE CREATION MODAL ────────────────────────────────────── */}
        {newIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <form
              onSubmit={handleCreateIssue}
              className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-semibold text-white">Create New Issue</h3>
                <button
                  type="button"
                  onClick={() => setNewIssueModal(false)}
                  className="p-1 text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newIssueTitle}
                  onChange={(e) => setNewIssueTitle(e.target.value)}
                  placeholder="e.g. Deploy 120kHz hydrophone node in Arctic..."
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-medium">Priority</label>
                <select
                  value={newIssuePriority}
                  onChange={(e) => setNewIssuePriority(e.target.value as any)}
                  className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewIssueModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500"
                >
                  Create Issue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
