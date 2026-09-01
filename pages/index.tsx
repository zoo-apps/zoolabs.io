import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Sparkles,
  Send,
  Plus,
  Mic,
  Globe,
  Settings2,
  ChevronDown,
  ArrowRight,
  Maximize2,
  Volume2,
  VolumeX,
  X,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  Wrench,
  Zap,
  Trash2,
  MessageSquare,
  ShieldCheck,
  Play,
  Pause,
  Layers,
  ChevronUp,
  UserPlus,
  Sliders,
  Share2,
  FileText,
  Database,
  ExternalLink,
  CreditCard,
  Wallet,
  Heart,
  CheckCircle2,
  Clock,
  Radio,
  BarChart2,
  Image as ImageIcon,
  BookOpen,
  Tag,
  Paperclip,
  AtSign,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { zooAudio } from '../lib/audio-engine'
import { useZooMissions, ANIMAL_FLEET, AnimalAgent } from '../lib/zoo-missions-context'
import { streamChatCompletion, getBackendBaseUrl } from '../lib/hanzo-ai-service'

// Types for Chat & Messages
export type ChatMessage = {
  id: string
  sender: 'user' | 'agent' | 'system'
  agentId?: string
  senderName: string
  avatar: string
  role?: string
  emoji?: string
  timestamp: string
  content: string
  toolExecuted?: {
    name: string
    plugin: string
    durationMs: number
    resultSnippet?: string
  }
  skillsUsed?: string[]
  plan?: { text: string; status: 'done' | 'in_progress' | 'queued' }[]
  previewChart?: boolean
  tasksProgress?: { title: string; progress: number; timeEstimate: string }[]
  codeSnippet?: { language: string; code: string }
}

export interface ChatSession {
  id: string
  title: string
  agentId: string
  category: 'today' | 'yesterday' | 'this_week'
  updatedAt: number
  timeLabel: string
  messages: ChatMessage[]
}

const STATIC_VIDEO_CLIPS = [
  '/bg_video/static/relactation0.mp4',
  '/bg_video/static/relactation1.mp4',
  '/bg_video/static/relactation2.mp4',
  '/bg_video/static/relactation3.mp4',
]

// Kid-Friendly & Scientific Starters per Agent (Spacious 5 +/- 3 items)
const AGENT_STARTERS: Record<string, { icon: string; title: string; prompt: string }[]> = {
  blue: [
    {
      icon: '🐋',
      title: 'Beluga Whale Songs',
      prompt: 'Why do beluga whales love singing and making chirp sounds underwater?',
    },
    {
      icon: '🌊',
      title: 'Cook Inlet & Beaufort Oceans',
      prompt: 'How do belugas navigate through thick Arctic sea ice using echolocation clicks?',
    },
    {
      icon: '🎵',
      title: 'Underwater Acoustics',
      prompt: 'What kinds of sounds do ships make, and how can we protect whale nursery zones?',
    },
    {
      icon: '🤝',
      title: 'Pod Teamwork',
      prompt: 'How do beluga mothers teach their calves special contact whistles?',
    },
  ],
  wolf: [
    {
      icon: '🐺',
      title: 'Wolf Pack Communication',
      prompt: 'How do wolves talk to each other with howls across snowy mountains?',
    },
    {
      icon: '❄️',
      title: 'Arctic Survival',
      prompt: 'How do arctic wolves stay warm in freezing -40°C blizzards?',
    },
    {
      icon: '📚',
      title: 'Wildlife Research Archive',
      prompt: 'Extract recent research findings on pack territory coordination and hunting trails.',
    },
  ],
  elephant: [
    {
      icon: '🐘',
      title: 'Ground Rumbles & Big Ears',
      prompt: 'Can elephants really feel low-frequency sound vibrations through their feet?',
    },
    {
      icon: '🧠',
      title: 'Elephant Memory',
      prompt: 'How do elephant matriarchs remember water holes hundreds of miles away for decades?',
    },
    {
      icon: '🗄️',
      title: 'ClickHouse Datastore',
      prompt: 'Show me how we index millions of hours of ocean hydrophone recordings in our memory bank.',
    },
  ],
  hippo: [
    {
      icon: '🦛',
      title: 'Riverbed Running',
      prompt: 'Can hippos swim or do they bounce along the bottom of the river?',
    },
    {
      icon: '🎨',
      title: 'Interactive 3D Canvas',
      prompt: 'Build an interactive ocean soundwave canvas with colorful spectrogram ripples.',
    },
    {
      icon: '🛡️',
      title: 'Natural Sunscreen',
      prompt: 'Why do hippos secrete pink "blood sweat" to protect their skin from the sun?',
    },
  ],
  giraffe: [
    {
      icon: '🦒',
      title: 'Tall Horizons & Sleep',
      prompt: 'Why are giraffes so tall, and how do they sleep standing up for only 30 minutes a day?',
    },
    {
      icon: '🌿',
      title: 'Acacia Leaf Defense',
      prompt: 'Why are giraffe tongues dark purple and 45 centimeters long?',
    },
    {
      icon: '🗺️',
      title: '2030 Conservation Plan',
      prompt: 'Draft a big-picture plan to protect wildlife corridors across national parks.',
    },
  ],
  rhino: [
    {
      icon: '🦏',
      title: 'Ancient Horns & Armor',
      prompt: 'What are rhino horns made of and why do rhinos love taking mud baths?',
    },
    {
      icon: '🔍',
      title: 'Scientific Logic Audit',
      prompt: 'Verify our wildlife conservation facts to make sure every single claim is 100% true.',
    },
  ],
  tiger: [
    {
      icon: '🐅',
      title: 'Night Vision & Swimming',
      prompt: 'Why do tigers love swimming in rivers unlike most other cats?',
    },
    {
      icon: '🔒',
      title: 'Safe AI Sandbox',
      prompt: 'Explain how our private microVM keeps children and researchers safe with zero tracking.',
    },
  ],
  leopard: [
    {
      icon: '🐆',
      title: 'Tree Climbing Power',
      prompt: 'How are leopards strong enough to carry heavy things straight up into tall trees?',
    },
    {
      icon: '⚡',
      title: 'Fast Problem Detective',
      prompt: 'Trace an ocean sound anomaly and figure out exactly what made the noise.',
    },
  ],
}

