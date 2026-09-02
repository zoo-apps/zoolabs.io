/**
 * The read-aloud control's icon.
 *
 * It was 🔈 / 🔊, which on Apple platforms is a glossy grey three-dimensional
 * speaker: it cannot take the button's colour, it renders differently on every
 * platform, and beside the flat ↑ next to it, it read as an ornament rather
 * than a control. Drawn here it inherits currentColor, so it is white on the
 * dark button and black on the light one, and it is the same shape everywhere.
 *
 * On and off are distinguished by shape, not only by colour — waves when it
 * speaks, a cross when it does not — so the state survives being looked at by
 * someone who cannot separate the two fills.
 */
export default function Speaker({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* The cone, as one closed shape. */}
      <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke="none" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <>
          <path d="M16 9.5 21 15" />
          <path d="M21 9.5 16 15" />
        </>
      )}
    </svg>
  )
}
