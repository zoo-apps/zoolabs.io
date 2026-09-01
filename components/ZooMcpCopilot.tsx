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
  ChevronUp,
  Activity,
  Play,
  RotateCw,
  ExternalLink,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'
import { getBackendBaseUrl, streamChatCompletion } from '../lib/hanzo-ai-service'

type McpLog = {
  id: string
  tool: string
  args: string
  result: string
  timestamp: string
}

export default function ZooMcpCopilot() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [inputPrompt, setInputPrompt] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeFamiliar, setActiveFamiliar] = useState<'beluga' | 'tiger' | 'elephant' | 'leopard'>('beluga')
  const [mcpLogs, setMcpLogs] = useState<McpLog[]>([
    {
      id: 'mcp_0',
      tool: 'mcp:hanzo_ai_gateway',
      args: '{ status: "connected", host: "api.hanzo.ai", latency: "12ms" }',
      result: 'Active MicroVM Cluster: 100% operational',
      timestamp: 'Just now',
    },
  ])

  const [copilotMessages, setCopilotMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm Blue — your autonomous Zoo Labs & Hanzo Cloud MCP Copilot. I can control the app, switch workspaces, generate video/music/3D, manage animal companions, and handle billing.",
    },
  ])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [copilotMessages, mcpLogs])

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
      result: 'Executed successfully via Hanzo AI backend',
      timestamp: 'Just now',
    }

    let responseText = "I've processed your command through Hanzo Cloud MCP microVM."

    if (lower.includes('video') || lower.includes('veo') || lower.includes('clip')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/video", view: "Veo-3 Studio" }',
        result: 'Navigated to AI Video Diffusion Studio',
        timestamp: 'Just now',
      }
      responseText = "Switching to the /video studio with Veo-3 GPU cluster active."
      setTimeout(() => router.push('/video'), 1000)
    } else if (lower.includes('music') || lower.includes('audio') || lower.includes('sound') || lower.includes('stem')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/music", view: "Bioacoustics DAW" }',
        result: 'Navigated to Bioacoustics DAW',
        timestamp: 'Just now',
      }
      responseText = "Opening the /music DAW. 120kHz raw hydrophone stream ready."
      setTimeout(() => router.push('/music'), 1000)
    } else if (lower.includes('3d') || lower.includes('model') || lower.includes('mesh')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/3d", view: "3D Editor" }',
        result: 'Navigated to 3D Mesh Studio',
        timestamp: 'Just now',
      }
      responseText = "Opening the /3d mesh editor. Ready for WebGL diffusion."
      setTimeout(() => router.push('/3d'), 1000)
    } else if (lower.includes('plan') || lower.includes('price') || lower.includes('billing') || lower.includes('subscribe')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:commerce_portal',
        args: '{ plan: "Plus Plan ($19)", amount: "$19.00" }',
        result: 'Redirecting to Hanzo Commerce Checkout',
        timestamp: 'Just now',
      }
      responseText = "I've navigated to the /pricing portal. You can buy the Plus Plan ($19) or Pro Plan ($99) directly."
      setTimeout(() => router.push('/pricing'), 1000)
    } else if (lower.includes('vibe') || lower.includes('friend') || lower.includes('room')) {
      actionLog = {
        id: `mcp_${Date.now()}`,
        tool: 'mcp:router_navigate',
        args: '{ path: "/vibe", mode: "Metaverse Pod" }',
        result: 'Navigated to /vibe room',
        timestamp: 'Just now',
      }
      responseText = "Connecting you to the /vibe multi-agent pod room."
      setTimeout(() => router.push('/vibe'), 1000)
    }

    setMcpLogs((prev) => [...prev, actionLog])
    setTimeout(() => {
      setCopilotMessages((prev) => [...prev, { role: 'assistant', text: responseText }])
      setIsExecuting(false)
    }, 800)
  }

  return (
    <>
      {/* ─── Floating Bottom-Right Zoo Favicon Copilot Launcher ───────── */}
      <div className="fixed bottom-5 right-5 z-50 select-none">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-black via-[#18181B] to-blue-900 border-2 border-white/20 shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open Zoo MCP Autonomous AI Assist"
          >
            {/* Favicon Z Wordmark */}
            <span className="font-black text-base text-white">Z</span>

            {/* Glowing Echolocation Ping Ring on Top-Right */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border border-black items-center justify-center text-[8px] font-bold text-white">
                🐬
              </span>
            </span>
          </button>
        ) : (
          /* ─── Opened MCP Copilot Drawer ─────────────────────────────── */
          <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl border border-white/15 bg-[#121214]/95 backdrop-blur-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 text-xs text-white">
            {/* Header */}
            <div className="h-12 border-b border-white/10 px-4 bg-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">ZOO</span>
                <div>
                  <h4 className="font-extrabold text-xs text-white tracking-tight flex items-center gap-1.5">
                    <span>MCP AI Assist</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 rounded-full font-mono">
                      api.hanzo.ai
                    </span>
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Live Hanzo AI Status Bar */}
            <div className="px-3 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">Hanzo AI Gateway:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <span className="text-zinc-500 font-mono">Hanzo Commerce Active</span>
            </div>

            {/* Message Stream */}
            <div
              ref={scrollerRef}
              className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
            >
              {copilotMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs shrink-0 shadow-md">
                      🐬
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-sm'
                        : 'bg-[#18181B] border border-white/10 text-zinc-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* MCP Tool Invocation Cards */}
              {mcpLogs.slice(-3).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-2xl bg-black/50 border border-white/10 space-y-1 font-mono text-[10px]"
                >
                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Terminal className="h-3 w-3" />
                      <span>{log.tool}</span>
                    </span>
                    <span className="text-zinc-500 text-[9px]">{log.timestamp}</span>
                  </div>
                  <p className="text-zinc-400 truncate">{log.args}</p>
                  <p className="text-emerald-400 flex items-center gap-1 pt-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{log.result}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Action Suggestions */}
            <div className="p-2 border-t border-white/5 bg-black/30 flex items-center gap-1.5 overflow-x-auto text-[10px] font-medium no-scrollbar">
              <button
                onClick={() => router.push('/vibe')}
                className="px-2 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-zinc-300 shrink-0 cursor-pointer"
              >
                🤝 Vibe Pod
              </button>
              <button
                onClick={() => router.push('/pricing')}
                className="px-2 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 shrink-0 cursor-pointer"
              >
                ✨ Buy Plus ($19)
              </button>
              <button
                onClick={() => router.push('/video')}
                className="px-2 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-zinc-300 shrink-0 cursor-pointer"
              >
                🎬 Video Maker
              </button>
              <button
                onClick={() => router.push('/work')}
                className="px-2 py-1 rounded-full bg-white/[0.06] hover:bg-white/10 text-zinc-300 shrink-0 cursor-pointer"
              >
                💼 Workboard
              </button>
            </div>

            {/* Bottom Input */}
            <form
              onSubmit={handleExecutePrompt}
              className="p-2.5 border-t border-white/10 bg-[#18181B] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Blue to control the app..."
                className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-blue-500 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                disabled={isExecuting || !inputPrompt.trim()}
                className="h-8 w-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center disabled:opacity-40 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
