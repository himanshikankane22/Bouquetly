import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Share2, Sparkles } from 'lucide-react'
import FlowerSVG from '../components/FlowerSVG'
import FloatingPetals from '../components/Shared/FloatingPetals'
import { fadeIn, rise } from '../animations/variants'

const CLUSTER = [
  { type: 'tulip' as const, width: 38, pos: 'absolute right-[8%] top-[16%]', rotate: 'rotate-6' },
  { type: 'rose' as const, width: 32, pos: 'absolute left-[7%] top-[24%]', rotate: '-rotate-[14deg]' },
  { type: 'daisy' as const, width: 28, pos: 'absolute left-[13%] bottom-[22%]', rotate: '-rotate-6' },
  { type: 'babysbreath' as const, width: 30, pos: 'absolute left-[45%] top-[8%]', rotate: 'rotate-3' },
  { type: 'lavender' as const, width: 36, pos: 'absolute right-[10%] bottom-[18%]', rotate: 'rotate-[8deg]' },
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
    icon: <Sparkles className="size-7" />,
  },
  {
    n: '03',
    title: 'Send a secret link',
    text: 'Their surprise lives inside a little envelope.',
    icon: <Share2 className="size-7" />,
  },
  {
    n: '04',
    title: 'They open it',
    text: 'Envelope, photograph, bouquet — all of it made just for them.',
    icon: <Heart className="size-7" />,
  },
]

export default function Home() {
  const reduce = useReducedMotion()
  const entrance: Variants = reduce ? fadeIn : rise

  const scrollToSteps = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen font-sans" style={{ background: '#141019' }}>
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, #1E1826 0%, #16121C 55%, #120F1A 100%)',
        }}
      >
        <FloatingPetals count={12} sparkles />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(190,80,80,0.14) 0%, rgba(20,14,26,0) 62%)',
          }}
        />

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
            className="font-hand text-2xl text-blush-300"
          >
            a tiny digital letter, just for them ✿
          </motion.p>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.12 }}
            className="mt-3 font-display text-4xl leading-tight text-cream-50 sm:text-6xl md:text-7xl"
          >
            A Little Something For You<span className="text-rose-400">.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.24 }}
            className="mt-5 max-w-xl text-lg text-plum-200"
          >
            Send someone a little happiness, one flower at a time.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={entrance}
            transition={{ delay: 0.36 }}
            className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
          >
            <Link
              to="/create"
              className="rounded-full bg-rose-400 px-8 py-4 text-base font-semibold text-white shadow-soft transition-colors duration-300 hover:bg-rose-500"
            >
              Create a Bouquet
            </Link>
            <button
              type="button"
              onClick={scrollToSteps}
              className="text-sm font-medium text-plum-200 transition-colors hover:text-blush-300"
            >
              How it works ↓
            </button>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="flex min-h-[90vh] items-center px-6 py-24" style={{ background: '#16121C' }}>
        <div className="mx-auto w-full max-w-6xl">
          <header className="mx-auto mb-16 max-w-2xl text-center">
            <p className="font-hand text-2xl text-blush-300">four small steps, wrapped in kind words ✧</p>
            <h2 className="mt-2 font-display text-3xl text-cream-50 sm:text-4xl md:text-5xl">
              How it works
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={rise}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-start gap-5 rounded-3xl border border-cream-300/60 bg-white/70 p-6 shadow-soft"
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-blush-100 text-rose-500">
                    {step.icon}
                  </div>
                  <span className="font-hand text-3xl leading-none text-rose-500">{step.n}</span>
                </div>
                <h3 className="font-display text-xl text-cocoa-700">{step.title}</h3>
                <p className="text-sm leading-relaxed text-cocoa-500">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-plum-700 bg-plum-900/60 py-10 text-center">
        <p className="font-hand text-xl text-plum-300">made just for you ♡</p>
      </footer>
    </main>
  )
}