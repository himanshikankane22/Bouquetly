import { BACKGROUND_OPTIONS } from '../../data/styles'
import type { SurpriseConfig } from '../../types'
import BouquetSVG from '../Bouquet/BouquetSVG'
import FloatingPetals from '../Shared/FloatingPetals'

export default function BouquetPreview({ config }: { config: SurpriseConfig }) {
  const background = BACKGROUND_OPTIONS.find((b) => b.id === config.backgroundStyle) ?? BACKGROUND_OPTIONS[0]
  const empty = config.flowers.length === 0

  return (
    <div
      className="relative h-72 overflow-hidden rounded-3xl shadow-soft lg:aspect-[4/5] lg:h-auto"
      style={{ backgroundImage: background.gradient }}
    >
      <FloatingPetals count={8} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-8">
        <BouquetSVG
          flowers={config.flowers}
          wrapping={config.wrappingStyle}
          ribbon={config.ribbonStyle}
          arrangement={config.arrangementStyle}
          bloomed
          className={`w-44 h-auto drop-shadow-xl sm:w-48 lg:w-64 ${empty ? 'opacity-55' : ''}`}
        />
        {empty && (
          <p className="text-center font-hand text-xl text-gold-300">Pick some flowers to see them bloom</p>
        )}
      </div>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-hand text-base text-cream-100/90">
        your bouquet, so far
      </p>
    </div>
  )
}