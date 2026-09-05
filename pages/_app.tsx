import type { AppProps } from 'next/app'
import { GuiProvider } from '@hanzo/gui'
import config from '../lib/gui'
import Look from '../components/Look'

import '../styles/globals.css'
import '../styles/gui.css'

/**
 * `disableInjectCSS`, because `gui.css` above IS the sheet — generated from the
 * same config by `scripts/gui-css.mjs`. Left to inject, the runtime writes the
 * whole accumulated sheet on every flush and the page ships several copies.
 *
 * The site has one appearance, so the theme is stated here and there is nothing
 * to resolve at run time.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <GuiProvider config={config} defaultTheme="light" disableInjectCSS>
      <Component {...pageProps} />
      {/* Site chrome, so it is here and not on each page: every route gets the
          one control over how it reads. */}
      <Look />
    </GuiProvider>
  )
}
