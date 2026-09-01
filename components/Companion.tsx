import { useEffect, useRef, useState } from 'react'
import { XStack, YStack } from '@hanzo/ui'
import { clipFor, hueFor, RESTING, type Feeling } from '../lib/companion'
import { BRAND, Label } from './kit'

/**
 * Blue's face. Plays the clip for whatever Blue is feeling; between questions it
 * drifts through the resting clips. The feeling is written out as well, so it
 * still reads with video blocked or paused.
 */
export default function Companion({
  feeling,
  thinking,
}: {
  feeling: Feeling | null
  thinking: boolean
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [rest, setRest] = useState(0)

  const src = feeling ? clipFor(feeling) : RESTING[rest]
  const hue = feeling ? hueFor(feeling) : BRAND.cyan

  // Reload on source change; a <video> keeps the old file otherwise.
  useEffect(() => {
    video.current?.load()
  }, [src])

  return (
    <figure style={{ margin: 0 }}>
      <YStack
        overflow="hidden"
        borderWidth={2}
        borderColor={BRAND.ink}
        bg={BRAND.blue}
        shadowColor={BRAND.ink}
        shadowOffset={{ width: 6, height: 6 }}
        shadowRadius={0}
        shadowOpacity={1}
      >
        <video
          ref={video}
          src={src}
          autoPlay
          muted
          playsInline
          loop={Boolean(feeling)}
          onEnded={() => !feeling && setRest((n) => (n + 1) % RESTING.length)}
          style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
        />

        <figcaption>
          <XStack items="center" gap="$2" px="$3" py="$2" borderTopWidth={2} borderColor={BRAND.ink} bg={hue}>
            <YStack
              width={10}
              height={10}
              rounded={10}
              borderWidth={1}
              borderColor={BRAND.ink}
              bg="white"
              opacity={thinking ? 0.4 : 1}
            />
            <Label color={BRAND.ink}>
              {thinking ? 'Blue is thinking' : feeling ? `Blue feels ${feeling}` : 'Blue is listening'}
            </Label>
          </XStack>
        </figcaption>
      </YStack>
    </figure>
  )
}
