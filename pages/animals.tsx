import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Sparkles,
  Bot,
  Plus,
  ArrowUpRight,
  Activity,
  Cpu,
  Layers,
  Zap,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Database,
  Radio,
  Share2,
  Volume2,
  Settings,
  ChevronRight,
  X,
  Play,
  Pause,
  Filter,
  Check,
  BookOpen,
  Code2,
  HardDrive,
  Users,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions, AnimalAgent } from '../lib/zoo-missions-context'

export default function AnimalsPage() {
  const { agents, activeMission, addAnimalAgent } = useZooMissions()
  const [selectedAgent, setSelectedAgent] = useState<AnimalAgent>(agents[0])
  const [activeTab, setActiveTab] = useState<'graph' | 'fleet' | 'builder'>('graph')
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'tools' | 'cloud' | 'logs'>('overview')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Character Creation Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [newRole, setNewRole] = useState('Researcher')
  const [newSpecies, setNewSpecies] = useState('Dolphin')
  const [newEmoji, setNewEmoji] = useState('🐬')
  const [newName, setNewName] = useState('')
  const [newAbilities, setNewAbilities] = useState<string[]>(['Search scientific literature', 'Speak aloud'])
  const [newKnowledge, setNewKnowledge] = useState('Marine bioacoustics & Arctic cetacean datasets')
  const [requireHumanApproval, setRequireHumanApproval] = useState(true)
  const [createdSuccess, setCreatedSuccess] = useState(false)

  // Filtered agent fleet
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || a.role.toLowerCase().includes(filterRole.toLowerCase())
    return matchesSearch && matchesRole
  })

  const handleCreateAnimal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    addAnimalAgent({
      name: newName,
      species: newSpecies,
      emoji: newEmoji,
      role: newRole,
      naturalRole: `${newRole} specialist`,
      description: `Autonomous ${newSpecies} agent powered by ZenLM sovereign weights.`,
      avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80',
      brain: 'ZenLM 70B · BitDelta LoRA',
      status: 'active',
      currentJob: 'Ready to join missions',
      knows: [newKnowledge],
      tools: newAbilities,
      canTalk: true,
      canDelegateTo: ['blue'],
      cloudMicroVm: `microvm-${newName.toLowerCase().replace(/\s+/g, '-')}.hanzo.cloud`,
    })

    setCreatedSuccess(true)
    setTimeout(() => {
      setCreatedSuccess(false)
      setActiveTab('graph')
      setWizardStep(1)
      setNewName('')
    }, 1800)
  }

  return (
    <>
      <Head>
        <title>Animals — Living Agent Map & Fleet | Zoo Labs</title>
        <meta
          name="description"
          content="Living agent map of what the organization is thinking about right now. Build and inspect autonomous AI animals."
        />
      </Head>

      <div className="min-h-screen bg-[#05070a] text-zinc-100 font-sans select-none flex flex-col">
        {/* Top App Chrome */}
        <ZooAppChrome minimal={false} />

        {/* ─── Subheader: Living World Summary & View Switcher ─── */}
        <header className="border-b border-white/[0.08] bg-[#090c12] px-6 py-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-lg">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">The Living Agent Fleet</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  {agents.length} Autonomous Creatures Live
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Active Mission: <span className="text-cyan-300 font-medium">{activeMission.title}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center rounded-xl bg-zinc-900 border border-white/10 p-1 text-xs">
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'graph'
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                <span>Living Map</span>
              </button>
              <button
                onClick={() => setActiveTab('fleet')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'fleet'
                    ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-blue-400" />
                <span>All Animals</span>
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'builder'
                    ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                    : 'text-cyan-300 hover:text-white'
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Animal</span>
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main Content ─── */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB 1: THE LIVING AGENT MAP (Signature Living Graph) */}
          {activeTab === 'graph' && (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
              {/* Center Canvas: Interactive SVG Activity & Delegation Mesh */}
              <div className="flex-1 bg-[#040609] p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-6 z-10 space-y-1">
                  <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    Living Activity Graph
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    Live delegation flow and active data packet exchange across microVM nodes.
                  </p>
                </div>

                {/* Animated Activity Packets Canvas */}
                <div className="relative w-full max-w-3xl h-[460px] flex items-center justify-center">
                  {/* SVG Connection Lines */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    {/* Center Mission to Blue */}
                    <line x1="50%" y1="50%" x2="20%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    {/* Center Mission to Raven */}
                    <line x1="50%" y1="50%" x2="50%" y2="18%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    {/* Center Mission to Elephant */}
                    <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                    {/* Center Mission to Beaver */}
                    <line x1="50%" y1="50%" x2="50%" y2="82%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  </svg>

                  {/* CENTER NODE: The Active Mission */}
                  <div className="z-20 p-5 rounded-3xl bg-zinc-950 border-2 border-cyan-400/70 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center max-w-xs backdrop-blur-2xl">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-sm font-bold text-white mt-1">Mission: Arctic Belugas</h3>
                    <p className="text-[10px] text-cyan-300 font-mono mt-0.5">Progress: 68% · 14.2k Audio Hrs</p>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[9px] text-zinc-400">
                      <span>Elephant: 72%</span> • <span>Raven: 32 Papers</span>
                    </div>
                  </div>

                  {/* TOP NODE: 🐦 Raven (Literature & Research) */}
                  <button
                    onClick={() => setSelectedAgent(agents.find((a) => a.id === 'raven') || agents[0])}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-20 p-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 hover:border-cyan-400 shadow-xl text-center transition-all hover:scale-105 cursor-pointer"
                  >
                    <span className="text-2xl">🐦</span>
                    <h4 className="text-xs font-bold text-white">Corvus the Raven</h4>
                    <span className="text-[9px] text-cyan-400 font-mono">Literature Review</span>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono">
                      ✓ 32 papers synthesized
                    </div>
                  </button>

                  {/* LEFT NODE: 🐋 Blue the Beluga (Voice & Scientist) */}
                  <button
                    onClick={() => setSelectedAgent(agents.find((a) => a.id === 'blue') || agents[0])}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-zinc-900/90 border border-cyan-400 shadow-xl text-center transition-all hover:scale-105 cursor-pointer ring-2 ring-cyan-500/20"
                  >
                    <span className="text-2xl">🐋</span>
                    <h4 className="text-xs font-bold text-white">Blue the Beluga</h4>
                    <span className="text-[9px] text-cyan-400 font-mono">Voice & Lead Scientist</span>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[9px] font-mono animate-pulse">
                      🔊 120 kHz Echolocation
                    </div>
                  </button>

                  {/* RIGHT NODE: 🐘 Elephant (Data & Memory) */}
                  <button
                    onClick={() => setSelectedAgent(agents.find((a) => a.id === 'elephant') || agents[0])}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 hover:border-cyan-400 shadow-xl text-center transition-all hover:scale-105 cursor-pointer"
                  >
                    <span className="text-2xl">🐘</span>
                    <h4 className="text-xs font-bold text-white">Ganesha the Elephant</h4>
                    <span className="text-[9px] text-cyan-400 font-mono">ClickHouse Datastore</span>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[9px] font-mono">
                      Cleaning audio · 72%
                    </div>
                  </button>

                  {/* BOTTOM NODE: 🦫 Beaver (App Builder & Frontend) */}
                  <button
                    onClick={() => setSelectedAgent(agents.find((a) => a.id === 'beaver') || agents[0])}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 p-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 hover:border-cyan-400 shadow-xl text-center transition-all hover:scale-105 cursor-pointer"
                  >
                    <span className="text-2xl">🦫</span>
                    <h4 className="text-xs font-bold text-white">Castor the Beaver</h4>
                    <span className="text-[9px] text-cyan-400 font-mono">Interactive Canvas</span>
                    <div className="mt-1 px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[9px] font-mono">
                      Population chart · 94%
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Sidebar: Deep Agent Character & Cloud Telemetry Inspector */}
              <aside className="w-full lg:w-96 bg-[#080b10] border-l border-white/[0.08] flex flex-col shrink-0 p-5 overflow-y-auto space-y-5">
                {/* Header Card */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-white/15 flex items-center justify-center text-2xl">
                        {selectedAgent.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{selectedAgent.name}</h3>
                        <p className="text-xs text-cyan-400 font-mono">{selectedAgent.species}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        zooAudio.speakAgent(selectedAgent.id, `Hello! I am ${selectedAgent.name}. ${selectedAgent.description}`)
                      }}
                      className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Speak</span>
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedAgent.description}</p>
                </div>

                {/* Inspector Sub-tabs */}
                <div className="flex items-center rounded-xl bg-zinc-900 border border-white/10 p-1 text-xs">
                  {(['overview', 'tools', 'cloud', 'logs'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setInspectorTab(tab)}
                      className={`flex-1 py-1 text-center rounded-lg capitalize transition-all ${
                        inspectorTab === tab
                          ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Sub-tab 1: Character Overview (Knows, Capabilities, Boundaries) */}
                {inspectorTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                        🧠 Brain & Sovereign Model
                      </h4>
                      <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/5 font-mono text-cyan-300">
                        {selectedAgent.brain}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                        📚 What It Knows
                      </h4>
                      <div className="space-y-1">
                        {selectedAgent.knows.map((k) => (
                          <div key={k} className="p-2 rounded-lg bg-zinc-900/60 border border-white/5 text-zinc-300 flex items-center gap-2">
                            <span className="text-cyan-400">•</span>
                            <span>{k}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                        🤝 Can Delegate To
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedAgent.canDelegateTo.map((target) => (
                          <span key={target} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono capitalize">
                            @{target}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Tools & Skills */}
                {inspectorTab === 'tools' && (
                  <div className="space-y-2 text-xs">
                    {selectedAgent.tools.map((tool) => (
                      <div key={tool} className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                        <span className="font-medium text-white">{tool}</span>
                        <span className="text-[10px] font-mono text-emerald-400">Granted</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sub-tab 3: Cloud Infrastructure */}
                {inspectorTab === 'cloud' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">MicroVM:</span>
                        <span className="text-cyan-400">{selectedAgent.cloudMicroVm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Tokens Processed:</span>
                        <span className="text-white">{selectedAgent.metrics.tokensUsed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">P99 Latency:</span>
                        <span className="text-emerald-400">{selectedAgent.metrics.latencyMs}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Cumulative Cost:</span>
                        <span className="text-zinc-300">{selectedAgent.metrics.costUsd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Uptime:</span>
                        <span className="text-emerald-400">{selectedAgent.metrics.uptime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 4: Execution Logs */}
                {inspectorTab === 'logs' && (
                  <div className="p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-[10px] text-zinc-400 space-y-1 overflow-x-auto">
                    <p className="text-cyan-400">[2026-09-01T07:30:12Z] microvm_init: booted in 12ms</p>
                    <p className="text-emerald-400">[2026-09-01T07:31:00Z] task_recv: {selectedAgent.currentJob}</p>
                    <p className="text-zinc-500">[2026-09-01T07:32:44Z] checkpoint: state saved to clickhouse</p>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* TAB 2: ALL ANIMALS FLEET GRID */}
          {activeTab === 'fleet' && (
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search animals by name or role..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 outline-none"
                  />
                </div>
              </div>

              {/* Grid of Animal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {filteredAgents.map((a) => (
                  <div
                    key={a.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-cyan-500/50 transition-all space-y-3 shadow-xl group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{a.emoji}</span>
                        <div>
                          <h3 className="font-bold text-white text-sm">{a.name}</h3>
                          <p className="text-xs text-cyan-400 font-mono">{a.role}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                        {a.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                      {a.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400">
                      <span className="font-semibold text-zinc-200">Current Task: </span>
                      {a.currentJob}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-zinc-500">{a.brain.split('·')[0]}</span>
                      <button
                        onClick={() => {
                          setSelectedAgent(a)
                          setActiveTab('graph')
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect in Map</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE A NEW ANIMAL (Character Creation Wizard) */}
          {activeTab === 'builder' && (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center">
              <div className="max-w-xl w-full rounded-3xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-4xl">✨ 🐾</span>
                  <h2 className="text-xl font-bold text-white">Create a New Animal Creature</h2>
                  <p className="text-xs text-zinc-400">
                    Design an autonomous animal companion with personality, abilities, knowledge, and boundaries.
                  </p>
                </div>

                {createdSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="font-bold text-white text-base">New Creature Brought to Life!</h3>
                    <p className="text-xs text-emerald-300">
                      {newName} ({newSpecies}) has appeared in the habitat and is ready for missions.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateAnimal} className="space-y-4">
                    {/* Step 1: Role & Species */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">1. Role & Specialty</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white outline-none"
                      >
                        <option value="Researcher">Researcher & Literature Scholar</option>
                        <option value="Builder">Builder & Frontend Engineer</option>
                        <option value="Scientist">Bioacoustic Marine Scientist</option>
                        <option value="Teacher">Educator & Storyteller</option>
                        <option value="Guardian">Security & Threat Auditor</option>
                      </select>
                    </div>

                    {/* Step 2: Animal Character Name & Species */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">2. Animal Species</label>
                        <select
                          value={newSpecies}
                          onChange={(e) => {
                            setNewSpecies(e.target.value)
                            const map: Record<string, string> = {
                              Dolphin: '🐬',
                              Otter: '🦦',
                              Penguin: '🐧',
                              Fox: '🦊',
                              Narwhal: '🦄',
                              Owl: '🦉',
                            }
                            setNewEmoji(map[e.target.value] || '🐾')
                          }}
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white outline-none"
                        >
                          <option value="Dolphin">Dolphin 🐬</option>
                          <option value="Otter">Sea Otter 🦦</option>
                          <option value="Penguin">Penguin 🐧</option>
                          <option value="Fox">Arctic Fox 🦊</option>
                          <option value="Narwhal">Narwhal 🦄</option>
                          <option value="Owl">Snowy Owl 🦉</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300">Name</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Echo the Dolphin"
                          className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder:text-zinc-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Step 3: Knowledge Sources */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">3. Knowledge Sources</label>
                      <input
                        type="text"
                        value={newKnowledge}
                        onChange={(e) => setNewKnowledge(e.target.value)}
                        placeholder="Connect docs, papers, or database URLs"
                        className="w-full p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Step 4: Boundaries */}
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white">Require Human Approval</p>
                        <p className="text-[10px] text-zinc-400">Must ask before deploying live code or policy briefs.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireHumanApproval}
                        onChange={(e) => setRequireHumanApproval(e.target.checked)}
                        className="h-4 w-4 rounded accent-cyan-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!newName.trim()}
                      className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/30 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Bring {newName || 'Creature'} to Life</span>
                      <span>✨</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
