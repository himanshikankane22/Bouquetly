import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Heart, RotateCcw } from 'lucide-react'
import FloatingPetals from '../components/Shared/FloatingPetals'
import Stepper from '../components/Create/Stepper'
import FlowerSelector from '../components/Create/FlowerSelector'
import CustomizePanel from '../components/Create/CustomizePanel'
import MessageEditor from '../components/Create/MessageEditor'
import CardPreview from '../components/Create/CardPreview'
import BouquetPreview from '../components/Create/BouquetPreview'
import { totalStems } from '../data/flowers'
import { BACKGROUND_OPTIONS } from '../data/styles'
import { useDraft } from '../state/DraftContext'

const STEP_LABELS = ['Flowers', 'Style', 'Message', 'Ready']

export default function Create() {
  const [step, setStep] = useState(0)
  const { draft, updateDraft, resetDraft } = useDraft()
  const background =
    BACKGROUND_OPTIONS.find((b) => b.id === draft.backgroundStyle) ?? BACKGROUND_OPTIONS[0]
  const emptyBouquet = totalStems(draft.flowers) === 0

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: background.gradient }}
    >
      <FloatingPetals count={10} />
      <div className="night-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-36 pt-6 sm:px-6">
        <header className="flex justify-center lg:justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-3 font-display text-2xl text-cream-50 transition hover:text-gold-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-plum-950 shadow-glow-gold">
              <Heart size={20} fill="currentColor" />
            </span>
            A Little Something For You
          </Link>
        </header>

        <div className="mt-7">
          <Stepper step={step} total={4} labels={STEP_LABELS} />
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            {step < 3 && (
              <div className="mb-6 max-h-64 overflow-hidden rounded-3xl lg:hidden">
                <BouquetPreview config={draft} />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 36, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -36, y: 8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {step === 0 && (
                  <FlowerSelector
                    flowers={draft.flowers}
                    onChange={(flowers) => updateDraft({ flowers })}
                  />
                )}
                {step === 1 && <CustomizePanel config={draft} onChange={updateDraft} />}
                {step === 2 && (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <MessageEditor config={draft} onChange={updateDraft} />
                    <div className="lg:sticky lg:top-24 lg:self-start">
                      <CardPreview config={draft} />
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="mx-auto max-w-xl pt-4 text-center">
                    <CardPreview config={draft} />
                    <p className="mt-9 font-hand text-3xl tracking-wide text-gold-300">
                      Almost there — the fun part is next.
                    </p>
                    <Link
                      to="/preview"
                      className="press mt-6 inline-block rounded-full bg-gold-400 px-8 py-4 font-bold text-plum-950 shadow-glow-gold transition-colors hover:bg-gold-300"
                    >
                      Open the surprise preview
                    </Link>
                    <p className="mx-auto mt-4 max-w-sm text-sm text-plum-200">
                      The preview replays the full envelope reveal — petals, pops of color, and your letter.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            {step < 3 && <BouquetPreview config={draft} />}
          </aside>
        </div>
      </div>

      {step < 3 && (
        <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-4">
          <div className="glass-chrome mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-lifted">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="press inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-semibold text-cream-50 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="press inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-plum-200 transition hover:text-gold-300"
            >
              <RotateCcw size={15} />
              Start over
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={step === 0 && emptyBouquet}
              className="press inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-2.5 font-bold text-plum-950 shadow-glow-gold transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}