import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Egg,
  Sparkles,
  Zap,
  Shield,
  CreditCard,
  ArrowRight,
  Check,
  TrendingUp,
  Cpu,
  Lock,
  Flame,
  Award,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

type EggTier = {
  id: string
  title: string
  price: string
  speciesCount: string
  conservationShare: string
  tierName: string
  emoji: string
  bgGradient: string
  borderColor: string
  features: string[]
  isFree?: boolean
}

const EGG_TIERS: EggTier[] = [
  {
    id: 'egg_genesis_beluga',
    title: 'Genesis Beluga Whale',
    price: '$0 (Free)',
    isFree: true,
    speciesCount: 'Blue the Beluga Companion',
    conservationShare: '100% Free Open Source',
    tierName: 'FREE TIER',
    emoji: '🐬',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%), #121214',
    borderColor: '#3B82F6',
    features: [
      'Instant unlock of Blue the Beluga',
      'Emotionally intelligent bioacoustics model',
      'Full access to /vibe shared playground',
      'Desktop Clippy companion via @hanzo/bot',
    ],
  },
  {
    id: 'egg_endangered',
    title: 'Endangered Species Egg',
    price: '$15 / one-time',
    speciesCount: '1,500+ Species Pool',
    conservationShare: '82% to Real Wildlife',
    tierName: 'RARE TIER',
    emoji: '🥚',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(234, 88, 12, 0.15), transparent 70%), #121214',
    borderColor: '#EA580C',
    features: [
      'Hatch Siberian Tiger, Amur Leopard, or Rhino',
      'Deterministic DNA traits & animal voice',
      '82% directly funds sanctuary acoustic sensors',
      'Animated habitat background video in /vibe',
    ],
  },
  {
    id: 'egg_sublime',
    title: 'Sublime Origin Egg',
    price: '$49 / one-time',
    speciesCount: 'Apex & Mythic Familiars',
    conservationShare: '82% to Real Wildlife',
    tierName: 'SUBLIME TIER',
    emoji: '✨',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15), transparent 70%), #121214',
    borderColor: '#A855F7',
    features: [
      'Apex predators & deep ocean leviathans',
      'Guaranteed high-tier AI agent autonomy',
      'Priority GPU MicroVM queue in Hanzo Cloud',
      '3D Rigged WebGL model with GLB export',
    ],
  },
  {
    id: 'egg_apex_sanctuary',
    title: 'Sanctuary Master Sponsor',
    price: '$199 / one-time',
    speciesCount: 'Sanctuary Node Sponsor',
    conservationShare: '82% to Real Wildlife',
    tierName: 'MASTER TIER',
    emoji: '👑',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(234, 179, 8, 0.15), transparent 70%), #121214',
    borderColor: '#EAB308',
    features: [
      'Name & sponsor a real hydrophone/GPS node',
      'Direct telemetry stream from sanctuary sensors',
      '1/1 Custom 3D generative rig & GLB export',
      'Dedicated agent running 24/7 in Hanzo Cloud',
    ],
  },
]

export default function MintPage() {
  const [mintingId, setMintingId] = useState<string | null>(null)
  const [mintSuccess, setMintSuccess] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<EggTier | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClaim = (tier: EggTier) => {
    if (tier.isFree) {
      setMintingId(tier.id)
      setTimeout(() => {
        setMintingId(null)
        setMintSuccess(tier.id)
      }, 1200)
    } else {
      setCheckoutModal(tier)
    }
  }

  const handleSquareCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setMintSuccess(checkoutModal?.id || null)
      setCheckoutModal(null)
    }, 1500)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — Animals & Origin Eggs</title>
        <meta
          name="description"
          content="Sponsor and unlock autonomous animal AI familiars. Powered by Hanzo Commerce and api.hanzo.ai."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          backgroundColor: '#0A0A0C',
          color: '#FFFFFF',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          userSelect: 'none',
        }}
      >
        <ZooAppChrome />

        {/* ─── Main Content Container (CSS Grid Layout) ──────────────────── */}
        <main
          style={{
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
            padding: '40px 24px 80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          }}
        >
          {/* Hero Banner Section */}
          <section
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#A1A1AA',
              }}
            >
              <Sparkles style={{ height: '14px', width: '14px', color: '#3B82F6' }} />
              <span>Wildlife AI Ecosystem · 1,500+ Endangered Species</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
                maxWidth: '720px',
              }}
            >
              Unlock Animal Familiars & Sponsor Wildlife Sanctuaries
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: '#A1A1AA',
                maxWidth: '640px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Blue the Beluga is 100% free for everyone. Unlock rare endangered species companions with deterministic traits and support anti-poaching hydrophone arrays worldwide.
            </p>
          </section>

          {/* ─── EGG TIERS GRID (Responsive 1/2/3/4 Columns) ───────────────── */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              width: '100%',
            }}
          >
            {EGG_TIERS.map((tier) => {
              const isMinting = mintingId === tier.id
              const isSuccess = mintSuccess === tier.id

              return (
                <div
                  key={tier.id}
                  style={{
                    background: tier.bgGradient,
                    border: `1px solid ${tier.borderColor}40`,
                    borderRadius: '24px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '36px' }}>{tier.emoji}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          backgroundColor: `${tier.borderColor}20`,
                          color: tier.borderColor,
                          border: `1px solid ${tier.borderColor}40`,
                          fontFamily: 'monospace',
                        }}
                      >
                        {tier.tierName}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF' }}>
                        {tier.title}
                      </h3>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>{tier.price}</div>
                    </div>

                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#71717A' }}>Pool:</span>
                        <span style={{ fontWeight: 600, color: '#E4E4E7' }}>{tier.speciesCount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#71717A' }}>Impact:</span>
                        <span style={{ fontWeight: 600, color: '#10B981' }}>{tier.conservationShare}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#D4D4D8' }}>
                      {tier.features.map((f, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Check style={{ height: '14px', width: '14px', color: tier.borderColor, flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ lineHeight: 1.4 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaim(tier)}
                    disabled={isMinting}
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      borderRadius: '14px',
                      backgroundColor: tier.isFree ? '#3B82F6' : '#FFFFFF',
                      color: tier.isFree ? '#FFFFFF' : '#000000',
                      fontWeight: 800,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {isMinting ? (
                      <span>Unlocking Animal Familiar...</span>
                    ) : isSuccess ? (
                      <span style={{ color: tier.isFree ? '#FFFFFF' : '#10B981' }}>✓ Active in /vibe</span>
                    ) : (
                      <>
                        <span>{tier.isFree ? 'Unlock Free Beluga' : `Buy Now (${tier.price})`}</span>
                        <ArrowRight style={{ height: '14px', width: '14px' }} />
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </section>
        </main>

        {/* Square Checkout Modal for Animals */}
        {checkoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#18181B] p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white">Sponsor {checkoutModal.title}</h3>
                <button onClick={() => setCheckoutModal(null)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs">
                <div className="flex justify-between text-zinc-400"><span>Animal:</span><span className="text-white font-bold">{checkoutModal.title}</span></div>
                <div className="flex justify-between text-zinc-400"><span>Price:</span><span className="text-blue-400 font-bold">{checkoutModal.price}</span></div>
                <div className="flex justify-between text-emerald-400 pt-1 border-t border-white/5 font-semibold"><span>82% Wildlife Allocation:</span><span>Included</span></div>
              </div>

              <form onSubmit={handleSquareCheckout} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400">Card Number</label>
                  <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 px-3 py-2">
                    <CreditCard className="h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="4111 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  {isProcessing ? 'Processing Square Payment...' : `Confirm Sponsorship (${checkoutModal.price})`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
