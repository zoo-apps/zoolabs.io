import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AnimalAgent {
  id: string
  name: string
  species: string
  emoji: string
  role: string
  description: string
  naturalRole: string
  avatar: string
  brain: string
  status: 'active' | 'idle' | 'busy' | 'delegating'
  currentJob?: string
  currentProgress?: number
  isSpeaking?: boolean
  knows: string[]
  tools: string[]
  canTalk: boolean
  canDelegateTo: string[]
  cloudMicroVm: string
  metrics: {
    runsCount: number
    tokensUsed: string
    latencyMs: number
    costUsd: string
    uptime: string
  }
}

export interface MissionTask {
  id: string
  title: string
  description?: string
  assignee: AnimalAgent | { id: string; name: string; emoji: string; role: string }
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  progress?: number
  linkedArtifact?: string
  causalDecisionId?: string
}

export interface MissionDecision {
  id: string
  scenario: string
  reasoning: string
  outcome: string
  confidence: number
  decidedBy: string
  timestamp: string
  causalType: 'CAUSED' | 'INFLUENCED' | 'PRECEDENT_FOR'
  downstreamImpact: string
  policyVerified: boolean
}

export interface ZooMission {
  id: string
  title: string
  emoji?: string
  category: 'Marine Biology' | 'Conservation' | 'Citizen Science' | 'Engineering' | 'Research'
  status: 'active' | 'in_progress' | 'review' | 'completed'
  progress: number
  habitat: string
  objective: string
  narrative: string
  leadAgentId: string
  assignedAnimalIds: string[]
  tasks: MissionTask[]
  evidence: {
    sourcesCount: number
    papers: { title: string; doi: string; author: string; year: number }[]
    datasets: { name: string; size: string; format: string; records: string; hash: string }[]
    hydrophones: { id: string; location: string; freq: string; status: string }[]
  }
  activeCanvas: 'habitat' | 'chart' | 'story' | 'code' | 'map'
  decisions: MissionDecision[]
  impact: {
    metric1?: { label: string; value: string }
    metric2?: { label: string; value: string }
    metric3?: { label: string; value: string }
    metric4?: { label: string; value: string }
    metric?: string
    target?: string
    current?: string
  }
}

