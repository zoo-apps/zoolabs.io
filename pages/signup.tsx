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
  Egg,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const backendUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'http://localhost:8000'

    try {
      await fetch(`${backendUrl}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, org: 'zoo' }),
      })
    } catch {
      // graceful fallback
    }

    setTimeout(() => {
      setIsLoading(false)
      const user = {
        name: name || 'Alex Rivera',
        email: email || 'alex@zoolabs.id',
        plan: 'Free Familiar',
      }
      localStorage.setItem('zoo_user', JSON.stringify(user))
      router.push('/pricing')
    }, 1000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Sign Up & Create Zoo ID (zoolabs.id)</title>
        <meta
          name="description"
          content="Create your sovereign Zoo ID (zoolabs.id), claim your free Beluga whale AI familiar, and join the Zoo Labs network."
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
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Create your Zoo ID</h1>
              <p className="text-xs text-zinc-400">
                Claim your free Blue the Beluga companion & join 1,500+ species sanctuaries.
              </p>
            </div>

            {/* Free Perk Card */}
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-3">
              <span className="text-2xl">🐬</span>
              <div className="text-xs">
                <p className="font-bold text-white">Free Beluga Whale AI Included</p>
                <p className="text-[10px] text-zinc-400">Automatic Blue companion unlock on signup.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400">Full Name or Handle</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@zoolabs.id"
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3.5 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>{isLoading ? 'Creating Sovereign Zoo ID...' : 'Claim Free Account & Beluga'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Footer switch */}
            <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
              Already have a Zoo ID?{' '}
              <Link href="/login" className="text-white font-bold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
