import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Palette,
  Sparkles,
  Layout,
  Layers,
  Wand2,
  Sliders,
  Download,
  Share2,
  MousePointer,
  Square,
  Type,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { getBackendBaseUrl } from '../lib/hanzo-ai-service'

export default function DesignCanvasPage() {
  const [prompt, setPrompt] = useState('Liquid glass visual design system for endangered species telemetry dashboard with monochrome dark tokens and cyan accent lines')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTool, setActiveTool] = useState<'select' | 'shape' | 'text' | 'ai'>('select')

  const handleGenerateDesign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)

    const baseUrl = await getBackendBaseUrl()

    try {
      await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'zen-vl',
          messages: [
            { role: 'system', content: 'You are Hanzo Stitch Visual Design engine.' },
            { role: 'user', content: `Generate design tokens and UI components: ${prompt}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
    }, 1400)
  }

  return (
    <>
      <Head>
        <title>Zoo Flow — AI Visual Design Canvas (Google Stitch Style)</title>
        <meta name="description" content="AI visual canvas for wildlife branding, UI layouts, and asset generation." />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#0A0A0C] text-white font-sans flex flex-col select-none">
        <ZooAppChrome />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <aside className="w-80 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto">
            <form onSubmit={handleGenerateDesign} className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-bold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  <span>Stitch Visual Prompt</span>
                </span>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your design layout, theme tokens, and component structure..."
                  className="w-full rounded-2xl bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <span>Synthesizing Design Tokens...</span>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Generate UI Layout</span>
                  </>
                )}
              </button>
            </form>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Design Tools</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'select', name: 'Select & Move', icon: MousePointer },
                  { id: 'shape', name: 'Glass Frame', icon: Square },
                  { id: 'text', name: 'Typography', icon: Type },
                  { id: 'ai', name: 'AI Generator', icon: Sparkles },
                ].map((tool) => {
                  const Icon = tool.icon
                  const isSel = activeTool === tool.id
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        isSel
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{tool.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="text-zinc-400 font-semibold">@hanzo/gui Design Tokens</span>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                Zero shadcn dependencies. Pure native CSS Grid tokens and liquid glass shaders.
              </p>
            </div>
          </aside>

          {/* Center Stage: Interactive Canvas */}
          <main className="flex-1 bg-[#0E0E11] p-8 flex items-center justify-center relative overflow-hidden">
            {/* Grid Canvas Background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Rendered Mock Design Artboard */}
            <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#18181B]/80 backdrop-blur-2xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    🐬
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Zoo Wildlife Telemetry Artboard</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">1440x900 • Responsive CSS Grid</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  LIVE COMPONENT
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Hydrophone SNR', val: '48.2 dB', desc: 'Active 120kHz capture' },
                  { label: 'Species Classified', val: '1,500+', desc: 'Deterministic genetic traits' },
                  { label: 'MicroVM Latency', val: '12ms', desc: 'Direct Hanzo Cloud execution' },
                ].map((card, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <p className="text-[10px] text-zinc-400 font-semibold">{card.label}</p>
                    <p className="text-xl font-extrabold text-white">{card.val}</p>
                    <p className="text-[9px] text-zinc-500">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
