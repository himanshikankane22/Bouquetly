import type { ArrangementStyle, BackgroundStyle, RibbonStyle, WrappingStyle } from '../types'

export interface WrappingOption {
  id: WrappingStyle
  name: string
  swatch: string
}

export const WRAPPING_OPTIONS: WrappingOption[] = [
  { id: 'kraft', name: 'Kraft Paper', swatch: '#C9A87C' },
  { id: 'blush', name: 'Blush Paper', swatch: '#F2C9C2' },
  { id: 'sage', name: 'Sage Paper', swatch: '#BECBAE' },
  { id: 'cream', name: 'Cream Paper', swatch: '#F7EFE2' },
]

export interface RibbonOption {
  id: RibbonStyle
  name: string
  swatch: string
}

export const RIBBON_OPTIONS: RibbonOption[] = [
  { id: 'satin', name: 'Rose Satin', swatch: '#C98678' },
  { id: 'gold', name: 'Golden Satin', swatch: '#D9AE77' },
  { id: 'twine', name: 'Twine', swatch: '#A5846B' },
]

export interface ArrangementOption {
  id: ArrangementStyle
  name: string
}

export const ARRANGEMENT_OPTIONS: ArrangementOption[] = [
  { id: 'fan', name: 'Open Fan' },
  { id: 'cluster', name: 'Tight Cluster' },
]

export interface BackgroundOption {
  id: BackgroundStyle
  name: string
  gradient: string
}

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { id: 'cream', name: 'Midnight Plum', gradient: 'linear-gradient(160deg, #1E1826 0%, #16121C 55%, #120F1A 100%)' },
  { id: 'blush', name: 'Berry Night', gradient: 'linear-gradient(160deg, #241420 0%, #1B1019 60%, #150C14 100%)' },
  { id: 'dream', name: 'Ember Night', gradient: 'linear-gradient(160deg, #241812 0%, #19120F 60%, #130E0C 100%)' },
  { id: 'sage', name: 'Violet Dusk', gradient: 'linear-gradient(160deg, #1B1828 0%, #14121E 60%, #100E18 100%)' },
]

export function wrappingColor(style: WrappingStyle): string {
  const map: Record<WrappingStyle, string> = {
    kraft: '#C9A87C',
    blush: '#F2C9C2',
    sage: '#BECBAE',
    cream: '#F7EFE2',
  }
  return map[style]
}

export function ribbonColor(style: RibbonStyle): string {
  const map: Record<RibbonStyle, string> = {
    satin: '#C98678',
    gold: '#D9AE77',
    twine: '#A5846B',
  }
  return map[style]
}