// Initial Seed Conversations with Grouped Categories
const INITIAL_CONVERSATIONS: ChatSession[] = [
  {
    id: 'conv_beluga_research',
    title: 'Investigate declining beluga populations',
    agentId: 'blue',
    category: 'today',
    updatedAt: Date.now() - 1000 * 60 * 2,
    timeLabel: '2m ago',
    messages: [
      {
        id: 'msg_u1',
        sender: 'user',
        senderName: 'You',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        timestamp: '10:21 AM',
        content: 'Blue, investigate why beluga populations are declining in the Cook Inlet and create an interactive report that kids can understand.',
      },
      {
        id: 'msg_a1',
        sender: 'agent',
        agentId: 'blue',
        senderName: 'Blue',
        role: 'Lead researcher',
        avatar: '/bg_video/static/relactation0.mp4',
        emoji: '🐋',
        timestamp: '10:21 AM',
        content: `On it! I'll research the key factors affecting beluga populations in Cook Inlet and build an interactive report that's engaging and easy for kids to understand.\n\nHere's my plan:\nI'll update you as I go. Anything specific you want me to focus on?`,
        plan: [
          { text: 'Gather population data and trends', status: 'done' },
          { text: 'Identify threats and human impact', status: 'in_progress' },
          { text: 'Find conservation efforts', status: 'queued' },
          { text: 'Create kid-friendly interactive report', status: 'queued' },
        ],
        tasksProgress: [
          { title: 'Analyzing population data (NOAA)', progress: 72, timeEstimate: '2m left' },
          { title: 'Searching recent research papers', progress: 45, timeEstimate: '3m left' },
          { title: 'Compiling human impact factors', progress: 0, timeEstimate: 'Queued' },
        ],
        previewChart: true,
        skillsUsed: ['Marine Bioacoustics', 'NOAA Data Ingestion', 'Interactive Visualizer'],
        toolExecuted: {
          name: 'Bioacoustics FFT & Population Trend Ingester',
          plugin: 'ZenLM 70B Voice',
          durationMs: 24,
          resultSnippet: 'Ingested Cook Inlet NOAA time-series (1979-2024)',
        },
      },
    ],
  },
  {
    id: 'conv_what_belugas_eat',
    title: 'What do belugas eat?',
    agentId: 'blue',
    category: 'today',
    updatedAt: Date.now() - 1000 * 60 * 45,
    timeLabel: '45m ago',
    messages: [
      {
        id: 'msg_u_eat',
        sender: 'user',
        senderName: 'You',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        timestamp: '09:40 AM',
        content: 'What kinds of food do beluga whales hunt in the ocean?',
      },
      {
        id: 'msg_a_eat',
        sender: 'agent',
        agentId: 'blue',
        senderName: 'Blue',
        role: 'Lead researcher',
        avatar: '/bg_video/static/relactation0.mp4',
        emoji: '🐋',
        timestamp: '09:40 AM',
        content: `Belugas love eating delicious salmon, arctic cod, herring, shrimp, squid, and crabs! 🐟🦑\n\nBecause we don't have sharp chewing teeth, we use gentle suction to pull fish right into our mouths. Under the ice, we can dive down hundreds of feet to hunt along the ocean floor!`,
        skillsUsed: ['Marine Ecology', 'Prey Distribution'],
      },
    ],
  },
  {
    id: 'conv_kids_infographic',
    title: 'Create kids infographic',
    agentId: 'blue',
    category: 'today',
    updatedAt: Date.now() - 1000 * 60 * 60 * 1,
    timeLabel: '1h ago',
    messages: [],
  },
  {
    id: 'conv_ocean_noise',
    title: 'Ocean noise impact',
    agentId: 'wolf',
    category: 'today',
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    timeLabel: '3h ago',
    messages: [],
  },
  {
    id: 'conv_interview_dr_moore',
    title: 'Interview Dr. Moore',
    agentId: 'wolf',
    category: 'yesterday',
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    timeLabel: 'Yesterday',
    messages: [],
  },
  {
    id: 'conv_generate_report',
    title: 'Generate report outline',
    agentId: 'elephant',
    category: 'yesterday',
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    timeLabel: 'Yesterday',
    messages: [],
  },
  {
    id: 'conv_best_time_whales',
    title: 'Best time to see whales?',
    agentId: 'blue',
    category: 'yesterday',
    updatedAt: Date.now() - 1000 * 60 * 60 * 28,
    timeLabel: 'Yesterday',
    messages: [],
  },
  {
    id: 'conv_arctic_sea_ice',
    title: 'Arctic sea ice trends',
    agentId: 'giraffe',
    category: 'this_week',
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
    timeLabel: '2d ago',
    messages: [],
  },
  {
    id: 'conv_shipping_traffic',
    title: 'Shipping traffic data',
    agentId: 'elephant',
    category: 'this_week',
    updatedAt: Date.now() - 1000 * 60 * 60 * 50,
    timeLabel: '2d ago',
    messages: [],
  },
  {
    id: 'conv_explain_echolocation',
    title: 'Explain echolocation',
    agentId: 'blue',
    category: 'this_week',
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    timeLabel: '3d ago',
    messages: [],
  },
]

