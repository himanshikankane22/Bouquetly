import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Share2, Sparkles } from 'lucide-react'
import FlowerSVG from '../components/FlowerSVG'
import FloatingPetals from '../components/Shared/FloatingPetals'
import { fadeIn, rise } from '../animations/variants'

const CLUSTER = [
  { type: 'tulip' as const, width: 40, pos: 'absolute right-[8%] top-[16%]', rotate: 'rotate-6' },
  { type: 'rose' as const, width: 34, pos: 'absolute left-[6%] top-[24%]', rotate: '-rotate-[14deg]' },
  { type: 'daisy' as const, width: 30, pos: 'absolute left-[13%] bottom-[22%]', rotate: '-rotate-6' },
  { type: 'babysbreath' as const, width: 32, pos: 'absolute left-[45%] top-[7%]', rotate: 'rotate-3' },
  { type: 'lavender' as const, width: 38, pos: 'absolute right-[9%] bottom-[18%]', rotate: 'rotate-[8deg]' },
]

const STEPS: Array<{ n: string; title: string; text: string; icon: ReactNode }> = [
  {
    n: '01',
    title: 'Pick your flowers',
    text: 'Choose the blooms that remind you of them.',
    icon: <FlowerSVG type="rose" width={40} />,
  },
  {
    n: '02',
    title: 'Add a keepsake',
    text: 'Tuck in a photo and a few words.',
    icon: <Sparkles className="size-6" />,
  },
  {
    n: '03',
    title: 'Send a secret link',
    text: 'Their surprise lives inside a little envelope.',
    icon: <Share2 className="size-6" />,
  },
  {
    n: '04',
    title: 'They open it',
    text: 'Envelope, photograph, bouquet — all of it made just for them.',
    icon: <Heart className="size-6" />,
  },
]

export default function Home() {
  const reduce = useReducedMotion()
  const entrance: Variants = reduce ? fadeIn : rise

  const scrollToSteps = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen font-sans">
      {/* ============ HERO ============ */}
      <section className="night-mesh relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <FloatingPetals count={12} sparkles />
        <div aria-hidden="true" className="night-vignette pointer-events-none absolute inset-0" />

        {/* floating bouquet cluster — only on large screens */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          {CLUSTER.map((flower, i) =>
            reduce ? (
              <div key={i} className={flower.pos}>
                <FlowerSVG type={flower.type} width={flower.width} className={flower.rotate} />
              </div>
            ) : (
              <motion.div
                key={i}
                className={flower.pos}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 1.2, ease: 'easeOut' },
                  y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <FlowerSVG type={flower.type} width={flower.width} className={flower.rotate} />
              </motion.div>
            ),
          )}
        </div>

        <div className="relative z-20 flex max-w-3xl flex-col items-center">
          <motion.p
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0 }}
            className="font-hand text-2xl tracking-wide text-gold-300"
          >
            a tiny digital letter, just for them ✿
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.12 }}
            className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-cream-50 sm:text-6xl md:text-7xl"
          >
            A Little Something{' '}
            <span className="block">For You<span className="text-gold-400">.</span></span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.24 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-plum-200"
          >
            Send someone a little happiness, one flower at a time.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.36 }}
            className="mt-11 flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
          >
            <Link
              to="/create"
              className="press inline-flex items-center gap-2 rounded-full bg-gold-400 px-9 py-4 text-base font-bold text-plum-950 shadow-glow-gold transition-colors duration-300 hover:bg-gold-300"
            >
              Create a Bouquet
              <ArrowRight className="size-4.5" />
            </Link>
            <button
              type="button"
              onClick={scrollToSteps}
              className="text-sm font-semibold tracking-wide text-plum-200 transition-colors hover:text-gold-300"
            >
              How it works ↓
            </button>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how-it-works"
        className="relative flex min-h-[90vh] items-center overflow-hidden px-6 py-24"
        style={{ background: 'linear-gradient(180deg, #161221 0%, #120e1a 100%)' }}
      >
        <div aria-hidden="true" className="night-vignette pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-6xl">
          <header className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-hand text-2xl tracking-wide text-gold-300">
              four small steps, wrapped in kind words ✧
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-cream-50 sm:text-4xl md:text-5xl">
              How it works
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={rise}
                transition={{ delay: i * 0.08 }}
                className="edge-top flex flex-col items-start gap-5 rounded-3xl bg-plum-800/70 p-6"
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-plum-700 text-gold-300">
                    {step.icon}
                  </div>
                  <span className="font-display text-3xl leading-none text-gold-400/70">{step.n}</span>
                </div>
                <h3 className="font-display text-xl text-cream-50">{step.title}</h3>
                <p className="text-sm leading-relaxed text-plum-200">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-plum-800 bg-plum-950/80 py-10 text-center">
        <p className="font-hand text-2xl tracking-wide text-gold-300">made just for you ♡</p>
      </footer>
    </main>
  )
}
