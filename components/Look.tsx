import { useState } from 'react'
import { YStack } from '@hanzo/ui'
import { Appearance, useAppearance } from '@hanzo/appearance'
import { Label, Panel, Press } from './kit'

/**
 * How the page reads to you: type size, how far apart the sizes sit, density,
 * face, measure.
 *
 * Nothing here decides any of that. @hanzo/appearance writes the knobs and
 * @hanzo/design multiplies them into every ramp, so a change reaches the whole
 * page rather than the handful of places that happen to read a token directly —
 * which is only true while this site keeps asking for rungs instead of numbers.
 *
 * Bottom LEFT, because bottom right is Ask Blue. A site with a settings mark and
 * a chat mark in one corner has asked the reader to guess which is which, and an
 * overlap that only resolves by stacking order is still two controls in one
 * place.
 *
 * `useAppearance` runs whether the panel is open or not. The head script paints
 * type, density and measure before anything else, but it deliberately does not
 * validate a colour, so the mount is where an accent lands. The panel itself is
 * not built until it is asked for.
 */
export default function Look() {
  const [open, setOpen] = useState(false)
  useAppearance()

  return (
    <YStack position="fixed" b={12} l={12} z={40} items="flex-start" gap="$2">
      {/* Opaque, unlike the page's panels: this one floats over running text and
          the site's translucent surface leaves both unreadable. */}
      {open && (
        <Panel bg="white" width={320} maxW="calc(100vw - 24px)" maxH="70vh" overflow="scroll" gap="$2">
          <Appearance />
        </Panel>
      )}
      {/* A mark, not a button: two letters and the site's edge. Measured, a
          full-padded Press lands on the door's composer at 390 — the composer is
          the width of the phone there, so the only clear ground is the strip
          under it. */}
      <Press px="$2" py="$1" onPress={() => setOpen(!open)} label="How this page reads">
        <Label>Aa</Label>
      </Press>
    </YStack>
  )
}
