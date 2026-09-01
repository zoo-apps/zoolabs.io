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
  Network,
  Share2,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { useZooMissions, MissionTask } from '../lib/zoo-missions-context'
import { zooAudio } from '../lib/audio-engine'

export default function WorkWorkspace() {
  const { activeMission, missions, setActiveMissionId, updateTaskStatus, addTask, agents } = useZooMissions()

  const [activeView, setActiveView] = useState<'board' | 'list' | 'decisions'>('board')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTask, setSelectedTask] = useState<MissionTask | null>(activeMission.tasks[0] || null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [newTaskModal, setNewTaskModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high')
  const [newAssignee, setNewAssignee] = useState('Blue the Beluga')
  const [searchQuery, setSearchQuery] = useState('')

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedTaskId(id)
  }

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey)
    }
  }

  const handleDrop = (e: React.DragEvent, targetStatus: MissionTask['status']) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    setDraggedTaskId(null)
    setDragOverColumn(null)

    if (!taskId) return

    updateTaskStatus(taskId, targetStatus)
    zooAudio.playCue('ping')
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const selectedAg = agents.find((a) => a.name === newAssignee) || agents[0]

    addTask({
      title: newTitle.trim(),
      status: 'todo',
      priority: newPriority,
      assignee: selectedAg,
      tags: ['sovereign-ai', activeMission.id],
      progress: 0,
      description: `Task created for ${activeMission.title}`,
    })

    setNewTitle('')
    setNewTaskModal(false)
    zooAudio.playCue('ping')
  }

  // Filter tasks
  const filteredTasks = activeMission.tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Missions & Work — Unified Living World | Zoo Labs</title>
        <meta
          name="description"
          content="Multi-agent mission dispatcher, drag-and-drop Kanban board, and Semantica causal decision lineage."
        />
      </Head>

      <div className="h-screen w-screen overflow-hidden bg-[#05070a] text-zinc-100 font-sans select-none flex flex-col">
        {/* Top App Chrome */}
        <ZooAppChrome minimal={false} />

        {/* ─── Subheader: Mission Switcher & View Mode ─── */}
        <header className="h-12 border-b border-white/[0.08] bg-[#090c12] px-4 flex items-center justify-between shrink-0 z-40 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </button>

            {/* Mission Selector Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Mission:</span>
              <select
                value={activeMission.id}
                onChange={(e) => setActiveMissionId(e.target.value)}
                className="bg-zinc-900 border border-white/15 text-cyan-300 font-semibold px-2.5 py-1 rounded-lg text-xs outline-none cursor-pointer"
              >
                {missions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Switcher: Board, List, Decisions */}
            <div className="hidden sm:flex items-center bg-zinc-900 border border-white/10 rounded-lg p-0.5 text-[11px]">
              <button
                onClick={() => setActiveView('board')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'board' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Kanban className="h-3.5 w-3.5 text-cyan-400" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'list' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ListTodo className="h-3.5 w-3.5 text-blue-400" />
                <span>List ({activeMission.tasks.length})</span>
              </button>
              <button
                onClick={() => setActiveView('decisions')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeView === 'decisions' ? 'bg-zinc-800 text-white shadow-sm font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Network className="h-3.5 w-3.5 text-purple-400" />
                <span>Decisions ({activeMission.decisions.length})</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNewTaskModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 text-xs font-semibold active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Mission Task</span>
            </button>
            <Link
              href="/vibe"
              className="inline-flex items-center gap-1 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/10 px-3 py-1 text-xs text-white/80 transition-all"
            >
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>/vibe Studio</span>
            </Link>
          </div>
        </header>

        {/* ─── Main Workspace ─── */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Missions List & Evidence Datasets */}
          {sidebarOpen && (
            <aside className="w-64 border-r border-white/[0.08] bg-[#07090e] flex flex-col justify-between p-3 shrink-0 text-xs">
              <div className="space-y-4 overflow-y-auto">
                {/* Missions List */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">
                    Active World Missions
                  </span>
                  {missions.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMissionId(m.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        activeMission.id === m.id
                          ? 'bg-zinc-800 border border-cyan-500/40 text-white font-medium'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{m.emoji}</span>
                        <span className="truncate">{m.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">{m.progress}%</span>
                    </button>
                  ))}
                </div>

                {/* Evidence Datasets for Active Mission */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2">
                    Evidence Datasets
                  </span>
                  {activeMission.evidence.datasets.map((ds) => (
                    <div key={ds.name} className="p-2 rounded-lg bg-zinc-900/60 border border-white/5 space-y-0.5">
                      <div className="flex justify-between font-semibold text-white">
                        <span className="truncate">{ds.name}</span>
                        <span className="text-cyan-400 font-mono text-[10px]">{ds.size}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                        <span>{ds.records}</span>
                        <span>{ds.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Status */}
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 space-y-1">
                <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Impact Metric
                </span>
                <p className="text-xs font-bold text-white">{activeMission.impact.metric}</p>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Target: {activeMission.impact.target}</span>
                  <span className="text-emerald-400 font-bold">{activeMission.impact.current}</span>
                </div>
              </div>
            </aside>
          )}

          {/* Center Workspace Views */}
          <main className="flex-1 flex flex-col overflow-hidden bg-[#040609] p-4">
            {/* SEARCH & FILTER BAR */}
            <div className="pb-3 flex items-center justify-between gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks or assignees..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 outline-none"
                />
              </div>

              <div className="text-xs text-zinc-400">
                <span>{filteredTasks.length} tasks in mission</span>
              </div>
            </div>

            {/* VIEW 1: KANBAN BOARD WITH DRAG & DROP */}
            {activeView === 'board' && (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 overflow-x-auto pb-4">
                {[
                  { key: 'backlog', title: 'Backlog', color: 'text-zinc-400', border: 'border-zinc-800' },
                  { key: 'todo', title: 'To Do', color: 'text-blue-400', border: 'border-blue-500/30' },
                  { key: 'in_progress', title: 'In Progress', color: 'text-amber-400', border: 'border-amber-500/30' },
                  { key: 'done', title: 'Completed', color: 'text-emerald-400', border: 'border-emerald-500/30' },
                ].map((col) => {
                  const colTasks = filteredTasks.filter((t) => t.status === col.key)

                  return (
                    <div
                      key={col.key}
                      onDragOver={(e) => handleDragOver(e, col.key)}
                      onDrop={(e) => handleDrop(e, col.key as any)}
                      className={`flex flex-col rounded-2xl bg-zinc-950/70 border ${
                        dragOverColumn === col.key ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-zinc-900/90' : 'border-white/10'
                      } p-3 transition-all`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                        <span className={`text-xs font-bold ${col.color} flex items-center gap-1.5`}>
                          <span>{col.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500">({colTasks.length})</span>
                        </span>
                      </div>

                      {/* Task Cards */}
                      <div className="flex-1 overflow-y-auto space-y-2.5">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onClick={() => setSelectedTask(task)}
                            className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2 cursor-grab active:cursor-grabbing shadow-lg group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-xs text-white leading-tight">
                                {task.title}
                              </h4>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize ${
                                  task.priority === 'urgent'
                                    ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                    : task.priority === 'high'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            {/* Progress bar */}
                            {(task.progress ?? 0) > 0 && (
                              <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${task.progress}%` }} />
                              </div>
                            )}

                            {/* Assignee & Tags */}
                            <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                              <div className="flex items-center gap-1.5 font-medium text-white">
                                <span>{task.assignee.emoji}</span>
                                <span className="truncate max-w-[100px]">{task.assignee.name.split(' ')[0]}</span>
                              </div>
                              <span className="font-mono text-zinc-500">{task.id}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* VIEW 2: LINEAR/GITHUB-STYLE TASK LIST */}
            {activeView === 'list' && (
              <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/80 p-4 space-y-2">
                {filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-cyan-500/40 flex items-center justify-between text-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-500 text-[11px]">{t.id}</span>
                      <span className="font-semibold text-white">{t.title}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] capitalize">
                        {t.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-white">
                        <span>{t.assignee.emoji}</span>
                        <span>{t.assignee.name}</span>
                      </div>
                      <span className="text-cyan-400 font-mono text-[11px] font-bold">{t.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW 3: SEMANTICA DECISIONS & PROVENANCE */}
            {activeView === 'decisions' && (
              <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl border border-white/10 bg-zinc-950/80">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Network className="h-4 w-4 text-purple-400" />
                    <span>Semantica Decision Intelligence & Provenance Lineage</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Immutable bi-temporal decision log linked to W3C PROV-O agents and datasets.
                  </p>
                </div>

                <div className="space-y-3">
                  {activeMission.decisions.map((dec) => (
                    <div
                      key={dec.id}
                      className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-400 font-bold text-xs">{dec.id}</span>
                          <span className="text-white font-semibold text-xs">{dec.decidedBy}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{dec.timestamp}</span>
                      </div>

                      <p className="text-xs text-zinc-300">{dec.scenario}</p>

                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-[11px]">
                        <span className="font-semibold text-emerald-300">Outcome:</span>
                        <p className="text-zinc-300">{dec.outcome}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                        <span className="truncate max-w-[280px]">Impact: {dec.downstreamImpact}</span>
                        <span className="text-purple-400 font-bold">{dec.causalType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ─── Create Task Modal ─── */}
        {newTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Create New Mission Task</h3>
                <button onClick={() => setNewTaskModal(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Task Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Ingest 2026 icebreaker tracking coordinates"
                    className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Priority</label>
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

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Assignee Agent</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white outline-none"
                    >
                      {agents.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.emoji} {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-lg cursor-pointer"
                >
                  Create Task
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
