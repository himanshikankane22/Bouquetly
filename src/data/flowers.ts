import type { FlowerType, FlowerSelection } from '../types'

export interface FlowerInfo {
  type: FlowerType
  name: string
  meaning: string
  size: number
}

export const FLOWERS: FlowerInfo[] = [
  { type: 'rose', name: 'Rose', meaning: 'for love', size: 48 },
  { type: 'tulip', name: 'Tulip', meaning: 'for joy', size: 43 },
  { type: 'daisy', name: 'Daisy', meaning: 'for cheer', size: 45 },
  { type: 'peony', name: 'Peony', meaning: 'for grace', size: 54 },
  { type: 'sunflower', name: 'Sunflower', meaning: 'for warmth', size: 54 },
  { type: 'wildflower', name: 'Wildflower', meaning: 'for wonder', size: 40 },
  { type: 'babysbreath', name: "Baby's Breath", meaning: 'for care', size: 34 },
  { type: 'lavender', name: 'Lavender', meaning: 'for calm', size: 34 },
]

export function totalStems(flowers: FlowerSelection[]): number {
  return flowers.reduce((sum, f) => sum + (f.quantity > 0 ? f.quantity : 0), 0)
}

export function flowerInfo(type: FlowerType): FlowerInfo {
  return FLOWERS.find((f) => f.type === type) ?? FLOWERS[0]
}