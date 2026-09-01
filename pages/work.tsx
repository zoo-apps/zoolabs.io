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
  GripVertical,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

export type Issue = {
  id: string
  title: string
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'urgent' | 'high' | 'medium' | 'low'
  assignee: { name: string; avatar: string; type: 'human' | 'agent' }
  labels: string[]
  createdAt: string
  description?: string
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'ZOO-101',
    title: 'Compile BitDelta 1-bit quantization kernel for Zen 70B',
    status: 'in_progress',
    priority: 'urgent',
    assignee: { name: 'Blue the Beluga', avatar: '🐬', type: 'agent' },
    labels: ['cuda', 'bitdelta', 'quantization'],
    createdAt: '2h ago',
    description: 'Optimize low-rank parameter delta blending directly in GPU shared memory.',
  },
  {
    id: 'ZOO-102',
    title: 'Bundle Zoo Desktop macOS & Linux native Tauri binaries',
    status: 'done',
    priority: 'high',
    assignee: { name: 'Siberian Tiger', avatar: '🐅', type: 'agent' },
    labels: ['rust', 'tauri', 'desktop'],
    createdAt: '3h ago',
    description: 'Verify src-tauri debug and release targets with Pyodide microVM runtime.',
  },
  {
    id: 'ZOO-103',
    title: 'Implement DeltaSoup multi-expert weight merging for /vibe',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'Sarah Chen', avatar: '👩‍🔬', type: 'human' },
    labels: ['deltasoup', 'fine-tuning', 'lora'],
    createdAt: '4h ago',
    description: 'Support dynamic interpolation between coding, research, and creative LoRAs.',
  },
  {
    id: 'ZOO-104',
    title: 'Wire ComfyUI 3D mesh synthesis pipelines (TripoSR + Trellis)',
    status: 'todo',
    priority: 'urgent',
    assignee: { name: 'Alex Rivera', avatar: '👨‍🎨', type: 'human' },
    labels: ['comfyui', '3d', 'trellis'],
    createdAt: '1d ago',
    description: 'Bridge backend GPU nodes to front-end WebGL orbit inspector.',
  },
  {
    id: 'ZOO-105',
    title: 'Deploy durable microVM task runner on Hanzo Cloud',
    status: 'done',
    priority: 'high',
    assignee: { name: 'You (Host)', avatar: '🧑‍💻', type: 'human' },
    labels: ['microvm', 'hanzo-cloud', 'infra'],
    createdAt: '2d ago',
    description: 'Connect live Go microVM server on port 8080 to autonomous agent loops.',
  },
  {
    id: 'ZOO-106',
    title: 'Publish Sovereign AI Foundation open-weights benchmark paper',
    status: 'backlog',
    priority: 'medium',
    assignee: { name: 'Sumatran Elephant', avatar: '🐘', type: 'agent' },
    labels: ['research', 'papers', 'benchmarks'],
    createdAt: '3d ago',
    description: 'Draft comprehensive evaluation on MMLU-Pro, HumanEval, and Math-500.',
  },
]

const CHANNELS = [
  { id: 'general', name: 'general', desc: 'Pod announcements and general collaboration' },
  { id: 'sovereign-ai', name: 'sovereign-ai', desc: 'Zen weights, BitDelta, and DeltaSoup research' },
  { id: 'desktop-tauri', name: 'desktop-tauri', desc: 'Zoo Desktop Rust and Pyodide runtime' },
  { id: '3d-mesh', name: '3d-mesh', desc: 'ComfyUI 3D diffusion and Trellis rigging' },
  { id: 'microvm-sandbox', name: 'microvm-sandbox', desc: 'Hanzo Cloud Go backend execution' },
]

