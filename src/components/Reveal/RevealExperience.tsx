import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { RotateCcw, Sparkles } from 'lucide-react'
import type { SurpriseConfig } from '../../types'
import { BACKGROUND_OPTIONS } from '../../data/styles'
import type { SurpriseSound } from '../../utils/sound'
import FloatingPetals from '../Shared/FloatingPetals'
import Envelope, { type EnvelopePhase } from '../Envelope/Envelope'
import RevealCard, { type RevealStage } from './RevealCard'

export type RevealPhase =
  | 'envelope'
  | 'flap'
  | 'open'
  | 'card'
  | 'photo'
  | 'bouquet'
  | 'message'
  | 'done'

const STAGE_FROM_PHASE: Record<Exclude<RevealPhase, 'envelope' | 'flap' | 'open'>, RevealStage> = {
  card: 'card',
  photo: 'photo',
  bouquet: 'bouquet',
  message: 'message',
  done: 'done',
}

interface RevealExperienceProps {
  config: SurpriseConfig
  variant?: 'recipient' | 'preview'
  onGenerate?: () => void
  onPhaseChange?: (phase: RevealPhase) => void
  sound?: SurpriseSound
}

/**
 * The recipient experience: a closed envelope, then a deliberately
 * staged reveal — flap, letter, photograph, bouquet, message.
 */
export default function RevealExperience({
  config,
  variant = 'recipient',
  onGenerate,
  onPhaseChange,
  sound,
}: RevealExperienceProps) {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<RevealPhase>(() => (reduced ? 'done' : 'envelope'))
  const timers = useRef<number[]>([])
  const started = useRef<boolean>(reduced === true)
  const soundRef = useRef(sound)
  const onPhaseChangeRef = useRef(onPhaseChange)

  useEffect(() => {
    soundRef.current = sound
    onPhaseChangeRef.current = onPhaseChange
  }, [sound, onPhaseChange])

  const go = useCallback((next: RevealPhase, delay: number) => {
    timers.current.push(
      window.setTimeout(() => {
        setPhase(next)
      }, delay),
    )
  }, [])

  const start = useCallback(() => {
    if (started.current) return
    started.current = true
    soundRef.current?.playOpen()
    setPhase('flap')
    go('open', 750)
    go('card', 1550)
    go('photo', 2150)
    go('bouquet', 2850)
    go('message', 3600)
    go('done', 4300)
  }, [go])

  const replay = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
    started.current = false
    setPhase('envelope')
  }, [])

  useEffect(() => {
    onPhaseChangeRef.current?.(phase)
    if (phase === 'open') soundRef.current?.playCard()
    if (phase === 'done') soundRef.current?.playReveal()
  }, [phase])

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const envelopePhase: EnvelopePhase =
    phase === 'envelope' ? 'closed' : phase === 'flap' ? 'opening' : phase === 'open' ? 'open' : 'gone'
  const bg = BACKGROUND_OPTIONS.find((b) => b.id === config.backgroundStyle)?.gradient
  const letterScene = phase !== 'envelope' && phase !== 'flap' && phase !== 'open'

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: bg ?? BACKGROUND_OPTIONS[0].gradient }}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(8,4,12,0.45) 100%)' }}
      />
      {!letterScene && (
        <motion.span
          className="pointer-events-none absolute left-1/2 top-1/2 h-[54vmin] w-[86vmin] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(200,90,90,0.20), transparent 70%)' }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <FloatingPetals count={12} sparkles className="z-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          {!letterScene ? (
            <motion.div
              key="letter"
              className="flex w-full flex-col items-center"
              exit={{ opacity: 0, y: -44, scale: 0.94, transition: { duration: 0.55, ease: 'easeInOut' } }}
            >
              <Envelope
                phase={envelopePhase}
                interactive={phase === 'envelope'}
                onOpen={start}
                className="w-[min(86vw,340px)]"
              />

              <div className="mt-10 text-center">
                <AnimatePresence mode="wait">
                  {phase === 'envelope' ? (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <p className="font-display text-xl text-plum-100 sm:text-2xl">
                        You&apos;ve got a little something 💌
                      </p>
                      <motion.p
                        className="mt-2 font-hand text-2xl text-blush-300"
                        animate={{ opacity: [0.55, 1, 0.55] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Tap the envelope to open
                      </motion.p>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="patience"
                      className="font-hand text-2xl text-plum-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      a little patience…
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="card"
              className="flex w-full flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <RevealCard config={config} stage={STAGE_FROM_PHASE[phase]} reduced={reduced === true} />

              {variant === 'preview' && phase === 'done' && (
                <motion.div
                  className="mt-9 flex flex-col items-center"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.55, ease: 'easeOut' }}
                >
                  <p className="font-hand text-2xl text-cocoa-500">
                    Ready to send this little something?
                  </p>
                  <button
                    type="button"
                    onClick={onGenerate}
                    className="mt-4 rounded-full bg-rose-400 px-9 py-4 text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-lifted"
                  >
                    Generate My Surprise
                    <Sparkles className="ml-2 inline h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {variant === 'preview' && phase !== 'envelope' && (
        <button
          type="button"
          onClick={replay}
          aria-label="Replay the surprise"
          className="fixed right-4 top-4 z-20 flex size-11 items-center justify-center rounded-full border border-cream-300/70 bg-white/80 shadow-soft backdrop-blur transition hover:bg-white"
        >
          <RotateCcw className="h-4 w-4 text-cocoa-600" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}