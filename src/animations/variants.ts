import type { Variants } from 'framer-motion'

/** Gentle up-rise used across reveals */
export const rise: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

export const softPop: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 16 },
  },
}

/** Slow drifting petals */
export function petalDrift(duration = 16, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: -30, x: 0, rotate: 0 },
    show: {
      opacity: [0, 0.75, 0.75, 0],
      y: ['40vh', '88vh'],
      x: [0, 30, -18, 24],
      rotate: [0, 90, 180, 280],
      transition: { duration, delay, repeat: Infinity, ease: 'linear' },
    },
  }
}

export const envelopeFloat: Variants = {
  float: {
    y: [0, -9, 0],
    rotate: [0, 0.8, 0],
    transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const sway: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 140, damping: 14 },
  },
}