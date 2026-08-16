import { useId, useMemo } from 'react'
import type { FlowerType } from '../types'
import { hashSeed, mulberry32 } from '../data/bouquet'
import { flowerInfo } from '../data/flowers'

interface FlowerSVGProps {
  type: FlowerType
  width?: number
  className?: string
}

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

function Calyx({ top = 98, fill = '#7E9C66', stroke = '#6D8A55' }: { top?: number; fill?: string; stroke?: string }) {
  return (
    <g>
      <path
        d={`M50 120 C 46 114 41 106 39 ${top} C 45 106 49 112 50 120 Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
      />
      <path
        d={`M50 120 C 54 114 59 106 61 ${top} C 55 106 51 112 50 120 Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
      />
    </g>
  )
}

/** layered petal placed on a ring around a centre, rotated & scaled */
function petalPath(cx: number, cy: number, r: number, angle: number, d: string, fill: string, stroke?: string, strokeWidth = 1) {
  const x = cx + r * Math.cos(angle)
  const yy = cy + r * Math.sin(angle)
  return (
    <g transform={`translate(${x} ${yy}) rotate(${(angle * 180) / Math.PI + 90}) scale(1 1)`}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
 /* ROSE — layered spiral petals with deep shading and curl             */
/* ------------------------------------------------------------------ */
function RoseArt({ uid }: { uid: string }) {
  const petal = 'M0 -17 C 6 -12 7.5 -3 0 1.5 C -7.5 -3 -6 -12 0 -17 Z'
  const inner = 'M0 -10.5 C 4.5 -7.5 5 -2 0 1 C -5 -2 -4.5 -7.5 0 -10.5 Z'
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-rg`} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#F6A9AC" />
          <stop offset="45%" stopColor="#DE6A72" />
          <stop offset="100%" stopColor="#B0404C" />
        </radialGradient>
        <radialGradient id={`${uid}-mg`} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#D1626C" />
          <stop offset="100%" stopColor="#953643" />
        </radialGradient>
        <radialGradient id={`${uid}-cg`} cx="45%" cy="42%" r="66%">
          <stop offset="0%" stopColor="#B74A55" />
          <stop offset="100%" stopColor="#7C2733" />
        </radialGradient>
      </defs>
      <g>
        <path d="M50 118 C 44 112 38 102 40 92 C 45 99 49 108 50 118 Z" fill="#8AA66F" />
        <path d="M50 118 C 56 112 62 102 60 92 C 55 99 51 108 50 118 Z" fill="#8AA66F" />
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 7 + Math.PI / 7
          return petalPath(50, 56, 26, a, petal, `url(#${uid}-rg)`, '#9C3640', 0.9)
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 6 + Math.PI / 6 + 0.35
          return petalPath(50, 58, 14, a, inner, `url(#${uid}-mg)`, '#7E2A36', 0.8)
        })}
        {/* centre curl */}
        <path
          d="M50 46 a7 7 0 1 1 -7 7 a11 11 0 1 0 11 -11 a15 15 0 1 1 -15 15 a19 19 0 1 0 19 -19"
          fill="none"
          stroke={`url(#${uid}-cg)`}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path d="M40 40 C 45 34 54 33 59 38" stroke="rgba(255,236,230,0.75)" strokeWidth={2.8} fill="none" strokeLinecap="round" />
        <path d="M34 56 C 40 50 48 49 53 53" stroke="rgba(255,230,225,0.4)" strokeWidth={2} fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* TULIP — three outer + three inner cupped petals, folded tips        */
/* ------------------------------------------------------------------ */
function TulipArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8C6A4" />
          <stop offset="55%" stopColor="#EF9774" />
          <stop offset="100%" stopColor="#CD604F" />
        </linearGradient>
        <linearGradient id={`${uid}-fg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBCFAE" />
          <stop offset="100%" stopColor="#E0856C" />
        </linearGradient>
        <linearGradient id={`${uid}-hg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE3C8" />
          <stop offset="100%" stopColor="#F0A27E" />
        </linearGradient>
      </defs>
      <g>
        {/* outer petals */}
        <path d="M50 82 C 28 73 20 52 24 36 C 26 28 33 23 41 24 C 38 42 43 64 50 82 Z" fill={`url(#${uid}-bg)`} />
        <path d="M50 82 C 72 73 80 52 76 36 C 74 28 67 23 59 24 C 62 42 57 64 50 82 Z" fill={`url(#${uid}-bg)`} />
        <path d="M50 82 C 36 78 28 62 30 46 C 31 34 36 28 43 27 C 41 40 44 58 50 74 C 56 58 59 40 57 27 C 64 28 69 34 70 46 C 72 62 64 78 50 82 Z" fill={`url(#${uid}-fg)`} stroke="#E0856F" strokeWidth={1.2} />
        {/* inner petal highlight */}
        <path d="M50 78 C 43 66 42 52 46 42 C 43 54 44 68 50 78 Z" fill={`url(#${uid}-hg)`} opacity={0.85} />
        <path d="M50 78 C 57 66 58 52 54 42 C 57 54 56 68 50 78 Z" fill={`url(#${uid}-hg)`} opacity={0.6} />
        {/* centre seams */}
        <path d="M50 82 C 46 70 44 56 45 44" stroke="rgba(255,235,225,0.6)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <path d="M50 82 C 55 70 57 56 56 46" stroke="rgba(255,235,225,0.4)" strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <path d="M50 82 C 45 92 43 104 50 120 C 57 104 55 92 50 82 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth={0.8} />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* DAISY — many slender white petals around a dimpled golden disk      */
/* ------------------------------------------------------------------ */
function DaisyArt({ uid }: { uid: string }) {
  const petal = 'M0 -19 C 4.5 -13 5.5 -6 0 1.5 C -5.5 -6 -4.5 -13 0 -19 Z'
  const innerPetal = 'M0 -13 C 3.5 -8.5 4 -3 0 1 C -4 -3 -3.5 -8.5 0 -13 Z'
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-cg`} cx="42%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#FBE08A" />
          <stop offset="55%" stopColor="#F0BE4E" />
          <stop offset="100%" stopColor="#D9993A" />
        </radialGradient>
        <radialGradient id={`${uid}-dg`} cx="45%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#E8B340" />
          <stop offset="100%" stopColor="#C68A2E" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 14 }).map((_, i) =>
          petalPath(50, 52, 16.5, (i * Math.PI * 2) / 14, petal, i % 2 === 0 ? '#FFFFFF' : '#FCF6EC', '#EFE3CE', 0.7),
        )}
        {Array.from({ length: 14 }).map((_, i) =>
          petalPath(50, 52, 9.5, (i * Math.PI * 2) / 14 + Math.PI / 14, innerPetal, i % 2 === 0 ? '#FFFFFF' : '#FCF3E4', '#EDE0C8', 0.6),
        )}
        <circle cx="50" cy="52" r="15" fill={`url(#${uid}-cg)`} />
        <circle cx="50" cy="52" r="15" fill="none" stroke="#C98F2C" strokeWidth="1" />
        {/* dimpled seed texture */}
        {(
          [
            [46, 47, 2],
            [54, 47, 2],
            [46, 55, 2],
            [54, 55, 2],
            [50, 51, 2.2],
            [50, 43, 1.7],
            [50, 59, 1.7],
            [42, 51, 1.7],
            [58, 51, 1.7],
            [44, 51, 1.5],
            [56, 51, 1.5],
            [50, 47, 1.5],
            [50, 55, 1.5],
          ] as const
        ).map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#D19A2E" opacity={0.85} />
        ))}
        <circle cx="46" cy="46" r="3.2" fill="rgba(255,244,200,0.9)" />
        <circle cx="54" cy="50" r="2" fill="rgba(255,244,200,0.6)" />
        <Calyx top={104} />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* PEONY — dense ruffled layered petals, lush blush                    */
/* ------------------------------------------------------------------ */
function ruffled(scale: number, fill: string, stroke?: string) {
  return (
    <g transform={`translate(50 54) scale(${scale}) translate(-50 -54)`}>
      <path
        d="M 50 54 C 38 47 35 31 41 23 C 45 18 48 20 50 24 C 52 20 55 18 59 23 C 65 31 62 47 50 54 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </g>
  )
}

function PeonyArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-og`} cx="40%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#FBCFC6" />
          <stop offset="65%" stopColor="#F2A0A6" />
          <stop offset="100%" stopColor="#DE8790" />
        </radialGradient>
        <radialGradient id={`${uid}-ig`} cx="42%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F0A0A8" />
          <stop offset="100%" stopColor="#D5798B" />
        </radialGradient>
        <radialGradient id={`${uid}-cg`} cx="45%" cy="42%" r="64%">
          <stop offset="0%" stopColor="#E38A96" />
          <stop offset="100%" stopColor="#B85A6C" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 50 54)`}>
            {ruffled(1.28, `url(#${uid}-og)`, '#E8A299')}
          </g>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45 + 22.5} 50 54)`}>
            {ruffled(0.9, `url(#${uid}-ig)`, '#DE8790')}
          </g>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 60 + 12} 50 54)`}>
            {ruffled(0.56, `url(#${uid}-cg)`, '#C76B7C')}
          </g>
        ))}
        <path d="M50 51 a4 4 0 1 1 -4 4 a6.5 6.5 0 1 0 6.5 -6.5 a9 9 0 1 1 -9 9" fill="none" stroke="#A64A5E" strokeWidth="2" strokeLinecap="round" />
        <path d="M41 42 C 45 37 51 36 56 40" stroke="rgba(255,245,240,0.85)" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M36 56 C 41 50 49 49 54 53" stroke="rgba(255,240,235,0.5)" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <Calyx top={86} />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* SUNFLOWER — two rings of golden rays over a dark seeded disk        */