export default function WorkWorkspace() {
  const [activeView, setActiveView] = useState<'board' | 'issues' | 'chat'>('board')
  const [activeChannelId, setActiveChannelId] = useState('general')
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(INITIAL_ISSUES[0])
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [newIssueModal, setNewIssueModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high')

  // Load saved issues from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zoo_kanban_issues')
      if (saved) {
        setIssues(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  const saveIssues = (updated: Issue[]) => {
    setIssues(updated)
    try {
      localStorage.setItem('zoo_kanban_issues', JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  // HTML5 Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedIssueId(id)
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStatus: Issue['status']) => {
    e.preventDefault()
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId
    setDraggedIssueId(null)
    setDragOverColumn(null)

    if (!issueId) return

    const updated = issues.map((iss) => (iss.id === issueId ? { ...iss, status: targetStatus } : iss))
    saveIssues(updated)
  }

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newIss: Issue = {
      id: `ZOO-${100 + issues.length + 1}`,
      title: newTitle.trim(),
      status: 'todo',
      priority: newPriority,
      assignee: { name: 'Blue the Beluga', avatar: '🐬', type: 'agent' },
      labels: ['sovereign-ai', 'agent'],
      createdAt: 'Just now',
      description: 'Created from Kanban board.',
    }

    saveIssues([newIss, ...issues])
    setNewTitle('')
    setNewIssueModal(false)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Work Workspace (Interactive Kanban & Tasks)</title>
        <meta
          name="description"
          content="Multi-agent project management, drag-and-drop Kanban board, and task dispatcher wired to Hanzo Cloud."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#090b0e] text-zinc-100 font-sans select-none flex flex-col">
        {/* Top App Chrome */}
        <div className="z-50 shrink-0">
          <ZooAppChrome />
        </div>

        {/* Subheader */}
        <header className="h-11 border-b border-white/[0.08] bg-[#0c0f14] px-4 flex items-center justify-between shrink-0 z-40 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Zoo Work Studio</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">Multi-Agent Kanban</span>
            </div>

            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
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
                <span>List ({issues.length})</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewIssueModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-semibold active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Task</span>
            </button>
            <Link
              href="/vibe"
              className="inline-flex items-center gap-1 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/10 px-3 py-1 text-xs text-white/80 transition-all"
            >
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span>/vibe Studio</span>
            </Link>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Rail */}
          {sidebarOpen && (
            <aside className="w-60 border-r border-white/[0.08] bg-zinc-950/90 flex flex-col justify-between p-3 space-y-4 shrink-0">
              <div className="space-y-4 overflow-y-auto scrollbar-none">
                {/* Channels */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    <span>Channels</span>
                  </div>
                  {CHANNELS.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChannelId(ch.id)
                        setActiveView('chat')
                      }}
                      className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeChannelId === ch.id && activeView === 'chat'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <Hash className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="truncate">{ch.name}</span>
                    </button>
                  ))}
                </div>

                {/* Agents */}
                <div className="space-y-1 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">Autonomous Agents</span>
                  {[
                    { name: 'Blue the Beluga', emoji: '🐬', status: 'Live LoRA' },
                    { name: 'Siberian Tiger', emoji: '🐅', status: 'Tauri Pod' },
                    { name: 'Sumatran Elephant', emoji: '🐘', status: 'Inference' },
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

              {/* Backend Status */}
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 text-[11px] flex items-center justify-between text-zinc-400">
                <span>Hanzo Cloud MicroVM</span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 8080 Active
                </span>
              </div>
            </aside>
          )}

          {/* Center Kanban Board with Real HTML5 Drag & Drop */}
          <main className="flex-1 flex overflow-x-auto p-4 gap-4 bg-[#07090c]">
            {(['backlog', 'todo', 'in_progress', 'done'] as const).map((colKey) => {
              const colIssues = issues.filter((i) => i.status === colKey)
              const colMeta = {
                backlog: { name: 'Backlog', color: 'text-zinc-400', border: 'border-zinc-800' },
                todo: { name: 'Todo', color: 'text-amber-400', border: 'border-amber-500/20' },
                in_progress: { name: 'In Progress', color: 'text-blue-400', border: 'border-blue-500/20' },
                done: { name: 'Done', color: 'text-emerald-400', border: 'border-emerald-500/20' },
              }[colKey]

              const isDropActive = dragOverColumn === colKey

              return (
                <div
                  key={colKey}
                  onDragOver={(e) => handleDragOver(e, colKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, colKey)}
                  className={`w-72 sm:w-80 rounded-2xl bg-zinc-950/80 border flex flex-col p-3 space-y-3 shrink-0 max-h-full transition-all ${
                    isDropActive
                      ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10'
                      : 'border-white/[0.08]'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 px-1">
                    <div className="flex items-center gap-2">
                      <CircleDot className={`h-3.5 w-3.5 ${colMeta.color}`} />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">{colMeta.name}</h3>
                    </div>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-mono">
                      {colIssues.length}
                    </span>
                  </div>

                  {/* Issues List with Drag & Drop Cards */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none min-h-[150px]">
                    {colIssues.map((iss) => (
                      <div
                        key={iss.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, iss.id)}
                        onClick={() => setSelectedIssue(iss)}
                        className={`p-3 rounded-xl bg-zinc-900/90 border transition-all cursor-grab active:cursor-grabbing space-y-2 group ${
                          draggedIssueId === iss.id ? 'opacity-40 scale-95 border-dashed border-blue-400' : ''
                        } ${
                          selectedIssue?.id === iss.id
                            ? 'border-blue-500 bg-zinc-900 shadow-md shadow-blue-900/20'
                            : 'border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1">
                            <GripVertical className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400" />
                            <span className="font-mono text-zinc-400 font-semibold">{iss.id}</span>
                          </div>
                          <span
                            className={`uppercase font-bold text-[9px] px-1.5 py-0.2 rounded ${
                              iss.priority === 'urgent'
                                ? 'bg-red-500/20 text-red-400'
                                : iss.priority === 'high'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {iss.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-medium text-white leading-snug">{iss.title}</h4>

                        {/* Labels */}
                        <div className="flex flex-wrap gap-1">
                          {iss.labels.map((lbl) => (
                            <span
                              key={lbl}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800/80 text-zinc-400 border border-white/5"
                            >
                              {lbl}
                            </span>
                          ))}
                        </div>

                        {/* Assignee & Date */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span>{iss.assignee.avatar}</span>
                            <span className="text-zinc-400 truncate max-w-[110px]">{iss.assignee.name}</span>
                          </div>
                          <span className="text-zinc-500">{iss.createdAt}</span>
                        </div>
                      </div>
                    ))}

                    {colIssues.length === 0 && (
                      <div className="h-24 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-[11px] text-zinc-600">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </main>
        </div>

        {/* New Issue Modal */}
        {newIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <form
              onSubmit={handleCreateIssue}
              className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl backdrop-blur-3xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-semibold text-white">Create New Task</h3>
                <button
                  type="button"
                  onClick={() => setNewIssueModal(false)}
                  className="rounded-full p-1 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Fine-tune DeltaSoup parameter soup on GPU node"
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewIssueModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
