import React from 'react'

export default function ZooLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  const s = size
  const rOuter = (270 / 1024) * s
  const rInner = (234 / 1024) * s
  const cx = s / 2
  const cy = s / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <defs>
        <clipPath id="zooOuterCircle">
          <circle cx="512" cy="511" r="270" />
        </clipPath>
        <clipPath id="zooGreenClip">
          <circle cx="513" cy="369" r="234" />
        </clipPath>
        <clipPath id="zooRedClip">
          <circle cx="365" cy="595" r="234" />
        </clipPath>
      </defs>
      <g clipPath="url(#zooOuterCircle)">
        <circle cx="513" cy="369" r="234" fill="#00A652" />
        <circle cx="365" cy="595" r="234" fill="#ED1C24" />
        <circle cx="643" cy="595" r="234" fill="#2E3192" />
        <g clipPath="url(#zooGreenClip)">
          <circle cx="365" cy="595" r="234" fill="#FCF006" />
        </g>
        <g clipPath="url(#zooGreenClip)">
          <circle cx="643" cy="595" r="234" fill="#01ACF1" />
        </g>
        <g clipPath="url(#zooRedClip)">
          <circle cx="643" cy="595" r="234" fill="#EA018E" />
        </g>
        <g clipPath="url(#zooGreenClip)">
          <g clipPath="url(#zooRedClip)">
            <circle cx="643" cy="595" r="234" fill="#FFFFFF" />
          </g>
        </g>
      </g>
    </svg>
  )
}