export const ANIMAL_FLEET: AnimalAgent[] = [
  {
    id: 'blue',
    name: 'Blue the Beluga',
    species: 'Delphinapterus leucas',
    emoji: '🐋',
    role: 'Conversational Scientist & Host',
    naturalRole: 'Voice, conversation, teaching, multimodal interaction',
    description: 'Empathetic beluga scientist leading marine acoustics and multi-agent coordination.',
    avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Voice · BitDelta LoRA',
    status: 'active',
    currentJob: 'Guiding acoustic hydrophone analysis with Sarah & Raven',
    currentProgress: 88,
    knows: ['Marine bioacoustics', 'Arctic sea ice telemetry', 'ZOO documentation', 'Whale vocalizations'],
    tools: ['Web Search', 'Audio Synthesis', 'Echolocation Analyser', 'GitHub', 'Maps'],
    canTalk: true,
    canDelegateTo: ['raven', 'elephant', 'beaver'],
    cloudMicroVm: 'microvm-arctic-01 (beaufort.hanzo.cloud)',
    metrics: { runsCount: 1420, tokensUsed: '84.2M', latencyMs: 24, costUsd: '$3.42', uptime: '99.99%' },
  },
  {
    id: 'elephant',
    name: 'Ganesha the Elephant',
    species: 'Elephas maximus',
    emoji: '🐘',
    role: 'Data & Memory Custodian',
    naturalRole: 'Memory, datasets, long-term organizational knowledge',
    description: 'Ingests massive datasets, builds context graphs, and guarantees bi-temporal provenance.',
    avatar: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Datastore · ClickHouse ORM',
    status: 'busy',
    currentJob: 'Cleaning 10-year NOAA hydrophone dataset (1.4 TB)',
    currentProgress: 72,
    knows: ['ClickHouse Datastore', 'Bi-temporal graphs', 'W3C PROV-O lineage', 'NOAA Hydrophone archives'],
    tools: ['SQL Parser', 'Dataform Pipeline', 'Parquet Reader', 'Semantic Indexer'],
    canTalk: true,
    canDelegateTo: ['owl', 'fox'],
    cloudMicroVm: 'microvm-clickhouse-04 (ds.hanzo.cloud)',
    metrics: { runsCount: 3890, tokensUsed: '240.8M', latencyMs: 18, costUsd: '$8.15', uptime: '100%' },
  },
  {
    id: 'raven',
    name: 'Corvus the Raven',
    species: 'Corvus corax',
    emoji: '🐦',
    role: 'Discovery & Research Scholar',
    naturalRole: 'Research, literature synthesis, arXiv/bioRxiv extraction',
    description: 'Flies across scientific repositories, extracting insights, citations, and conflicting facts.',
    avatar: 'https://images.unsplash.com/photo-1520637736862-4d197d1e855a?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Scholar · RAG Engine',
    status: 'active',
    currentJob: 'Synthesized 32 papers on Arctic ship noise impact',
    currentProgress: 100,
    knows: ['arXiv & bioRxiv', 'PubMed', 'Semantic Scholar', 'Citation Graph Traversal'],
    tools: ['Web Fetch', 'PDF Parser', 'Deduplication Matcher', 'Arxiv Search'],
    canTalk: true,
    canDelegateTo: ['owl', 'beaver'],
    cloudMicroVm: 'microvm-research-03 (scholar.hanzo.cloud)',
    metrics: { runsCount: 2140, tokensUsed: '118.4M', latencyMs: 32, costUsd: '$4.80', uptime: '99.98%' },
  },
  {
    id: 'beaver',
    name: 'Castor the Beaver',
    species: 'Castor canadensis',
    emoji: '🦫',
    role: 'Infrastructure & App Builder',
    naturalRole: 'Building websites, apps, code patches, infrastructure',
    description: 'Constructs reactive interactive UIs, full-stack microVMs, and publishes live websites.',
    avatar: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Code · Sandbox Sandboxer',
    status: 'active',
    currentJob: 'Building interactive population chart & live web preview',
    currentProgress: 94,
    knows: ['Next.js React 19', 'Tailwind CSS', 'Hanzo Cloud API', 'Web Audio API', 'Three.js'],
    tools: ['Terminal Sandbox', 'Git Brancher', 'Hot Reloader', 'Vite Bundler'],
    canTalk: true,
    canDelegateTo: ['fox'],
    cloudMicroVm: 'microvm-sandbox-05 (build.hanzo.cloud)',
    metrics: { runsCount: 5200, tokensUsed: '312.0M', latencyMs: 15, costUsd: '$9.60', uptime: '99.99%' },
  },
  {
    id: 'tiger',
    name: 'Sher the Tiger',
    species: 'Panthera tigris',
    emoji: '🐅',
    role: 'Security & Threat Guardian',
    naturalRole: 'Security, threat detection, auditing, compliance',
    description: 'Audits sandboxes, checks secret permissions, and enforces zero-trust sandbox boundaries.',
    avatar: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 32B Sec · SAIF Policy Guard',
    status: 'idle',
    currentJob: 'Auditing microVM sandbox isolation and API token scopes',
    knows: ['SAIF Compliance', 'KMS Key destruction guards', 'OAuth2 / Passkeys', 'Network policies'],
    tools: ['Vulnerability Scanner', 'Secret Scrubber', 'Firewall Auditor'],
    canTalk: true,
    canDelegateTo: [],
    cloudMicroVm: 'microvm-sec-02 (guard.hanzo.cloud)',
    metrics: { runsCount: 940, tokensUsed: '42.1M', latencyMs: 12, costUsd: '$1.90', uptime: '100%' },
  },
  {
    id: 'octopus',
    name: 'Kraken the Octopus',
    species: 'Octopus vulgaris',
    emoji: '🐙',
    role: 'Multi-Agent Orchestrator',
    naturalRole: 'Multi-agent orchestration / many tools simultaneously',
    description: 'Coordinates 8 parallel subagent pipelines across cloud microVMs with zero latency.',
    avatar: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Router · Async Orchestrator',
    status: 'idle',
    currentJob: 'Managing parallel tasks across Raven, Elephant, and Beaver',
    knows: ['DAG Workflow Execution', 'Subagent Lifecycle', 'MicroVM Multiplexing'],
    tools: ['Agent Router', 'Task Queue', 'State Barrier', 'Metrics Collector'],
    canTalk: true,
    canDelegateTo: ['blue', 'raven', 'elephant', 'beaver', 'tiger', 'owl'],
    cloudMicroVm: 'microvm-orch-01 (mesh.hanzo.cloud)',
    metrics: { runsCount: 6810, tokensUsed: '410.2M', latencyMs: 8, costUsd: '$14.20', uptime: '100%' },
  },
  {
    id: 'owl',
    name: 'Athena the Owl',
    species: 'Athene noctua',
    emoji: '🦉',
    role: 'Scientific Reviewer & Logician',
    naturalRole: 'Review, reasoning and scientific validation',
    description: 'Enforces SHACL validation rules, evaluates hypotheses, and verifies peer-review integrity.',
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 70B Logic · SHACL Reasoner',
    status: 'idle',
    currentJob: 'Validating statistical confidence intervals on acoustic clusters',
    knows: ['Formal Logic', 'SHACL & OWL Schemas', 'Statistical Significance', 'Hypothesis Testing'],
    tools: ['SHACL Validator', 'Rete Engine', 'Hypothesis Checker'],
    canTalk: true,
    canDelegateTo: [],
    cloudMicroVm: 'microvm-reasoner-01 (logic.hanzo.cloud)',
    metrics: { runsCount: 1680, tokensUsed: '92.5M', latencyMs: 28, costUsd: '$3.80', uptime: '100%' },
  },
  {
    id: 'fox',
    name: 'Kitsune the Fox',
    species: 'Vulpes vulpes',
    emoji: '🦊',
    role: 'Root-Cause Debugger',
    naturalRole: 'Debugging and problem solving',
    description: 'Tracks down tricky bugs, solves complex edge cases, and writes automated regression tests.',
    avatar: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=400&auto=format&fit=crop&q=80',
    brain: 'ZenLM 32B Debug · Ast Analyzer',
    status: 'idle',
    currentJob: 'Inspecting FFT window overlap in Python spectrogram script',
    knows: ['TypeScript / Go / Python AST', 'Memory Leaks', 'CBP Tracing'],
    tools: ['GDB / Delve', 'Stacktrace Analyser', 'Automated Patch Tester'],
    canTalk: true,
    canDelegateTo: ['beaver'],
    cloudMicroVm: 'microvm-fox-01 (debug.hanzo.cloud)',
    metrics: { runsCount: 2950, tokensUsed: '142.0M', latencyMs: 20, costUsd: '$5.10', uptime: '99.99%' },
  },
]

