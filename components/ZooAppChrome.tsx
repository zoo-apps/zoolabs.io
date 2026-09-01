import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Check,
  Settings,
  LogOut,
  Users,
  Layers,
  ArrowRight,
  Activity,
  Bot,
  Command,
  FileText,
  Database,
  Calendar,
  X,
} from 'lucide-react'
import { useZooMissions } from '../lib/zoo-missions-context'
import { zooAudio } from '../lib/audio-engine'

const NAV_ITEMS = [
  { href: '/', label: 'Chat', icon: '💬', id: 'chat' },
  { href: '/vibe', label: 'Vibe', icon: '💜', id: 'vibe' },
  { href: '/work', label: 'Work', icon: '💼', id: 'work' },
  { href: '/animals', label: 'Animals', icon: '🐾', id: 'animals' },
]

export default function ZooAppChrome({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter()
  const { activeMission, missions, setActiveMissionId, agents } = useZooMissions()

  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(null)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)

  // Notification items
  const NOTIFICATIONS = [
    {
      id: 'n1',
      title: 'Raven completed literature synthesis',
      desc: 'Extracted 32 papers on Arctic ship noise impact (p < 0.001 correlation).',
      time: '4m ago',
      emoji: '🐦',
    },
    {
      id: 'n2',
      title: 'Elephant finished hydrophone cleaning',
      desc: '1.4 TB NOAA dataset indexed into ClickHouse datastore.',
      time: '12m ago',
      emoji: '🐘',
    },
    {
      id: 'n3',
      title: 'Beaver updated interactive canvas',
      desc: 'Spectrogram + population chart ready in /vibe.',
      time: '25m ago',
      emoji: '🦫',
    },
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem('zoo_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // default
      }
    }
  }, [])

  // Cmd+K shortcut for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearchModal((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setShowSearchModal(false)
        setShowNotifications(false)
        setShowUserDropdown(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Determine current active mode
  const currentMode =
    router.pathname === '/'
      ? 'chat'
      : router.pathname === '/vibe'
      ? 'vibe'
      : router.pathname === '/work'
      ? 'work'
      : router.pathname === '/animals'
      ? 'animals'
      : ''

  // Search Results
  const searchResults = searchQuery.trim()
    ? [
        ...missions
          .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((m) => ({ type: 'Mission', title: m.title, url: '/work', emoji: m.emoji || '🎯' })),
        ...agents
          .filter(
            (a) =>
              a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((a) => ({ type: 'Animal Agent', title: `${a.name} (${a.role})`, url: '/animals', emoji: a.emoji })),
        ...activeMission.tasks
          .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((t) => ({ type: 'Task', title: t.title, url: '/work', emoji: '📋' })),
        ...activeMission.evidence.datasets
          .filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((d) => ({ type: 'Dataset', title: d.name, url: '/work', emoji: '📊' })),
      ]
    : []

  return (
    <>
      {/* ─── 1. TOP GLOBAL NAVIGATION ─── */}
      <header
        className="h-12 w-full border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 z-50 shrink-0 text-xs select-none font-sans"
      >
        {/* Left: Clean ZOO Wordmark + 4 Mode Tabs */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 cursor-pointer group">
            <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              ZOO
            </span>
          </Link>

          {/* 4 Canonical Mode Tabs */}
          <nav className="flex items-center gap-1 p-0.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentMode === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-md shadow-white/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (Cmd+K) */}
          <button
            onClick={() => {
              setShowSearchModal(true)
              zooAudio.playCue('ping')
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer text-xs"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline text-[11px]">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono text-zinc-400">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setUnreadNotifications(0)
              }}
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-zinc-950 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 rounded-2xl bg-[#0c0f17] border border-white/15 p-4 z-50 space-y-3 shadow-2xl backdrop-blur-2xl text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white">Mission Activity</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Real-time feed</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <span>{n.emoji}</span>
                          <span className="truncate">{n.title}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-1 ring-white/20">
                {user ? user.name.charAt(0).toUpperCase() : '🐋'}
              </div>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-11 w-56 rounded-2xl bg-[#0c0f17] border border-white/15 p-3 z-50 space-y-2 shadow-2xl backdrop-blur-2xl text-xs">
                <div className="border-b border-white/10 pb-2">
                  <p className="font-bold text-white">{user ? user.name : 'Explorer (Guest)'}</p>
                  <p className="text-[10px] text-zinc-400">{user ? user.email : 'guest@zoolabs.io'}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Memory & Settings</span>
                  <Settings className="h-3.5 w-3.5 text-zinc-400" />
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Upgrade Sovereign AI</span>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </Link>
                {user ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem('zoo_user')
                      setUser(null)
                      setShowUserDropdown(false)
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-950/40 text-rose-400 transition-colors text-left"
                  >
                    <span>Sign Out</span>
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
                  >
                    <span>Log In / Sign Up</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. PERSISTENT CONTEXT STRIP ("One Context, Four Views") ─── */}
      {!minimal && (
        <div className="h-8 w-full border-b border-white/[0.06] bg-[#05070a]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 text-[11px] text-zinc-400 z-40">
          <div className="flex items-center gap-2 truncate">
            {/* Active Context Marker */}
            <span className="text-xs">{activeMission.emoji || '🎯'}</span>
            <span className="font-semibold text-zinc-200 truncate">{activeMission.title}</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-cyan-400 hidden sm:inline font-medium">
              Blue + {activeMission.assignedAnimalIds.length - 1} agents
            </span>
            <span className="text-zinc-600 hidden md:inline">•</span>
            <span className="hidden md:inline font-mono text-zinc-500">
              {activeMission.progress}% complete ({activeMission.tasks.filter((t) => t.status === 'done').length}/
              {activeMission.tasks.length} tasks)
            </span>
          </div>

          {/* Mode Perspective Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">Perspective:</span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-white font-medium text-[10px] capitalize">
              {currentMode || 'Overview'} View
            </span>
          </div>
        </div>
      )}

      {/* ─── 3. GLOBAL SEARCH & COMMAND PALETTE MODAL (Cmd+K) ─── */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-4 shadow-2xl space-y-3">
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-white/10 pb-3">
              <Search className="h-4 w-4 text-cyan-400 ml-2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search missions, animals, memory, tasks, or evidence datasets..."
                className="w-full bg-transparent pl-3 pr-8 text-sm text-white placeholder:text-zinc-500 outline-none"
              />
              <button onClick={() => setShowSearchModal(false)} className="text-zinc-500 hover:text-white p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="max-h-80 overflow-y-auto space-y-1 text-xs">
              {searchQuery.trim() === '' ? (
                <div className="p-3 text-zinc-500 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600">Quick Jump</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowSearchModal(false)
                        router.push('/')
                      }}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>💬</span>
                      <div>
                        <p className="font-semibold text-white">Chat with AI</p>
                        <p className="text-[10px] text-zinc-400">1:1 conversation with Blue</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false)
                        router.push('/vibe')
                      }}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>💜</span>
                      <div>
                        <p className="font-semibold text-white">Vibe Together</p>
                        <p className="text-[10px] text-zinc-400">Live audio room & shared canvas</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false)
                        router.push('/work')
                      }}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>💼</span>
                      <div>
                        <p className="font-semibold text-white">Do the Work</p>
                        <p className="text-[10px] text-zinc-400">Kanban tasks & research</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false)
                        router.push('/animals')
                      }}
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-zinc-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>🐾</span>
                      <div>
                        <p className="font-semibold text-white">Build your Zoo</p>
                        <p className="text-[10px] text-zinc-400">Living agent graph & character builder</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowSearchModal(false)
                      router.push(res.url)
                    }}
                    className="w-full p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-left flex items-center justify-between text-zinc-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{res.emoji}</span>
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{res.title}</p>
                        <p className="text-[10px] text-zinc-500">{res.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-500">
                  <p>No results found for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
