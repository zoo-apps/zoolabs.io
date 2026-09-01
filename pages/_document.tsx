import { Head, Html, Main, NextScript } from 'next/document'

const DESCRIPTION =
  'Ask Blue, a beluga whale and marine scientist at Zoo Labs Foundation, and search every paper and proposal the foundation has published.'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
