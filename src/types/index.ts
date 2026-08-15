export type FlowerType =
  | 'rose'
  | 'tulip'
  | 'daisy'
  | 'peony'
  | 'sunflower'
  | 'wildflower'
  | 'babysbreath'
  | 'lavender'

export type WrappingStyle = 'kraft' | 'blush' | 'sage' | 'cream'

export type RibbonStyle = 'satin' | 'gold' | 'twine'

export type ArrangementStyle = 'fan' | 'cluster'

export type BackgroundStyle = 'cream' | 'blush' | 'dream' | 'sage'

export interface FlowerSelection {
  type: FlowerType
  quantity: number
}

export interface SurpriseConfig {
  id?: string
  recipientName: string
  senderName: string
  message: string
  image: string
  includeImage: boolean
  flowers: FlowerSelection[]
  wrappingStyle: WrappingStyle
  ribbonStyle: RibbonStyle
  arrangementStyle: ArrangementStyle
  backgroundStyle: BackgroundStyle
  createdAt: number
}

export const MAX_MESSAGE_LENGTH = 320
export const MAX_FLOWERS_TOTAL = 26
export const MAX_FLOWERS_PER_TYPE = 6