import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
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
  Radio,
  Layers,
  Heart,
  Globe,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'

type AnimalModelTier = {
  id: string
  title: string
  modelTag: string
  price: string
  speciesCount: string
  conservationShare: string
  tierName: string
  emoji: string
  features: string[]
  isFree?: boolean
}

const MODEL_TIERS: AnimalModelTier[] = [
  {
    id: 'model_genesis_beluga',
    title: 'Genesis Beluga Whale',
    modelTag: 'Zen4-Bioacoustic 7B',
    price: '$0 (Free)',
    isFree: true,
    speciesCount: 'Blue the Beluga Companion',
    conservationShare: '100% Free Open Source',
    tierName: 'FREE TIER',
    emoji: '🐬',
    features: [
      'Instant unlock of Blue the Beluga',
      'Emotionally intelligent bioacoustics model',
      'Full access to /vibe shared workspace',
      'Desktop Clippy companion via @hanzo/bot',
    ],
  },
  {
    id: 'model_endangered',
    title: 'Endangered Species Familiar',
    modelTag: 'Zen4-Omni 32B Multimodal',
    price: '$15 / one-time',
    speciesCount: '1,500+ Species Pool',
    conservationShare: 'Direct Wildlife Allocation',
    tierName: 'RARE TIER',
    emoji: '🐅',
    features: [
      'Siberian Tiger, Amur Leopard, or Sumatran Rhino',
      'Vocalization synthesis & species neural voice',
      'Directly funds sanctuary acoustic sensors',
      'Interactive 3D habitat workspace in /vibe',
    ],
  },
  {
    id: 'model_sublime',
    title: 'Sublime Apex Multimodal Agent',
    modelTag: 'Zen4-Ultra 480B MoE',
    price: '$49 / one-time',
    speciesCount: 'Apex & Deep Ocean Familiars',
    conservationShare: 'Direct Wildlife Allocation',
    tierName: 'SUBLIME TIER',
    emoji: '✨',
    features: [
      'Apex predators & deep ocean leviathans',
      'Autonomous multi-agent research & reasoning',
      'Priority GPU MicroVM queue in Hanzo Cloud',
      '3D Rigged WebGL model with GLB export',
    ],
  },
  {
    id: 'model_sanctuary_node',
    title: 'Sanctuary Hydrophone Sponsor',
    modelTag: 'Edge Sensor Mesh + Telemetry',
    price: '$199 / one-time',
    speciesCount: 'Sanctuary Hardware Node Sponsor',
    conservationShare: 'Direct Wildlife Allocation',
    tierName: 'MASTER TIER',
    emoji: '👑',
    features: [
      'Name & sponsor a real hydrophone/GPS node',
      'Direct 120kHz live acoustic telemetry feed',
      '1/1 Custom 3D generative rig & GLB export',
      '501(c)(3) tax-deductible contribution receipt',
    ],
  },
]

