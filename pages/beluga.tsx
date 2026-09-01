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
        {/* Fullscreen Beluga Chat Component */}
        <BelugaChat fullscreen />
      </div>
    </>
  )
}