export const INITIAL_MISSIONS: ZooMission[] = [
  {
    id: 'mission_arctic_belugas',
    title: 'Understand Declining Beluga Populations in the Arctic',
    emoji: '🐋',
    category: 'Marine Biology',
    status: 'active',
    progress: 68,
    habitat: 'Beaufort Sea, Arctic Ocean',
    objective: 'Analyze 10 years of passive acoustic hydrophone recordings to correlate ship noise, seasonal sea-ice loss, and vocalization patterns with calving rates.',
    narrative: 'A collaborative mission where marine scientists, students, and autonomous AI animal agents ingest 1.4 TB of underwater bioacoustic audio, reconstruct migration paths, and build an interactive public conservation portal.',
    leadAgentId: 'blue',
    assignedAnimalIds: ['blue', 'raven', 'elephant', 'beaver', 'owl'],
    tasks: [
      {
        id: 'TASK-101',
        title: 'Pull 10-year NOAA hydrophone dataset from Beaufort Sea arrays',
        description: 'Ingest raw WAV streams, calculate FFT spectrograms, and index in ClickHouse datastore.',
        assignee: ANIMAL_FLEET[1], // Elephant
        status: 'in_progress',
        priority: 'urgent',
        tags: ['Dataset', 'ClickHouse', 'Audio'],
        progress: 72,
        linkedArtifact: 'noaa_beaufort_2016_2026.parquet',
        causalDecisionId: 'DEC-01',
      },
      {
        id: 'TASK-102',
        title: 'Perform systematic literature review on Arctic ice loss vs whale calving',
        description: 'Synthesize 32 peer-reviewed papers on echolocation frequency shifts in noisy waters.',
        assignee: ANIMAL_FLEET[2], // Raven
        status: 'done',
        priority: 'high',
        tags: ['Literature', 'arXiv', 'bioRxiv'],
        progress: 100,
        linkedArtifact: 'arctic_noise_meta_analysis.pdf',
        causalDecisionId: 'DEC-02',
      },
      {
        id: 'TASK-103',
        title: 'Build interactive real-time population & spectrogram chart',
        description: 'Construct interactive canvas with zoomable timeline and audio waveform playback.',
        assignee: ANIMAL_FLEET[3], // Beaver
        status: 'in_progress',
        priority: 'high',
        tags: ['Frontend', 'React 19', 'Audio'],
        progress: 94,
        linkedArtifact: 'PopulationChart.tsx',
        causalDecisionId: 'DEC-03',
      },
      {
        id: 'TASK-104',
        title: 'Create illustrated citizen science story for K-12 classrooms',
        description: 'Explain beluga echolocation and sea ice changes in engaging illustrated story format.',
        assignee: ANIMAL_FLEET[0], // Blue
        status: 'in_progress',
        priority: 'medium',
        tags: ['Education', 'Kids', 'Story'],
        progress: 60,
        linkedArtifact: 'BelugaStorybook.pdf',
      },
      {
        id: 'TASK-105',
        title: 'Run SHACL consistency verification on causal reasoning chain',
        description: 'Verify that correlated noise factors meet W3C PROV-O provenance constraints.',
        assignee: ANIMAL_FLEET[6], // Owl
        status: 'todo',
        priority: 'high',
        tags: ['SHACL', 'Validation', 'Logic'],
        progress: 0,
      },
      {
        id: 'TASK-106',
        title: 'Publish peer-reviewed conservation policy brief to Arctic Council',
        description: 'Format findings into official Arctic Marine Protected Area recommendation.',
        assignee: { id: 'sarah_scientist', name: 'Dr. Sarah Lin', emoji: '👩‍🔬', role: 'Marine Biologist' },
        status: 'todo',
        priority: 'urgent',
        tags: ['Policy', 'Conservation', 'NGO'],
        progress: 10,
      },
    ],
    evidence: {
      sourcesCount: 84,
      papers: [
        { title: 'Anthropogenic Noise and Beluga Echolocation in the Beaufort Sea', doi: '10.1121/1.5094773', author: 'Lin, S. et al.', year: 2025 },
        { title: 'Decadal Telemetry of Beluga Migration Under Rapid Summer Sea-Ice Loss', doi: '10.1038/s41558-024-02119-x', author: 'Hauser, D. et al.', year: 2024 },
        { title: 'Machine Learning Classification of Whistle Types in Wild Odontocetes', doi: '10.1371/journal.pone.0289110', author: 'Castellote, M. et al.', year: 2023 },
      ],
      datasets: [
        { name: 'NOAA Beaufort Sea Hydrophone Audio (Array A-F)', size: '1.4 TB', format: 'FLAC / Parquet', records: '14,280 hours', hash: 'sha256:8f4c...91a2' },
        { name: 'National Snow and Ice Data Center Sea-Ice Index', size: '820 MB', format: 'NetCDF4', records: '3,650 days', hash: 'sha256:3e1a...40cb' },
        { name: 'Satellite Tag Argos Telemetry Tracking (120 Belugas)', size: '420 MB', format: 'GeoJSON', records: '284,000 pings', hash: 'sha256:7b92...88df' },
      ],
      hydrophones: [
        { id: 'HYD-BF-01', location: 'Beaufort Shelf (71.3° N, 154.2° W)', freq: '120 kHz Broadband', status: 'Online · Streaming' },
        { id: 'HYD-BF-02', location: 'Amundsen Gulf (70.1° N, 124.7° W)', freq: '96 kHz Array', status: 'Online · Streaming' },
        { id: 'HYD-BF-03', location: 'Mackenzie Estuary (69.4° N, 134.1° W)', freq: '192 kHz High-Res', status: 'Online · Streaming' },
      ],
    },
    activeCanvas: 'chart',
    decisions: [
      {
        id: 'DEC-01',
        scenario: 'Filter acoustic spectrogram noise from heavy container icebreakers',
        reasoning: 'Bandpass notch filter at 120-450 Hz preserves whistle harmonic overtones while eliminating engine propeller cavitation.',
        outcome: '99.4% vocalization recall retained across 14,000 audio hours.',
        confidence: 0.98,
        decidedBy: '🐘 Elephant + 🐋 Blue',
        timestamp: '14 mins ago',
        causalType: 'CAUSED',
        downstreamImpact: 'Enabled Raven to accurately count distinct whale contact calls.',
        policyVerified: true,
      },
      {
        id: 'DEC-02',
        scenario: 'Correlate calving drop with summer commercial shipping routes',
        reasoning: 'Synthesized 32 papers indicating mother-calf separation frequency quadruples when ship noise exceeds 135 dB.',
        outcome: 'Statistically significant causal relationship established (p < 0.001).',
        confidence: 0.95,
        decidedBy: '🐦 Raven + 🦉 Owl',
        timestamp: '8 mins ago',
        causalType: 'INFLUENCED',
        downstreamImpact: 'Drafted immediate 15-knot speed buffer recommendation for shipping corridor.',
        policyVerified: true,
      },
      {
        id: 'DEC-03',
        scenario: 'Render live dual-track visualizer with interactive bioacoustics',
        reasoning: 'Combines spectrogram canvas with population trend curve and Web Audio playback.',
        outcome: 'Deploys directly to shared Vibe room and interactive web app.',
        confidence: 0.99,
        decidedBy: '🦫 Beaver',
        timestamp: '2 mins ago',
        causalType: 'PRECEDENT_FOR',
        downstreamImpact: 'Powers the shared canvas in both Vibe and Work views.',
        policyVerified: true,
      },
    ],
    impact: {
      metric1: { label: 'Hydrophone Arrays', value: '14 Live Streams' },
      metric2: { label: 'Whale Calls Classified', value: '142,800 Calls' },
      metric3: { label: 'Classrooms Engaged', value: '28 Schools' },
      metric4: { label: 'Protected Corridor Proposed', value: '4,200 sq km' },
      metric: 'Protected Corridor Proposed',
      target: '5,000 sq km',
      current: '4,200 sq km',
    },
  },
  {
    id: 'mission_maui_corals',
    title: 'Map Coral Bleaching & Reef Acoustics Around Maui',
    emoji: '🪸',
    category: 'Conservation',
    status: 'in_progress',
    progress: 45,
    habitat: 'Olowalu & Molokini Reefs, Maui, Hawaii',
    objective: 'Track reef ecosystem acoustic bio-diversity recovery using underwater soundscapes and drone multispectral imagery.',
    narrative: 'Monitoring coral larvae recruitment and fish biodiversity sounds to prioritize reef restoration zones.',
    leadAgentId: 'octopus',
    assignedAnimalIds: ['octopus', 'blue', 'elephant', 'beaver'],
    tasks: [],
    evidence: { sourcesCount: 42, papers: [], datasets: [], hydrophones: [] },
    activeCanvas: 'map',
    decisions: [],
    impact: {
      metric1: { label: 'Reef Area Surveyed', value: '850 Hectares' },
      metric2: { label: 'Bioacoustic Index', value: '+34% Health' },
      metric3: { label: 'Citizen Observers', value: '410 Divers' },
      metric4: { label: 'Coral Outplants', value: '12,500 Frags' },
      metric: 'Reef Restoration Health',
      target: '+50%',
      current: '+34%',
    },
  },
  {
    id: 'mission_monarch_sanctuary',
    title: 'Protect California Monarch Butterfly Coastal Habitats',
    emoji: '🦋',
    category: 'Conservation',
    status: 'in_progress',
    progress: 58,
    habitat: 'Pacific Grove & Santa Cruz, California',
    objective: 'Identify critical eucalyptus and native milkweed corridors to protect overwintering western monarch clusters.',
    narrative: 'Connecting community school observations with satellite canopy temperature models.',
    leadAgentId: 'raven',
    assignedAnimalIds: ['raven', 'tiger', 'beaver'],
    tasks: [],
    evidence: { sourcesCount: 56, papers: [], datasets: [], hydrophones: [] },
    activeCanvas: 'story',
    decisions: [],
    impact: {
      metric1: { label: 'Milkweed Corridors', value: '12 Acres' },
      metric2: { label: 'Monarchs Counted', value: '24,600' },
      metric3: { label: 'Schools Participating', value: '18 Districts' },
      metric4: { label: 'Canopy Preserved', value: '98.5%' },
      metric: 'Monarch Canopy Preserved',
      target: '100%',
      current: '98.5%',
    },
  },
]

