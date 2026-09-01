// @hanzo/ui ships the Next wrapper and it is the one way to configure this: it
// discovers every installed `@hanzogui/*`, aliases `react-native` to the web
// implementation, and puts `.web.*` ahead of the default extensions. Hand-rolling
// those is how `next dev` and `next build` come to disagree about compiling.
const withGui = require('@hanzo/ui/next')

/** @type {import('next').NextConfig} */
module.exports = withGui(
  {
    // Served as static files from GitHub Pages, so the build has to emit them.
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    reactStrictMode: true,
    poweredByHeader: false,

    // Next appends its own block to CLAUDE.md/AGENTS.md on every dev run. This
    // repo's agent notes are hand-written and not committed, so leave them be.
    agentRules: false,
  },
  __dirname
)