export default function AnimalsPage() {
  const [selectedTier, setSelectedTier] = useState<AnimalModelTier | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleActivate = (tier: AnimalModelTier) => {
    setSelectedTier(tier)
    if (tier.isFree) {
      setSuccess(true)
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <div className="bg-background text-white min-h-screen flex flex-col font-sans relative overflow-x-hidden">
      <Head>
        <title>Frontier AI Animal Familiars & Conservation Models — Zoo Labs</title>
        <meta
          name="description"
          content="Unlock frontier bioacoustic AI agents and directly sponsor real-world wildlife sanctuary sensor networks."
        />
      </Head>

      <div className="glow-backdrop" />
      <ZooAppChrome />

      <main className="container py-12 flex flex-col gap-12 relative z-10">
        {/* Header Hero */}
        <section className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <div className="pill">
            <Radio className="h-3.5 w-3.5 text-blue-400" />
            <span>Frontier Bioacoustic AI Ecosystem · 1,500+ Endangered Species</span>
          </div>

          <h1 className="display-chrome text-4xl md:text-6xl font-bold tracking-tight">
            Unlock Animal Familiars & Sponsor Wildlife Sanctuaries
          </h1>

          <p className="text-secondary text-base md:text-lg leading-relaxed max-w-2xl">
            Blue the Beluga is 100% free for everyone. Unlock rare endangered species companions with deterministic
            bioacoustic models and directly support anti-poaching hydrophone arrays worldwide.
          </p>

          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            <Link
              href="https://zoo.ngo/donation"
              target="_blank"
              className="action"
              data-fill
            >
              <Heart className="h-4 w-4 text-emerald-600" />
              <span>Donate Directly at zoo.ngo ↗</span>
            </Link>
            <Link
              href="/vibe"
              className="action"
            >
              <span>Launch 3-Column Vibe Room &rarr;</span>
            </Link>
          </div>
        </section>

        {/* 4-Tier Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODEL_TIERS.map((tier) => {
            const isFeatured = tier.id === 'model_endangered'

            return (
              <div
                key={tier.id}
                className={`card p-6 flex flex-col justify-between relative transition-all ${
                  isFeatured ? 'border-strong' : ''
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="badge badge-warm uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{tier.emoji}</span>
                    <span className="pill text-xs">
                      {tier.tierName}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{tier.title}</h3>
                    <p className="text-xs font-mono text-zinc-400">{tier.modelTag}</p>
                  </div>

                  <div className="border-b border-white/10 pb-4">
                    <div className="text-2xl font-black text-white">{tier.price}</div>
                    <div className="text-xs text-secondary mt-1 flex items-center gap-1">
                      <Heart className="h-3 w-3 text-emerald-400" />
                      <span>{tier.conservationShare}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-secondary">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleActivate(tier)}
                    className="action w-full"
                    data-fill={isFeatured ? true : undefined}
                  >
                    <span>{tier.isFree ? 'Adopt Free in /vibe' : `Activate ${tier.title.split(' ')[0]}`}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </section>

        {/* Live Bioacoustic Sensor Mesh Status */}
        <section className="card p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="pill mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Sanctuary Mesh Telemetry</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Live Bioacoustic Sensor Arrays</h2>
              <p className="text-sm text-secondary mt-1">
                Funded by Zoo Labs and autonomous community familiars across marine & terrestrial sanctuaries.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-xl font-bold text-white">48 Nodes</div>
                <div className="text-xs text-zinc-500">Live Active</div>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-center">
                <div className="text-xl font-bold text-emerald-400">120 kHz</div>
                <div className="text-xs text-zinc-500">Sampling Rate</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Arctic Cetacean Hydrophones</span>
                <span className="badge badge-online">99.8% Uptime</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Detecting beluga echolocation & bowhead whale acoustic vocalizations in real-time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Sumatran Rainforest Canopy</span>
                <span className="badge badge-online">99.4% Uptime</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Anti-poaching microphone arrays triangulating tiger calls and chainsaw acoustics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Galapagos Marine Sanctuary</span>
                <span className="badge badge-online">100% Uptime</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Tracking hammerhead shark migration rhythms and commercial vessel acoustics.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Activation Modal */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTier.emoji}</span>
                <h3 className="text-base font-bold text-white">{selectedTier.title}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedTier(null)
                  setSuccess(false)
                }}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!success ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Model:</span>
                    <span className="font-mono text-white">{selectedTier.modelTag}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Contribution:</span>
                    <span className="font-bold text-emerald-400">{selectedTier.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleActivate(selectedTier)}
                  disabled={isProcessing}
                  className="action w-full"
                  data-fill
                  style={{ minHeight: '44px' }}
                >
                  {isProcessing ? 'Connecting to Zoo Cloud...' : `Confirm & Activate`}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedTier.title} Activated!</h4>
                  <p className="text-xs text-secondary mt-1">
                    Your companion is now active in your /vibe workspace and telemetry streams.
                  </p>
                </div>
                <Link
                  href="/vibe"
                  className="action w-full"
                  data-fill
                  style={{ minHeight: '44px' }}
                >
                  Enter /vibe Workspace &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