/* ------------------------------------------------------------------ */
function SunflowerArt({ uid }: { uid: string }) {
  const ray = 'M0 -24 C 5 -16 6.5 -7 0 2 C -6.5 -7 -5 -16 0 -24 Z'
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-rg`} cx="42%" cy="38%" r="76%">
          <stop offset="0%" stopColor="#F9D874" />
          <stop offset="100%" stopColor="#ECAE44" />
        </radialGradient>
        <radialGradient id={`${uid}-dg`} cx="40%" cy="36%" r="76%">
          <stop offset="0%" stopColor="#8A5432" />
          <stop offset="100%" stopColor="#522E17" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 16 }).map((_, i) =>
          petalPath(50, 52, 23, (i * Math.PI * 2) / 16, ray, `url(#${uid}-rg)`, '#D99B2E', 0.7),
        )}
        {Array.from({ length: 16 }).map((_, i) =>
          petalPath(50, 52, 15.5, (i * Math.PI * 2) / 16 + Math.PI / 16, ray, i % 2 === 0 ? '#F7CE66' : '#EFAF4A', '#CE9029', 0.6),
        )}
        <circle cx="50" cy="52" r="17.5" fill={`url(#${uid}-dg)`} />
        <circle cx="50" cy="52" r="17.5" fill="none" stroke="#3C2010" strokeWidth={1.6} />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i * 137.5 * Math.PI) / 180
          const r = 4 + ((i * 7) % 10)
          return (
            <circle key={i} cx={50 + r * Math.cos(a)} cy={52 + r * Math.sin(a)} r={1.9} fill={i % 3 === 0 ? '#9C6B3B' : '#B57C48'} opacity={0.9} />
          )
        })}
        <circle cx="45" cy="46" r="3.2" fill="rgba(255,217,160,0.55)" />
        <circle cx="56" cy="55" r="2" fill="rgba(255,217,160,0.35)" />
        <Calyx top={106} />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* WILDFLOWER — five tapered petals, warm coral, soft centre           */
