import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Sparkles,
  Bot,
  X,
  Send,
  Terminal,
  Cpu,
  Layers,
  Wand2,
  Activity,
  Play,
  RotateCw,
  ExternalLink,
  Sliders,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Zap,
} from 'lucide-react'
import { getBackendBaseUrl, streamChatCompletion } from '../lib/hanzo-ai-service'

type McpLog = {
  id: string
  tool: string
  args: string
  result: string
  timestamp: string
}

type TabKey = 'chat' | 'tools' | 'appearance' | 'cloud'

const ACCENT_COLORS = [
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Electric Blue', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
]

export default function ZooMcpCopilot() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('chat')
  const [inputPrompt, setInputPrompt] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)

  // @hanzo/appearance live state
  const [themeMode, setThemeMode] = useState<'dark' | 'oled' | 'ocean'>('dark')
  const [glassOpacity, setGlassOpacity] = useState(60)
  const [glassBlur, setGlassBlur] = useState(24)
  const [accentColor, setAccentColor] = useState('#06b6d4')
  const [borderRadius, setBorderRadius] = useState(16)

  const [mcpLogs, setMcpLogs] = useState<McpLog[]>([
    {
      id: 'mcp_0',
      tool: 'mcp:hanzo_cloud_sandbox',
      args: '{ endpoint: "http://127.0.0.1:8080", cluster: "local-dev" }',
      result: 'MicroVM sandbox initialized (8.4ms latency)',
      timestamp: 'Just now',
    },
    {
      id: 'mcp_1',
      tool: 'mcp:sovereign_weights',
      args: '{ model: "zenlm-70b-bitdelta", lora: "soup-v1" }',
      result: 'LoRA parameters blended in GPU memory',
      timestamp: '1m ago',
    },
  ])

  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I'm your Zoo MCP agent. Connected to Hanzo Cloud microVMs at 127.0.0.1:8080. How can I assist with your workspaces, tools, or design tokens?",
    },
  ])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [copilotMessages, mcpLogs])

  // Apply appearance tokens dynamically to document
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.style.setProperty('--glass-opacity', `${glassOpacity / 100}`)
    root.style.setProperty('--glass-blur', `${glassBlur}px`)
    root.style.setProperty('--accent-primary', accentColor)
    root.style.setProperty('--radius-base', `${borderRadius}px`)
  }, [glassOpacity, glassBlur, accentColor, borderRadius, themeMode])

  const handleExecutePrompt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputPrompt.trim() || isExecuting) return

    const userText = inputPrompt.trim()
    setInputPrompt('')
    setIsExecuting(true)

    setCopilotMessages((prev) => [...prev, { role: 'user', text: userText }])

    const lower = userText.toLowerCase()
    let actionLog: McpLog = {
      id: `mcp_${Date.now()}`,
      tool: 'mcp:agent_action',
      args: JSON.stringify({ prompt: userText }),
      result: 'Processed through Hanzo Cloud microVM sandbox',
      timestamp: 'Just now',
    }

    let responseText = "Executed task via Hanzo Cloud microVM runtime."

    if (lower.includes('video') || lower.includes('clip')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/video" }',
        result: 'Navigating to Video Studio',
        timestamp: 'Just now',
      }
      responseText = "Navigating to AI Video Diffusion Studio."
      setTimeout(() => router.push('/video'), 800)
    } else if (lower.includes('music') || lower.includes('sound')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/music" }',
        result: 'Navigating to Bioacoustics DAW',
        timestamp: 'Just now',
      }
      responseText = "Opening Bioacoustics DAW."
      setTimeout(() => router.push('/music'), 800)
    } else if (lower.includes('work') || lower.includes('task') || lower.includes('board') || lower.includes('kanban')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/work" }',
        result: 'Navigating to Work Studio',
        timestamp: 'Just now',
      }
      responseText = "Opening Zoo Work Kanban Board."
      setTimeout(() => router.push('/work'), 800)
    } else if (lower.includes('vibe') || lower.includes('friend') || lower.includes('room')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/vibe" }',
        result: 'Navigating to /vibe room',
        timestamp: 'Just now',
      }
      responseText = "Connecting you to the /vibe multiplayer room."
      setTimeout(() => router.push('/vibe'), 800)
    } else if (lower.includes('animal') || lower.includes('agent') || lower.includes('fleet')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/animals" }',
        result: 'Navigating to AI Agents Ecosystem',
        timestamp: 'Just now',
      }
      responseText = "Opening AI Agents Ecosystem dashboard."
      setTimeout(() => router.push('/animals'), 800)
    }

    setMcpLogs((prev) => [...prev, actionLog])
    setTimeout(() => {
      setCopilotMessages((prev) => [...prev, { role: 'assistant', text: responseText }])
      setIsExecuting(false)
    }, 600)
  }

  return (
    <>
      {/* ─── Fixed Bottom-Right Zoo Launcher ───────── */}
      <div
        className="fixed bottom-5 right-5 z-50 select-none"
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/20 shadow-2xl shadow-cyan-500/20 hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open Zoo MCP Control Center"
          >
            {/* Pure Zoo Geometric Logo */}
            <div className="flex items-center justify-center">
              <span className="font-black text-lg tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                Z
              </span>
            </div>

            {/* Glowing online microVM indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-black"></span>
            </span>
          </button>
        ) : (
          /* ─── Opened Zoo MCP Drawer ─────────────────────────────── */
          <div className="w-[380px] sm:w-[420px] h-[540px] rounded-3xl border border-white/15 bg-[#0e1117]/95 backdrop-blur-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 text-xs text-white">
            {/* Header */}
            <div className="h-12 border-b border-white/10 px-4 bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-black text-xs text-cyan-400">
                  Z
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
                    <span>Zoo MCP Studio</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                      Cloud 8080
                    </span>
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tabs Switcher */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/40 text-[11px] shrink-0">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'chat'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'tools'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                MCP Tools ({mcpLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'appearance'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="h-3 w-3" />
                <span>Appearance</span>
              </button>
              <button
                onClick={() => setActiveTab('cloud')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                  activeTab === 'cloud'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Cloud
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
              {/* TAB 1: Chat */}
              {activeTab === 'chat' && (
                <div ref={scrollerRef} className="space-y-3">
                  {copilotMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-cyan-600 text-white font-medium'
                            : 'bg-zinc-900 border border-white/10 text-zinc-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isExecuting && (
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] animate-pulse">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" /> Calling Hanzo microVM MCP tools…
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MCP Tools */}
              {activeTab === 'tools' && (
                <div className="space-y-2.5">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Registered MCP Servers & Logs
                  </div>
                  {mcpLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-400 font-semibold">{log.tool}</span>
                        <span className="text-[9px] text-zinc-500">{log.timestamp}</span>
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 truncate">{log.args}</div>
                      <div className="text-[11px] text-emerald-400">{log.result}</div>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                    <div className="font-semibold text-white">Active Native Sidecars</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['fs', 'zsh', 'git', 'clickhouse', 'microvm', 'zenlm'].map((tool) => (
                        <span key={tool} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                          mcp:{tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Appearance (@hanzo/appearance & @hanzo/tokens) */}
              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Theme Mode</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['dark', 'oled', 'ocean'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setThemeMode(m)}
                          className={`py-1.5 rounded-xl border text-center capitalize font-medium transition-all cursor-pointer ${
                            themeMode === m
                              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-sm'
                              : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Accent Color</label>
                    <div className="flex items-center gap-2">
                      {ACCENT_COLORS.map((col) => (
                        <button
                          key={col.hex}
                          onClick={() => setAccentColor(col.hex)}
                          style={{ backgroundColor: col.hex }}
                          className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                            accentColor === col.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          title={col.name}
                        >
                          {accentColor === col.hex && <Check className="h-3.5 w-3.5 text-black stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Liquid Glass Blur Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Glass Backdrop Blur</span>
                      <span className="font-mono text-cyan-400">{glassBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={glassBlur}
                      onChange={(e) => setGlassBlur(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Glass Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Liquid Glass Opacity</span>
                      <span className="font-mono text-cyan-400">{glassOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={glassOpacity}
                      onChange={(e) => setGlassOpacity(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Corner Radius */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">Border Radius Knob</span>
                      <span className="font-mono text-cyan-400">{borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="28"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Cloud Settings */}
              {activeTab === 'cloud' && (
                <div className="space-y-3 text-[11px]">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Hanzo Cloud MicroVM</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                      </span>
                    </div>
                    <div className="font-mono text-zinc-400 text-[10px] bg-black/60 p-2 rounded-lg border border-white/5">
                      Endpoint: http://127.0.0.1:8080
                    </div>
                    <div className="flex justify-between text-zinc-400 pt-1 border-t border-white/5">
                      <span>Inference Model</span>
                      <span className="text-cyan-400 font-mono">ZenLM 70B · BitDelta</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Throughput</span>
                      <span className="text-white font-mono">142 tokens/sec</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-zinc-400">
                    <div className="font-semibold text-white">Sovereign Decentralization</div>
                    <div>Weights remain local or self-hosted in your Hanzo microVM pod with zero proprietary telemetry.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input (only in Chat or Tools tab) */}
            {(activeTab === 'chat' || activeTab === 'tools') && (
              <form
                onSubmit={handleExecutePrompt}
                className="p-3 border-t border-white/10 bg-black/50 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask MCP agent or run microVM command…"
                  className="flex-1 bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isExecuting || !inputPrompt.trim()}
                  className="h-8 w-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  )
}
