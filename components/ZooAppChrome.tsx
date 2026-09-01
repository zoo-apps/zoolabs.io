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
  CreditCard,
  Heart,
  Plus,
  User,
} from 'lucide-react'
import { useZooMissions } from '../lib/zoo-missions-context'
import { zooAudio } from '../lib/audio-engine'

// Navigation links matching the latest Zoo workbench ecosystem
const NAV_ITEMS = [
  { href: '/beluga', label: 'Ocean', icon: '🐟', id: 'ocean' },
  { href: '/vibe', label: 'Vibe', icon: '💜', id: 'vibe' },
  { href: '/work', label: 'Work', icon: '🗄️', id: 'work' },
  { href: '/animals', label: 'Animals', icon: '🐾', id: 'animals' },
  { href: '/video', label: 'Video', icon: '🎬', id: 'video' },
  { href: '/music', label: 'Music', icon: '🎵', id: 'music' },
  { href: '/design', label: 'Design', icon: '🎨', id: 'design' },
  { href: '/3d', label: '3D', icon: '🧊', id: '3d' },
]

export default function ZooAppChrome({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter()
  const { activeMission, missions, agents } = useZooMissions()

  const [user, setUser] = useState<{ name: string; email: string; plan: string; avatar?: string } | null>({
    name: 'Richard Kaminsky',
    email: 'richard@zoo.ngo',
    plan: 'Free Familiar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  })

  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [activeOrgName, setActiveOrgName] = useState('Zoo Labs (Personal)')
  const [unreadNotifications, setUnreadNotifications] = useState(2)

  // Notification items
  const NOTIFICATIONS = [
    {
      id: 'n1',
      title: 'Fenrir Wolf completed literature synthesis',
      desc: 'Synthesized 32 papers on Arctic ship noise impact (p < 0.001 correlation).',
      time: '4m ago',
      emoji: '🐺',
    },
    {
      id: 'n2',
      title: 'Ganesha Elephant finished hydrophone cleaning',
      desc: '1.4 TB NOAA dataset indexed into ClickHouse datastore.',
      time: '12m ago',
      emoji: '🐘',
    },
    {
      id: 'n3',
      title: 'Kiboko Hippo updated interactive canvas',
      desc: 'Spectrogram + population chart ready in /vibe.',
      time: '25m ago',
      emoji: '🦛',
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
        setShowOrgDropdown(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Determine current active mode
  const currentMode =
    router.pathname === '/' || router.pathname === '/beluga'
      ? 'ocean'
      : router.pathname === '/vibe'
      ? 'vibe'
      : router.pathname === '/work'
      ? 'work'
      : router.pathname === '/animals'
      ? 'animals'
      : router.pathname === '/video'
      ? 'video'
      : router.pathname === '/music'
      ? 'music'
      : router.pathname === '/design'
      ? 'design'
      : router.pathname === '/3d'
      ? '3d'
      : ''

  return (
    <>
      {/* ─── 1. TOP GLOBAL NAVIGATION ─── */}
      <header
        className="h-12 w-full border-b border-white/[0.08] bg-[#07090e]/95 backdrop-blur-2xl flex items-center justify-between px-3 sm:px-5 z-50 shrink-0 text-xs select-none font-sans"
      >
        {/* Left: Clean ZOO Wordmark + Org Selector + Mode Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 cursor-pointer group shrink-0">
            <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors font-mono">
              ZOO
            </span>
          </Link>

          {/* Org Selector Dropdown (Zoo Labs Personal) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 text-xs font-medium transition-all"
            >
              <span>{activeOrgName}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showOrgDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#0d121f] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <button
                  onClick={() => {
                    setActiveOrgName('Zoo Labs (Personal)')
                    setShowOrgDropdown(false)
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 text-zinc-200"
                >
                  <div>
                    <p className="font-bold text-xs">Zoo Labs (Personal)</p>
                    <p className="text-[10px] text-zinc-400">Free Familiar Plan</p>
                  </div>
                  {activeOrgName.includes('Personal') && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
                <button
                  onClick={() => {
                    setActiveOrgName('Zoo Labs Foundation')
                    setShowOrgDropdown(false)
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-white/5 text-zinc-200"
                >
                  <div>
                    <p className="font-bold text-xs">Zoo Labs Foundation</p>
                    <p className="text-[10px] text-purple-400">501(c)(3) Team Workspace</p>
                  </div>
                  {activeOrgName.includes('Foundation') && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Ecosystem Navigation Tabs */}
          <nav className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = currentMode === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#151f38] text-white border border-blue-500/40 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Section: 24/7 Bots Active + Google User Chip + Bell + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 24/7 Bots Active Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>24/7 Bots Active</span>
          </div>

          {/* Google User Plan Chip */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-[11px]">
            <span className="text-xs font-bold text-blue-400">G</span>
            <span className="font-medium text-white">Google User</span>
            <span className="text-zinc-400 text-[10px]">Free Familiar</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Search (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden xl:inline text-xs">Search</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setUnreadNotifications(0)
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d121f] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white text-xs">Autonomous Agent Updates</span>
                  <span className="text-[10px] text-zinc-400">Real-time</span>
                </div>
                <div className="space-y-2">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <span>{n.emoji}</span>
                          <span className="truncate">{n.title}</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="h-7 w-7 rounded-full overflow-hidden border border-white/20 hover:border-cyan-400 transition-all cursor-pointer"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d121f] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 space-y-3">
                <div className="pb-2 border-b border-white/10">
                  <p className="font-bold text-white text-xs">{user?.name || 'Richard Kaminsky'}</p>
                  <p className="text-[11px] text-zinc-400">{user?.email || 'richard@zoo.ngo'}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                    {user?.plan || 'Free Familiar'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-zinc-200"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                      <span>Upgrade Plan</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold">$19/mo</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-zinc-200"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Workspace Settings</span>
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. SEARCH MODAL (Cmd+K) ─── */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-lg bg-[#0d121f] border border-white/20 rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search missions, animals, tools, or papers..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 text-zinc-400 hover:text-white rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2">
                Quick Navigation
              </p>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setShowSearchModal(false)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 text-xs text-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label} Studio</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
