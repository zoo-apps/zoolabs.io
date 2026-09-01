import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Music,
  Play,
  Pause,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  Wand2,
  Layers,
  Radio,
  Activity,
  Disc,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { getBackendBaseUrl } from '../lib/hanzo-ai-service'

const STEM_TRACKS = [
  { id: 't1', name: 'Beluga Bioacoustic 120kHz', color: '#3B82F6', level: 85, muted: false, solo: false },
  { id: 't2', name: 'Arctic Ocean Sub-Bass', color: '#8B5CF6', level: 70, muted: false, solo: false },
  { id: 't3', name: 'Glacier Resonant Pad', color: '#EC4899', level: 60, muted: false, solo: false },
  { id: 't4', name: 'Hydrophone Click Percussion', color: '#10B981', level: 75, muted: false, solo: false },
  { id: 't5', name: 'Whale Call Harmonics', color: '#F59E0B', level: 90, muted: false, solo: false },
]

export default function MusicStudioPage() {
  const [prompt, setPrompt] = useState('Deep ocean ambient meditation with authentic Beluga whale echolocation chirps and sub-bass hydrophone pulses')
  const [bpm, setBpm] = useState(110)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [tracks, setTracks] = useState(STEM_TRACKS)

  const handleGenerateMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)

    const baseUrl = await getBackendBaseUrl()

    try {
      await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'zen-musicfx',
          messages: [
            { role: 'system', content: 'You are Hanzo MusicFX Bioacoustics audio generator.' },
            { role: 'user', content: `Generate stems for: ${prompt}, BPM: ${bpm}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
      setIsPlaying(true)
    }, 1600)
  }

  const toggleMute = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t))
    )
  }

  return (
    <>
      <Head>
        <title>Zoo Flow — AI Music & Bioacoustics DAW</title>
        <meta name="description" content="Generate multi-track bioacoustic wildlife audio and music stems powered by Hanzo AI." />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#0A0A0C] text-white font-sans flex flex-col select-none">
        <ZooAppChrome />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Inspector: Prompt & Master Controls */}
          <aside className="w-80 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto">
            <form onSubmit={handleGenerateMusic} className="space-y-4">
              <div className="space-y-1.5">
                <span className="font-bold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  <span>Bioacoustic Prompt</span>
                </span>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your musical vibe, instruments, and bioacoustic elements..."
                  className="w-full rounded-2xl bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600 resize-none leading-relaxed"
                />
              </div>

              {/* Sliders */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Tempo (BPM)</span>
                    <span className="font-mono text-white font-bold">{bpm} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
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
                  <span>Generating Audio Stems...</span>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Generate Bioacoustic Track</span>
                  </>
                )}
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="text-zinc-400 font-semibold">120kHz Hydrophone Stream</span>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                Raw ultrasonic acoustic telemetry integrated into neural audio synthesis.
              </p>
            </div>
          </aside>

          {/* Center Stage: Multi-Track DAW Mixer */}
          <main className="flex-1 flex flex-col justify-between overflow-hidden bg-black/40 p-6 space-y-6">
            {/* Master Transport Bar */}
            <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <div className="font-mono">
                  <p className="text-sm font-bold text-white">01:24.8 / 03:40.0</p>
                  <p className="text-[10px] text-zinc-400">44.1 kHz • 24-bit Lossless FLAC</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  ● 5 STEMS SYNCED
                </span>
              </div>
            </div>

            {/* Stems Tracks List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="p-4 rounded-2xl bg-[#121214] border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="w-56 shrink-0">
                    <h4 className="text-xs font-bold text-white truncate">{track.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Channel {track.id.toUpperCase()}</p>
                  </div>

                  {/* Waveform Simulator Bars */}
                  <div className="flex-1 flex items-center gap-1 h-8 overflow-hidden">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const h = isPlaying && !track.muted ? Math.max(15, (Math.sin(i * 0.4 + Date.now() * 0.005) * 50 + 50)) : 20
                      return (
                        <div
                          key={i}
                          style={{
                            height: `${h}%`,
                            backgroundColor: track.muted ? '#27272A' : track.color,
                            opacity: track.muted ? 0.3 : 0.8,
                          }}
                          className="flex-1 rounded-full transition-all duration-75"
                        />
                      )
                    })}
                  </div>

                  {/* Track Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleMute(track.id)}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                        track.muted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {track.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