/* ------------------------------------------------------------------ */
function WildflowerArt({ uid }: { uid: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-pg`} cx="42%" cy="36%" r="80%">
          <stop offset="0%" stopColor="#F4988C" />
          <stop offset="65%" stopColor="#E06A5F" />
          <stop offset="100%" stopColor="#C5534A" />
        </radialGradient>
        <radialGradient id={`${uid}-sg`} cx="45%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#F2B24A" />
          <stop offset="100%" stopColor="#E07E3C" />
        </radialGradient>
      </defs>
      <g>
        {Array.from({ length: 5 }).map((_, i) => {
          const wide = i % 2 === 1
          const s = wide ? 1.12 : 1
          return (
            <g key={i} transform={`rotate(${i * 72 + (i % 2) * 4} 50 60) scale(${s})`}>
              <path
                d="M 50 60 C 44 49 41 36 50 26 C 59 36 56 49 50 60 Z"
                fill={`url(#${uid}-pg)}`
                stroke="#C5534A"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </g>
          )
        })}
        <circle cx="50" cy="60" r="8.5" fill="#FFF6E8" stroke="#E6C193" strokeWidth={1} />
        <circle cx="50" cy="60" r="4.2" fill={`url(#${uid}-sg)`} />
        {(
          [
            [48.2, 58.2, 1.4],
            [51.8, 58.2, 1.4],
            [48.2, 61.8, 1.4],
            [51.8, 61.8, 1.4],
            [50, 60, 1.5],
          ] as const
        ).map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#D96A2C" opacity={0.9} />
        ))}
        <path d="M42 50 C 45 45 50 44 53 47" stroke="rgba(255,250,240,0.8)" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Calyx top={106} />
      </g>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* BABY'S BREATH — fine branching stems with tiny airy blossoms        */
