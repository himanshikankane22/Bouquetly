import { motion, useReducedMotion } from 'framer-motion'
import type { FlowerSpec } from '../../data/bouquet'
import { hashSeed, mulberry32 } from '../../data/bouquet'
import { FlowerArt } from '../FlowerSVG'

interface FlowerGroupProps {
  spec: FlowerSpec
  index: number
  bloomed?: boolean
}

interface Leaf {
  t: number
  flip: number
  scale: number
  rot: number
}

export default function FlowerGroup({ spec, index, bloomed = true }: FlowerGroupProps) {
  const reduced = useReducedMotion()
  const dx = spec.anchor.x - spec.base.x
  const dy = spec.anchor.y - spec.base.y
  const stemLen = Math.hypot(dx, dy)
  // Curved stem path using stemCurve for natural arch
  const stemControlX = spec.stemCurve * -dy / stemLen
  const stemControlY = spec.stemCurve * dx / stemLen
  const stemPath = `
    M${spec.base.x} ${spec.base.y}
    Q${spec.base.x + stemControlX} ${spec.base.y + stemControlY}
    ${spec.anchor.x} ${spec.anchor.y}
  `

  const rand = mulberry32(hashSeed(spec.id))
  // Vary leaf count slightly (2–3 leaves) and give each leaf individual traits
  const leafCount = 2 + Math.floor(rand() * 2)
  const leaves: Leaf[] = []
  for (let i = 0; i < leafCount; i++) {
    leaves.push({
      t: [0.3, 0.55, 0.8][i] || 0.5,
      flip: rand() > 0.5 ? 1 : -1,
      scale: 0.7 + rand() * 0.4,
      rot: (rand() - 0.5) * (20 - i * 4), // decreasing rotation spread
    })
  }

  const bezierAt = (t: number) => ({
    x: 2 * (1 - t) * t * (midX + px * spec.stemCurve) + t * t * dx,
    y: 2 * (1 - t) * t * (midY + py * spec.stemCurve) + t * t * dy,
  })

  const swayDuration = 4.8 + (index % 5) * 0.9
  const swayDelay = (index % 7) * 0.55
  const growDelay = 0.2 + index * 0.08

  return (
    <g data-fg="1" transform={`translate(${spec.base.x} ${spec.base.y}) rotate(${spec.rotation})`}>
      <motion.g
        animate={reduced ? undefined : { rotate: [0, 1.7, 0, -1.7, 0] }}
        transition={{ duration: swayDuration, repeat: Infinity, ease: 'easeInOut', delay: swayDelay }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      >
        <motion.path
          d={d}
          fill="none"
          stroke="#8FA87D"
          strokeWidth="3.2"
          strokeLinecap="round"
          initial={reduced || bloomed ? false : { pathLength: 0 }}
          animate={reduced || bloomed ? undefined : { pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: growDelay }}
        />
        {leaves.map((leaf, i) => {
          const p = bezierAt(leaf.t)
          return (
            <motion.g
              key={i}
              transform={`translate(${p.x} ${p.y}) rotate(${leaf.rot + 38 * leaf.flip}) scale(${leaf.flip * leaf.scale} ${leaf.scale})`}
              initial={reduced || bloomed ? false : { opacity: 0 }}
              animate={reduced || bloomed ? undefined : { opacity: 1 }}
              transition={{ duration: 0.4, delay: growDelay + 0.15 + i * 0.06 }}
            >
              {/* Leaf with subtle midrib and two-tone shading */}
              <ellipse rx="14" ry="6" fill="#9DB58C" />
              <g stroke="#87A177" strokeWidth="1.2" fill="none">
                <path d="M-12 0 Q 0 2.5 12 0" />
                <path d="M-11 0 Q 0 1.5 11 0" strokeOpacity={0.6} />
              </g>
            </motion.g>
          )
        })}
        <g transform={`translate(${dx - 50} ${dy - 120})`}>
          <motion.g
            initial={reduced || bloomed ? false : { scale: 0, opacity: 0 }}
            animate={reduced || bloomed ? undefined : { scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 16, delay: growDelay + 0.2 }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          >
            <g transform={`translate(50 120) scale(${spec.size / 100}) translate(-50 -120)`}>
              <FlowerArt type={spec.type} />
            </g>
          </motion.g>
        </g>
      </motion.g>
    </g>
  )
}