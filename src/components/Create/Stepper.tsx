import { Check } from 'lucide-react'

interface StepperProps {
  step: number
  total: number
  labels: string[]
}

export default function Stepper({ step, total, labels }: StepperProps) {
  return (
    <nav aria-label="Creation steps" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length: total }, (_, i) => {
        const done = i < step
        const active = i === step
        return (
          <div
            key={labels[i]}
            className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors duration-300 sm:px-4 ${
              active ? 'bg-blush-100 ring-2 ring-rose-400/70' : done ? 'bg-white/70' : 'bg-white/40'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active ? 'bg-rose-400 text-white' : done ? 'bg-sage-400 text-white' : 'bg-cream-300 text-cocoa-600'
              }`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`text-xs font-semibold sm:text-sm ${active ? 'text-rose-300' : 'text-plum-200'}`}
            >
              {labels[i]}
            </span>
          </div>
        )
      })}
    </nav>
  )
}