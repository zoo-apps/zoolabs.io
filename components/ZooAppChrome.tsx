import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Zap,
  Egg,
  Shield,
  Menu,
  X,
  Bot,
  Plus,
  Check,
  CreditCard,
  Users,
  Copy,
  Mail,
  Share2,
  Settings,
} from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Ocean', icon: '🐬', key: '1' },
  { href: '/vibe', label: 'Vibe', icon: '🤝', key: '2' },
  { href: '/work', label: 'Work', icon: '💼', key: '3' },
  { href: '/animals', label: 'Animals', icon: '🐾', key: '4' },
  { href: '/video', label: 'Video', icon: '🎬', key: '5' },
  { href: '/music', label: 'Music', icon: '🎵', key: '6' },
  { href: '/design', label: 'Design', icon: '🎨', key: '7' },
  { href: '/3d', label: '3D', icon: '🧊', key: '8' },
]

const INITIAL_ORGS = [
  { id: 'org_personal', name: 'Zoo Labs (Personal)', icon: '🐬', role: 'Owner', members: 1 },
  { id: 'org_arctic', name: 'Arctic Sanctuary Pod', icon: '🐅', role: 'Admin', members: 12 },
  { id: 'org_sumatra', name: 'Sumatran Research Lab', icon: '🐘', role: 'Member', members: 48 },
]

