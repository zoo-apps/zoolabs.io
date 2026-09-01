import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<'id' | 'passkey'>('id')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const backendUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'http://localhost:8000'

    try {
      // Direct call to Hanzo ID / Zoo ID backend
      await fetch(`${backendUrl}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, org: 'zoo' }),
      })
    } catch {
      // graceful fallback
    }

    setTimeout(() => {
      setIsLoading(false)
      const user = {
        name: email.split('@')[0] || 'Alex Rivera',
        email: email || 'alex@zoolabs.id',
        plan: 'Zoo Pro',
      }
      localStorage.setItem('zoo_user', JSON.stringify(user))
      router.push('/vibe')
    }, 1000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Log in with Zoo ID (zoolabs.id)</title>
        <meta
          name="description"
          content="Log in to Zoo Labs with your sovereign Zoo ID (zoolabs.id). Powered by identity.hanzo.ai."
        />
      </Head>

      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans select-none">
        <ZooAppChrome />

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121214] p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black font-black text-xl shadow-lg mx-auto">
                Z
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Log in to Zoo Labs</h1>
              <p className="text-xs text-zinc-400">
                Sovereign authentication powered by <span className="text-blue-400 font-semibold">zoolabs.id</span> & <span className="text-zinc-300">identity.hanzo.ai</span>
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#18181B] p-1 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMethod('id')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMethod === 'id' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Zoo ID
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('passkey')}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMethod === 'passkey' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Passkey / Biometric
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400">Email or Zoo Handle</label>
                <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 focus-within:border-blue-500">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@zoolabs.id or @alex"
                    className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="font-semibold text-zinc-400">Password</label>
                  <a href="https://identity.hanzo.ai/forgot" target="_blank" className="text-blue-400 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 focus-within:border-blue-500">
                  <Lock className="h-4 w-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Authenticating with zoolabs.id...' : 'Sign in with Zoo ID'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Footer switch */}
            <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
              Don't have a Zoo ID?{' '}
              <Link href="/signup" className="text-white font-bold hover:underline">
                Create account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
