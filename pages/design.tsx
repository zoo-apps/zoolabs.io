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
  Code2,
  Copy,
  Box,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { getBackendBaseUrl } from '../lib/hanzo-ai-service'

export default function DesignCanvasPage() {
  const [prompt, setPrompt] = useState('Liquid glass Sovereign AI landing page with BitDelta parameter cards, dark monochrome aesthetic, and electric cyan accents')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTool, setActiveTool] = useState<'select' | 'shape' | 'text' | 'ai'>('select')
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'canvas' | 'code'>('canvas')

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
            { role: 'system', content: 'You are Hanzo Stitch UI/UX design engine.' },
            { role: 'user', content: `Generate sovereign AI layout components: ${prompt}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
    }, 1200)
  }

  const copyComponentCode = () => {
    const code = `<div className="rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl p-8 space-y-6">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-bold text-white">Sovereign Frontier AI</h3>
    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Zen 70B Active</span>
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">BitDelta Compression</p>
      <p className="text-2xl font-bold text-white">1-bit</p>
    </div>
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">DeltaSoup Merging</p>
      <p className="text-2xl font-bold text-white">Dynamic</p>
    </div>
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">MicroVM Latency</p>
      <p className="text-2xl font-bold text-white">8ms</p>
    </div>
  </div>
</div>`
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <>
      <Head>
        <title>Zoo Labs — AI UI Design Studio (Stitch & ComfyUI 3D)</title>
        <meta name="description" content="AI visual canvas for Sovereign AI UI layouts, design tokens, and component generation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#090b0e] text-zinc-100 font-sans flex flex-col select-none">
        <ZooAppChrome />

        {/* Subheader */}
        <div className="h-11 border-b border-white/[0.08] bg-[#0c0f14] px-4 flex items-center justify-between shrink-0 z-40 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Zoo Design Studio</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Liquid Glass Token Canvas</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px]">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'canvas' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'code' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Code (TSX)
              </button>
            </div>

            <button
              onClick={copyComponentCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Export TSX'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <aside className="w-80 border-r border-white/[0.08] bg-zinc-950/90 flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto">
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

          {/* Center Stage: Interactive Canvas or Code */}
          <main className="flex-1 bg-[#07090c] p-8 flex items-center justify-center relative overflow-hidden">
            {/* Grid Canvas Background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {activeTab === 'canvas' ? (
              /* Rendered Mock Design Artboard */
              <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#12161f]/80 backdrop-blur-2xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-blue-600/30">
                      🐬
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">Sovereign Frontier AI Artboard</h3>
                      <p className="text-[11px] text-zinc-400 font-mono">1440x900 • Responsive Liquid Glass</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono font-medium">
                    LIVE TOKEN SYSTEM
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'BitDelta Compression', val: '1-bit', desc: 'Zero accuracy loss delta' },
                    { label: 'DeltaSoup Weights', val: 'Dynamic', desc: 'Real-time LoRA merge' },
                    { label: 'MicroVM Latency', val: '8ms', desc: 'Hanzo Cloud Go backend' },
                  ].map((card, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1 shadow-lg">
                      <p className="text-[11px] text-zinc-400 font-medium">{card.label}</p>
                      <p className="text-2xl font-extrabold text-white">{card.val}</p>
                      <p className="text-[10px] text-zinc-500">{card.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white text-sm">Deploy UI Components to /vibe</h4>
                    <p className="text-xs text-zinc-400">Instantly preview across all active pod participants.</p>
                  </div>
                  <Link
                    href="/vibe"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30"
                  >
                    Open /vibe
                  </Link>
                </div>
              </div>
            ) : (
              /* Code View */
              <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl font-mono text-xs text-zinc-300 overflow-y-auto max-h-[500px] leading-relaxed">
                <pre>{`<div className="rounded-3xl border border-white/15 bg-black/60 backdrop-blur-2xl p-8 space-y-6">
  <div className="flex justify-between items-center">
    <h3 className="text-xl font-bold text-white">Sovereign Frontier AI</h3>
    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Zen 70B Active</span>
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">BitDelta Compression</p>
      <p className="text-2xl font-bold text-white">1-bit</p>
    </div>
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">DeltaSoup Merging</p>
      <p className="text-2xl font-bold text-white">Dynamic</p>
    </div>
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
      <p className="text-xs text-zinc-400">MicroVM Latency</p>
      <p className="text-2xl font-bold text-white">8ms</p>
    </div>
  </div>
</div>`}</pre>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
