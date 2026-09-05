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

/**
 * A label: what a control is called, in sentence case, never shouted.
 *
 * `$2` is the ramp's nav rung rather than the number 13, so the reader's own type
 * setting moves it. The old −0.1px of tracking was noise at this size — a
 * hundredth of an em — and tightening is a DISPLAY move; on a label it only costs
 * legibility.
 */
export const Label = styled(Text, {
  name: 'Label',
  fontSize: '$2',
  fontWeight: '500',
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
 * The lockup: the org at full weight, what it does at light.
 *
 * Says what it IS and nothing about how it looks — the size, the weight and the
 * display tracking are `.wordmark` in styles/globals.css, beside the headings it
 * belongs with. Drawn by gui it would carry the fleet's tracking instead, since
 * gui writes a letterSpacing of its own onto every display rung.
 */
export function Wordmark({ first, second }: { first: string; second: string }) {
  return (
    <span className="wordmark">
      {first}&nbsp;<span>{second}</span>
    </span>
  )
}

export { BRAND }
