import type { ArrangementStyle, FlowerSelection, RibbonStyle, WrappingStyle } from '../../types'
import { ribbonColor, wrappingColor } from '../../data/styles'
import { buildBouquet } from '../../data/bouquet'
import FlowerGroup from './FlowerGroup'

interface BouquetSVGProps {
  flowers: FlowerSelection[]
  wrapping: WrappingStyle
  ribbon: RibbonStyle
  arrangement: ArrangementStyle
  /** when false, stems grow in and heads bloom with a stagger */
  bloomed?: boolean
  className?: string
}

const GREENERY: Array<[number, number]> = [
  [-1, 0.2],
  [1, 0.2],
  [-0.55, 0.55],
  [0.55, 0.55],
  [-0.85, 0.9],
  [0.85, 0.9],
]

export default function BouquetSVG({
  flowers,
  wrapping,
  ribbon,
  arrangement,
  bloomed = true,
  className,
}: BouquetSVGProps) {
  const specs = buildBouquet(flowers, arrangement)
  const back = specs.filter((s) => !s.front).sort((a, b) => a.anchor.y - b.anchor.y)
  const front = specs.filter((s) => s.front).sort((a, b) => a.anchor.y - b.anchor.y)
  const wrap = wrappingColor(wrapping)
  const bow = ribbonColor(ribbon)

  return (
    <svg
      viewBox="0 0 400 600"
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* ---------- foliage behind everything ---------- */}
      <g>
        {GREENERY.map(([side, mag], i) => (
          <g key={i} transform={`translate(${200 + side * 40} ${492 + mag * 10}) rotate(${side * 40 * mag + 8})`}>
            <path
              d="M0 0 C -24 -18 -34 -38 -24 -55 C -10 -44 5 -22 0 0 Z"
              fill={i % 2 === 0 ? '#93AB78' : '#A3B98B'}
            />
          </g>
        ))}
      </g>

      {/* ---------- back stems, leaves and heads ---------- */}
      {back.map((spec, i) => (
        <FlowerGroup key={spec.id} spec={spec} index={i} bloomed={bloomed} />
      ))}

      {/* ---------- wrapping cone ---------- */}
      <g>
        <path
          d="M 112 462 C 152 476 248 476 288 462 C 270 516 246 566 216 582 C 208 587 192 587 184 582 C 154 566 130 516 112 462 Z"
          fill={wrap}
        />
        <path
          d="M 128 472 C 162 484 238 484 272 472 C 256 512 236 558 210 576 C 204 580 196 580 190 576 C 164 558 144 512 128 472 Z"
          fill="rgba(0,0,0,0.09)"
        />
        <path
          d="M 152 470 L 248 470 C 238 510 222 548 200 566 C 178 548 162 510 152 470 Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path
          d="M 152 470 C 162 510 178 548 200 566"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M 112 462 C 152 476 248 476 288 462"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2.4"
          fill="none"
        />
        {wrapping === 'kraft' && (
          <g stroke="rgba(122,88,52,0.28)" strokeWidth="1.6" fill="none">
            <path d="M 138 474 L 124 566" />
            <path d="M 200 480 L 200 588" />
            <path d="M 262 474 L 276 566" />
          </g>
        )}
        {wrapping === 'blush' && (
          <g fill="rgba(255,255,255,0.55)">
            {[
              [140, 495, 3.4],
              [240, 505, 3.4],
              [180, 525, 3],
              [220, 545, 3],
              [200, 575, 3],
              [260, 480, 2.6],
              [140, 530, 2.6],
              [230, 480, 2.4],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        )}
        {wrapping === 'sage' && (
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" fill="none">
            <path d="M 150 490 C 165 505 165 520 150 535" />
            <path d="M 250 490 C 235 505 235 520 250 535" />
            <path d="M 200 495 C 210 515 210 535 200 555" />
          </g>
        )}
        {wrapping === 'cream' && (
          <g fill="rgba(199,151,92,0.4)">
            {[
              [150, 500, 3],
              [248, 498, 3],
              [190, 525, 3],
              [212, 552, 3],
              [172, 560, 3],
              [228, 524, 2.6],
              [200, 584, 2.6],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        )}
      </g>

      {/* ---------- front stems, leaves and heads tucked over the paper ---------- */}
      {front.map((spec, i) => (
        <FlowerGroup key={spec.id} spec={spec} index={back.length + i} bloomed={bloomed} />
      ))}

      {/* ---------- ribbon ---------- */}
      <g>
        <path
          d="M 140 470 C 162 482 238 482 260 470"
          stroke={bow}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 146 471 C 164 481 236 481 254 471"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 200 478 C 176 458 152 468 162 490 C 169 507 190 496 200 478 Z"
          fill={bow}
        />
        <path
          d="M 200 478 C 224 458 248 468 238 490 C 231 507 210 496 200 478 Z"
          fill={bow}
          opacity="0.92"
        />
        <circle cx="200" cy="478" r="8.5" fill={bow} />
        <circle cx="197" cy="475" r="2.6" fill="rgba(255,255,255,0.5)" />
        <path d="M 200 486 C 194 512 186 534 178 552" stroke={bow} strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <path d="M 200 486 C 208 514 218 536 228 554" stroke={bow} strokeWidth="6.5" fill="none" strokeLinecap="round" />
      </g>

      {/* ---------- fallen petals ---------- */}
      <g>
        {(
          [
            [162, 544, -22, '#F0A9A9', '#D98A8A'],
            [238, 558, 18, '#F6D3C9', '#E3B7AC'],
            [196, 578, -6, '#C7B1E6', '#AC92CC'],
          ] as const
        ).map(([x, y, rot, fill, stroke], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <path
              d="M0 0 C -7 -6 -9 -14 -3 -19 C 3 -14 4 -6 0 0 Z"
              fill={fill}
              stroke={stroke}
              strokeWidth="1"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
