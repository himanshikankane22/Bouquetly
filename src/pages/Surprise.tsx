import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, PenTool } from 'lucide-react'
import RevealExperience, { type RevealPhase } from '../components/Reveal/RevealExperience'
import MusicToggle from '../components/Shared/MusicToggle'
import FloatingPetals from '../components/Shared/FloatingPetals'
import { decodeSurprise } from '../utils/store'
import { useSurpriseSound } from '../utils/sound'

export default function Surprise() {
  const { id } = useParams<{ id: string }>()
  const config = useMemo(() => (id ? decodeSurprise(id) : null), [id])
  const sound = useSurpriseSound()
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    document.title = config ? 'A little something for you 💌' : 'A Little Something For You'
  }, [config])

  useEffect(() => {
    if (config?.image && config.includeImage) {
      const img = new Image()
      img.src = config.image
    }
  }, [config])

  if (!config) {
    return (
      <div
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E1826 0%, #16121C 55%, #120F1A 100%)' }}
      >
        <FloatingPetals count={10} sparkles />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <span className="flex size-20 items-center justify-center rounded-full bg-crimson-600/40 shadow-soft">
              <Heart className="h-9 w-9 text-crimson-400" aria-hidden="true" />
            </span>
            <h1 className="mt-7 font-display text-3xl text-cream-50 sm:text-4xl">
              Oops… this little surprise
              <br />
              seems to have wandered away.
            </h1>
            <p className="mt-4 max-w-md font-sans text-plum-200">
              The link may be broken, or its envelope was never sent. But you can always make a
              brand new one — just for someone.
            </p>
            <Link
              to="/create"
              className="mt-8 rounded-full bg-rose-400 px-8 py-4 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-lifted"
            >
              Create Your Own
            </Link>
            <p className="mt-6 font-hand text-2xl text-plum-300">made just for you ♡</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <>
      <RevealExperience
        config={config}
        sound={sound}
        onPhaseChange={(phase: RevealPhase) => {
          if (phase !== 'envelope') setInteracted(true)
        }}
      />
      {interacted && (
        <MusicToggle
          enabled={sound.enabled}
          onToggle={sound.toggle}
          className="fixed right-4 top-4 z-30"
        />
      )}
      <Link
        to="/create"
        className="fixed bottom-4 right-4 z-30 flex size-11 items-center justify-center rounded-full border border-cream-300/70 bg-white/80 shadow-soft backdrop-blur transition hover:bg-white"
        aria-label="Create your own surprise"
        title="Create your own surprise"
      >
        <PenTool className="h-4 w-4 text-cocoa-600" aria-hidden="true" />
      </Link>
    </>
  )
}