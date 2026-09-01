import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Sparkles,
  ChevronDown,
  Bot,
  Plus,
  Check,
  CreditCard,
  Users,
  Copy,
  Settings,
  Egg,
  LogOut,
  Menu,
  X,
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
      <nav
        className="h-12 w-full border-b flex items-center justify-between px-4 z-50 shrink-0 text-xs select-none font-sans"
        style={{
          backgroundColor: 'rgba(10, 10, 12, 0.88)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Left: Bigger ZOO Wordmark & Organization Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center cursor-pointer">
            <span className="font-black text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
              ZOO
            </span>
          </Link>

          <span className="text-zinc-600">/</span>

          {/* Organization Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="action px-3 py-1 text-xs"
              style={{ minHeight: '32px' }}
            >
              <span>{activeOrg.icon}</span>
              <span className="truncate sm:max-w-[140px]">{activeOrg.name}</span>
              <ChevronDown className="h-3 w-3 text-zinc-400" />
            </button>

            {showOrgDropdown && (
              <div
                className="absolute top-10 left-0 w-64 rounded-2xl p-3 z-50 space-y-2 text-xs"
                style={{
                  backgroundColor: 'rgba(18, 18, 22, 0.96)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-floating)',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs uppercase font-bold text-zinc-400">Switch Organization</span>
                </div>

                <div className="space-y-1">
                  {orgs.map((org) => {
                    const isSel = activeOrg.id === org.id
                    return (
                      <button
                        key={org.id}
                        onClick={() => {
                          setActiveOrg(org)
                          setShowOrgDropdown(false)
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isSel ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          border: isSel ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{org.icon}</span>
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{org.name}</p>
                            <p className="text-xs text-zinc-400">{org.members} members • {org.role}</p>
                          </div>
                        </div>
                        {isSel && <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => {
                      setShowOrgDropdown(false)
                      setCreatedInviteLink(null)
                      setShowCreateOrgModal(true)
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-blue-400 font-semibold border border-dashed border-white/10 mt-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Organization & Invite Pod</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Pills */}
          <div
            className="hidden xl:flex items-center gap-1 p-0.5 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = router.pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: 24/7 Autonomous Bot Status, Plans, User Session */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 24/7 MicroVM Indicator */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowBotsDropdown(!showBotsDropdown)}
              className="pill cursor-pointer"
              style={{
                color: '#60A5FA',
                borderColor: 'rgba(59, 130, 246, 0.25)',
                background: 'rgba(59, 130, 246, 0.08)',
              }}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <Bot className="h-3 w-3" />
              <span className="font-bold">24/7 Bots Active</span>
            </button>

            {showBotsDropdown && (
              <div
                className="absolute top-10 right-0 w-72 rounded-2xl p-3.5 z-50 space-y-2 text-xs"
                style={{
                  backgroundColor: 'rgba(18, 18, 22, 0.96)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-floating)',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white">Zoo Cloud MicroVM Bots</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">ONLINE</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Your animal familiars run continuous background tasks, bioacoustic audio processing, and sandbox builds in Zoo Cloud.
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <span>🐬</span>
                      <span>Blue the Beluga</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">120 kHz Telemetry</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-white">
                      <span>🐅</span>
                      <span>Siberian Tiger</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">Task ZOO-101</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Plans */}
          <Link href="/pricing" className="action px-3 py-1 text-xs" style={{ minHeight: '32px' }}>
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Plans</span>
          </Link>

          {/* User Account Capsule */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="action px-2.5 py-1 text-xs"
                style={{ minHeight: '32px' }}
              >
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-white truncate sm:max-w-[100px]">{user.name}</span>
                <span className="badge badge-accent py-0 px-1.5">{user.plan}</span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>

              {showUserDropdown && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl p-3 z-50 space-y-2 text-xs"
                  style={{
                    backgroundColor: 'rgba(18, 18, 22, 0.96)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid var(--border-strong)',
                    boxShadow: 'var(--shadow-floating)',
                  }}
                >
                  <div className="border-b border-white/10 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <span className="badge badge-online py-0 px-1.5">zoolabs.id</span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
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
                    href="/animals"
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
            <div className="flex items-center gap-2">
              <Link href="/login" className="action px-3 py-1 text-xs" style={{ minHeight: '32px' }}>
                Log in
              </Link>
              <Link href="/signup" className="action px-3 py-1 text-xs" data-fill style={{ minHeight: '32px' }}>
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden fixed top-12 left-0 right-0 p-4 border-b z-50 space-y-2 text-xs"
          style={{
            backgroundColor: 'rgba(10, 10, 12, 0.95)',
            backdropFilter: 'blur(24px)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-white"
              >
                <span>{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Create Org Modal */}
      {showCreateOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div
            className="w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-white"
            style={{
              backgroundColor: 'rgba(18, 18, 22, 0.98)',
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-floating)',
            }}
          >
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
                  <label className="text-xs font-semibold text-zinc-400">Pod / Organization Name</label>
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
                      className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-white/30 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Invite Friends (Email Addresses)</label>
                  <input
                    type="text"
                    placeholder="sarah@zoolabs.id, dev@hanzo.ai..."
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-white/30 placeholder:text-zinc-600"
                  />
                  <p className="text-xs text-zinc-500">Teammates get instant access to your /vibe pod and workboards.</p>
                </div>

                <button
                  type="submit"
                  className="action w-full"
                  data-fill
                  style={{ minHeight: '44px' }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Pod & Generate Invite Link</span>
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>Pod "{newOrgName}" Created!</span>
                  </p>
                  <p className="text-zinc-400 text-xs">Share this invite link with your friends to collaborate in /vibe:</p>
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
                    className="action px-3 py-1 text-xs"
                    data-fill
                    style={{ minHeight: '32px' }}
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
                  className="action w-full"
                  data-fill
                  style={{ minHeight: '44px' }}
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
