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
  Maximize2,
  Sliders,
  Flame,
  Globe,
  Lock,
  Compass,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions, AnimalAgent } from '../lib/zoo-missions-context'

export default function AnimalsPage() {
  const { agents, activeMission, addAnimalAgent, updateAgentMemory, trainAgentSkill } = useZooMissions()
  const [selectedAgent, setSelectedAgent] = useState<AnimalAgent>(agents[0])
  const [activeTab, setActiveTab] = useState<'graph' | 'fleet' | 'builder'>('graph')
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'memory' | 'tools' | 'cloud' | 'logs'>('overview')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false)

  // Interactive Memory & Skill training inputs
  const [newMemoryText, setNewMemoryText] = useState('')
  const [newSkillName, setNewSkillName] = useState('')
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'training' | 'success'>('idle')

  // Character Creation Wizard State
  const [wizardStep, setWizardStep] = useState(1)
  const [newRole, setNewRole] = useState('Researcher')
  const [newSpecies, setNewSpecies] = useState('Dolphin')
  const [newEmoji, setNewEmoji] = useState('🐬')
  const [newName, setNewName] = useState('')
  const [newAbilities, setNewAbilities] = useState<string[]>(['Search scientific literature', 'Speak aloud'])
  const [newKnowledge, setNewKnowledge] = useState('Marine bioacoustics & Arctic cetacean datasets')
  const [createdSuccess, setCreatedSuccess] = useState(false)

  // Sync selected agent if agents list changes
  useEffect(() => {
    const found = agents.find((a) => a.id === selectedAgent.id)
    if (found) setSelectedAgent(found)
  }, [agents])

  // Filtered agent fleet
  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || a.role.toLowerCase().includes(filterRole.toLowerCase())
    return matchesSearch && matchesRole
  })

  const handleTrainMemory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemoryText.trim()) return
    setTrainingStatus('training')
    zooAudio.playCue('ping')

    setTimeout(() => {
      updateAgentMemory(selectedAgent.id, newMemoryText.trim())
      setNewMemoryText('')
      setTrainingStatus('success')
      setTimeout(() => setTrainingStatus('idle'), 2000)
    }, 900)
  }

  const handleTrainSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSkillName.trim()) return
    setTrainingStatus('training')
    zooAudio.playCue('ping')

    setTimeout(() => {
      trainAgentSkill(selectedAgent.id, newSkillName.trim())
      setNewSkillName('')
      setTrainingStatus('success')
      setTimeout(() => setTrainingStatus('idle'), 2000)
    }, 900)
  }

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
      currentJob: 'Ready to join active missions',
      knows: [newKnowledge],
      tools: newAbilities,
      canTalk: true,
      canDelegateTo: ['blue'],
      cloudMicroVm: `microvm-${newName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.hanzo.cloud`,
    })

    setCreatedSuccess(true)
    zooAudio.playCue('join')
    setTimeout(() => {
      setCreatedSuccess(false)
      setActiveTab('graph')
      setWizardStep(1)
      setNewName('')
    }, 1500)
  }

  return (
    <>
      <Head>
        <title>Animals — Living Agent Map & Fleet | ZOO</title>
        <meta
          name="description"
          content="Living agent map of what the organization is thinking about right now. Build, personalize, and inspect autonomous AI animals."
        />
      </Head>

      <div className="h-screen w-screen bg-[#06080d] text-zinc-100 font-sans select-none flex flex-col overflow-hidden">
        {/* ─── 1. Top App Navigation Bar ─── */}
        <ZooAppChrome minimal={false} />

        {/* ─── 2. Subheader Bar ─── */}
        <div className="h-12 border-b border-white/[0.08] bg-[#090d15] px-3 sm:px-6 flex items-center justify-between shrink-0 text-xs">
          {/* Left: Section Brand & Active Mission */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-base">🐾</span>
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="hidden sm:inline font-bold text-white tracking-wide">Living Fleet</span>
              <span className="hidden sm:inline text-zinc-500">•</span>
              <span className="hidden md:inline text-zinc-400 truncate">
                Mission: <strong className="text-cyan-300 font-medium">{activeMission.title}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                {agents.length} active
              </span>
            </div>
          </div>

          {/* Right: Tab Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'graph'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">Map</span>
              </button>
              <button
                onClick={() => setActiveTab('fleet')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden xs:inline sm:inline">Fleet</span>
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'builder'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create</span>
              </button>
            </div>

            {/* Mobile Inspector Toggle */}
            <button
              onClick={() => setMobileInspectorOpen(!mobileInspectorOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300"
              title="Toggle Agent Inspector"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── 3. Main Body Content ─── */}
        <div className="flex-1 flex overflow-hidden relative" style={{ minHeight: 0 }}>
          {/* ═══════════ TAB 1: LIVING MAP VIEW ═══════════ */}
          {activeTab === 'graph' && (
            <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden" style={{ minHeight: 0 }}>
              {/* Left/Center: Interactive Living Graph Canvas */}
              <div
                className="flex-1 bg-[#04060a] relative overflow-hidden flex flex-col justify-between p-4 sm:p-6"
                style={{ flex: '1 1 0%', minHeight: 0 }}
              >
                {/* Canvas Background Grid Pattern */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Top Canvas Legend */}
                <div className="relative z-10 flex items-center justify-between shrink-0">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Multi-Agent Coordination Mesh
                      </h2>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Real-time packet exchange across sovereign microVMs & ClickHouse memory
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-[11px] text-zinc-400">
                      ⚡ Sovereign LoRA Active
                    </span>
                  </div>
                </div>

                {/* Center Node Topology - Desktop 2D Mesh (md+) / Mobile Vertical Flow (<md) */}
                <div className="relative flex-1 w-full my-4 flex items-center justify-center min-h-[440px]">
                  {/* Desktop 2D Node Mesh */}
                  <div className="hidden md:flex relative w-full h-full items-center justify-center">
                    {/* Glowing Connection Splines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="amberLine" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>

                      {/* Line Connectors */}
                      <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="url(#cyanLine)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="url(#amberLine)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="url(#cyanLine)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="50%" y1="50%" x2="50%" y2="88%" stroke="url(#cyanLine)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="url(#cyanLine)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                    </svg>

                    {/* TOP-LEFT NODE: Wolf */}
                    <div style={{ position: 'absolute', top: '8%', left: '6%', zIndex: 20 }}>
                      <button
                        onClick={() => {
                          setSelectedAgent(agents.find((a) => a.id === 'wolf') || agents[0])
                          setMobileInspectorOpen(true)
                          zooAudio.playCue('click')
                        }}
                        className={`p-3 rounded-2xl bg-[#0e131f]/95 border transition-all hover:scale-105 cursor-pointer text-left shadow-xl backdrop-blur-md min-w-[130px] sm:min-w-[150px] ${
                          selectedAgent.id === 'wolf'
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-white/10 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🐺</span>
                          <div>
                            <p className="text-xs font-bold text-white">Fenrir Wolf</p>
                            <p className="text-[10px] text-cyan-400 font-mono">Literature Review</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10">
                          <span className="text-zinc-400">Papers</span>
                          <span className="font-mono text-emerald-400">32 synthesized</span>
                        </div>
                      </button>
                    </div>

                    {/* TOP-RIGHT NODE: Twiga the Giraffe */}
                    <div style={{ position: 'absolute', top: '8%', right: '6%', zIndex: 20 }}>
                      <button
                        onClick={() => {
                          setSelectedAgent(agents.find((a) => a.id === 'giraffe') || agents[0])
                          setMobileInspectorOpen(true)
                          zooAudio.playCue('click')
                        }}
                        className={`p-3 rounded-2xl bg-[#0e131f]/95 border transition-all hover:scale-105 cursor-pointer text-left shadow-xl backdrop-blur-md min-w-[130px] sm:min-w-[150px] ${
                          selectedAgent.id === 'giraffe'
                            ? 'border-amber-400 ring-2 ring-amber-500/30'
                            : 'border-white/10 hover:border-amber-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🦒</span>
                          <div>
                            <p className="text-xs font-bold text-white">Twiga Giraffe</p>
                            <p className="text-[10px] text-amber-400 font-mono">Big-Picture Strategy</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10">
                          <span className="text-zinc-400">Horizon</span>
                          <span className="font-mono text-amber-300">2030 Roadmap</span>
                        </div>
                      </button>
                    </div>

                    {/* CENTER HUB NODE: Active Mission */}
                    <div className="z-30 p-4 sm:p-5 rounded-3xl bg-[#0c101a] border-2 border-cyan-400/80 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-center max-w-xs sm:max-w-sm backdrop-blur-2xl">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-2xl">🎯</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 animate-pulse">
                          LIVE COORDINATION
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{activeMission.title}</h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        NOAA Hydrophone Bioacoustics • 14.2k Audio Hrs
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-300">
                        <div className="p-1.5 rounded-lg bg-white/[0.04] text-center">
                          <span className="text-zinc-500 block text-[9px]">PROGRESS</span>
                          <span className="font-bold text-cyan-300">68% Complete</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/[0.04] text-center">
                          <span className="text-zinc-500 block text-[9px]">DATAPOINTS</span>
                          <span className="font-bold text-emerald-400">1.4 TB Cleaned</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM-LEFT NODE: Blue Beluga */}
                    <div style={{ position: 'absolute', bottom: '8%', left: '6%', zIndex: 20 }}>
                      <button
                        onClick={() => {
                          setSelectedAgent(agents.find((a) => a.id === 'blue') || agents[0])
                          setMobileInspectorOpen(true)
                          zooAudio.playCue('click')
                        }}
                        className={`p-3 rounded-2xl bg-[#0e131f]/95 border transition-all hover:scale-105 cursor-pointer text-left shadow-xl backdrop-blur-md min-w-[130px] sm:min-w-[150px] ${
                          selectedAgent.id === 'blue'
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-white/10 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🐋</span>
                          <div>
                            <p className="text-xs font-bold text-white">Blue the Beluga</p>
                            <p className="text-[10px] text-cyan-400 font-mono">Lead Scientist</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10">
                          <span className="text-zinc-400">Voice</span>
                          <span className="font-mono text-cyan-300 animate-pulse">120 kHz Audio</span>
                        </div>
                      </button>
                    </div>

                    {/* BOTTOM-CENTER NODE: Hippo */}
                    <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                      <button
                        onClick={() => {
                          setSelectedAgent(agents.find((a) => a.id === 'hippo') || agents[0])
                          setMobileInspectorOpen(true)
                          zooAudio.playCue('click')
                        }}
                        className={`p-3 rounded-2xl bg-[#0e131f]/95 border transition-all hover:scale-105 cursor-pointer text-left shadow-xl backdrop-blur-md min-w-[130px] sm:min-w-[150px] ${
                          selectedAgent.id === 'hippo'
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-white/10 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🦛</span>
                          <div>
                            <p className="text-xs font-bold text-white">Kiboko Hippo</p>
                            <p className="text-[10px] text-cyan-400 font-mono">Frontend & Canvas</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10">
                          <span className="text-zinc-400">Sandbox</span>
                          <span className="font-mono text-blue-300">94% Done</span>
                        </div>
                      </button>
                    </div>

                    {/* BOTTOM-RIGHT NODE: Elephant */}
                    <div style={{ position: 'absolute', bottom: '8%', right: '6%', zIndex: 20 }}>
                      <button
                        onClick={() => {
                          setSelectedAgent(agents.find((a) => a.id === 'elephant') || agents[0])
                          setMobileInspectorOpen(true)
                          zooAudio.playCue('click')
                        }}
                        className={`p-3 rounded-2xl bg-[#0e131f]/95 border transition-all hover:scale-105 cursor-pointer text-left shadow-xl backdrop-blur-md min-w-[130px] sm:min-w-[150px] ${
                          selectedAgent.id === 'elephant'
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-white/10 hover:border-cyan-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🐘</span>
                          <div>
                            <p className="text-xs font-bold text-white">Ganesha Elephant</p>
                            <p className="text-[10px] text-cyan-400 font-mono">ClickHouse Memory</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-white/10">
                          <span className="text-zinc-400">Telemetry</span>
                          <span className="font-mono text-emerald-400">72% Indexed</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Coordination Flow (<md) */}
                  <div className="md:hidden flex flex-col items-center w-full space-y-3 overflow-y-auto max-h-full py-2">
                    {/* Mission Hub Card */}
                    <div className="w-full p-4 rounded-2xl bg-[#0c101a] border border-cyan-400/60 text-center shadow-lg">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-xl">🎯</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
                          LIVE COORDINATION
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white">{activeMission.title}</h3>
                      <div className="mt-2 pt-2 border-t border-white/10 flex justify-around text-[10px] font-mono text-zinc-300">
                        <span>Progress: <strong className="text-cyan-300">68%</strong></span>
                        <span>Data: <strong className="text-emerald-400">1.4 TB</strong></span>
                      </div>
                    </div>

                    {/* Connected Animal Nodes Grid */}
                    <div className="w-full grid grid-cols-2 gap-2">
                      {[
                        { id: 'blue', name: 'Blue', role: 'Lead Scientist', emoji: '🐋', stat: '120 kHz Audio' },
                        { id: 'wolf', name: 'Wolf', role: 'Literature', emoji: '🐺', stat: '32 papers' },
                        { id: 'giraffe', name: 'Giraffe', role: 'Strategy', emoji: '🦒', stat: '2030 Roadmap' },
                        { id: 'hippo', name: 'Hippo', role: 'Canvas UI', emoji: '🦛', stat: '94% Done' },
                        { id: 'elephant', name: 'Elephant', role: 'ClickHouse', emoji: '🐘', stat: '72% Indexed' },
                        { id: 'tiger', name: 'Tiger', role: 'Security', emoji: '🐅', stat: '100% Guarded' },
                      ].map((ag) => (
                        <button
                          key={ag.id}
                          onClick={() => {
                            setSelectedAgent(agents.find((a) => a.id === ag.id) || agents[0])
                            setMobileInspectorOpen(true)
                            zooAudio.playCue('click')
                          }}
                          className={`p-2.5 rounded-xl bg-zinc-900/90 border text-left transition-all ${
                            selectedAgent.id === ag.id ? 'border-cyan-400 bg-cyan-950/40' : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{ag.emoji}</span>
                            <div className="min-w-0 truncate">
                              <p className="text-xs font-bold text-white truncate">{ag.name}</p>
                              <p className="text-[9px] text-cyan-400 font-mono truncate">{ag.role}</p>
                            </div>
                          </div>
                          <p className="text-[9px] text-zinc-400 font-mono mt-1 pt-1 border-t border-white/5">{ag.stat}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Canvas Toolbar */}
                <div className="relative z-10 flex items-center justify-between text-xs pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px] truncate">
                    <span className="truncate">Tap any animal to inspect neural weights or microVM.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/vibe"
                      className="px-2.5 sm:px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <span>💜 Vibe</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile / Tablet Inspector Backdrop */}
              {mobileInspectorOpen && (
                <div
                  className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                  onClick={() => setMobileInspectorOpen(false)}
                />
              )}

              {/* ═══════════ RIGHT SIDEBAR: DEEP AGENT INSPECTOR ═══════════ */}
              <aside
                className={`bg-[#090d15] border-l border-white/[0.08] flex-col shrink-0 h-full overflow-hidden transition-all duration-300 z-50 w-full md:w-80 lg:w-96 ${
                  mobileInspectorOpen
                    ? 'fixed inset-y-0 right-0 max-w-sm w-full shadow-2xl flex'
                    : 'hidden lg:flex'
                }`}
              >
                {/* Inspector Header */}
                <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-zinc-800 border border-white/15 flex items-center justify-center text-2xl shrink-0">
                      {selectedAgent.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{selectedAgent.name}</h3>
                      <p className="text-[11px] text-cyan-400 font-mono truncate">{selectedAgent.species}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        zooAudio.speakAgent(selectedAgent.id, `Hello! I am ${selectedAgent.name}. Ready for our mission.`)
                      }}
                      className="px-2.5 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Speak</span>
                    </button>
                    {mobileInspectorOpen && (
                      <button
                        onClick={() => setMobileInspectorOpen(false)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inspector Navigation Tabs */}
                <div className="flex items-center border-b border-white/[0.08] px-3 py-1 bg-black/20 gap-1 overflow-x-auto text-[11px]">
                  {[
                    { id: 'overview', label: 'Overview', icon: Compass },
                    { id: 'memory', label: 'Memory & LoRA', icon: Database },
                    { id: 'tools', label: 'Tools & MCP', icon: Code2 },
                    { id: 'cloud', label: 'microVM Telemetry', icon: Cpu },
                    { id: 'logs', label: 'Logs', icon: Terminal },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const active = inspectorTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setInspectorTab(tab.id as any)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                          active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Inspector Content Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                  {/* TAB: OVERVIEW */}
                  {inspectorTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Natural Role & Bio */}
                      <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Natural Role</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono">
                            Online
                          </span>
                        </div>
                        <p className="text-zinc-200 text-xs font-medium">{selectedAgent.naturalRole}</p>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">{selectedAgent.description}</p>
                      </div>

                      {/* Sovereign Weights & Brain */}
                      <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Brain & Weights</span>
                          <span className="text-[10px] text-cyan-400 font-mono">BitDelta Personalization</span>
                        </div>
                        <div className="flex items-center gap-2 text-white font-mono text-xs">
                          <Cpu className="h-4 w-4 text-cyan-400" />
                          <span>{selectedAgent.brain}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Runs sovereign inference on Hanzo Cloud microVM with zero external telemetry leakage.
                        </p>
                      </div>

                      {/* Current Job */}
                      <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Current Assignment</span>
                        <p className="text-xs text-white font-medium">{selectedAgent.currentJob}</p>
                      </div>
                    </div>
                  )}

                  {/* TAB: MEMORY & PERSONALIZATION */}
                  {inspectorTab === 'memory' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Personal Knowledge ({selectedAgent.knows.length})
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">ClickHouse + Vector</span>
                      </div>

                      <div className="space-y-2">
                        {selectedAgent.knows.map((k, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 text-zinc-300 flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-snug">{k}</span>
                          </div>
                        ))}
                      </div>

                      {/* Train New Memory Form */}
                      <form onSubmit={handleTrainMemory} className="p-3.5 rounded-2xl bg-[#0e1320] border border-cyan-500/30 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          Train Personal Knowledge & LoRA
                        </span>
                        <textarea
                          value={newMemoryText}
                          onChange={(e) => setNewMemoryText(e.target.value)}
                          placeholder="e.g. NOAA Station 47003 Beaufort Sea seasonal acoustic telemetry schema..."
                          rows={3}
                          className="w-full rounded-xl bg-black/50 border border-white/10 p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none font-sans"
                        />
                        <button
                          type="submit"
                          disabled={trainingStatus === 'training' || !newMemoryText.trim()}
                          className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {trainingStatus === 'training' ? (
                            <span>Fine-tuning weights...</span>
                          ) : trainingStatus === 'success' ? (
                            <span>✓ Memory Ingested into LoRA!</span>
                          ) : (
                            <span>Inject Knowledge</span>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB: TOOLS & MCP */}
                  {inspectorTab === 'tools' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Active Capabilities ({selectedAgent.tools.length})
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Model Context Protocol</span>
                      </div>

                      <div className="space-y-1.5">
                        {selectedAgent.tools.map((t, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between">
                            <span className="text-zinc-200 text-[11px] font-medium">{t}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-zinc-400">
                              mcp://ready
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Connect New Skill Form */}
                      <form onSubmit={handleTrainSkill} className="p-3.5 rounded-2xl bg-[#0e1320] border border-cyan-500/30 space-y-2">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Code2 className="h-3 w-3" />
                          Connect New MCP Tool / Skill
                        </span>
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g. S3 Parquet Analyzer, Web Scraper, Git Commit"
                          className="w-full rounded-xl bg-black/50 border border-white/10 p-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="submit"
                          disabled={trainingStatus === 'training' || !newSkillName.trim()}
                          className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Connect Tool</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB: CLOUD & TELEMETRY */}
                  {inspectorTab === 'cloud' && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between text-zinc-400 text-[10px]">
                          <span>MICROVM INSTANCE</span>
                          <span className="text-emerald-400">HEALTHY</span>
                        </div>
                        <p className="text-white text-[11px] font-bold">{selectedAgent.cloudMicroVm}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                          <span className="text-[9px] text-zinc-500 block">CPU LOAD</span>
                          <span className="text-cyan-300 font-bold text-sm">18.4%</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                          <span className="text-[9px] text-zinc-500 block">MEMORY</span>
                          <span className="text-white font-bold text-sm">2.1 / 16 GB</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1 text-[11px]">
                        <span className="text-[9px] text-zinc-500 block">S3 BUCKET PERSISTENCE</span>
                        <p className="text-zinc-300">s3://zoo-research-datasets/{selectedAgent.id}/</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-1 text-[11px]">
                        <span className="text-[9px] text-zinc-500 block">CLICKHOUSE DATASTORE</span>
                        <p className="text-zinc-300">datastore.zoo.internal:9000 (12.4M records)</p>
                      </div>
                    </div>
                  )}

                  {/* TAB: LOGS */}
                  {inspectorTab === 'logs' && (
                    <div className="rounded-2xl bg-black/80 border border-white/10 p-3 font-mono text-[10px] text-emerald-400 space-y-1.5 h-64 overflow-y-auto">
                      <p className="text-zinc-500">--- microVM sandbox boot sequence ---</p>
                      <p>[0.02s] Mounted rootfs at /var/lib/sovereign/{selectedAgent.id}</p>
                      <p>[0.05s] BitDelta LoRA adapter loaded (24MB weights)</p>
                      <p>[0.11s] Connected to Datastore pool at datastore.zoo.internal</p>
                      <p>[0.18s] MCP server registered 4 tools</p>
                      <p className="text-cyan-400">[0.25s] Agent {selectedAgent.name} is listening on multi-agent bus</p>
                      <p className="text-zinc-300">[1.42s] Executed task: Analyzing Cook Inlet population telemetry</p>
                      <p className="text-emerald-300">[2.10s] Status 200 OK • Ready for next prompt</p>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* ═══════════ TAB 2: ALL ANIMALS FLEET ═══════════ */}
          {activeTab === 'fleet' && (
            <div className="flex-1 bg-[#04060a] p-4 sm:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="h-4 w-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search creatures, skills, species..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {['all', 'researcher', 'architect', 'memory', 'strategy'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                          filterRole === role
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-5 rounded-2xl bg-[#090d15] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{agent.emoji}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                              <p className="text-[11px] text-cyan-400 font-mono">{agent.species}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono">
                            {agent.status}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{agent.description}</p>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[10px]">
                          <span className="text-zinc-500 block font-mono">CURRENT JOB</span>
                          <span className="text-zinc-300">{agent.currentJob}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedAgent(agent)
                            setActiveTab('graph')
                            zooAudio.playCue('click')
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
                        >
                          View in Graph →
                        </button>

                        <button
                          onClick={() => {
                            zooAudio.speakAgent(agent.id, `Hello! I am ${agent.name}.`)
                          }}
                          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TAB 3: CREATE NEW ANIMAL BUILDER ═══════════ */}
          {activeTab === 'builder' && (
            <div className="flex-1 bg-[#04060a] p-4 sm:p-8 overflow-y-auto flex items-center justify-center">
              <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#090d15] border border-white/10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Deploy Sovereign AI Animal
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Spawn an autonomous agent with personalized BitDelta weights, S3 persistence, and MCP tools.
                  </p>
                </div>

                {createdSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2">
                    <span className="text-4xl">🎉</span>
                    <h3 className="text-sm font-bold text-white">Animal Spawned Successfully!</h3>
                    <p className="text-xs text-emerald-300">Spinning up microVM and mounting Datastore...</p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateAnimal} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Maya the Seal"
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">Species</label>
                        <input
                          type="text"
                          required
                          value={newSpecies}
                          onChange={(e) => setNewSpecies(e.target.value)}
                          placeholder="e.g. Harbor Seal"
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">Emoji Icon</label>
                        <input
                          type="text"
                          required
                          value={newEmoji}
                          onChange={(e) => setNewEmoji(e.target.value)}
                          placeholder="🦭"
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">Archetype / Role</label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Researcher">Researcher</option>
                          <option value="Strategist">Strategist & Planner</option>
                          <option value="Software Engineer">Software Engineer</option>
                          <option value="Data Scientist">Data Scientist</option>
                          <option value="Designer">Designer & 3D Artist</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 mb-1">Seed Knowledge & Memory</label>
                      <textarea
                        value={newKnowledge}
                        onChange={(e) => setNewKnowledge(e.target.value)}
                        rows={2}
                        placeholder="Domain expertise to bake into BitDelta LoRA..."
                        className="w-full p-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
                      >
                        Deploy to MicroVM Fleet
                      </button>
                    </div>
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
