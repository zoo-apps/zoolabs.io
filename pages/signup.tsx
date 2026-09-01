import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Sparkles, Check } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'https://api.hanzo.ai'

    try {
      await fetch(`${backendUrl}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, org: 'zoo' }),
      })
    } catch {
      // Graceful fallback for demo
    }

    setTimeout(() => {
      setIsLoading(false)
      const user = {
        name: name || email.split('@')[0],
        email: email,
        plan: 'Free Familiar',
      }
      localStorage.setItem('zoo_user', JSON.stringify(user))
      router.push('/pricing')
    }, 600)
  }

  const handleSocialAuth = (provider: 'google' | 'github') => {
    setIsLoading(true)
    setTimeout(() => {
      const user = {
        name: provider === 'google' ? 'Google User' : 'GitHub Dev',
        email: `user@${provider}.com`,
        plan: 'Free Familiar',
      }
      localStorage.setItem('zoo_user', JSON.stringify(user))
      router.push('/pricing')
    }, 600)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs ID — Create Account (zoolabs.id)</title>
        <meta
          name="description"
          content="Create your sovereign Zoo ID, unlock your free Blue the Beluga companion, and join the Zoo Labs network."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen w-full flex flex-col justify-between text-white font-sans select-none"
        style={{
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), rgba(255, 255, 255, 0))',
        }}
      >
        {/* Top Header */}
        <header className="w-full px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-opacity">
            <span className="font-semibold text-sm tracking-tight text-white">Zoo Labs ID</span>
          </Link>

          <Link
            href="https://identity.hanzo.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/80 transition-colors"
          >
            identity.hanzo.ai
          </Link>
        </header>

        {/* Main Center Container */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            className="flex flex-col space-y-3.5"
            style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}
          >
            {/* Title */}
            <h1 className="text-xl font-semibold text-white text-center pb-1">
              Create Account
            </h1>

            {/* Social Auth Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                className="w-full h-11 px-4 rounded-full flex items-center justify-center gap-3 text-sm font-medium text-white transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                }}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('github')}
                className="w-full h-11 px-4 rounded-full flex items-center justify-center gap-3 text-sm font-medium text-white transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                }}
              >
                <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Sign up with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1.5">
              <div className="flex-1 h-[1px] bg-white/[0.12]" />
              <span className="text-xs text-white/40 font-normal">or</span>
              <div className="flex-1 h-[1px] bg-white/[0.12]" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSignup} className="flex flex-col space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-white/80 font-medium pl-3">Your name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Satoshi"
                  className="w-full h-11 px-4 rounded-full text-sm text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/80 font-medium pl-3">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@zoolabs.id"
                  className="w-full h-11 px-4 rounded-full text-sm text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/80 font-medium pl-3">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-11 px-4 pr-11 rounded-full text-sm text-white placeholder:text-white/30 outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/90 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Free Perk Note */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5 text-xs text-white/80">
                <span className="text-lg">🐬</span>
                <span>Includes free Blue the Beluga AI companion unlock</span>
              </div>

              {/* Main Submit: Solid Bright White Pill Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim()}
                className="w-full h-11 rounded-full bg-white text-black font-semibold text-sm transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-lg mt-1"
              >
                {isLoading ? 'Creating Sovereign Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-white/50">Already have an account? </span>
              <Link href="/login" className="text-xs text-white font-medium hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-6 py-6 flex flex-col items-center gap-3 text-xs text-white/40">
          <div className="flex items-center gap-3">
            <span>Zoo Labs Foundation Inc, 2026</span>
            <span>•</span>
            <Link href="https://docs.zoolabs.io/terms" target="_blank" className="hover:text-white/80 transition-colors">
              Terms
            </Link>
          </div>

          <div className="h-5 w-5 rounded-full p-[2px] transition-transform hover:scale-110" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #FF2E93 0deg, #FF8A00 72deg, #FFD600 144deg, #00E5FF 216deg, #7928CA 288deg, #FF2E93 360deg)' }}>
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[8px] font-bold text-white">
              Z
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
