import type { CSSProperties, ReactNode } from 'react'
import { ARRANGEMENT_OPTIONS, BACKGROUND_OPTIONS, RIBBON_OPTIONS, WRAPPING_OPTIONS } from '../../data/styles'
import type { SurpriseConfig } from '../../types'

interface CustomizePanelProps {
  config: SurpriseConfig
  onChange: (partial: Partial<SurpriseConfig>) => void
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-lg text-cocoa-600">{title}</h3>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function SwatchOption({
  selected,
  name,
  style,
  onPick,
}: {
  selected: boolean
  name: string
  style: CSSProperties
  onPick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2 transition-transform duration-200 ${
        selected ? 'scale-[1.05] bg-blush-50 ring-2 ring-rose-400' : 'hover:bg-cream-50'
      }`}
    >
      <span className="h-9 w-9 rounded-full border border-cream-400/50 shadow-inner" style={style} />
      <span className={`text-xs font-semibold ${selected ? 'text-rose-600' : 'text-cocoa-500'}`}>{name}</span>
    </button>
  )
}

export default function CustomizePanel({ config, onChange }: CustomizePanelProps) {
  return (
    <div className="space-y-6 rounded-3xl border border-cream-300/70 bg-white/70 p-6 shadow-soft backdrop-blur">
      <Section title="Wrapping Paper">
        {WRAPPING_OPTIONS.map((opt) => (
          <SwatchOption
            key={opt.id}
            selected={config.wrappingStyle === opt.id}
            name={opt.name}
            style={{ backgroundColor: opt.swatch }}
            onPick={() => onChange({ wrappingStyle: opt.id })}
          />
        ))}
      </Section>
      <Section title="Ribbon">
        {RIBBON_OPTIONS.map((opt) => (
          <SwatchOption
            key={opt.id}
            selected={config.ribbonStyle === opt.id}
            name={opt.name}
            style={{ backgroundColor: opt.swatch }}
            onPick={() => onChange({ ribbonStyle: opt.id })}
          />
        ))}
      </Section>
      <Section title="Arrangement">
        {ARRANGEMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange({ arrangementStyle: opt.id })}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-transform duration-200 ${
              config.arrangementStyle === opt.id
                ? 'scale-[1.05] bg-rose-400 text-white shadow-soft ring-2 ring-rose-400'
                : 'border border-cream-300 bg-white text-cocoa-600 hover:bg-cream-50'
            }`}
          >
            {opt.name}
          </button>
        ))}
      </Section>
      <Section title="Background">
        {BACKGROUND_OPTIONS.map((opt) => (
          <SwatchOption
            key={opt.id}
            selected={config.backgroundStyle === opt.id}
            name={opt.name}
            style={{ backgroundImage: opt.gradient }}
            onPick={() => onChange({ backgroundStyle: opt.id })}
          />
        ))}
      </Section>
    </div>
  )
}