export default function ChatPage() {
  const router = useRouter()
  const { activeMission } = useZooMissions()

  // Persistent Chat Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_CONVERSATIONS)
  const [activeSessionId, setActiveSessionId] = useState<string>('conv_beluga_research')
  const [selectedAgentId, setSelectedAgentId] = useState<string>('blue')

  // Animal Age / Life-Stage Selector for 3D Models (Baby, Teen, Adult)
  const [animalStage, setAnimalStage] = useState<'baby' | 'teen' | 'adult'>('adult')

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [rightInspectorOpen, setRightInspectorOpen] = useState<boolean>(true)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [isVoiceListening, setIsVoiceListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null)
  const [agentSelectorOpen, setAgentSelectorOpen] = useState(false)
  const [multiAgentPodOpen, setMultiAgentPodOpen] = useState(false)
  const [devConsoleOpen, setDevConsoleOpen] = useState(false)
  const [activeDevTab, setActiveDevTab] = useState<'overview' | 'skills' | 'microvm'>('overview')
  const [webSearchEnabled, setWebSearchEnabled] = useState(true)
  const [deepResearchOpen, setDeepResearchOpen] = useState(false)
  const [selectedModelName, setSelectedModelName] = useState('Deep Research')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  // Org Switcher & Top-Up / Staking State
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const [activeOrg, setActiveOrg] = useState<{
    id: string
    name: string
    type: 'team' | 'personal'
    badge: string
    credits: number
    balanceUsd: string
  }>({
    id: 'zoo_labs_foundation',
    name: 'ZOO Labs',
    type: 'team',
    badge: '501(c)(3) Foundation',
    credits: 1250,
    balanceUsd: '$12.50',
  })

  // Payment, Donate & Invite Modals
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('25')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto'>('card')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const currentVideoClip = STATIC_VIDEO_CLIPS[currentVideoIndex % STATIC_VIDEO_CLIPS.length]

  // Active Session and current agent
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]
  const currentAgent: AnimalAgent =
    ANIMAL_FLEET.find((a) => a.id === selectedAgentId) || ANIMAL_FLEET[0]

  const messages = currentSession?.messages || []

  const scrollerRef = useRef<HTMLDivElement>(null)
  const cinematicScrollerRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount and detect screen size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
        setRightInspectorOpen(false)
      } else if (window.innerWidth < 1280) {
        setRightInspectorOpen(false)
      }
    }
    try {
      const saved = localStorage.getItem('zoo_chat_sessions_v3')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed)
          setActiveSessionId(parsed[0].id)
          setSelectedAgentId(parsed[0].agentId || 'blue')
        }
      }
    } catch (e) {
      console.warn('Could not load sessions from localStorage', e)
    }
  }, [])

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
    }
    if (cinematicScrollerRef.current) {
      cinematicScrollerRef.current.scrollTop = cinematicScrollerRef.current.scrollHeight
    }
  }, [messages, busy])

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated)
    try {
      localStorage.setItem('zoo_chat_sessions_v3', JSON.stringify(updated))
    } catch (e) {
      console.warn('Could not save sessions to localStorage', e)
    }
  }

  // Create brand new conversation
  const handleNewConversation = () => {
    const newId = `conv_${Date.now()}`
    const newSession: ChatSession = {
      id: newId,
      title: 'New Animal Exploration',
      agentId: selectedAgentId,
      category: 'today',
      updatedAt: Date.now(),
      timeLabel: 'Just now',
      messages: [],
    }
    const updated = [newSession, ...sessions]
    saveSessions(updated)
    setActiveSessionId(newId)
    setInput('')
    zooAudio.playCue('join')
  }

  // Delete conversation
  const handleDeleteConversation = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation()
    const updated = sessions.filter((s) => s.id !== idToDelete)
    if (updated.length === 0) {
      const fallback: ChatSession = {
        id: `conv_${Date.now()}`,
        title: 'New Exploration',
        agentId: 'blue',
        category: 'today',
        updatedAt: Date.now(),
        timeLabel: 'Just now',
        messages: [],
      }
      saveSessions([fallback])
      setActiveSessionId(fallback.id)
      setSelectedAgentId('blue')
    } else {
      saveSessions(updated)
      if (activeSessionId === idToDelete) {
        setActiveSessionId(updated[0].id)
        setSelectedAgentId(updated[0].agentId || 'blue')
      }
    }
    zooAudio.playCue('leave')
  }

  // Generate realistic agent reply
  const generateAgentResponse = (userPrompt: string, targetAgent: AnimalAgent): ChatMessage => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    switch (targetAgent.id) {
      case 'wolf':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'wolf',
          senderName: 'Fenrir the Wolf',
          role: 'Discovery & Research Scholar',
          avatar: targetAgent.avatar,
          emoji: '🐺',
          timestamp,
          content: `Here is what our wildlife science archive shows about "${userPrompt}":\n\nWolves live and travel in close family packs of 4 to 15 members. By using acoustic howls, scent trails, and body posture, packs maintain harmony, share food, and protect vast territories without fighting. Each pack member plays an important role! 🐺🌲`,
          skillsUsed: ['ArXiv Wildlife Literature', 'Pack Social Hierarchy', 'Acoustic RAG'],
          toolExecuted: {
            name: 'arXiv & bioRxiv Extractor',
            plugin: 'Scholar RAG MCP v2.4',
            durationMs: 34,
            resultSnippet: 'Extracted 14 peer-reviewed citations on pack dynamics',
          },
        }

      case 'elephant':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'elephant',
          senderName: 'Ganesha the Elephant',
          role: 'Data & Memory Custodian',
          avatar: targetAgent.avatar,
          emoji: '🐘',
          timestamp,
          content: `From our ClickHouse long-term datastore regarding "${userPrompt}":\n\nElephants communicate over miles using 14-24 Hz infrasonic ground waves. The matriarch preserves a mental map of watering holes, migration corridors, and safe zones across generations. In our Zoo knowledge bank, this memory is indexed with bi-temporal provenance! 🐘📊`,
          skillsUsed: ['ClickHouse Datastore', 'Infrasound Analysis', 'Lineage Graph'],
          toolExecuted: {
            name: 'ClickHouse Columnar Query',
            plugin: 'Datastore MCP',
            durationMs: 18,
            resultSnippet: 'Ingested & queried 1.4 TB NOAA hydrophone recordings',
          },
        }

      case 'giraffe':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'giraffe',
          senderName: 'Twiga the Giraffe',
          role: 'Big-Picture Strategist',
          avatar: targetAgent.avatar,
          emoji: '🦒',
          timestamp,
          content: `Looking at the macro ecological horizon for "${userPrompt}":\n\nGiraffes maintain ecosystem balance by browsing top acacia canopies that no other herbivore can reach. For long-term 2030 wildlife survival, establishing cross-border migratory corridors with acoustic telemetry is key! 🦒🗺️`,
          skillsUsed: ['Strategic Forecasting', 'Macro Ecology', 'Multi-Agent Alignment'],
          toolExecuted: {
            name: 'Roadmap & Scenario Simulator',
            plugin: 'Strategic Planner MCP',
            durationMs: 22,
            resultSnippet: 'Simulated 10-year conservation corridor scenario',
          },
        }

      case 'hippo':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'hippo',
          senderName: 'Kiboko the Hippo',
          role: 'Infrastructure & App Builder',
          avatar: targetAgent.avatar,
          emoji: '🦛',
          timestamp,
          content: `Constructed interactive components for "${userPrompt}":\n\nHippos gallop across river bottoms at 5 mph (8 km/h). I have deployed a reactive WebGL canvas and S3 audio stream so you can visualize and listen to underwater hydrophone telemetry in real-time! 🦛⚡`,
          skillsUsed: ['Next.js React 19', 'Tailwind CSS', 'S3 Storage', 'WebGL Canvas'],
          toolExecuted: {
            name: 'Terminal Sandbox & Hot Reloader',
            plugin: 'Sandbox MCP',
            durationMs: 15,
            resultSnippet: 'Compiled live spectrogram shaders on microVM-05',
          },
        }

      case 'tiger':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'tiger',
          senderName: 'Sher the Tiger',
          role: 'Security & Threat Guardian',
          avatar: targetAgent.avatar,
          emoji: '🐅',
          timestamp,
          content: `Auditing security boundaries for "${userPrompt}":\n\nTigers possess binocular night vision 6x sharper than humans. In the Zoo Cloud ecosystem, all your prompts, audio, and datasets run in hardware-isolated microVMs with zero telemetry leakage! 🐅🛡️`,
          skillsUsed: ['SAIF Compliance', 'MicroVM Isolation', 'Zero-Trust Audit'],
          toolExecuted: {
            name: 'Sandbox Isolation Auditor',
            plugin: 'Security MCP',
            durationMs: 12,
            resultSnippet: 'Zero-trust sandbox boundary verified · 0 leaks',
          },
        }

      case 'leopard':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'leopard',
          senderName: 'Pardus the Leopard',
          role: 'Root-Cause Debugger',
          avatar: targetAgent.avatar,
          emoji: '🐆',
          timestamp,
          content: `Tracing anomalies for "${userPrompt}":\n\nLeopards possess acute high-frequency hearing up to 50 kHz. I have filtered out ambient propeller noise to pinpoint the exact frequency of animal vocalizations! 🐆⚡`,
          skillsUsed: ['AST Analyzer', 'FFT Filter', 'eBPF CBP Tracing'],
          toolExecuted: {
            name: 'Spectrogram Anomaly Filter',
            plugin: 'Debugger MCP',
            durationMs: 20,
            resultSnippet: 'Filtered 120-450 Hz propeller interference',
          },
        }

      case 'rhino':
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'rhino',
          senderName: 'Kifaru the Rhino',
          role: 'Scientific Reviewer',
          avatar: targetAgent.avatar,
          emoji: '🦏',
          timestamp,
          content: `Formal verification for "${userPrompt}":\n\nI evaluated our peer-reviewed citations and causal proofs against W3C PROV-O rules. All statistical assertions are verified with 99.8% confidence! 🦏⚖️`,
          skillsUsed: ['Formal Logic', 'SHACL Schemas', 'Hypothesis Testing'],
          toolExecuted: {
            name: 'SHACL Logic Reasoner',
            plugin: 'Review MCP',
            durationMs: 28,
            resultSnippet: 'Evaluated 3 causal proofs · 100% compliant',
          },
        }

      case 'blue':
      default:
        return {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          agentId: 'blue',
          senderName: 'Blue',
          role: 'Conversational Scientist & Host',
          avatar: '/bg_video/static/relactation0.mp4',
          emoji: '🐋',
          timestamp,
          content: `Here is what we know about "${userPrompt}":\n\nBeluga whales (Delphinapterus leucas) are known as the "canaries of the sea" because of our rich vocal repertoire of whistles, clicks, trills, and bells! We use acoustic echolocation beams focused through our melon to hunt, stay with our pod, and navigate under polar ice sheets. 🐋🌊`,
          skillsUsed: ['Bioacoustics Analysis', 'Echolocation Modeling', 'Arctic Telemetry'],
          toolExecuted: {
            name: 'Bioacoustics FFT Spectrogram',
            plugin: 'ZenLM 70B Voice',
            durationMs: 20,
            resultSnippet: 'Analyzed 120 kHz ultrasound acoustics · 32 vocal types',
          },
        }
    }
  }

  // Handle user sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || busy) return

    const userPrompt = input.trim()
    setInput('')
    setBusy(true)
    zooAudio.playCue('click')

    // Detect if user targeted a specific agent with @mention
    let targetAgent = currentAgent
    const lower = userPrompt.toLowerCase()
    if (lower.includes('@wolf')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'wolf') || currentAgent
    else if (lower.includes('@elephant')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'elephant') || currentAgent
    else if (lower.includes('@giraffe')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'giraffe') || currentAgent
    else if (lower.includes('@hippo')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'hippo') || currentAgent
    else if (lower.includes('@tiger')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'tiger') || currentAgent
    else if (lower.includes('@leopard')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'leopard') || currentAgent
    else if (lower.includes('@rhino')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'rhino') || currentAgent
    else if (lower.includes('@blue')) targetAgent = ANIMAL_FLEET.find((a) => a.id === 'blue') || currentAgent

    if (targetAgent.id !== selectedAgentId) {
      setSelectedAgentId(targetAgent.id)
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      timestamp,
      content: userPrompt,
    }

    const updatedMessages = [...messages, userMsg]
    const updatedSessions = sessions.map((s) => {
      if (s.id === currentSession.id) {
        return {
          ...s,
          title: s.messages.length === 0 ? userPrompt.slice(0, 36) : s.title,
          agentId: targetAgent.id,
          updatedAt: Date.now(),
          timeLabel: 'Just now',
          messages: updatedMessages,
        }
      }
      return s
    })

    saveSessions(updatedSessions)

    // Simulate Agent Thinking & Tool Execution
    setTimeout(() => {
      const agentReply = generateAgentResponse(userPrompt, targetAgent)
      const finalMessages = [...updatedMessages, agentReply]

      const finalizedSessions = sessions.map((s) => {
        if (s.id === currentSession.id) {
          return {
            ...s,
            title: s.messages.length === 0 ? userPrompt.slice(0, 36) : s.title,
            agentId: targetAgent.id,
            updatedAt: Date.now(),
            timeLabel: 'Just now',
            messages: finalMessages,
          }
        }
        return s
      })

      saveSessions(finalizedSessions)
      setBusy(false)
      zooAudio.playCue('ping')

      // Auto speak if voice mode is preferred
      if (isVoiceListening) {
        speakMessage(agentReply.id, agentReply.content, targetAgent.id)
      }
    }, 750)
  }

  // Handle Starter prompt click
  const handleStartPrompt = (promptText: string) => {
    setInput(promptText)
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 50)
  }

  // Speak agent message aloud using Web Speech API
  const speakMessage = (msgId: string, text: string, agentId: string) => {
    if (isSpeaking === msgId) {
      zooAudio.stopSpeaking()
      setIsSpeaking(null)
      return
    }

    setIsSpeaking(msgId)
    // Strip markdown formatting for cleaner speech synthesis
    const cleanText = text.replace(/[*_#`~]/g, '').slice(0, 280)
    zooAudio.speakAgent(agentId, cleanText)

    setTimeout(() => {
      setIsSpeaking(null)
    }, 6000)
  }

  // Microphone Voice Input
  const toggleVoice = async () => {
    if (isVoiceListening) {
      setIsVoiceListening(false)
      zooAudio.stopMicrophone()
      zooAudio.playCue('leave')
    } else {
      setIsVoiceListening(true)
      zooAudio.playCue('join')
      const started = await zooAudio.startMicrophone()
      if (started) {
        // Start Web Speech Recognition if available
        const win = typeof window !== 'undefined' ? (window as any) : null
        const SpeechRec = win?.SpeechRecognition || win?.webkitSpeechRecognition

        if (SpeechRec) {
          try {
            const rec = new SpeechRec()
            rec.continuous = false
            rec.interimResults = true
            rec.lang = 'en-US'
            rec.onresult = (ev: any) => {
              const transcript = Array.from(ev.results)
                .map((r: any) => r[0].transcript)
                .join('')
              setInput(transcript)
            }
            rec.onerror = () => setIsVoiceListening(false)
            rec.onend = () => setIsVoiceListening(false)
            rec.start()
          } catch (e) {
            console.warn('SpeechRecognition failed to start', e)
            setIsVoiceListening(false)
          }
        }
      }
    }
  }

  // Process Commerce Top-Up / Staking
  const handleProcessTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessingPayment(true)

    const backendUrl = await getBackendBaseUrl()
    try {
      await fetch(`${backendUrl}/v1/commerce/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: topUpAmount,
          method: paymentMethod,
          org: activeOrg.id,
        }),
      })
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsProcessingPayment(false)
      setPaymentSuccess(true)
      const addedCredits = parseInt(topUpAmount, 10) * 100
      setActiveOrg((prev) => ({
        ...prev,
        credits: prev.credits + addedCredits,
        balanceUsd: `$${(parseFloat(prev.balanceUsd.replace('$', '')) + parseFloat(topUpAmount)).toFixed(2)}`,
      }))
      zooAudio.playCue('ping')

      setTimeout(() => {
        setShowTopUpModal(false)
        setShowDonateModal(false)
        setPaymentSuccess(false)
      }, 1400)
    }, 1000)
  }

  const starters = AGENT_STARTERS[selectedAgentId] || AGENT_STARTERS.blue

  // Grouped sessions
  const todaySessions = sessions.filter((s) => s.category === 'today' || !s.category)
  const yesterdaySessions = sessions.filter((s) => s.category === 'yesterday')
  const thisWeekSessions = sessions.filter((s) => s.category === 'this_week')

  return (
    <>
      <Head>
        <title>{currentSession.title || currentAgent.name} — ZOO Chat</title>
        <meta
          name="description"
          content="Interactive sovereign AI animal agents. Persona, voice, skills, 3D models and multi-agent coordination."
        />
      </Head>

      <div className="h-screen w-screen bg-[#05070c] text-zinc-100 flex flex-col font-sans select-none overflow-hidden">
        {/* Top App Chrome (Global Header: Chat, Vibe, Work, Animals, Search, Profile) */}
        <ZooAppChrome minimal={true} />

        {/* ─── MAIN APP WORKBENCH (Sidebar + Main Stage + Right Context Inspector) ─── */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile Overlay Backdrop for Sidebar */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
            />
          )}

          {/* ══════════════════════════════════════════════════════════
              1. LEFT SIDEBAR: Grouped History + Meet Blue + Org Switcher
              ══════════════════════════════════════════════════════════ */}
          <aside
            className={`bg-[#080b12] border-r border-white/[0.08] flex flex-col justify-between shrink-0 z-50 md:z-30 transition-all duration-300 ease-in-out ${
              sidebarOpen
                ? 'w-72 sm:w-80 p-3.5 fixed md:relative inset-y-0 left-0 shadow-2xl md:shadow-none'
                : 'w-0 p-0 border-r-0 overflow-hidden opacity-0 pointer-events-none -translate-x-full md:translate-x-0'
            }`}
          >
            {/* Top: New Chat + Grouped Conversations */}
            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
              {/* + New Chat Button */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleNewConversation}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 cursor-pointer active:scale-98"
                >
                  <Plus className="h-4 w-4" />
                  <span>New chat</span>
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5"
                  title="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grouped Session History */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm scrollbar-thin">
                {/* Section: Today */}
                {todaySessions.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Today
                    </div>
                    {todaySessions.map((session) => {
                      const isSelected = session.id === activeSessionId
                      const agent = ANIMAL_FLEET.find((a) => a.id === session.agentId) || ANIMAL_FLEET[0]

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            setActiveSessionId(session.id)
                            setSelectedAgentId(session.agentId || 'blue')
                            if (window.innerWidth < 768) setSidebarOpen(false)
                          }}
                          className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#141b2c] text-white font-medium border border-blue-500/30 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="text-base shrink-0">{agent.emoji}</span>
                          <div className="truncate flex-1">
                            <p className="truncate text-xs sm:text-sm text-zinc-100 font-medium">
                              {session.title || 'Untitled Conversation'}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500 shrink-0 group-hover:hidden">
                            {session.timeLabel}
                          </span>

                          {/* Delete Button on Hover */}
                          <button
                            onClick={(e) => handleDeleteConversation(e, session.id)}
                            className="hidden group-hover:block p-1 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Section: Yesterday */}
                {yesterdaySessions.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Yesterday
                    </div>
                    {yesterdaySessions.map((session) => {
                      const isSelected = session.id === activeSessionId
                      const agent = ANIMAL_FLEET.find((a) => a.id === session.agentId) || ANIMAL_FLEET[0]

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            setActiveSessionId(session.id)
                            setSelectedAgentId(session.agentId || 'blue')
                            if (window.innerWidth < 768) setSidebarOpen(false)
                          }}
                          className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#141b2c] text-white font-medium border border-blue-500/30 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="text-base shrink-0">{agent.emoji}</span>
                          <div className="truncate flex-1">
                            <p className="truncate text-xs sm:text-sm text-zinc-100 font-medium">
                              {session.title}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500 shrink-0 group-hover:hidden">
                            {session.timeLabel}
                          </span>
                          <button
                            onClick={(e) => handleDeleteConversation(e, session.id)}
                            className="hidden group-hover:block p-1 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Section: This Week */}
                {thisWeekSessions.length > 0 && (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      This week
                    </div>
                    {thisWeekSessions.map((session) => {
                      const isSelected = session.id === activeSessionId
                      const agent = ANIMAL_FLEET.find((a) => a.id === session.agentId) || ANIMAL_FLEET[0]

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            setActiveSessionId(session.id)
                            setSelectedAgentId(session.agentId || 'blue')
                            if (window.innerWidth < 768) setSidebarOpen(false)
                          }}
                          className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#141b2c] text-white font-medium border border-blue-500/30 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span className="text-base shrink-0">{agent.emoji}</span>
                          <div className="truncate flex-1">
                            <p className="truncate text-xs sm:text-sm text-zinc-100 font-medium">
                              {session.title}
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-500 shrink-0 group-hover:hidden">
                            {session.timeLabel}
                          </span>
                          <button
                            onClick={(e) => handleDeleteConversation(e, session.id)}
                            className="hidden group-hover:block p-1 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom: Meet Blue Card + Bottom-Left Org Switcher */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08] shrink-0">
              {/* Meet Blue Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0e1628] to-[#070b14] border border-blue-500/20 shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-xl shrink-0">
                    🐋
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Meet Blue</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      Your AI research partner for the ocean
                    </p>
                  </div>
                </div>
                <Link
                  href="/beluga"
                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-[11px] font-semibold text-blue-200 hover:text-white transition-all whitespace-nowrap"
                >
                  Learn more
                </Link>
              </div>

              {/* Org Switcher at Bottom Left */}
              <div className="relative">
                <button
                  onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">💜</span>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {activeOrg.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      {activeOrg.type === 'team' ? '501(c)(3)' : 'Solo'}
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-zinc-400 group-hover:text-white transition-transform" />
                </button>

                {/* Org Switcher Dropdown Popover */}
                {orgDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-full bg-[#0d121f] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                      <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                        Switch Workspace
                      </span>
                      <span className="font-mono text-emerald-400 text-[11px]">{activeOrg.balanceUsd}</span>
                    </div>

                    <div className="space-y-1">
                      {/* Org 1: ZOO Labs Foundation */}
                      <button
                        onClick={() => {
                          setActiveOrg({
                            id: 'zoo_labs_foundation',
                            name: 'ZOO Labs',
                            type: 'team',
                            badge: '501(c)(3) Foundation',
                            credits: 1250,
                            balanceUsd: '$12.50',
                          })
                          setOrgDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          activeOrg.id === 'zoo_labs_foundation'
                            ? 'bg-purple-950/40 border border-purple-500/40 text-white'
                            : 'hover:bg-white/5 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>💜</span>
                          <div>
                            <p className="text-xs font-bold">Zoo Labs Foundation</p>
                            <p className="text-[10px] text-zinc-400">501(c)(3) Scientific Team</p>
                          </div>
                        </div>
                        {activeOrg.id === 'zoo_labs_foundation' && (
                          <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>

                      {/* Org 2: Personal Workspace */}
                      <button
                        onClick={() => {
                          setActiveOrg({
                            id: 'personal_workspace',
                            name: 'Personal Space',
                            type: 'personal',
                            badge: 'Solo Researcher',
                            credits: 420,
                            balanceUsd: '$4.20',
                          })
                          setOrgDropdownOpen(false)
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          activeOrg.id === 'personal_workspace'
                            ? 'bg-purple-950/40 border border-purple-500/40 text-white'
                            : 'hover:bg-white/5 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <div>
                            <p className="text-xs font-bold">Personal Workspace</p>
                            <p className="text-[10px] text-zinc-400">Alex Rivera (Solo)</p>
                          </div>
                        </div>
                        {activeOrg.id === 'personal_workspace' && (
                          <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    </div>

                    {/* Quick Actions: Top Up & Donate */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          setShowTopUpModal(true)
                          setOrgDropdownOpen(false)
                        }}
                        className="py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold text-center transition-all cursor-pointer"
                      >
                        + Top Up
                      </button>
                      <button
                        onClick={() => {
                          setShowDonateModal(true)
                          setOrgDropdownOpen(false)
                        }}
                        className="py-1.5 px-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold text-center transition-all cursor-pointer"
                      >
                        ❤️ Donate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ══════════════════════════════════════════════════════════
              2. CENTER STAGE: Chat Feed, 4K Ocean Video & 3D Animal View
              ══════════════════════════════════════════════════════════ */}
          <main className="flex-1 bg-[#05070c] flex flex-col overflow-hidden relative">
            {/* Subheader: Session Title + Multi-Agent Indicator + Switch to Vibe */}
            <div className="h-14 border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between shrink-0 bg-[#080b12]/95 backdrop-blur-md z-20">
              {/* Left: Sidebar Toggle + Title */}
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0"
                  title={sidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>

                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                    <span>{currentSession.title}</span>
                  </h2>
                  <p className="text-[10px] text-zinc-400 truncate">
                    Started {currentSession.timeLabel} by you
                  </p>
                </div>
              </div>

              {/* Center: Multi-Agent Working Summary */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setMultiAgentPodOpen(!multiAgentPodOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-zinc-200 transition-all cursor-pointer"
                >
                  <span className="text-sm">🐕</span>
                  <span className="font-semibold text-white">Blue is working on this</span>
                  <span className="text-zinc-400">· 3 agents · 3 tasks running</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>

                {/* Multi-Agent Pod Modal Popover */}
                {multiAgentPodOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-[#0d121f] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                      Active Pod Coordination
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>🐋</span>
                          <span className="font-semibold text-white">Blue (Lead Researcher)</span>
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px]">Working</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>🐘</span>
                          <span className="font-semibold text-white">Elephant (Data Analyst)</span>
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px]">Working</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>🐺</span>
                          <span className="font-semibold text-white">Wolf (Literature Scholar)</span>
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px]">Working</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span>🦒</span>
                          <span className="font-semibold text-white">Giraffe (Strategist)</span>
                        </div>
                        <span className="text-cyan-400 font-mono text-[10px]">Queued</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Invite + Switch to Vibe + Inspector Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Invite</span>
                </button>

                <Link
                  href="/vibe"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 border border-purple-400/40 text-xs font-semibold text-white transition-all shadow-md shadow-purple-600/20"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-200" />
                  <span>Switch to Vibe</span>
                </Link>

                {/* Toggle Right Inspector */}
                <button
                  onClick={() => setRightInspectorOpen(!rightInspectorOpen)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    rightInspectorOpen
                      ? 'bg-blue-950/40 text-blue-300 border-blue-500/40'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border-white/10'
                  }`}
                  title="Toggle Work & Context Inspector"
                >
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Media Canvas */}
            <div className="flex-1 relative overflow-hidden flex flex-col justify-between p-3 sm:p-6">
              {/* 
                MEDIA BACKGROUND HANDLING:
                - If Blue: Video background with soft overlay (doesn't cover text)
                - If Wolf/Elephant/Hippo/Giraffe/Tiger/Leopard/Rhino: 3D Animal companion loaded from /models/
              */}
              {selectedAgentId === 'blue' ? (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={currentVideoClip}
                    className="h-full w-full object-cover opacity-30 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/70 to-[#05070c]/50" />
                </div>
              ) : (
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
                  {/* Subtle Grid Accent */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
                </div>
              )}

              {/* 3D Animal Life-Stage Bar (Shown for non-Blue 3D Animals) */}
              {selectedAgentId !== 'blue' && (
                <div className="relative z-20 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 mb-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentAgent.emoji}</span>
                    <span className="text-xs font-bold text-white">{currentAgent.name} 3D Companion</span>
                  </div>

                  {/* Life Stage Selector: Baby / Teen / Adult */}
                  <div className="flex items-center bg-zinc-900/90 border border-white/10 p-0.5 rounded-xl text-xs">
                    {(['baby', 'teen', 'adult'] as const).map((stage) => (
                      <button
                        key={stage}
                        onClick={() => {
                          setAnimalStage(stage)
                          zooAudio.playCue('click')
                        }}
                        className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                          animalStage === stage
                            ? 'bg-blue-600 text-white font-bold shadow'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {stage === 'baby' ? '🐾 Baby' : stage === 'teen' ? '🌟 Teen' : '👑 Adult'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Center Content: Messages Feed OR Spacious Kid-Friendly Welcome */}
              {messages.length > 0 ? (
                <div
                  ref={cinematicScrollerRef}
                  className="relative z-10 flex-1 max-w-3xl mx-auto w-full overflow-y-auto space-y-4 my-2 pr-2 scrollbar-none"
                >
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user'
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className="h-9 w-9 rounded-2xl overflow-hidden shrink-0 border border-white/15 bg-black/50 flex items-center justify-center text-xl shadow-md">
                          {isUser ? (
                            <img src={msg.avatar} alt="You" className="h-full w-full object-cover" />
                          ) : (
                            <span>{msg.emoji || currentAgent.emoji}</span>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`p-4 sm:p-5 rounded-3xl max-w-[85%] text-sm sm:text-base backdrop-blur-xl border leading-relaxed shadow-xl space-y-3 ${
                            isUser
                              ? 'bg-blue-600/90 text-white border-blue-400/40'
                              : 'bg-[#0d121f]/90 text-zinc-100 border-white/15'
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between gap-4 text-xs text-zinc-400 pb-2 border-b border-white/10">
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              {msg.emoji && <span className="text-base">{msg.emoji}</span>}
                              <span>{msg.senderName}</span>
                              {msg.role && (
                                <span className="text-[11px] text-cyan-400 font-mono hidden sm:inline">
                                  · {msg.role}
                                </span>
                              )}
                            </span>

                            <div className="flex items-center gap-2">
                              {!isUser && (
                                <button
                                  onClick={() =>
                                    speakMessage(msg.id, msg.content, msg.agentId || currentAgent.id)
                                  }
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    isSpeaking === msg.id
                                      ? 'bg-cyan-500 text-black animate-pulse'
                                      : 'bg-white/10 hover:bg-white/20 text-cyan-300'
                                  }`}
                                  title="Listen aloud"
                                >
                                  <Volume2 className="h-3 w-3" />
                                  <span>{isSpeaking === msg.id ? 'Playing...' : 'Listen'}</span>
                                </button>
                              )}
                              <span className="font-mono text-zinc-400 text-xs">{msg.timestamp}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <p className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                            {msg.content}
                          </p>

                          {/* Plan Section with Checkmarks */}
                          {msg.plan && msg.plan.length > 0 && (
                            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                              <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                Research Plan
                              </div>
                              <div className="space-y-1.5">
                                {msg.plan.map((step, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                      {step.status === 'done' ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                      ) : step.status === 'in_progress' ? (
                                        <div className="h-3.5 w-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                                      ) : (
                                        <div className="h-3.5 w-3.5 rounded-full border border-zinc-600" />
                                      )}
                                      <span className={step.status === 'done' ? 'text-zinc-300 line-through' : 'text-zinc-200'}>
                                        {step.text}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                        step.status === 'done'
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : step.status === 'in_progress'
                                          ? 'bg-blue-500/20 text-blue-300'
                                          : 'bg-zinc-800 text-zinc-400'
                                      }`}
                                    >
                                      {step.status === 'done' ? 'Done' : step.status === 'in_progress' ? 'In progress' : 'Queued'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tasks Progress Card */}
                          {msg.tasksProgress && msg.tasksProgress.length > 0 && (
                            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-white flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Blue is working...</span>
                                </span>
                              </div>
                              <div className="space-y-2">
                                {msg.tasksProgress.map((task, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs text-zinc-300">
                                      <span>{task.title}</span>
                                      <span className="font-mono text-[11px] text-zinc-400">{task.timeEstimate}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-1 text-[11px] text-blue-400 hover:underline cursor-pointer">
                                View all tasks (3) →
                              </div>
                            </div>
                          )}

                          {/* Embedded Chart Preview */}
                          {msg.previewChart && (
                            <div className="p-3.5 rounded-2xl bg-[#090d16] border border-blue-500/30 space-y-2">
                              <div className="flex items-center justify-between text-xs text-zinc-300">
                                <span className="font-bold text-white">Cook Inlet Beluga Population (1979–2024)</span>
                                <span className="text-[10px] font-mono text-zinc-500">NOAA Dataset</span>
                              </div>
                              <div className="h-24 w-full bg-black/40 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                                {/* SVG Sparkline */}
                                <svg className="w-full h-full" viewBox="0 0 300 80">
                                  <path
                                    d="M 0 30 Q 50 20 100 45 T 200 60 T 300 68"
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="2.5"
                                  />
                                </svg>
                                <span className="absolute bottom-1 right-2 text-[10px] text-zinc-400 font-mono">
                                  Estimated Population: 279
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Executed Tool Pill */}
                          {msg.toolExecuted && (
                            <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Wrench className="h-3.5 w-3.5 text-cyan-400" />
                                <span>Tool: {msg.toolExecuted.name}</span>
                              </span>
                              <span className="text-cyan-400/80">{msg.toolExecuted.durationMs}ms</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {busy && (
                    <div className="flex items-center gap-2.5 text-sm text-cyan-300 bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 w-fit shadow-xl">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>{currentAgent.name} is discovering answers...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 max-w-3xl mx-auto w-full space-y-5 my-auto">
                  {/* Welcome Header */}
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-sm text-cyan-300 mb-1 shadow-lg">
                      <span className="text-lg">{currentAgent.emoji}</span>
                      <span className="font-semibold">{currentAgent.name}</span>
                      <span>·</span>
                      <span className="text-zinc-300">{currentAgent.role}</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
                      What would you like to explore today?
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-300 drop-shadow max-w-xl mx-auto leading-relaxed">
                      Ask questions about ocean animals, pack communication, wildlife survival, or test our multi-agent tools!
                    </p>
                  </div>

                  {/* Kid-Friendly Starter Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {starters.slice(0, 4).map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStartPrompt(s.prompt)}
                        className="p-4 rounded-3xl bg-[#0c121e]/85 hover:bg-[#121b2d] border border-white/15 hover:border-cyan-400/60 backdrop-blur-2xl text-left transition-all group cursor-pointer shadow-xl hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-2.5 text-white font-bold text-sm group-hover:text-cyan-300 transition-colors">
                          <span className="text-xl">{s.icon}</span>
                          <span>{s.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 leading-relaxed">
                          {s.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Spacious Composer */}
              <div className="relative z-10 max-w-3xl mx-auto w-full pt-2">
                <form
                  onSubmit={handleSendMessage}
                  className="p-2 sm:p-2.5 rounded-3xl bg-[#0c111c]/95 border border-white/20 backdrop-blur-2xl flex flex-col gap-2 shadow-2xl focus-within:border-cyan-400 transition-all"
                >
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-2xl">{currentAgent.emoji}</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${currentAgent.name.split(' ')[0]}... (or type @wolf, @elephant)`}
                      className="flex-1 bg-transparent px-2 py-1.5 text-sm sm:text-base text-white placeholder:text-zinc-500 outline-none"
                    />
                  </div>

                  {/* Composer Tools Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs px-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAgentSelectorOpen(!agentSelectorOpen)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        title="Mention agent"
                      >
                        <AtSign className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          webSearchEnabled
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                        <span>Web</span>
                      </button>

                      {/* Deep Research Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDeepResearchOpen(!deepResearchOpen)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                          <span>{selectedModelName}</span>
                          <ChevronDown className="h-3 w-3" />
                        </button>

                        {deepResearchOpen && (
                          <div className="absolute left-0 bottom-full mb-2 w-56 bg-[#0d121f] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                            {['Deep Research', 'ZenLM 70B Scholar', 'ZenLM Fast 32B', 'Code Sandboxer'].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => {
                                  setSelectedModelName(m)
                                  setDeepResearchOpen(false)
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-200 hover:bg-white/10 transition-colors"
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live Mic */}
                      <button
                        type="button"
                        onClick={toggleVoice}
                        className={`p-2 rounded-full transition-all cursor-pointer ${
                          isVoiceListening
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-zinc-200'
                        }`}
                        title={isVoiceListening ? 'Listening...' : 'Talk with microphone'}
                      >
                        <Mic className="h-4 w-4" />
                      </button>

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={!input.trim() || busy}
                        className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-35 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                        title="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>

          {/* ══════════════════════════════════════════════════════════
              3. RIGHT INSPECTOR: Agents, Resources, Context & Artifacts
              ══════════════════════════════════════════════════════════ */}
          <aside
            className={`bg-[#080b12] border-l border-white/[0.08] flex flex-col justify-between shrink-0 p-4 z-30 transition-all duration-300 ease-in-out ${
              rightInspectorOpen
                ? 'w-72 sm:w-80 fixed xl:relative inset-y-0 right-0 shadow-2xl xl:shadow-none'
                : 'w-0 p-0 border-l-0 overflow-hidden opacity-0 pointer-events-none'
            }`}
          >
            <div className="space-y-5 overflow-y-auto pr-1 scrollbar-thin flex-1 text-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white text-xs">Work & Context Inspector</span>
                <button
                  onClick={() => setRightInspectorOpen(false)}
                  className="xl:hidden p-1 text-zinc-400 hover:text-white rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Agents Working on this */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Agents working on this
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🐋</span>
                      <div>
                        <p className="font-bold text-white">Blue</p>
                        <p className="text-[10px] text-zinc-400">Conversational AI · Lead</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Working</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🐘</span>
                      <div>
                        <p className="font-bold text-white">Elephant</p>
                        <p className="text-[10px] text-zinc-400">Data Analyst · Datastore</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Working</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🐺</span>
                      <div>
                        <p className="font-bold text-white">Wolf</p>
                        <p className="text-[10px] text-zinc-400">Researcher · Literature</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Working</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🦒</span>
                      <div>
                        <p className="font-bold text-white">Giraffe</p>
                        <p className="text-[10px] text-zinc-400">Strategist · Big picture</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Queued</span>
                  </div>
                </div>
                <Link
                  href="/animals"
                  className="block text-[11px] text-blue-400 hover:text-blue-300 font-semibold pt-1"
                >
                  View all agents →
                </Link>
              </div>

              {/* Resources */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Resources
                </div>
                <div className="space-y-1 text-zinc-300">
                  <div className="flex items-center justify-between py-1 px-1.5 hover:bg-white/5 rounded">
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Documents</span>
                    </span>
                    <span className="font-mono text-zinc-500">18</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1.5 hover:bg-white/5 rounded">
                    <span className="flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Datasets</span>
                    </span>
                    <span className="font-mono text-zinc-500">5</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1.5 hover:bg-white/5 rounded">
                    <span className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Web links</span>
                    </span>
                    <span className="font-mono text-zinc-500">27</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1.5 hover:bg-white/5 rounded">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Images</span>
                    </span>
                    <span className="font-mono text-zinc-500">12</span>
                  </div>
                </div>
              </div>

              {/* Context Tags */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Context
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Cook Inlet', 'Belugas', 'Conservation', 'Climate Change', 'Noise Pollution'].map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Artifacts */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Recent artifacts
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      <span>Beluga Report (Draft)</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Interactive · Updated just now</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <BarChart2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Population Trends Chart</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Image · 10m ago</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Threats Overview</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Document · 25m ago</p>
                  </div>
                </div>
                <Link
                  href="/work"
                  className="block text-[11px] text-blue-400 hover:text-blue-300 font-semibold pt-1"
                >
                  View all artifacts →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. MODALS: Top Up, Donate, Invite Teammates
          ══════════════════════════════════════════════════════════ */}

      {/* A. Top Up / Payment Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-base">Top Up Compute Credits</h3>
              </div>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-lg">Payment Successful!</h4>
                <p className="text-sm text-zinc-300">
                  Added {parseInt(topUpAmount, 10) * 100} credits to {activeOrg.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessTopUp} className="space-y-4">
                {/* Amount Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Select Amount</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['10', '25', '50', '100'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopUpAmount(amt)}
                        className={`py-2 rounded-xl font-mono text-sm font-bold transition-all ${
                          topUpAmount === amt
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-blue-950 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-blue-950 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <span className="font-bold">PayPal</span>
                      <span>Checkout</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs transition-all ${
                        paymentMethod === 'crypto'
                          ? 'bg-blue-950 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-zinc-400'
                      }`}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Web3 USDC</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-400">
                  Target Org: <span className="text-white font-bold">{activeOrg.name}</span>
                  <br />
                  Receipt routed through <span className="font-mono text-cyan-400">commerce.hanzo.ai</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {isProcessingPayment ? 'Processing...' : `Pay $${topUpAmount} & Top Up`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* B. 501(c)(3) Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400" />
                <h3 className="font-bold text-base">Tax-Deductible Donation</h3>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p>
                Zoo Labs Foundation Inc. is a registered 501(c)(3) scientific organization (EIN: 88-3538992).
              </p>
              <p>
                Donations directly fund physical anti-poaching acoustic sensors, GPS tracking collars, and wildlife reserves.
              </p>
            </div>

            <form onSubmit={handleProcessTopUp} className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {['25', '50', '100', '250'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl font-mono text-sm font-bold transition-all ${
                      topUpAmount === amt
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 font-bold text-sm text-white transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                {isProcessingPayment ? 'Processing...' : `Donate $${topUpAmount} via Hanzo Commerce`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* C. Invite Teammates Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1424] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-base">Invite to Exploration Room</h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-300">
              Collaborate live with scientists, classrooms, and autonomous animal agents in real time.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Shareable Room Link</label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-cyan-300">
                <span className="truncate flex-1">https://zoolabs.io/vibe?room=arctic-belugas</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://zoolabs.io/vibe?room=arctic-belugas')
                    zooAudio.playCue('ping')
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 text-white font-sans text-xs font-semibold hover:bg-blue-500"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
