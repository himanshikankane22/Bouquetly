import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { SurpriseConfig } from '../../types'
import { REVEAL_IMAGE_ALT } from '../../utils/constants'
import BouquetSVG from '../Bouquet/BouquetSVG'
import PolaroidPhoto from './PolaroidPhoto'

export type RevealStage = 'card' | 'photo' | 'bouquet' | 'message' | 'done'

const STAGE_ORDER: Record<RevealStage, number> = {
  card: 0,
  photo: 1,
  bouquet: 2,
  message: 3,
  done: 4,
}

interface RevealCardProps {
  config: SurpriseConfig
  stage: RevealStage
  reduced?: boolean
}

const lineIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

/**
 * The letter that emerges from the envelope: paper, keepsake photograph,
 * the digital bouquet, and the personalised message — revealed in stages.
 */
export default function RevealCard({ config, stage, reduced = false }: RevealCardProps) {
  const prefersReduced = useReducedMotion()
  const noTransform = reduced || prefersReduced === true
  const [photoFailed, setPhotoFailed] = useState(false)

  const at = (s: RevealStage) => STAGE_ORDER[stage] >= STAGE_ORDER[s]
  const showPhoto = at('photo')
  const showBouquet = at('bouquet')
  const showMessage = at('message')
  const showBadge = at('done')
  const photoShown = config.includeImage && config.image && !photoFailed

  return (
    <motion.article
      initial={noTransform ? { opacity: 0 } : { opacity: 0, y: 44, scale: 0.94 }}
      animate={noTransform ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      className="relative w-full max-w-xl rounded-[20px] border border-cream-300/70 px-7 pb-10 pt-4 shadow-lifted sm:px-10"
      style={{
        background: 'linear-gradient(180deg, #FDFBF4 0%, #F7EEDC 100%)',
        transformOrigin: '50% 0%',
      }}
    >
      <span className="paper-grain pointer-events-none absolute inset-0 rounded-[20px] opacity-40" />
      <span className="paper-lines pointer-events-none absolute inset-x-8 top-28 bottom-16 opacity-30" />

      {/* keepsake photo */}
      <div
        className={`relative z-10 mx-auto w-[78%] max-w-[280px] transition-[height] duration-300 ${
          photoShown ? 'h-[168px] sm:h-[184px]' : 'h-0'
        }`}
      >
        {photoShown && (
          <motion.div
            initial={false}
            animate={
              showPhoto
                ? { opacity: 1, scale: 1, rotate: -2.5, y: 0 }
                : { opacity: 0, scale: 0.88, rotate: 3, y: 14 }
            }
            transition={{ type: 'spring', stiffness: 110, damping: 14 }}
          >
            <PolaroidPhoto
              src={config.image}
              alt={REVEAL_IMAGE_ALT}
              onError={() => setPhotoFailed(true)}
            />
          </motion.div>
        )}
      </div>

      {/* bouquet */}
      <div className="relative z-10 flex h-[280px] items-end justify-center sm:h-[300px]">
        <motion.div
          initial={false}
          animate={showBouquet ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <BouquetSVG
            flowers={config.flowers}
            wrapping={config.wrappingStyle}
            ribbon={config.ribbonStyle}
            arrangement={config.arrangementStyle}
            bloomed={false}
            className="h-auto w-44 drop-shadow-lg sm:w-48"
          />
        </motion.div>
      </div>

      {/* personalised message */}
      <div className="relative z-10 mt-2 space-y-3 text-center">
        <motion.p
          className="font-display text-2xl text-cocoa-700 sm:text-3xl"
          variants={lineIn}
          initial="hidden"
          animate={showMessage ? 'show' : 'hidden'}
        >
          {config.recipientName.trim() ? `To: ${config.recipientName.trim()}` : 'To: you'}
        </motion.p>
        <motion.p
          className="whitespace-pre-wrap font-hand text-2xl leading-snug text-cocoa-600 sm:text-[1.75rem]"
          variants={lineIn}
          initial="hidden"
          animate={showMessage ? 'show' : 'hidden'}
          transition={{ delay: 0.12 }}
        >
          {config.message.trim() || 'Just a little something, made with all my heart.'}
        </motion.p>
        <motion.p
          className="text-right font-hand text-2xl text-rose-500"
          variants={lineIn}
          initial="hidden"
          animate={showMessage ? 'show' : 'hidden'}
          transition={{ delay: 0.24 }}
        >
          {config.senderName.trim() ? `— ${config.senderName.trim()}` : '— me'}
        </motion.p>
      </div>

      {/* signature badge */}
      <div className="relative z-10 mt-6 flex justify-center">
        <motion.p
          className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-5 py-2 font-hand text-2xl text-cocoa-700 ring-1 ring-gold-400/40"
          initial={false}
          animate={showBadge ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 160, damping: 13 }}
        >
          <Heart className="h-4 w-4 fill-gold-400 text-gold-400" aria-hidden="true" />
          Made just for you ♡
        </motion.p>
      </div>
    </motion.article>
  )
}