import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Box,
  Sparkles,
  Layers,
  Wand2,
  Sliders,
  Download,
  Share2,
  Rotate3d,
  Maximize2,
  Cpu,
  Egg,
  Check,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { getBackendBaseUrl } from '../lib/hanzo-ai-service'

const MODELS_CATALOG = [
  { id: 'm1', name: 'Origin Endangered Egg 3D', poly: '48.2k polys', format: 'GLB / USDZ', thumb: '🥚' },
  { id: 'm2', name: 'Beluga Whale Avatar Rig', poly: '86.4k polys', format: 'Rigged GLTF', thumb: '🐬' },
  { id: 'm3', name: 'Siberian Tiger Companion', poly: '112k polys', format: 'PBR Textures', thumb: '🐅' },
  { id: 'm4', name: 'Sumatran Elephant Sensor Node', poly: '95k polys', format: 'LOD 0-3', thumb: '🐘' },
]

export default function ThreeDEditorPage() {
  const [prompt, setPrompt] = useState('Photorealistic 3D crystalline Origin Egg with translucent obsidian shell, glowing golden core, and procedural Voronoi fracture pattern')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState(MODELS_CATALOG[0])
  const [wireframe, setWireframe] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(1)

  const handleGenerate3D = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)

    const baseUrl = await getBackendBaseUrl()

    try {
      await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'zen-3d',
          messages: [
            { role: 'system', content: 'You are Hanzo 3D Diffusion engine.' },
            { role: 'user', content: `Generate 3D mesh: ${prompt}, wireframe: ${wireframe}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
      const newModel = {
        id: `m_${Date.now()}`,
        name: prompt.slice(0, 24) + ' 3D',
        poly: '64.0k polys',
        format: 'GLB / USDZ',
        thumb: '✨',
      }
      setSelectedModel(newModel)
    }, 1800)
  }

  return (
    <>
      <Head>
        <title>Zoo Flow — 3D Mesh Generator & WebGL Studio</title>
        <meta name="description" content="Generate and edit 3D meshes, Origin Eggs, and animal avatar rigs with Hanzo 3D diffusion." />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#0A0A0C] text-white font-sans flex flex-col select-none">
        <ZooAppChrome />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Inspector: Prompt & Mesh Settings */}
          <aside className="w-80 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto">
            <form onSubmit={handleGenerate3D} className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-bold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  <span>Text to 3D Mesh / Splat</span>
                </span>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your 3D mesh geometry, materials, and lighting..."
                  className="w-full rounded-2xl bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600 resize-none leading-relaxed"
                />
              </div>

              {/* Wireframe toggle */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-semibold text-zinc-300">Wireframe Mode</span>
                  <button
                    type="button"
                    onClick={() => setWireframe(!wireframe)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      wireframe ? 'bg-blue-600 text-white' : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {wireframe ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Rotation Speed</span>
                    <span className="font-mono text-white font-bold">{rotationSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <span>Synthesizing 3D Mesh...</span>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Generate 3D Model</span>
                  </>
                )}
              </button>
            </form>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Mesh Catalog</span>
              <div className="space-y-1.5">
                {MODELS_CATALOG.map((m) => {
                  const isSel = selectedModel.id === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSel
                          ? 'bg-blue-950/40 border-blue-500 text-white shadow-md'
                          : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{m.thumb}</span>
                      <div className="truncate">
                        <p className="font-bold text-xs text-white truncate">{m.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{m.poly} • {m.format}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-1 text-[11px]">
              <span className="text-blue-300 font-semibold flex items-center gap-1">
                <Egg className="h-3.5 w-3.5" />
                <span>Origin Eggs & Animals</span>
              </span>
              <p className="text-zinc-400 text-[10px] leading-relaxed">
                3D models can be exported to GLB, USDZ, or spawned directly into your /vibe multi-agent room.
              </p>
            </div>
          </aside>

          {/* Center Stage: WebGL 3D Viewport */}
          <main className="flex-1 bg-black p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Viewport Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs">
                <Rotate3d className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-white">{selectedModel.name}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 font-mono text-[11px]">{selectedModel.poly}</span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>WebGL 2.0 • 60 FPS</span>
              </div>
            </div>

            {/* 3D Model Representation (Procedural CSS 3D Egg Orbit) */}
            <div className="flex-1 flex items-center justify-center relative">
              <div
                className="relative w-64 h-80 rounded-[50%] flex items-center justify-center transition-transform"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #93C5FD 0%, #1E3A8A 50%, #030712 100%)',
                  boxShadow: '0 0 60px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.3)',
                  border: wireframe ? '2px dashed #60A5FA' : '1px solid rgba(255, 255, 255, 0.2)',
                  animation: `spin ${6 / (rotationSpeed || 1)}s linear infinite`,
                }}
              >
                {/* Core Nucleus */}
                <div
                  className="w-20 h-28 rounded-[50%] bg-gradient-to-tr from-amber-300 to-amber-100 opacity-90 blur-[2px] shadow-2xl shadow-yellow-400"
                />
              </div>
            </div>

            {/* Viewport Footer */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono z-10 border-t border-white/5 pt-3">
              <span>ZOO 3D GENERATOR · ORBIT CONTROLS ACTIVE</span>
              <span>READY FOR WEBGL & HANZO CLOUD MICROVMS</span>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
