import { Head, Html, Main, NextScript } from 'next/document'
import { bootScript } from '@hanzo/appearance/state'

const DESCRIPTION =
  'Ask Blue, a beluga whale and marine scientist at Zoo Labs Foundation, and search every paper and proposal the foundation has published.'

/**
 * `light` is the design system's own theme class, and this site is a light one:
 * paper ground, black ink, the deep painting its own dark room over the top. It
 * has to be said HERE because @hanzo/design scopes the light half of every
 * colour token to `.light` — without it `--text-primary` stays the dark theme's
 * near-white and base.css paints every heading white on paper. `defaultTheme` on
 * GuiProvider only ever answered for gui's own tokens.
 *
 * The script is the appearance preference, back on the document before the first
 * paint. hanzo.ai carries it in an app-router `layout.tsx`; the same string goes
 * in `<Head>` here, which is a rung better — parsed in the head there is no frame
 * to flash, where the body runs after the browser already has something to paint.
 * The panel writes the preference to storage; this is the half that reads it, so
 * a choice survives a reload instead of lasting until the tab moves. Everything
 * else about it — validating a colour, reacting to a change — is `useAppearance`
 * in components/Look.
 */
export default function Document() {
  return (
    <Html lang="en" className="light">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: bootScript() }} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#f5e8c8" />
        <meta name="description" content={DESCRIPTION} />

        <meta property="og:title" content="Zoo Labs — Ask Blue" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://zoolabs.io" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zoo Labs — Ask Blue" />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
