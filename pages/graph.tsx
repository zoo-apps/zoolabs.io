import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Network,
  Share2,
  Search,
  Bot,
  Database,
  FileText,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Info,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { useZooMissions } from '../lib/zoo-missions-context'
import { zooAudio } from '../lib/audio-engine'

export default function GraphExplorerPage() {
  const { activeMission, agents } = useZooMissions()
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [graphFilter, setGraphFilter] = useState<'all' | 'agents' | 'missions' | 'decisions' | 'datasets'>('all')

  // Synthetic Graph Nodes & Edges based on Semantica AGI architecture
  const NODES = [
    { id: 'm-beluga', type: 'mission', label: 'Arctic Belugas Mission', emoji: '🎯', status: 'In Progress (68%)', layer: 'Core' },
    { id: 'a-blue', type: 'agent', label: 'Blue the Beluga', emoji: '🐋', role: 'Voice & Lead Scientist', layer: 'Agents' },
    { id: 'a-elephant', type: 'agent', label: 'Ganesha Elephant', emoji: '🐘', role: 'ClickHouse Custodian', layer: 'Agents' },
    { id: 'a-raven', type: 'agent', label: 'Corvus Raven', emoji: '🐦', role: 'Literature Scholar', layer: 'Agents' },
    { id: 'a-beaver', type: 'agent', label: 'Castor Beaver', emoji: '🦫', role: 'Frontend & Charts', layer: 'Agents' },
    { id: 'a-owl', type: 'agent', label: 'Athena Owl', emoji: '🦉', role: 'Scientific Auditor', layer: 'Agents' },
    { id: 'ds-noaa', type: 'dataset', label: 'NOAA 14.2k Hr Hydrophone Audio', emoji: '📊', size: '1.4 TB', layer: 'Evidence' },
    { id: 'ds-papers', type: 'dataset', label: '32 Arctic Marine Biology Papers', emoji: '📚', size: '32 Items', layer: 'Evidence' },
    { id: 'dec-01', type: 'decision', label: 'DEC-01: Apply 120Hz Notch Filter', emoji: '⚖️', by: 'Blue -> Elephant', layer: 'Decisions' },
    { id: 'dec-02', type: 'decision', label: 'DEC-02: Publish K-12 Storybook', emoji: '⚖️', by: 'Blue -> Beaver', layer: 'Decisions' },
    { id: 'dec-03', type: 'decision', label: 'DEC-03: Propose 15-Knot Speed Limit', emoji: '⚖️', by: 'Athena -> Council', layer: 'Decisions' },
  ]

  const EDGES = [
    { from: 'a-blue', to: 'm-beluga', relation: 'LEADS', type: 'influence' },
    { from: 'a-elephant', to: 'm-beluga', relation: 'PROCESSES', type: 'causal' },
    { from: 'a-raven', to: 'm-beluga', relation: 'RESEARCHES', type: 'causal' },
    { from: 'a-beaver', to: 'm-beluga', relation: 'BUILDS', type: 'causal' },
    { from: 'a-elephant', to: 'ds-noaa', relation: 'INGESTS', type: 'data' },
    { from: 'a-raven', to: 'ds-papers', relation: 'EXTRACTS_EVIDENCE', type: 'data' },
    { from: 'dec-01', to: 'ds-noaa', relation: 'PROVENANCE_OF', type: 'decision' },
    { from: 'dec-01', to: 'a-elephant', relation: 'EXECUTED_BY', type: 'decision' },
    { from: 'dec-02', to: 'a-beaver', relation: 'DELEGATED_TO', type: 'decision' },
    { from: 'dec-03', to: 'm-beluga', relation: 'OUTCOME_OF', type: 'decision' },
  ]

  const filteredNodes = NODES.filter((n) => {
    if (graphFilter === 'all') return true
    if (graphFilter === 'agents') return n.type === 'agent'
    if (graphFilter === 'missions') return n.type === 'mission'
    if (graphFilter === 'decisions') return n.type === 'decision'
    if (graphFilter === 'datasets') return n.type === 'dataset'
    return true
  })

  useEffect(() => {
    setSelectedNode(NODES[0])
  }, [])

  return (
    <>
      <Head>
        <title>Semantica Graph — Knowledge & Decision Intelligence | Zoo Labs</title>
        <meta
          name="description"
          content="Interactive knowledge graph, decision causal chains, and W3C PROV-O provenance explorer."
        />
      </Head>

      <div className="h-screen w-screen overflow-hidden bg-[#05070a] text-zinc-100 font-sans select-none flex flex-col">
        {/* Top App Chrome */}
        <ZooAppChrome minimal={false} />

        {/* Subheader */}
        <header className="h-12 border-b border-white/[0.08] bg-[#090c12] px-6 flex items-center justify-between shrink-0 z-40 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-purple-400" />
              <h1 className="font-bold text-white">Semantica Decision & Context Graph</h1>
            </div>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400 font-mono text-[11px]">ForceAtlas2 • W3C PROV-O Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center rounded-xl bg-zinc-900 border border-white/10 p-0.5 text-[11px]">
              {(['all', 'agents', 'missions', 'decisions', 'datasets'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setGraphFilter(f)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    graphFilter === f ? 'bg-zinc-800 text-white font-semibold shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Graph Workbench */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center Interactive Graph Canvas */}
          <main className="flex-1 bg-[#040609] relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              <defs>
                <linearGradient id="edgePurple" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Connecting lines across key nodes */}
              <line x1="50%" y1="50%" x2="25%" y2="35%" stroke="url(#edgePurple)" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="75%" y2="35%" stroke="url(#edgePurple)" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="25%" y2="65%" stroke="url(#edgePurple)" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="50%" y1="50%" x2="75%" y2="65%" stroke="url(#edgePurple)" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* Nodes Grid Display */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full">
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id

                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setSelectedNode(n)
                      zooAudio.playCue('ping')
                    }}
                    className={`p-4 rounded-2xl text-left transition-all backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-3 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-purple-400 bg-zinc-900 ring-4 ring-purple-500/20 scale-105'
                        : 'border border-white/10 bg-zinc-950/80 hover:border-white/30 hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{n.emoji}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 border border-white/10 text-zinc-400 capitalize">
                        {n.type}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs leading-tight">{n.label}</h4>
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{n.role || n.size || n.by || n.status}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span>Layer: {n.layer}</span>
                      <span className="text-purple-400">PROV-O</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </main>

          {/* Right Inspector: Semantica Entity & Lineage Detail */}
          {selectedNode && (
            <aside className="w-80 lg:w-96 border-l border-white/[0.08] bg-[#07090e] p-5 flex flex-col justify-between shrink-0 overflow-y-auto space-y-5">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{selectedNode.emoji}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-[10px] font-mono text-purple-300 capitalize">
                      {selectedNode.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{selectedNode.label}</h3>
                  <p className="text-xs text-zinc-400 font-mono">{selectedNode.id}</p>
                </div>

                {/* Provenance & Decision Chain Trace */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    <span>Decision Chain & Causal Lineage</span>
                  </h4>

                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">prov:wasAssociatedWith</span>
                      <span className="text-cyan-400">agent:blue-beluga</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">prov:used</span>
                      <span className="text-emerald-400">dataset:noaa-hydrophones</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">prov:wasGeneratedBy</span>
                      <span className="text-purple-400">activity:zen-inference</span>
                    </div>
                  </div>
                </div>

                {/* Connected Relationships */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-zinc-300 uppercase tracking-wider text-[10px]">
                    Connected Edges ({EDGES.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).length})
                  </h4>
                  <div className="space-y-1.5">
                    {EDGES.filter((e) => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-purple-300">{edge.relation}</span>
                        <span className="text-zinc-400">{edge.from === selectedNode.id ? edge.to : edge.from}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/vibe"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30"
                >
                  <span>Open in /vibe Studio</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