interface ZooMissionsContextType {
  missions: ZooMission[]
  activeMission: ZooMission
  setActiveMissionId: (id: string) => void
  agents: AnimalAgent[]
  updateTaskStatus: (taskId: string, status: MissionTask['status']) => void
  updateTaskAssignee: (taskId: string, agentId: string) => void
  addTask: (task: Omit<MissionTask, 'id'>) => void
  setActiveCanvas: (canvas: ZooMission['activeCanvas']) => void
  addAnimalAgent: (agent: Omit<AnimalAgent, 'id' | 'metrics'>) => void
  addMissionDecision: (decision: Omit<MissionDecision, 'id' | 'timestamp'>) => void
}

const ZooMissionsContext = createContext<ZooMissionsContextType | null>(null)

export function ZooMissionsProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<ZooMission[]>(INITIAL_MISSIONS)
  const [activeMissionId, setActiveMissionId] = useState<string>('mission_arctic_belugas')
  const [agents, setAgents] = useState<AnimalAgent[]>(ANIMAL_FLEET)

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0]

  const updateTaskStatus = (taskId: string, status: MissionTask['status']) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== activeMission.id) return m
        const updatedTasks = m.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
        const doneCount = updatedTasks.filter((t) => t.status === 'done').length
        const newProgress = Math.round((doneCount / (updatedTasks.length || 1)) * 100)
        return { ...m, tasks: updatedTasks, progress: newProgress }
      })
    )
  }

  const updateTaskAssignee = (taskId: string, agentId: string) => {
    const targetAgent = agents.find((a) => a.id === agentId)
    if (!targetAgent) return

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== activeMission.id) return m
        const updatedTasks = m.tasks.map((t) =>
          t.id === taskId ? { ...t, assignee: targetAgent } : t
        )
        return { ...m, tasks: updatedTasks }
      })
    )
  }

  const addTask = (task: Omit<MissionTask, 'id'>) => {
    const newId = `TASK-${Date.now().toString().slice(-3)}`
    const newTask: MissionTask = { ...task, id: newId }

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== activeMission.id) return m
        const updatedTasks = [newTask, ...m.tasks]
        return { ...m, tasks: updatedTasks }
      })
    )
  }

  const setActiveCanvas = (canvas: ZooMission['activeCanvas']) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === activeMission.id ? { ...m, activeCanvas: canvas } : m))
    )
  }

  const addAnimalAgent = (agent: Omit<AnimalAgent, 'id' | 'metrics'>) => {
    const newAgent: AnimalAgent = {
      ...agent,
      id: agent.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4),
      metrics: { runsCount: 1, tokensUsed: '12.4K', latencyMs: 22, costUsd: '$0.05', uptime: '100%' },
    }
    setAgents((prev) => [...prev, newAgent])
  }

  const addMissionDecision = (decision: Omit<MissionDecision, 'id' | 'timestamp'>) => {
    const newDecision: MissionDecision = {
      ...decision,
      id: `DEC-${Date.now().toString().slice(-3)}`,
      timestamp: 'Just now',
    }

    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== activeMission.id) return m
        return { ...m, decisions: [newDecision, ...m.decisions] }
      })
    )
  }

  return (
    <ZooMissionsContext.Provider
      value={{
        missions,
        activeMission,
        setActiveMissionId,
        agents,
        updateTaskStatus,
        updateTaskAssignee,
        addTask,
        setActiveCanvas,
        addAnimalAgent,
        addMissionDecision,
      }}
    >
      {children}
    </ZooMissionsContext.Provider>
  )
}

export function useZooMissions() {
  const context = useContext(ZooMissionsContext)
  if (!context) {
    throw new Error('useZooMissions must be used within a ZooMissionsProvider')
  }
  return context
}
