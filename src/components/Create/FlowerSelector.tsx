import { Minus, Plus } from 'lucide-react'
import { FLOWERS, totalStems } from '../../data/flowers'
import { MAX_FLOWERS_PER_TYPE, MAX_FLOWERS_TOTAL } from '../../types'
import type { FlowerSelection, FlowerType } from '../../types'
import FlowerSVG from '../FlowerSVG'

interface FlowerSelectorProps {
  flowers: FlowerSelection[]
  onChange: (next: FlowerSelection[]) => void
}

export default function FlowerSelector({ flowers, onChange }: FlowerSelectorProps) {
  const total = totalStems(flowers)
  const atTotalCap = total >= MAX_FLOWERS_TOTAL

  const quantityOf = (type: FlowerType) => flowers.find((f) => f.type === type)?.quantity ?? 0

  const toggle = (type: FlowerType) => {
    if (quantityOf(type) > 0) {
      onChange(flowers.filter((f) => f.type !== type))
    } else if (!atTotalCap) {
      onChange([...flowers, { type, quantity: 1 }])
    }
  }

  const adjust = (type: FlowerType, delta: number) => {
    const current = quantityOf(type)
    const next = current + delta
    if (next <= 0) {
      onChange(flowers.filter((f) => f.type !== type))
    } else if (next <= MAX_FLOWERS_PER_TYPE && total + delta <= MAX_FLOWERS_TOTAL) {
      onChange(flowers.map((f) => (f.type === type ? { ...f, quantity: next } : f)))
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {FLOWERS.map((f) => {
          const count = quantityOf(f.type)
          const selected = count > 0
          const plusDisabled = count >= MAX_FLOWERS_PER_TYPE || atTotalCap
          return (
            <div
              key={f.type}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${f.name}, ${selected ? `${count} in the bouquet, remove` : 'add to the bouquet'}`}
              onClick={() => toggle(f.type)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(f.type)
                }
              }}
              className={`flex cursor-pointer select-none flex-col items-center gap-1 rounded-2xl border p-4 text-center transition-all duration-200 ${
                selected
                  ? 'scale-[1.03] border-rose-300 bg-blush-50/80 ring-2 ring-rose-400'
                  : 'border-cream-300 bg-white/70 hover:-translate-y-0.5 hover:shadow-soft'
              }`}
            >
              <FlowerSVG type={f.type} width={60} />
              <p className="font-display text-base text-cocoa-700">{f.name}</p>
              <p className="text-xs italic text-cocoa-300">{f.meaning}</p>
              {selected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1.5 flex items-center gap-2 rounded-full border border-cream-300/70 bg-white/90 px-1.5 py-1 shadow-soft"
                >
                  <button
                    type="button"
                    aria-label={`Remove one ${f.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      adjust(f.type, -1)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-100 text-cocoa-600 transition hover:bg-cream-300"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold text-cocoa-700">{count}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${f.name}`}
                    disabled={plusDisabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      adjust(f.type, 1)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 text-rose-500 transition hover:bg-blush-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-5 text-center text-sm font-semibold text-plum-200">
        {total} {total === 1 ? 'flower' : 'flowers'} in your bouquet
      </p>
    </div>
  )
}