import { Music2 } from 'lucide-react'

interface MusicToggleProps {
  enabled: boolean
  onToggle: () => void
  className?: string
}

export default function MusicToggle({ enabled, onToggle, className }: MusicToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? 'Turn off ambient sound' : 'Toggle ambient sound'}
      aria-pressed={enabled}
      className={`flex size-10 items-center justify-center rounded-full border border-cream-300/70 shadow-soft backdrop-blur transition-colors duration-300 ${
        enabled ? 'bg-blush-200 text-rose-500' : 'bg-white/80 text-cocoa-500 hover:bg-white'
      } ${className ?? ''}`}
    >
      <Music2 className={`size-5 ${enabled ? 'animate-pulse' : ''}`} />
    </button>
  )
}