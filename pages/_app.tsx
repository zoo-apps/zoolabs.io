import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ZooMcpCopilot from '../components/ZooMcpCopilot'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="dark font-sans">
      <Component {...pageProps} />
      <ZooMcpCopilot />
    </div>
  )
}
