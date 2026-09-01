import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, Bot, Sparkles, Github } from 'lucide-react'
import { BelugaChat } from '../components/BelugaChat'

export default function BelugaPage() {
  return (
    <>
      <Head>
        <title>Blue the Beluga | Fullscreen Ocean AI Avatar - Zoo Labs</title>
        <meta
          name="description"
          content="Full screen interactive ocean AI experience with Blue the Beluga, powered by ZenLM on the Hanzo Cloud."
        />
      </Head>

      <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
        {/* Floating Top Nav (Minimal Monochrome) */}
        <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4 bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl rounded-full px-4 py-2 shadow-2xl">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Zoo</span>
            </Link>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-zinc-300" />
              <span className="font-semibold text-xs text-white">Beluga Ocean Studio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl text-xs font-medium text-zinc-300 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              ZenLM Neural Avatar
            </span>
            <Link
              href="https://github.com/zoo-labs"
              target="_blank"
              className="p-2 rounded-full bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl text-zinc-400 hover:text-white transition-all shadow-2xl"
            >
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Fullscreen Beluga Chat Component */}
        <BelugaChat fullscreen />
      </div>
    </>
  )
}
