import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { Anchor, Paragraph, Strong, XStack, YStack } from '@hanzo/ui'
import { BRAND, Label, Press, Wordmark } from './kit'
import Dock from './Dock'

const MEASURE = 1120

const TABS = [
  { href: '/', label: 'Ask Blue' },
  { href: '/research', label: 'Research' },
]

// Resources, all of them live and all of them ours.
const LINKS = [
  ['Docs', 'https://docs.zoo.ngo'],
  ['Papers', 'https://papers.zoo.ngo'],
  ['Proposals', 'https://zips.zoo.ngo'],
  ['Gym', 'https://gym.zoo.ngo'],
  ['Code', 'https://github.com/zooai'],
  ['Foundation', 'https://zoo.ngo'],
]

/**
 * The wordmark carries the brand and the mark carries the AI: ZOO LABS reads
 * top left at full weight, and the CMYK circle sits bottom right where you
 * reach for it. Header and footer run edge to edge; their contents line up
 * with the page.
 */
export default function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()

  return (
    <YStack minH="100vh">
      <header style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <XStack justify="center" borderBottomWidth={2} borderColor={BRAND.ink} bg="rgba(255,255,255,0.92)">
          <XStack width="100%" maxW={MEASURE} flexWrap="wrap" items="center" gap="$3" px="$4" py="$3">
            <Link href="/">
              <Wordmark first="Zoo" second="Labs" />
            </Link>

            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={pathname === tab.href ? 'page' : undefined}
              >
                <Press tone={pathname === tab.href ? BRAND.yellow : undefined}>
                  <Label>{tab.label}</Label>
                </Press>
              </Link>
            ))}

            <YStack flex={1} />
            <Anchor href="https://zoo.ngo" textDecorationLine="none">
              <Press tone={BRAND.magenta}>
                <Label color="white">The Foundation</Label>
              </Press>
            </Anchor>
          </XStack>
        </XStack>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer>
        <XStack justify="center" mt="$8" borderTopWidth={2} borderColor={BRAND.ink} bg="rgba(255,255,255,0.7)">
          <XStack width="100%" maxW={MEASURE} flexWrap="wrap" gap="$6" px="$4" py="$6">
            <Paragraph maxW="min(380px, 100%)" fontSize={14}>
              <Strong>Zoo Labs Foundation Inc.</Strong> — a 501(c)(3) non-profit research
              organisation. EIN 88-3538992. Everything we publish is open.
            </Paragraph>
            <XStack flexWrap="wrap" gap="$5" minW={0} flex={1}>
              {LINKS.map(([label, href]) => (
                <Anchor key={label} href={href} fontSize={14} fontWeight="700" color={BRAND.ink}>
                  {label}
                </Anchor>
              ))}
            </XStack>
          </XStack>
        </XStack>
      </footer>

      <Dock />
    </YStack>
  )
}
