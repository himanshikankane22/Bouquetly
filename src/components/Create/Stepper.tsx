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
            className={`glass-chrome flex items-center gap-2 rounded-full px-2.5 py-1.5 transition-colors duration-300 sm:px-4 ${
              active ? 'ring-2 ring-gold-400/80' : done ? 'opacity-90' : 'opacity-60'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active ? 'bg-gold-400 text-plum-950' : done ? 'bg-sage-400 text-plum-950' : 'bg-white/15 text-cream-100'
              }`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`text-xs font-semibold sm:text-sm ${active ? 'text-gold-300' : 'text-cream-100'}`}
            >
              {labels[i]}
            </span>
          </div>
        )
      })}
    </nav>
  )
}