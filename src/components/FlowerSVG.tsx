import { useId } from 'react'
import type { FlowerType } from '../types'

interface FlowerSVGProps {
  type: FlowerType
  width?: number
  className?: string
}

/**
 * Cohesive cute-botanical flower heads. Every flower is drawn in a 100x120
 * coordinate space and its calyx tip sits exactly at (50, 120) — the
 * bottom-centre anchor where a bouquet stem attaches.
 */
export const FLOWER_ASPECT_H = 120 / 100

/**
 * The flower drawing as raw SVG content (gradients + shapes), so the same
 * art can be embedded directly in the bouquet's single coordinate system.
 */
export function FlowerArt({ type }: { type: FlowerType }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  switch (type) {
    case 'rose':
      return <RoseArt uid={uid} />
    case 'tulip':
      return <TulipArt uid={uid} />
    case 'daisy':
      return <DaisyArt uid={uid} />
    case 'peony':
      return <PeonyArt uid={uid} />
    case 'sunflower':
      return <SunflowerArt uid={uid} />
    case 'wildflower':
      return <WildflowerArt uid={uid} />
    case 'babysbreath':
      return <BabysBreathArt />
    case 'lavender':
      return <LavenderArt />
    default:
      return <DaisyArt uid={uid} />
  }
}

export default function FlowerSVG({ type, width = 30, className }: FlowerSVGProps) {
  return (
    <svg
      width={width}
      viewBox="0 0 100 120"
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <FlowerArt type={type} />
    </svg>
  )
}

function Calyx({ top = 98 }: { top?: number }) {
  return (
    <g>
      <path
        d={`M50 120 C 46 114 41 106 39 ${top} C 45 106 49 112 50 120 Z`}
        fill="#7E9C66"
        stroke="#6D8A55"
        strokeWidth="0.8"
      />
      <path
        d={`M50 120 C 54 114 59 106 61 ${top} C 55 106 51 112 50 120 Z`}
        fill="#7E9C66"
        stroke="#6D8A55"
        strokeWidth="0.8"
      />
    </g>
  )
}

function petalEllipse(
  cx: number,
  cy: number,
  r: number,
  angle: number,
  rx: number,
  ry: number,
  fill: string,
  stroke?: string,
) {
  const x = cx + r * Math.cos(angle)
  const yy = cy + r * Math.sin(angle)
  return (
    <ellipse
      cx={x}
      cy={yy}
      rx={rx}
      ry={ry}
      fill={fill}
      stroke={stroke}
      transform={`rotate(${(angle * 180) / Math.PI + 90} ${x} ${yy})`}
    />
  )
}

function RoseArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-rg`} cx="38%" cy="32%" r="74%">
          <stop offset="0%" stopColor="#F3A0A4" />
          <stop offset="55%" stopColor="#D95F67" />
          <stop offset="100%" stopColor="#B8434E" />
        </radialGradient>
        <radialGradient id={`${uid}-mg`} cx="44%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#CF626C" />
          <stop offset="100%" stopColor="#9C3F4C" />
        </radialGradient>
      </defs>
      <g>
        <path d="M50 118 C 44 112 39 103 40 93 C 45 99 49 108 50 118 Z" fill="#7E9C66" />
        <path d="M50 118 C 56 112 61 103 60 93 C 55 99 51 108 50 118 Z" fill="#7E9C66" />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            {petalEllipse(50, 56, 25, (i * Math.PI * 2) / 5 + Math.PI / 5, 21, 16.5, `url(#${uid}-rg)`, '#B8434E')}
          </g>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={i}>
            {petalEllipse(50, 56, 12.5, (i * Math.PI) / 2 + Math.PI / 4, 12, 9.5, `url(#${uid}-mg)`, '#8E2F3E')}
          </g>
        ))}
        <path
          d="M50 48 a5.5 5.5 0 1 1 -5.5 5.5 a8.5 8.5 0 1 0 8.5 -8.5 a12 12 0 1 1 -12 12"
          fill="none"
          stroke="#8E2F3E"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M40 42 C 44 37 52 36 56 40" stroke="rgba(255,240,235,0.7)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <Calyx top={96} />
      </g>
    </g>
  )
}

function TulipArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8C4A2" />
          <stop offset="55%" stopColor="#EF9875" />
          <stop offset="100%" stopColor="#D36B5E" />
        </linearGradient>
        <linearGradient id={`${uid}-fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBCFAE" />
          <stop offset="100%" stopColor="#E58A6C" />
        </linearGradient>
      </defs>
      <g>
        <path d="M50 82 C 30 74 22 54 25 38 C 27 30 33 25 40 26 C 37 40 41 62 50 80 Z" fill="#D98064" />
        <path d="M50 82 C 70 74 78 54 75 38 C 73 30 67 25 60 26 C 63 40 59 62 50 80 Z" fill="#D98064" />
        <path d="M50 82 C 40 76 33 58 35 42 C 36 32 40 27 45 26 C 48 30 49 38 50 44 C 51 38 52 30 55 26 C 60 27 64 32 65 42 C 67 58 60 76 50 82 Z" fill={`url(#${uid}-fg)`} stroke="#E0856F" strokeWidth="1.2" />
        <path d="M50 82 C 46 70 44 56 45 44" stroke="rgba(255,240,235,0.55)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M50 82 C 55 70 57 56 56 46" stroke="rgba(255,240,235,0.35)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M50 82 C 45 92 43 104 50 120 C 57 104 55 92 50 82 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth="0.8" />
      </g>
    </g>
  )
}

function DaisyArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-cg`} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#F9D977" />
          <stop offset="60%" stopColor="#F0BE4E" />
          <stop offset="100%" stopColor="#DDA03A" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 13 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 27.7 + (i % 2) * 0.9} 50 50)`}>
            <ellipse cx="50" cy="33" rx="7.5" ry="16" fill={i % 2 === 0 ? '#FFFFFF' : '#FDF6EC'} />
            <ellipse cx="50" cy="33" rx="7.5" ry="16" fill="none" stroke="#EFE3CE" strokeWidth="0.9" />
          </g>
        ))}
        <circle cx="50" cy="50" r="14.5" fill={`url(#${uid}-cg)`} />
        <circle cx="50" cy="50" r="14.5" fill="none" stroke="#CF932E" strokeWidth="1" />
        {(
          [
            [46, 46, 2],
            [54, 46, 2],
            [46, 54, 2],
            [54, 54, 2],
            [50, 50, 2.2],
            [50, 42, 1.7],
            [50, 58, 1.7],
            [42, 50, 1.7],
            [58, 50, 1.7],
          ] as const
        ).map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#D39A2C" />
        ))}
        <circle cx="46" cy="46" r="3" fill="rgba(255,243,196,0.85)" />
        <Calyx top={104} />
      </g>
    </g>
  )
}

function ruffledPetal(scale: number, fill: string, stroke?: string) {
  return (
    <g transform={`translate(50 50) scale(${scale}) translate(-50 -50)`}>
      <path
        d="M 50 50 C 39 44 37 30 42 24 C 46 20 48 22 50 25 C 52 22 54 20 58 24 C 63 30 61 44 50 50 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
    </g>
  )
}

function PeonyArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-og`} cx="40%" cy="34%" r="76%">
          <stop offset="0%" stopColor="#FACCC4" />
          <stop offset="70%" stopColor="#F2A0A6" />
          <stop offset="100%" stopColor="#E28B93" />
        </radialGradient>
        <radialGradient id={`${uid}-ig`} cx="42%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#EF9FA6" />
          <stop offset="100%" stopColor="#D97E8F" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 60} 50 50)`}>
            {ruffledPetal(1.22, `url(#${uid}-og)`, '#E8A299')}
          </g>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 60 + 30} 50 50)`}>
            {ruffledPetal(0.82, `url(#${uid}-ig)`, '#DE8790')}
          </g>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 90 + 15} 50 50)`}>
            {ruffledPetal(0.5, '#D97E8F', '#C76B7C')}
          </g>
        ))}
        <path d="M50 47 a3.5 3.5 0 1 1 -3.5 3.5 a5.5 5.5 0 1 0 5.5 -5.5" fill="none" stroke="#A84A5E" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M42 40 C 46 36 51 36 55 39" stroke="rgba(255,245,240,0.8)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <Calyx top={88} />
      </g>
    </g>
  )
}

function SunflowerArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-dg`} cx="40%" cy="36%" r="75%">
          <stop offset="0%" stopColor="#8A5432" />
          <stop offset="100%" stopColor="#5F3820" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 15 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 24} 50 50)`}>
            <ellipse cx="50" cy="29" rx="8" ry="19" fill={i % 2 === 0 ? '#F7CE66' : '#EFB143'} />
            <ellipse cx="50" cy="29" rx="8" ry="19" fill="none" stroke="#DFA12F" strokeWidth="0.8" />
          </g>
        ))}
        <circle cx="50" cy="50" r="16.5" fill={`url(#${uid}-dg)`} />
        <circle cx="50" cy="50" r="16.5" fill="none" stroke="#4A2B16" strokeWidth="1.6" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 137.5 * Math.PI) / 180
          const r = 4 + ((i * 7) % 9)
          return (
            <circle key={i} cx={50 + r * Math.cos(angle)} cy={50 + r * Math.sin(angle)} r="1.8" fill={i % 3 === 0 ? '#9C6B3B' : '#B57C48'} />
          )
        })}
        <circle cx="45" cy="45" r="3" fill="rgba(255,217,160,0.5)" />
        <Calyx top={106} />
      </g>
    </g>
  )
}

function WildflowerArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-pg`} cx="42%" cy="36%" r="78%">
          <stop offset="0%" stopColor="#F29086" />
          <stop offset="70%" stopColor="#E06A5F" />
          <stop offset="100%" stopColor="#C75B52" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 5 }).map((_, i) => {
          const wide = i % 2 === 1
          return (
            <g key={i} transform={`rotate(${i * 72 + (i % 2) * 4} 50 66)`}>
              <path
                d={wide ? 'M 50 66 C 44 55 41.5 42 50 32 C 58.5 42 56 55 50 66 Z' : 'M 50 66 C 45.5 55 44 42 50 33 C 56 42 54.5 55 50 66 Z'}
                fill={`url(#${uid}-pg)`}
                stroke="#C95B52"
                strokeWidth="1.1"
              />
            </g>
          )
        })}
        <circle cx="50" cy="66" r="7.5" fill="#FFF6E8" stroke="#E8C9A0" strokeWidth="1" />
        <circle cx="50" cy="66" r="3.2" fill="#E0734F" />
        <path d="M43 52 C 45 48 49 47 52 49" stroke="rgba(255,250,240,0.75)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <Calyx top={108} />
      </g>
    </g>
  )
}

function BabysBreathArt() {
  return (
    <g>
      <path d="M50 120 C 48 92 51 62 50 40 C 49.6 33 50 27 50 22" stroke="#A9B98F" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M50 92 C 43 84 36 80 30 78" stroke="#A9B98F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 70 C 58 62 66 58 73 57" stroke="#A9B98F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 52 C 44 46 38 42 33 40" stroke="#A9B98F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M50 96 C 57 90 63 87 68 86" stroke="#A9B98F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {(
        [
          [50, 22, 4.2, '#FEFDFA'],
          [46, 34, 3.2, '#FEFDFA'],
          [55, 48, 3.4, '#F6F0FA'],
          [44, 60, 3.2, '#FEFDFA'],
          [57, 80, 3, '#FEFDFA'],
          [47, 88, 3, '#F6F0FA'],
          [30, 78, 4.4, '#FEFDFA'],
          [73, 57, 4.2, '#FEFDFA'],
          [33, 40, 3.6, '#F6F0FA'],
          [68, 86, 3.4, '#FEFDFA'],
          [40, 72, 3, '#FEFDFA'],
          [60, 30, 3.2, '#F6F0FA'],
          [38, 28, 2.8, '#FEFDFA'],
          [64, 44, 3, '#FEFDFA'],
        ] as const
      ).map(([x, y, r, fill], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={fill} stroke="#D8C6E0" strokeWidth="1" />
      ))}
      <path d="M50 120 C 47 115 46 110 47 107 C 49 110 50 114 50 120 Z" fill="#7E9C66" />
      <path d="M50 120 C 53 115 54 110 53 107 C 51 110 50 114 50 120 Z" fill="#7E9C66" />
    </g>
  )
}

function LavenderArt() {
  const nodes = [40, 54, 68, 82, 96]
  const colors = ['#C7B1E6', '#B79FD9', '#A78ACB', '#9678BC', '#8F6CB8']
  return (
    <g>
      <path d="M50 120 C 49 90 50 56 50 26" stroke="#7E9C66" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {nodes.map((y, i) => {
        const r = 3.8 + (y - 40) * 0.054
        const color = colors[i]
        return (
          <g key={i}>
            {[-r, -r / 2, 0, r / 2, r].map((dx, k) => (
              <circle
                key={k}
                cx={50 + dx}
                cy={y + ((k % 3) - 1)}
                r={r + (dx === 0 ? 0.8 : 0.2)}
                fill={color}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.7"
              />
            ))}
          </g>
        )
      })}
      <circle cx="50" cy="22" r="2.6" fill="#DDCEF2" />
      <circle cx="47" cy="19.5" r="2" fill="#D2BFEC" />
      <circle cx="53" cy="21" r="1.9" fill="#D2BFEC" />
      <path d="M50 120 C 46 113 43 105 45 100 C 48 106 50 112 50 120 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth="0.7" />
      <path d="M50 120 C 54 113 57 105 55 100 C 52 106 50 112 50 120 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth="0.7" />
    </g>
  )
}
