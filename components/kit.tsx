/**
 * The site's whole visual vocabulary: a hard black edge and an offset shadow.
 * Three pieces, stated once, so nothing on any page invents its own panel.
 *
 * gui draws every box as a div, so anything that needs to BE something — a
 * button, a landmark, a figure — is a real element with the gui box inside it.
 * That keeps semantics in the HTML and styling in the config, rather than
 * asking one prop to carry both.
 */
import type { ComponentProps, ReactNode } from 'react'
import { styled } from '@hanzo/gui'
import { Text, XStack, YStack } from '@hanzo/ui'
import { BRAND } from '../lib/brand'

const shadow = (n: number) => `${n}px ${n}px 0 0 ${BRAND.ink}`

const edge = {
  borderWidth: 2,
  borderColor: BRAND.ink,
  boxShadow: shadow(6),
} as const

/** A surface. */
export const Panel = styled(YStack, {
  name: 'Panel',
  ...edge,
  bg: 'rgba(255,255,255,0.82)',
  p: '$4',

  variants: {
    /** A coloured spine down the left — the one accent a panel gets. */
    spine: {
      ':string': (hue: string) => ({ borderLeftWidth: 10, borderLeftColor: hue }),
    },
  } as const,
})

const PressBox = styled(XStack, {
  name: 'PressBox',
  ...edge,
  items: 'center',
  justify: 'center',
  gap: '$2',
  px: '$4',
  py: '$3',
  bg: 'white',

  variants: {
    tone: {
      ':string': (hue: string) => ({ bg: hue }),
    },
    live: {
      true: {
        hoverStyle: { x: 2, y: 2, bxsh: shadow(4) },
        pressStyle: { x: 4, y: 4, bxsh: shadow(2) },
      },
      false: { o: 0.4 },
    },
  } as const,
})

/** Small caps. Every label on the site is one of these. */
export const Label = styled(Text, {
  name: 'Label',
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 1.8,
  textTransform: 'uppercase',
})

type PressProps = ComponentProps<typeof PressBox> & {
  onPress?: () => void
  disabled?: boolean
  label?: string
  children?: ReactNode
}

/** Anything you click. The shadow shortens as it goes down, so it presses. */
export function Press({ onPress, disabled, label, children, ...box }: PressProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
      style={{
        display: 'block',
        margin: 0,
        padding: 0,
        border: 0,
        background: 'none',
        font: 'inherit',
        color: 'inherit',
        textAlign: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <PressBox live={!disabled} {...box}>
        {children}
      </PressBox>
    </button>
  )
}

/**
 * The lockup, as one shape: the org at full weight, what it does at light.
 * Big and bold, because on a page this quiet the name is the only chrome.
 */
export function Wordmark({ first, second }: { first: string; second: string }) {
  return (
    <Text
      fontSize={30}
      $sm={{ fontSize: 34 }}
      lineHeight={36}
      fontWeight="900"
      letterSpacing={-1}
      textTransform="uppercase"
      color={BRAND.ink}
      select="none"
    >
      {first}&nbsp;
      <Text fontWeight="200" letterSpacing={-1} textTransform="uppercase" color={BRAND.ink}>
        {second}
      </Text>
    </Text>
  )
}

export { BRAND }
