import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { petalDrift } from '../../animations/variants'

const PETAL_COLORS = ['#E89BA8', '#C9A6C4', '#E4C391', '#A9A3D0', '#E58EA0', '#D8B8C2']
const SPARKLE_COLORS = ['#F2E6C9', '#E8C6C6', '#D9D4E8']

function seededRandom(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface FloatingPetalsProps {
  count?: number
  className?: string
  /** adds tiny twinkling star-sparkles (nice on dark scenes) */
  sparkles?: boolean
}

export default function FloatingPetals({ count = 10, className, sparkles = false }: FloatingPetalsProps) {
  const reduce = useReducedMotion()

  const petals = useMemo(() => {
    const rand = seededRandom(0x5eed)
    return Array.from({ length: count }, (_, i) => ({
      left: rand() * 96,
      top: rand() * 100,
      duration: 14 + rand() * 8,
      delay: rand() * 8,
      color: PETAL_COLORS[i % PETAL_COLORS.length],
    }))
  }, [count])

  const stars = useMemo(() => {
    const rand = seededRandom(0x54a5)
    return Array.from({ length: 14 }, (_, i) => ({
      left: rand() * 96,
      top: rand() * 92,
      size: 3 + rand() * 4,
      delay: rand() * 4,
      color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
    >
      {sparkles &&
        stars.map((star, i) =>
          reduce ? (
            <div
              key={`s${i}`}
              className="absolute rounded-full opacity-30"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
              }}
            />
          ) : (
            <motion.div
              key={`s${i}`}
              className="absolute rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
              }}
              animate={{ opacity: [0.1, 0.85, 0.15], scale: [0.7, 1.15, 0.75] }}
              transition={{ duration: 2.6 + star.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ),
        )}
      {petals.map((petal, i) =>
        reduce ? (
          <div
            key={i}
            className="absolute h-2.5 w-2.5 rotate-45 rounded-tl-full rounded-tr-full opacity-20"
            style={{ left: `${petal.left}%`, top: `${petal.top}%`, backgroundColor: petal.color }}
          />
        ) : (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${petal.left}%` }}
            initial={{ opacity: 0, y: -40 }}
            animate="show"
            variants={petalDrift(petal.duration, petal.delay)}
          >
            <div
              className="h-2.5 w-2.5 rotate-45 rounded-tl-full rounded-tr-full"
              style={{ backgroundColor: petal.color }}
            />
          </motion.div>
        ),
      )}
    </div>
  )
}