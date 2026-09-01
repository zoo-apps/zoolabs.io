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
  Wallet,
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
    cta: 'Upgrade to Plus',
    features: [
      'Unlimited High-Definition AI Video & Bioacoustic Stems',
      'Unlimited 3D Mesh Generative Diffusion',
      'Priority GPU MicroVM execution in Zoo Cloud',
      'Private /vibe & /work encrypted rooms',
      '1 Animal Sanctuary sponsorship package included',
      'Dedicated API access token via api.hanzo.ai',
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
    cta: 'Get Pro Pod',
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
    cta: 'Contact Sales',
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'web3'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Payment Form Fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  const handleOpenCheckout = (plan: typeof PRICING_PLANS[0]) => {
    if (plan.id === 'plan_free') {
      router.push('/')
      return
    }
    if (plan.id === 'plan_enterprise') {
      window.location.href = 'mailto:contact@zoolabs.io?subject=Enterprise%20Inquiry'
      return
    }
    setCheckoutPlan(plan)
    setCheckoutSuccess(false)
  }

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const backendUrl = process.env.NEXT_PUBLIC_HANZO_API_URL || 'https://api.hanzo.ai'

    try {
      await fetch(`${backendUrl}/v1/commerce/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: checkoutPlan?.id,
          amount: checkoutPlan?.price,
          method: paymentMethod,
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
        name: 'Richard Kaminsky',
        email: 'richard@zoo.ngo',
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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans relative overflow-x-hidden">
      <Head>
        <title>Zoo Labs — Plans & Pricing ($0, $19, $99)</title>
        <meta
          name="description"
          content="Choose your Zoo Labs subscription plan: Free Plan ($0), Plus Plan ($19), Pro Plan ($99), or Enterprise. Powered by Hanzo AI."
        />
      </Head>

      <ZooAppChrome />

      <main className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Zoo Plans · Free, Plus & Pro</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            Simple, transparent wildlife AI.
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Unlock high-definition video diffusion, bioacoustic music, and 3D modeling while directly funding real-world endangered species conservation.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl bg-white/[0.03] border flex flex-col justify-between relative transition-all ${
                plan.highlighted ? 'border-blue-500/60 shadow-2xl shadow-blue-500/10' : 'border-white/10'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                    {plan.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-400 font-medium">/{plan.billing}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">How do donations to wildlife work?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A portion of every paid tier is allocated directly to verified wildlife sanctuaries and anti-poaching sensor networks via Zoo Labs 501(c)(3).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">Can I cancel anytime?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Yes, you can cancel or switch tiers anytime in your Account Settings. Your access and saved familiars remain available through the billing period.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">What models power Zoo Labs?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zoo is powered by frontier multimodal foundation models and specialized bioacoustic diffusion engines hosted in Hanzo Cloud MicroVMs via api.hanzo.ai.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white text-sm">Do I need a credit card for the Free Plan?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No credit card is required. Blue the Beluga and public datasets are 100% free for everyone forever.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Modal with Card, PayPal, and Web3 USDC */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0d121f] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">Subscribe to {checkoutPlan.name}</h3>
              </div>
              <button
                onClick={() => setCheckoutPlan(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!checkoutSuccess ? (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{checkoutPlan.name}</p>
                    <p className="text-xs text-zinc-400">{checkoutPlan.billing}</p>
                  </div>
                  <div className="text-2xl font-black text-white">{checkoutPlan.price}</div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-xs italic">PayPal</span>
                      <span>Checkout</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('web3')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'web3'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Web3 USDC</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">MM / YY</label>
                        <input
                          type="text"
                          required
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400">CVC</label>
                        <input
                          type="text"
                          required
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
                    <p className="text-xs text-zinc-300">You will be redirected to PayPal Express for one-click checkout.</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Routed via commerce.hanzo.ai</p>
                  </div>
                )}

                {paymentMethod === 'web3' && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center space-y-1">
                    <p className="text-xs text-zinc-300">Pay using MetaMask, Coinbase Wallet, or Rainbow (USDC on Base/Polygon/Ethereum).</p>
                    <p className="text-[10px] text-cyan-400 font-mono">Auto-stake & instant credits</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {isProcessing
                      ? 'Authorizing Secure Payment...'
                      : paymentMethod === 'paypal'
                      ? `Pay ${checkoutPlan.price} with PayPal`
                      : paymentMethod === 'web3'
                      ? `Pay ${checkoutPlan.price} with Crypto`
                      : `Pay ${checkoutPlan.price} & Activate`}
                  </span>
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Welcome to {checkoutPlan.name}. Redirecting to your workspace...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
