import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { Anchor, Paragraph, XStack, YStack } from '@hanzo/ui'
import { BRAND, Label, Press } from './kit'
import ZooLogo from './ZooLogo'

const MEASURE = 1120

const TABS = [
  { href: '/', label: 'Ask Blue' },
  { href: '/research', label: 'Research' },
]

const LINKS = [
  ['Papers', 'https://papers.zoo.ngo'],
  ['Proposals', 'https://zips.zoo.ngo'],
  ['Code', 'https://github.com/zooai'],
  ['Foundation', 'https://zoo.ngo'],
]

/** Header and footer run edge to edge; their contents line up with the page. */
export default function Chrome({ children }: { children: ReactNode }) {
  const { pathname } = useRouter()

  return (
    <YStack minH="100vh">
      <header style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <XStack justify="center" borderBottomWidth={2} borderColor={BRAND.ink} bg="rgba(255,255,255,0.92)">
          <XStack width="100%" maxW={MEASURE} flexWrap="wrap" items="center" gap="$3" px="$4" py="$3">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ZooLogo size={30} />
              <Paragraph fontSize={19} fontWeight="800">
                Zoo Labs
              </Paragraph>
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

            <Anchor href="https://zoo.ngo" ml="auto" textDecorationLine="none">
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
            <Paragraph maxW={380} fontSize={14}>
              <Paragraph fontWeight="800">Zoo Labs Foundation Inc.</Paragraph> — a 501(c)(3) non-profit
              research organisation. EIN 88-3538992. Everything we publish is open.
            </Paragraph>
            <XStack flexWrap="wrap" gap="$5">
              {LINKS.map(([label, href]) => (
                <Anchor key={label} href={href} fontSize={14} fontWeight="700" color={BRAND.ink}>
                  {label}
                </Anchor>
              ))}
            </XStack>
          </XStack>
        </XStack>
      </footer>
    </YStack>
  )
}
