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
      className={`glass-chrome flex size-10 items-center justify-center rounded-full shadow-lifted transition-colors duration-300 ${
        enabled ? 'text-gold-300' : 'text-plum-200 hover:text-gold-300'
      } ${className ?? ''}`}
    >
      <Music2 className={`size-5 ${enabled ? 'animate-pulse' : ''}`} />
    </button>
  )
}