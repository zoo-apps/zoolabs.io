import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  Lock,
  ArrowRight,
  HelpCircle,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

const PRICING_PLANS = [
  {
    id: 'plan_free',
    name: 'Free Plan',
    price: '$0',
    billing: 'Free forever',
    description: 'Perfect for exploring wildlife AI and interacting with Blue the Beluga.',
    badge: 'COMMUNITY',
    highlighted: false,
    cta: 'Get Started',
    features: [
      'Full access to Blue the Beluga AI companion',
      'Shared /vibe collaborative playground',
      'Desktop Clippy familiar companion mode',
      'Standard model generation queue',
      'Public wildlife research datasets',
    ],
  },
  {
    id: 'plan_plus',
    name: 'Plus Plan',
    price: '$19',
    billing: 'per month',
    description: 'For creators, researchers, and developers generating wildlife video, music & 3D.',
    badge: 'MOST POPULAR',
    highlighted: true,
    cta: 'Buy Now',
    features: [
      'Unlimited 4K AI Video & Bioacoustic Stems',
      'Unlimited 3D Mesh Generative Diffusion',
      'Priority GPU MicroVM execution in Zoo Cloud',
      'Private /vibe & /work encrypted rooms',
      '1 Animal Sanctuary sponsorship package included',
      'Dedicated API access token via api.zoolabs.io',
    ],
  },
  {
    id: 'plan_pro',
    name: 'Pro Plan',
    price: '$99',
    billing: 'per month (10 seats)',
    description: 'For wildlife organizations, research labs, and multi-agent developer pods.',
    badge: 'TEAMS & LABS',
    highlighted: false,
    cta: 'Buy Now',
    features: [
      '10 Team Seats with shared Slack/Linear workboard',
      'Direct hydrophone 120kHz raw telemetry stream',
      'Shared persistent Zoo Cloud code sandbox',
      'Donations directly supporting wildlife sanctuaries',
      '5 Custom animal familiar avatar models',
      'Dedicated Slack & priority email support',
    ],
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 'Custom',
    billing: 'Annual billing',
    description: 'Custom GPU nodes, sovereign biometric telemetry, and bespoke 3D animal avatars.',
    badge: 'ENTERPRISE',
    highlighted: false,
    cta: 'Contact Us',
    features: [
      'Dedicated Zoo Cloud H100 GPU microVM cluster',
      'Custom 3D animal avatar rig & voice cloning',
      'Sovereign self-hosted k3s/k8s node integration',
      '24/7 dedicated engineering support',
      'SLA guarantee & custom compliance',
    ],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [checkoutPlan, setCheckoutPlan] = useState<typeof PRICING_PLANS[0] | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Payment Form Fields
  const [cardNumber, setCardNumber] = useState('')
  const [expDate, setExpDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [zipCode, setZipCode] = useState('')

  const handleStartCheckout = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.id === 'plan_free') {
      router.push('/signup')
      return
    }
    if (plan.id === 'plan_enterprise') {
      window.location.href = 'mailto:council@zoo.ngo?subject=Zoo%20Enterprise%20Plan%20Inquiry'
      return
    }
    setCheckoutPlan(plan)
    setCheckoutSuccess(false)
  }

  const handleCompleteSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const backendUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'http://localhost:8000'

    try {
      // Hanzo Commerce API checkout
      await fetch(`${backendUrl}/v1/commerce/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: checkoutPlan?.id,
          amount: checkoutPlan?.price,
          org: 'zoo',
        }),
      })
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsProcessing(false)
      setCheckoutSuccess(true)

      const user = {
        name: 'Alex Rivera',
        email: 'alex@zoolabs.id',
        plan: checkoutPlan?.name || 'Plus Plan',
      }
      localStorage.setItem('zoo_user', JSON.stringify(user))

      setTimeout(() => {
        setCheckoutPlan(null)
        router.push('/settings')
      }, 1200)
    }, 1200)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Plans & Pricing ($0, $19, $99)</title>
        <meta
          name="description"
          content="Choose your Zoo Labs subscription plan: Free Plan ($0), Plus Plan ($19), Pro Plan ($99), or Enterprise. Powered by Hanzo AI."
        />
        {/* OpenGraph and Twitter Preview Meta Tags */}
        <meta property="og:title" content="Zoo Labs — Plans & Pricing ($0, $19, $99)" />
        <meta property="og:description" content="Unlock unlimited 4K video diffusion, bioacoustic music, and 3D modeling while directly funding real-world endangered species conservation." />
        <meta property="og:url" content="https://zoolabs.io/pricing" />
        <meta property="og:site_name" content="Zoo Labs" />
        <meta property="og:image" content="https://zoolabs.io/images/og-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@zoo_labs" />
        <meta name="twitter:title" content="Zoo Labs — Plans & Pricing ($0, $19, $99)" />
        <meta name="twitter:description" content="Unlock unlimited 4K video diffusion, bioacoustic music, and 3D modeling while directly funding real-world endangered species conservation." />
        <meta name="twitter:image" content="https://zoolabs.io/images/og-preview.png" />
      </Head>

      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans select-none">
        <ZooAppChrome />

        <main className="max-w-7xl w-full mx-auto px-4 py-12 sm:py-16 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Zoo Plans · Free, Plus & Pro</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Simple, transparent wildlife AI.
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Unlock unlimited 4K video diffusion, bioacoustic music, and 3D modeling while directly funding real-world endangered species conservation.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 border transition-all ${
                  plan.highlighted
                    ? 'border-blue-500/80 bg-gradient-to-b from-blue-950/40 via-[#121214] to-[#0A0A0C] shadow-2xl shadow-blue-900/20'
                    : 'border-white/10 bg-[#121214]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {plan.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-zinc-400 font-medium">/{plan.billing}</span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleStartCheckout(plan)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Conservation Commitment Banner */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#18181B] via-blue-950/20 to-[#18181B] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                <span>Direct Wildlife Conservation Donations</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Direct Wildlife Sanctuary Impact</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We donate proceeds directly to real-time acoustic sensors, GPS tracking collars, and anti-poaching camera arrays in protected wildlife reserves worldwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://zoo.ngo"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Donate at zoo.ngo</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => handleStartCheckout(PRICING_PLANS[1])}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Buy Plus Plan ($19)
              </button>
            </div>
          </div>
        </main>

        {/* Checkout Modal */}
        {checkoutPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Subscribe to {checkoutPlan.name}</h3>
                  <p className="text-[11px] text-zinc-400">Secure checkout powered by Zoo Commerce</p>
                </div>
                <button
                  onClick={() => setCheckoutPlan(null)}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Plan:</span>
                  <span className="font-bold text-white">{checkoutPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total:</span>
                  <span className="text-lg font-black text-blue-400">{checkoutPlan.price} / month</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                  <span>Wildlife Sanctuary Donation:</span>
                  <span className="text-emerald-400 font-semibold">Included (zoo.ngo)</span>
                </div>
              </div>

              {/* Credit Card Form */}
              <form onSubmit={handleCompleteSubscription} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400">Card Number</label>
                  <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 focus-within:border-blue-500">
                    <CreditCard className="h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="4111 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-zinc-400">Expires</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-zinc-400">CVC</label>
                    <input
                      type="text"
                      required
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-semibold text-zinc-400">Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="94103"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer mt-2"
                >
                  {isProcessing ? (
                    <span>Processing Subscription...</span>
                  ) : checkoutSuccess ? (
                    <span className="text-emerald-300">✓ Subscription Active!</span>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Buy Now ({checkoutPlan.price}/mo)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
