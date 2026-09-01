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
  bgGradient: string
  borderColor: string
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
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 70%), #121214',
    borderColor: '#3B82F6',
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
    conservationShare: 'Donation to Wildlife Included',
    tierName: 'RARE TIER',
    emoji: '🐅',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(234, 88, 12, 0.15), transparent 70%), #121214',
    borderColor: '#EA580C',
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
    conservationShare: 'Donation to Wildlife Included',
    tierName: 'SUBLIME TIER',
    emoji: '✨',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15), transparent 70%), #121214',
    borderColor: '#A855F7',
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
    conservationShare: 'Donation to Wildlife Included',
    tierName: 'MASTER TIER',
    emoji: '👑',
    bgGradient: 'radial-gradient(circle at 50% 0%, rgba(234, 179, 8, 0.15), transparent 70%), #121214',
    borderColor: '#EAB308',
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
  }

  const confirmActivation = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <div style={{ backgroundColor: '#0A0A0C', color: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans, "Zen", system-ui, sans-serif)' }}>
      <Head>
        <title>Frontier AI Animal Familiars & Conservation Models — Zoo Labs</title>
        <meta
          name="description"
          content="Unlock frontier bioacoustic AI agents and directly sponsor real-world wildlife sanctuary sensor networks."
        />
      </Head>

      <ZooAppChrome />

      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {/* Header Banner */}
        <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.02em',
            }}
          >
            <Radio style={{ width: '14px', height: '14px', color: '#3B82F6' }} />
            <span>Frontier Bioacoustic AI Ecosystem &middot; 1,500+ Endangered Species</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '850px',
              margin: '0',
            }}
          >
            Unlock Animal Familiars & Sponsor Wildlife Sanctuaries
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.65)',
              maxWidth: '680px',
              lineHeight: 1.6,
              margin: '0',
            }}
          >
            Blue the Beluga is 100% free for everyone. Unlock rare endangered species companions with deterministic
            bioacoustic models and directly support anti-poaching hydrophone arrays worldwide.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Link
              href="https://zoo.ngo/donation"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                background: '#10B981',
                color: '#000',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <Heart style={{ width: '14px', height: '14px' }} />
              <span>Donate Directly at zoo.ngo ↗</span>
            </Link>
            <Link
              href="/vibe"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Launch /vibe Playground</span>
            </Link>
          </div>
        </section>

        {/* 4 Model Tiers in CSS Grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            width: '100%',
          }}
        >
          {MODEL_TIERS.map((tier) => (
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
                boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '32px' }}>{tier.emoji}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${tier.borderColor}60`,
                      color: tier.borderColor,
                    }}
                  >
                    {tier.tierName}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>{tier.title}</h3>
                  <div style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, marginBottom: '8px' }}>
                    {tier.modelTag}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>{tier.price}</div>
                </div>

                {/* Pool & Impact Details */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Pool:</span>
                    <span style={{ fontWeight: 600 }}>{tier.speciesCount}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Impact:</span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>{tier.conservationShare}</span>
                  </div>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tier.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                      <Check style={{ width: '15px', height: '15px', color: tier.borderColor, flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleActivate(tier)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: tier.isFree ? 'rgba(255, 255, 255, 0.1)' : tier.borderColor,
                  color: tier.isFree ? '#FFFFFF' : '#000000',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'opacity 0.2s',
                }}
              >
                <span>{tier.isFree ? 'Activated (Included)' : `Activate ${tier.title}`}</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ))}
        </section>

        {/* Real Wildlife Conservation Sensor Stream Section */}
        <section
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 18, 20, 0.6) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '24px',
            padding: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '13px', fontWeight: 700 }}>
              <Globe style={{ width: '18px', height: '18px' }} />
              <span>Real-World 501(c)(3) Conservation Deployment</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
              Every Model Unlock Directly Sponsors Sanctuary Telemetry
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: 0 }}>
              Zoo Labs donates proceeds directly to the Zoo Foundation 501(c)(3) to deploy bioacoustic hydrophones,
              high-frequency camera traps, and GPS telemetry nodes in protected reserves across the Arctic, Farallon Islands,
              and Sumatra.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>847+</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Species Monitored</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#3B82F6' }}>120 kHz</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Raw Hydrophone Audio</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#EAB308' }}>100%</div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Open Bioacoustics Data</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#09090B',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio style={{ width: '16px', height: '16px', color: '#10B981' }} />
              <span>Live Sanctuary Sensor Telemetry</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono, "Zen Mono", monospace)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.7 }}>
              <div>&gt; NODE_ARCTIC_04: 120kHz Hydrophone Online</div>
              <div>&gt; SPECIES_DETECT: Delphinapterus leucas (Confidence 99.4%)</div>
              <div>&gt; LAT/LON: 71.2906&deg; N, 156.7886&deg; W</div>
              <div>&gt; NEURAL_INFERENCE: Zen4-Bioacoustic-Edge v1.4</div>
              <div style={{ color: '#10B981' }}>&gt; STATUS: Live stream active &bull; 0 packet loss</div>
            </div>
            <Link
              href="https://zoo.ngo/impact"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Explore All Sanctuary Nodes on zoo.ngo ↗</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Activation Checkout Modal */}
      {selectedTier && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => {
            setSelectedTier(null)
            setSuccess(false)
          }}
        >
          <div
            style={{
              background: '#121214',
              border: `1px solid ${selectedTier.borderColor}`,
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '48px' }}>🎉</div>
                <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Model Activated Successfully!</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                  <strong>{selectedTier.title}</strong> is now available in your active agent roster and /vibe multi-agent sandbox.
                </p>
                <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>
                  <Link
                    href="/vibe"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#3B82F6',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '14px',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Open /vibe
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedTier(null)
                      setSuccess(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{selectedTier.emoji}</span>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{selectedTier.title}</h3>
                      <div style={{ fontSize: '12px', color: '#3B82F6' }}>{selectedTier.modelTag}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800 }}>{selectedTier.price}</div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Model Activation:</span>
                    <span style={{ fontWeight: 600 }}>{selectedTier.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Wildlife Conservation Donation:</span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>Included (zoo.ngo)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Compute Infrastructure:</span>
                    <span style={{ fontWeight: 600 }}>Hanzo Cloud GPU MicroVM</span>
                  </div>
                </div>

                <button
                  onClick={confirmActivation}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: selectedTier.borderColor,
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '15px',
                    border: 'none',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    opacity: isProcessing ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isProcessing ? 'Activating Neural Weights...' : selectedTier.isFree ? 'Activate Free Model' : `Complete Activation (${selectedTier.price})`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
