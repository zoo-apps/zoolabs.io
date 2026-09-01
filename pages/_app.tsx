import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ZooMcpCopilot from '../components/ZooMcpCopilot'
import { ZooMissionsProvider } from '../lib/zoo-missions-context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ZooMissionsProvider>
      <div className="dark font-sans">
        <Component {...pageProps} />
        <ZooMcpCopilot />
      </div>
    </ZooMissionsProvider>
  )
}
