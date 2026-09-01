import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  CreditCard,
  Key,
  Users,
  Shield,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  AlertCircle,
  Plus,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'billing' | 'api' | 'team'>('billing')
  const [copiedKey, setCopiedKey] = useState(false)
  const [user, setUser] = useState({
    name: 'Alex Rivera',
    email: 'alex@zoolabs.id',
    plan: 'Plus Plan',
    card: 'Visa ending in 4242',
    renewal: 'October 1, 2026',
    apiKey: 'pk_live_zoo_9f830a7b12d99c4a',
  })

  useEffect(() => {
    const saved = localStorage.getItem('zoo_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser((prev) => ({ ...prev, ...parsed }))
      } catch (e) {
        // default
      }
    }
  }, [])

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Account & Billing Settings</title>
        <meta name="description" content="Manage your Zoo Labs subscription, Hanzo AI API keys, and team seats." />
      </Head>

      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans select-none">
        <ZooAppChrome />

        <main className="max-w-5xl w-full mx-auto px-4 py-10 space-y-8 flex-1">
          <div className="border-b border-white/10 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account & Billing Settings</h1>
            <p className="text-xs text-zinc-400 mt-1">Manage your active subscription, payment methods, and Hanzo Cloud API keys.</p>
          </div>

          {/* Settings Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {[
              { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
              { id: 'api', label: 'API Keys (Hanzo Cloud)', icon: Key },
              { id: 'team', label: 'Team Seats', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon
              const isSel = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSel ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab 1: Billing & Plans */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in text-xs">
              {/* Active Plan Card */}
              <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-400 font-mono">Current Subscription</span>
                    <h3 className="text-xl font-bold text-white">{user.plan} ($19/mo)</h3>
                    <p className="text-zinc-400">Billed monthly • Renews on {user.renewal}</p>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Change Plan
                  </Link>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-bold text-white">{user.card}</p>
                      <p className="text-[10px] text-zinc-500">Hanzo Commerce Tokenized Card</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Billing History & Invoices</h3>
                <div className="space-y-2">
                  {[
                    { id: 'INV-2026-08', date: 'August 1, 2026', amount: '$19.00', status: 'Paid' },
                    { id: 'INV-2026-07', date: 'July 1, 2026', amount: '$19.00', status: 'Paid' },
                  ].map((inv) => (
                    <div key={inv.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-400">{inv.id}</span>
                        <span>•</span>
                        <span className="text-zinc-300">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{inv.amount}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          {inv.status}
                        </span>
                        <button className="text-zinc-400 hover:text-white p-1">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: API Keys */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in text-xs">
              <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Hanzo Cloud API Key</h3>
                  <p className="text-zinc-400 mt-0.5">Use this token to authenticate SDK & CLI requests to api.hanzo.ai.</p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/60 border border-white/10">
                  <input
                    type="password"
                    readOnly
                    value={user.apiKey}
                    className="flex-1 bg-transparent text-xs text-white outline-none font-mono"
                  />
                  <button
                    onClick={handleCopyApiKey}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Team Seats */}
          {activeTab === 'team' && (
            <div className="space-y-6 animate-in fade-in text-xs">
              <div className="rounded-3xl bg-[#121214] border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Active Pod Members (3 / 10 Seats)</h3>
                    <p className="text-zinc-400 mt-0.5">Collaborate in /vibe rooms with live code and video sync.</p>
                  </div>
                  <Link
                    href="/vibe"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Invite Teammates
                  </Link>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Alex Rivera (You)', email: 'alex@zoolabs.id', role: 'Owner', avatar: 'A' },
                    { name: 'Richard Kaminsky', email: 'richard@zoolabs.id', role: 'Admin', avatar: 'R' },
                    { name: 'Sarah Chen', email: 'sarah@zoo.ngo', role: 'Member', avatar: 'S' },
                  ].map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {m.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-white">{m.name}</p>
                          <p className="text-[10px] text-zinc-500">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-zinc-300 font-mono">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
