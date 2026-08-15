import type { ArrangementStyle, FlowerSelection, FlowerType } from '../types'
import { flowerInfo } from './flowers'

export interface Point {
  x: number
  y: number
}

export interface FlowerSpec {
  id: string
  type: FlowerType
  /** where the head attaches — the top of the stem */
  anchor: Point
  /** where the stem starts (inside the wrapping near the tie) */
  base: Point
  /** head tilt in degrees (negative leans left) */
  rotation: number
  /** rendered head width in canvas units */
  size: number
  /** signed perpendicular bow of the stem */
  stemCurve: number
  /** draw the whole unit in front of the wrapping */
  front: boolean
}

/** single coordinate system for the whole bouquet */
export const CANVAS_W = 400
export const CANVAS_H = 600
export const TIE_X = 200
export const TIE_Y = 512
export const RIM_Y = 468

const STEM_LEN: Record<FlowerType, number> = {
  peony: 306,
  sunflower: 296,
  rose: 284,
  tulip: 252,
  daisy: 244,
  wildflower: 238,
  babysbreath: 208,
  lavender: 186,
}

export function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function centerOutIndex(i: number): number {
  if (i === 0) return 0
  return i % 2 === 1 ? (i + 1) / 2 : -(i / 2)
}

/**
 * Flower-first layout: every flower is described by an anchor (where its head
 * attaches) and a base (where its stem starts). Tall focal flowers sit in the
 * centre, shorter flowers arc outward, and the shortest are tucked in front
 * of the paper. Stems are derived from base -> anchor by the renderer.
 */
export function buildBouquet(flowers: FlowerSelection[], arrangement: ArrangementStyle): FlowerSpec[] {
  const flat: FlowerType[] = []
  flowers.forEach((sel) => {
    for (let i = 0; i < Math.max(0, sel.quantity); i++) flat.push(sel.type)
  })
  const n = flat.length
  if (n === 0) return []

  const rand = mulberry32(hashSeed(flat.join(',')))
  const maxAngle = arrangement === 'fan' ? 52 : 34

  const items = flat
    .map((type, idx) => ({ type, idx, len: STEM_LEN[type] ?? 240 }))
    .sort((a, b) => b.len - a.len)

  const specs: FlowerSpec[] = items.map((item, i) => {
    const out = centerOutIndex(i)
    const outMax = Math.max(1, Math.floor(n / 2))
    const step = maxAngle / outMax
    const angle = out * step + (rand() - 0.5) * step * 0.8
    const len = item.len * (0.94 + rand() * 0.1)
    const rad = (angle * Math.PI) / 180
    return {
      id: `${item.idx}-${item.type}`,
      type: item.type,
      anchor: {
        x: TIE_X + Math.sin(rad) * len,
        y: TIE_Y - Math.cos(rad) * len,
      },
      base: { x: TIE_X + (rand() - 0.5) * 14, y: TIE_Y + (rand() - 0.5) * 8 },
      rotation: -angle * 0.32 + (rand() - 0.5) * 4,
      size: flowerInfo(item.type).size * (0.92 + rand() * 0.16),
      stemCurve: (angle === 0 ? (rand() > 0.5 ? 1 : -1) : -Math.sign(angle)) * (12 + rand() * 16),
      front: false,
    }
  })

  const frontCount = n < 4 ? 0 : Math.min(3, Math.max(1, Math.round(n * 0.16)))
  for (let k = 0; k < frontCount; k++) {
    const s = specs[n - 1 - k]
    s.front = true
    const side = rand() > 0.5 ? 1 : -1
    const spread = 18 + rand() * 34
    s.anchor = {
      x: TIE_X + side * spread,
      y: RIM_Y - 14 - rand() * 16,
    }
    s.base = { x: TIE_X + side * (spread * 0.35), y: TIE_Y - 8 + rand() * 12 }
    s.rotation = (rand() - 0.5) * 16
    s.stemCurve = side * (10 + rand() * 14)
    s.size = flowerInfo(s.type).size * (0.8 + rand() * 0.12)
  }

  return specs
}
