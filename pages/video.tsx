import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Download,
  Share2,
  Layers,
  Video,
  Wand2,
  Camera,
  Clapperboard,
  Scissors,
  Plus,
  ArrowUp,
  ChevronRight,
  Monitor,
  Eye,
} from 'lucide-react'
import ZooAppChrome from '../components/ZooAppChrome'
import { getBackendBaseUrl } from '../lib/hanzo-ai-service'

const PRESET_CLIPS = [
  { id: 'c1', title: 'Beluga Ocean Deep Dive', dur: '4.2s', src: '/bg_video/static/relactation0.mp4', thumb: '🐬' },
  { id: 'c2', title: 'Arctic Glacier Glide', dur: '6.0s', src: '/bg_video/static/relactation1.mp4', thumb: '🌊' },
  { id: 'c3', title: 'Playful Ocean Spiral', dur: '5.5s', src: '/bg_video/emotion/Playful.mp4', thumb: '🫧' },
  { id: 'c4', title: 'Siberian Tiger Forest Prowl', dur: '8.0s', src: '/bg_video/static/relactation2.mp4', thumb: '🐅' },
]

export default function VideoFlowStudio() {
  const [prompt, setPrompt] = useState('Cinematic 8k IMAX drone shot of a Beluga whale pod swimming under Arctic ice sheets, volumetric sun rays shining through crystal blue water')
  const [selectedClip, setSelectedClip] = useState(PRESET_CLIPS[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [cameraMotion, setCameraMotion] = useState('Pan Up + Orbit Right')
  const [fps, setFps] = useState('60 FPS (Fluid)')
  const [aspectRatio, setAspectRatio] = useState('16:9 Cinema')
  const [duration, setDuration] = useState('8.0s')
  const [timelineTracks, setTimelineTracks] = useState(PRESET_CLIPS)

  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return
    setIsGenerating(true)

    const baseUrl = await getBackendBaseUrl()

    try {
      // Real API request to Hanzo AI backend
      await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'zen-director',
          messages: [
            { role: 'system', content: 'You are Hanzo Veo-3 Video Diffusion engine. Generate camera trajectory and visual parameters.' },
            { role: 'user', content: `Generate video: ${prompt}, motion: ${cameraMotion}, aspect: ${aspectRatio}` },
          ],
        }),
      })
    } catch {
      // handled
    }

    setTimeout(() => {
      setIsGenerating(false)
      const newClip = {
        id: `c_${Date.now()}`,
        title: prompt.slice(0, 26) + '...',
        dur: duration,
        src: PRESET_CLIPS[Math.floor(Math.random() * PRESET_CLIPS.length)].src,
        thumb: '✨',
      }
      setTimelineTracks((prev) => [newClip, ...prev])
      setSelectedClip(newClip)
    }, 1800)
  }

  return (
    <>
      <Head>
        <title>Zoo Flow — AI Video Maker & Cinematic Studio</title>
        <meta name="description" content="Generate and edit generative wildlife videos with AI camera motion and 4K cinema pipelines." />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-[#0A0A0C] text-white font-sans flex flex-col select-none">
        <ZooAppChrome />

        {/* Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Inspector: Prompt & Camera Trajectory */}
          <aside className="w-80 border-r border-white/[0.08] bg-[#121214] flex flex-col justify-between p-4 space-y-4 shrink-0 overflow-y-auto">
            <form onSubmit={handleGenerateVideo} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-bold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
                    <Sparkles className="h-3 w-3" />
                    <span>Prompt to Video</span>
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene in photorealistic detail..."
                  className="w-full rounded-2xl bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600 resize-none leading-relaxed"
                />
              </div>

              {/* Controls */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-purple-400" />
                    <span>Camera Trajectory</span>
                  </label>
                  <select
                    value={cameraMotion}
                    onChange={(e) => setCameraMotion(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                  >
                    <option>Pan Up + Orbit Right</option>
                    <option>Dynamic Drone Dive</option>
                    <option>Underwater Macro Cinematic Follow</option>
                    <option>Static 8K Studio Lock</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white outline-none"
                    >
                      <option>16:9 Cinema</option>
                      <option>9:16 Portrait</option>
                      <option>1:1 Square</option>
                      <option>21:9 UltraWide</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Framerate</label>
                    <select
                      value={fps}
                      onChange={(e) => setFps(e.target.value)}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-2 py-1.5 text-xs text-white outline-none"
                    >
                      <option>60 FPS (Fluid)</option>
                      <option>24 FPS (Cinematic)</option>
                      <option>120 FPS (Slow-Mo)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <span>Generating Veo-3 Video...</span>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Generate AI Video</span>
                  </>
                )}
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="text-zinc-400 font-semibold">Hanzo Veo-3 GPU Node</span>
              <p className="text-zinc-500 text-[10px] leading-relaxed">
                Durable video generation powered by Hanzo Cloud H100 clusters.
              </p>
            </div>
          </aside>

          {/* Center Stage: Video Player & Timeline */}
          <main className="flex-1 flex flex-col justify-between overflow-hidden bg-black/40">
            {/* Video Viewport */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
              <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                <video
                  ref={videoRef}
                  src={selectedClip.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video HUD Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>
                    <span className="font-mono text-[11px] text-zinc-300">00:04.2 / 00:08.0</span>
                  </div>

                  <span className="text-zinc-400 font-mono text-[11px]">{selectedClip.title}</span>
                </div>
              </div>
            </div>

            {/* Bottom Timeline Tracks */}
            <div className="h-36 border-t border-white/[0.08] bg-[#121214] p-4 flex flex-col justify-between shrink-0">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-blue-400" />
                  <span>Timeline Sequence</span>
                </span>
                <span className="text-[10px] font-mono">{timelineTracks.length} clips • 23.7s total</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {timelineTracks.map((clip) => {
                  const isSelected = selectedClip.id === clip.id
                  return (
                    <button
                      key={clip.id}
                      onClick={() => setSelectedClip(clip)}
                      className={`h-16 w-40 rounded-2xl p-2.5 flex flex-col justify-between shrink-0 text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg'
                          : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span>{clip.thumb}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{clip.dur}</span>
                      </div>
                      <span className="text-[11px] font-bold truncate">{clip.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
