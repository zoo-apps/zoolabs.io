import { useId } from 'react'

/** The Zoo mark: three overlapping circles making the CMYK Venn. */
export default function ZooLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  // Clip paths are referenced by id, so each instance needs its own.
  const uid = useId().replace(/:/g, '')
  const ring = `ring-${uid}`
  const green = `green-${uid}`
  const red = `red-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Zoo Labs Foundation"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id={ring}>
          <circle cx="512" cy="511" r="270" />
        </clipPath>
        <clipPath id={green}>
          <circle cx="513" cy="369" r="234" />
        </clipPath>
        <clipPath id={red}>
          <circle cx="365" cy="595" r="234" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${ring})`}>
        <circle cx="513" cy="369" r="234" fill="#00A652" />
        <circle cx="365" cy="595" r="234" fill="#ED1C24" />
        <circle cx="643" cy="595" r="234" fill="#2E3192" />
        <g clipPath={`url(#${green})`}>
          <circle cx="365" cy="595" r="234" fill="#FCF006" />
          <circle cx="643" cy="595" r="234" fill="#01ACF1" />
        </g>
        <g clipPath={`url(#${red})`}>
          <circle cx="643" cy="595" r="234" fill="#EA018E" />
        </g>
        <g clipPath={`url(#${green})`}>
          <g clipPath={`url(#${red})`}>
            <circle cx="643" cy="595" r="234" fill="#FFFFFF" />
          </g>
        </g>
      </g>
    </svg>
  )
}
