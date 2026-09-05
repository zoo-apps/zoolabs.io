import { useEffect, useRef, useState } from 'react'

/**
 * The clip behind the page, and the dissolve between clips.
 *
 * One video element cannot change what it is playing without going blank: set
 * `src`, call `load()`, and the element holds nothing until the first frame of
 * the next clip has arrived over the network. That is a black flash in the
 * middle of a sentence, every time Blue's feeling changes — the exact moment
 * the page is asking to be watched.
 *
 * So there are two elements, stacked. The one you can see keeps playing while
 * the other loads the next clip in silence; only once that one says it can play
 * do they trade opacity, and only then do they trade roles. Nothing is ever on
 * screen that has not already buffered, so there is no frame to lose.
 *
 * A clip that fails to load never gets its turn — the fade is driven by
 * `canplay`, so a 404 or a dead connection simply leaves the current clip
 * running. Better a beluga at rest than a black rectangle.
 */

export default function Film({
  src,
  loop,
  onEnded,
}: {
  src: string
  /** A feeling holds; a resting clip plays once and hands over to the next. */
  loop: boolean
  onEnded?: () => void
}) {
  // Which of the two elements is the one being watched.
  const [front, setFront] = useState(0)
  // What each element is playing. Both start on the same clip so the first
  // paint has a frame rather than a fade from nothing.
  const [reel, setReel] = useState<[string, string]>([src, src])
  const el = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]

  useEffect(() => {
    if (reel[front] === src) return

    const back = 1 - front
    const next = el[back].current
    if (!next) return

    // Point the hidden element at the new clip and wait. `canplay` is the
    // promise that a frame exists; anything earlier would show the blank we
    // are here to avoid.
    let live = true
    const show = () => {
      if (!live) return
      void next.play().catch(() => {})
      setFront(back)
    }

    setReel((r) => (back === 0 ? [src, r[1]] : [r[0], src]))
    next.addEventListener('canplay', show, { once: true })
    return () => {
      live = false
      next.removeEventListener('canplay', show)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, front, reel])

  return (
    <>
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={el[i]}
          src={reel[i]}
          className="deep-film"
          style={{ opacity: i === front ? 1 : 0 }}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop={loop}
          aria-hidden
          // Only the clip being watched decides when it has finished. The one
          // behind is buffering, and its `ended` is nobody's business.
          onEnded={i === front ? onEnded : undefined}
        />
      ))}
    </>
  )
}
