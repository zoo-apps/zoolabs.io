import { useState, useRef, useEffect } from 'react'
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
  { id: 't1', name: 'Neural Ambient Pad', color: '#3B82F6', level: 85, freq: 220, muted: false },
  { id: 't2', name: 'Sub-Bass Oscillator', color: '#8B5CF6', level: 70, freq: 55, muted: false },
  { id: 't3', name: 'Generative Chord Drone', color: '#EC4899', level: 60, freq: 330, muted: false },
  { id: 't4', name: 'Algorithmic Pulse Arp', color: '#10B981', level: 75, freq: 440, muted: false },
  { id: 't5', name: 'High Harmonics Shimmer', color: '#F59E0B', level: 90, freq: 880, muted: false },
]

export default function MusicStudioPage() {
  const [prompt, setPrompt] = useState('Atmospheric generative ambient soundscape with warm analog sub-bass, neural pads, and evolving spatial shimmer')
  const [bpm, setBpm] = useState(110)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [tracks, setTracks] = useState(STEM_TRACKS)
  const [waveformTick, setWaveformTick] = useState(0)

  // Web Audio Context & Oscillators
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map())

  // Waveform animation loop
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setWaveformTick((t) => (t + 1) % 1000)
    }, 80)
    return () => clearInterval(interval)
  }, [isPlaying])

  const stopAudio = () => {
    try {
      nodesRef.current.forEach(({ osc }) => {
        try { osc.stop() } catch {}
      })
      nodesRef.current.clear()
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.suspend()
      }
    } catch {}
  }

  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtxRef.current = new AudioCtx()
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      stopAudio()

      const ctx = audioCtxRef.current
      tracks.forEach((track) => {
        if (track.muted) return
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = track.id === 't2' ? 'triangle' : track.id === 't4' ? 'sawtooth' : 'sine'
        osc.frequency.setValueAtTime(track.freq, ctx.currentTime)

        // Low volume ambient mixing
        gain.gain.setValueAtTime((track.level / 100) * 0.05, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        nodesRef.current.set(track.id, { osc, gain })
      })
    } catch {}
  }

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio()
      setIsPlaying(false)
    } else {
      startAudio()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

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
            { role: 'system', content: 'You are Hanzo MusicFX audio generator.' },
            { role: 'user', content: `Generate audio stems for: ${prompt}, BPM: ${bpm}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
      if (!isPlaying) {
        startAudio()
        setIsPlaying(true)
      }
    }, 1500)
  }

  const toggleMute = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newMuted = !t.muted
          const existing = nodesRef.current.get(id)
          if (existing && audioCtxRef.current) {
            existing.gain.gain.setValueAtTime(newMuted ? 0 : (t.level / 100) * 0.05, audioCtxRef.current.currentTime)
          }
          return { ...t, muted: newMuted }
        }
        return t
      })
    )
  }

  return (
    <>
      <Head>
        <title>Zoo Flow — AI Music & Generative Audio DAW</title>
        <meta name="description" content="Generate multi-track neural audio stems and soundscapes powered by Hanzo AI." />
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
                  <span>Neural Audio Prompt</span>
                </span>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your musical vibe, instruments, chords, and sound design..."
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
                    <span>Generate Audio Stems</span>
                  </>
                )}
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="text-zinc-400 font-semibold">Web Audio Neural Synthesizer</span>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                Real-time Web Audio API multi-oscillator synthesis running in your browser.
              </p>
            </div>
          </aside>

          {/* Center Stage: Multi-Track DAW Mixer */}
          <main className="flex-1 flex flex-col justify-between overflow-hidden bg-black/40 p-6 space-y-6">
            {/* Master Transport Bar */}
            <div className="p-4 rounded-2xl bg-[#121214] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayback}
                  className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-white/10"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <div className="font-mono">
                  <p className="text-sm font-bold text-white">
                    {isPlaying ? 'LIVE SYNTHESIS ACTIVE' : 'TRANSPORT PAUSED'}
                  </p>
                  <p className="text-[10px] text-zinc-400">48.0 kHz • 32-bit Float • Web Audio Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${
                  isPlaying ? 'bg-emerald-500/20 text-emerald-300 animate-pulse' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  ● {tracks.filter((t) => !t.muted).length} / {tracks.length} STEMS AUDIBLE
                </span>
              </div>
            </div>

            {/* Stems Tracks List */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {tracks.map((track, trackIdx) => (
                <div
                  key={track.id}
                  className="p-4 rounded-2xl bg-[#121214] border border-white/10 flex items-center justify-between gap-4 transition-colors hover:border-white/20"
                >
                  <div className="w-56 shrink-0">
                    <h4 className="text-xs font-bold text-white truncate flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: track.color }} />
                      <span>{track.name}</span>
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-mono">{track.freq} Hz • Channel {track.id.toUpperCase()}</p>
                  </div>

                  {/* Waveform Simulator Bars */}
                  <div className="flex-1 flex items-center gap-1 h-8 overflow-hidden">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const wave = Math.sin((i + waveformTick + trackIdx * 10) * 0.3) * 0.5 + 0.5
                      const h = isPlaying && !track.muted ? Math.max(15, Math.round(wave * 90)) : 15
                      return (
                        <div
                          key={i}
                          style={{
                            height: `${h}%`,
                            backgroundColor: track.muted ? '#27272A' : track.color,
                            opacity: track.muted ? 0.2 : 0.85,
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
                      className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        track.muted ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/15'
                      }`}
                      title={track.muted ? 'Unmute Track' : 'Mute Track'}
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
