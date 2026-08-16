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
      <h3 className="font-display text-lg text-cream-50">{title}</h3>
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
        selected ? 'scale-[1.05] bg-plum-700/80 ring-2 ring-gold-400/60' : 'hover:bg-plum-700/50'
      }`}
    >
      <span
        className="h-9 w-9 rounded-full border border-white/20 shadow-inner"
        style={{ ...style, boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.3)' }}
      />
      <span className={`text-xs font-semibold ${selected ? 'text-gold-300' : 'text-plum-200'}`}>{name}</span>
    </button>
  )
}

export default function CustomizePanel({ config, onChange }: CustomizePanelProps) {
  return (
    <div className="glass-chrome space-y-6 rounded-3xl p-6 shadow-lifted">
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
            className={`press rounded-full px-5 py-2.5 text-sm font-semibold transition-transform duration-200 ${
              config.arrangementStyle === opt.id
                ? 'scale-[1.05] bg-gold-400 text-plum-950 shadow-glow-gold'
                : 'border border-white/10 bg-white/5 text-cream-100 hover:bg-white/10'
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