export default function ZooAppChrome({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>({
    name: 'Alex Rivera',
    email: 'alex@zoolabs.id',
    plan: 'Plus Plan',
  })

  const [orgs, setOrgs] = useState(INITIAL_ORGS)
  const [activeOrg, setActiveOrg] = useState(INITIAL_ORGS[0])
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showBotsDropdown, setShowBotsDropdown] = useState(false)

  // Create Org & Invite Modal
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false)
  const [newOrgName, setNewOrgName] = useState('')
  const [newOrgIcon, setNewOrgIcon] = useState('🐅')
  const [inviteEmails, setInviteEmails] = useState('')
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('zoo_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        // default session
      }
    }
  }, [])

  // Keyboard shortcut listener for Cmd+1..8
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const num = parseInt(e.key, 10)
        if (num >= 1 && num <= 8) {
          e.preventDefault()
          const target = NAV_LINKS[num - 1]
          if (target) router.push(target.href)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem('zoo_user')
    setUser(null)
    setShowUserDropdown(false)
    router.push('/login')
  }

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/signup')
      return
    }
    if (!newOrgName.trim()) return

    const orgId = `org_${Date.now()}`
    const newOrg = {
      id: orgId,
      name: newOrgName.trim(),
      icon: newOrgIcon,
      role: 'Owner',
      members: 1,
    }

    setOrgs((prev) => [...prev, newOrg])
    setActiveOrg(newOrg)
    setCreatedInviteLink(`https://zoolabs.io/join/${orgId}`)
  }

  const handleCopyInviteLink = () => {
    if (!createdInviteLink) return
    navigator.clipboard.writeText(createdInviteLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <>
      <nav className="h-12 w-full border-b border-white/[0.08] bg-[#0A0A0C]/90 backdrop-blur-2xl px-3 sm:px-4 flex items-center justify-between z-50 shrink-0 text-xs select-none font-sans">
        {/* Left: Bigger ZOO Wordmark (No Z icon) & Organization Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bigger ZOO Wordmark */}
          <Link href="/" className="flex items-center cursor-pointer group">
            <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:opacity-80 transition-opacity">
              ZOO
            </span>
          </Link>

          <span className="text-zinc-600">/</span>

          {/* Organization Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <span>{activeOrg.icon}</span>
              <span className="truncate max-w-[110px] sm:max-w-[140px]">{activeOrg.name}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showOrgDropdown && (
              <div className="absolute top-10 left-0 w-64 rounded-2xl bg-[#18181B] border border-white/10 p-3 shadow-2xl space-y-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Switch Organization</span>
                </div>

                <div className="space-y-1">
                  {orgs.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => {
                        setActiveOrg(org)
                        setShowOrgDropdown(false)
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        activeOrg.id === org.id
                          ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                          : 'hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{org.icon}</span>
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{org.name}</p>
                          <p className="text-[10px] text-zinc-400">{org.members} members • {org.role}</p>
                        </div>
                      </div>
                      {activeOrg.id === org.id && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setShowOrgDropdown(false)
                      setCreatedInviteLink(null)
                      setShowCreateOrgModal(true)
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-blue-400 font-semibold border border-dashed border-white/10 mt-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Organization & Invite Pod</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-0.5 rounded-full">
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: 24/7 Bot Indicator, Plans, and Zoo ID */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 24/7 Background Autonomous Bots Indicator */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowBotsDropdown(!showBotsDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              <Bot className="h-3 w-3" />
              <span className="font-bold">24/7 Bots Active</span>
            </button>

            {showBotsDropdown && (
              <div className="absolute top-10 right-0 w-72 rounded-2xl bg-[#18181B] border border-white/10 p-3.5 shadow-2xl space-y-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white">Zoo Cloud 24/7 MicroVM Bots</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">ONLINE</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Your animal familiars run continuous background tasks, bioacoustic audio processing, and sandbox builds in Zoo Cloud.
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <span>🐬</span>
                      <span>Blue the Beluga</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">120 kHz Telemetry</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <span>🐅</span>
                      <span>Siberian Tiger</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">Task ZOO-101</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Subscription Link */}
          <Link
            href="/pricing"
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-zinc-200 font-semibold text-xs transition-colors border border-white/[0.08]"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Plans</span>
          </Link>

          {/* Zoo ID User Profile Capsule */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
              >
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white truncate max-w-[80px] sm:max-w-[100px]">{user.name}</span>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono font-bold">
                  {user.plan}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#18181B] border border-white/10 p-3 shadow-2xl space-y-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="border-b border-white/10 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                        zoolabs.id
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/settings"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-200"
                  >
                    <span>Billing & Account Settings</span>
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-200"
                  >
                    <span>Manage Plans</span>
                    <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                  </Link>

                  <Link
                    href="/mint"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-zinc-200"
                  >
                    <span>My Animal Companions</span>
                    <Egg className="h-3.5 w-3.5 text-orange-400" />
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer"
                  >
                    <span>Sign Out</span>
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-2.5 sm:px-3 py-1 rounded-full text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 sm:px-3.5 py-1 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* ─── Create Organization & Invite Pod Modal ──────────────────────── */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl space-y-4 text-xs text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Create Pod & Invite Friends</h3>
              </div>
              <button
                onClick={() => setShowCreateOrgModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!createdInviteLink ? (
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400">Pod / Organization Name</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={newOrgIcon}
                      onChange={(e) => setNewOrgIcon(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2 py-2 text-base outline-none"
                    >
                      <option value="🐬">🐬</option>
                      <option value="🐅">🐅</option>
                      <option value="🐘">🐘</option>
                      <option value="🐆">🐆</option>
                      <option value="🐋">🐋</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arctic Bioacoustics Lab"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-400">Invite Friends (Email Addresses)</label>
                  <input
                    type="text"
                    placeholder="sarah@zoolabs.id, dev@hanzo.ai..."
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                  />
                  <p className="text-[10px] text-zinc-500">Teammates get instant access to your /vibe pod and workboards.</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Pod & Generate Invite Link</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>Pod "{newOrgName}" Created!</span>
                  </p>
                  <p className="text-zinc-400 text-[11px]">Share this invite link with your friends to collaborate in /vibe:</p>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/60 border border-white/10">
                  <input
                    type="text"
                    readOnly
                    value={createdInviteLink}
                    className="flex-1 bg-transparent text-xs text-white outline-none font-mono truncate"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowCreateOrgModal(false)
                    router.push('/vibe')
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors"
                >
                  Enter Pod Vibe Room &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