/* ------------------------------------------------------------------ */
function BabysBreathArt() {
  return (
    <g>
      <path d="M50 120 C 48 92 51 62 50 40 C 49.6 33 50 27 50 22" stroke="#A9B98F" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M50 92 C 43 84 35 80 29 77" stroke="#A9B98F" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M50 70 C 58 62 67 58 74 56" stroke="#A9B98F" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M50 52 C 43 46 37 42 32 39" stroke="#A9B98F" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M50 96 C 58 90 64 87 69 86" stroke="#A9B98F" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {(
        [
          [50, 22, 4.6, '#FFFFFF', 8],
          [46, 34, 3.6, '#FEFDFA', 7],
          [55, 48, 3.8, '#F6F0FA', 7],
          [44, 60, 3.6, '#FEFDFA', 7],
          [57, 80, 3.4, '#FEFDFA', 7],
          [47, 88, 3.4, '#F6F0FA', 7],
          [29, 77, 4.8, '#FFFFFF', 8],
          [74, 56, 4.6, '#FFFFFF', 8],
          [32, 39, 4, '#F6F0FA', 7],
          [69, 86, 3.8, '#FEFDFA', 7],
          [40, 72, 3.4, '#FEFDFA', 7],
          [60, 30, 3.6, '#F6F0FA', 7],
          [38, 28, 3.2, '#FEFDFA', 7],
          [65, 43, 3.4, '#FEFDFA', 7],
          [56, 64, 3.2, '#FEFDFA', 7],
          [43, 78, 3, '#FEFDFA', 7],
        ] as const
      ).map(([x, y, r, fill, pts], i) => (
        <g key={i}>
          {Array.from({ length: pts }).map((_, k) => {
            const a = (k * Math.PI * 2) / pts
            return (
              <ellipse
                key={k}
                cx={x + Math.cos(a) * r * 0.5}
                cy={y + Math.sin(a) * r * 0.42}
                rx={r * 0.42}
                ry={r * 0.3}
                fill={fill}
                stroke="#E3D4EA"
                strokeWidth={0.8}
              />
            )
          })
          }
          <circle cx={x} cy={y} r={r * 0.28} fill="#F3EDF6" stroke="#DCC7E6" strokeWidth={0.7} />
        </g>
      ))}
      <path d="M50 120 C 47 115 46 110 47 107 C 49 110 50 114 50 120 Z" fill="#7E9C66" />
      <path d="M50 120 C 53 115 54 110 53 107 C 51 110 50 114 50 120 Z" fill="#7E9C66" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* LAVENDER — stacked purple whorls climbing a green stem              */
/* ------------------------------------------------------------------ */
function LavenderArt() {
  const nodes = [40, 54, 68, 82, 96]
  const colors = ['#CBB6EA', '#BDA6E0', '#AD93D2', '#9C81C4', '#9376BC']
  const rim = ['#B79EDC', '#A88Cce', '#977BC0', '#866AAE', '#7E63A8']
  return (
    <g>
      <path d="M50 120 C 49 90 50 56 50 26" stroke="#7E9C66" strokeWidth={2.8} fill="none" strokeLinecap="round" />
      {nodes.map((y, i) => {
        const r = 5 + (y - 40) * 0.05
        const color = colors[i]
        const edge = rim[i]
        return (
          <g key={i}>
            {[-r, -r / 2, 0, r / 2, r].map((dx, k) => (
              <ellipse
                key={k}
                cx={50 + dx}
                cy={y + ((k % 3) - 1)}
                rx={r + (dx === 0 ? 0.9 : 0.25)}
                ry={r * 0.72}
                fill={color}
                stroke={edge}
                strokeWidth={0.8}
              />
            ))
          }
        )
      )}
      {/* tight buds at the tip */}
      <ellipse cx="50" cy="24" rx="3" ry="4" fill="#E0D2F4" stroke="#C4B0E4" strokeWidth={0.8} />
      <ellipse cx="47" cy="20" rx="2.4" ry="3.2" fill="#D9C9F0" stroke="#BFA6DF" strokeWidth={0.8} />
      <ellipse cx="53" cy="22" rx="2.2" ry="3" fill="#D9C9F0" stroke="#BFA6DF" strokeWidth={0.8} />
      <path d="M50 120 C 46 113 43 105 45 100 C 48 106 50 112 50 120 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth={0.7} />
      <path d="M50 120 C 54 113 57 105 55 100 C 52 106 50 112 50 120 Z" fill="#7E9C66" stroke="#6D8A55" strokeWidth={0.7} />
    </g>
  )
}