import { motion, useReducedMotion } from 'framer-motion'

export type EnvelopePhase = 'closed' | 'opening' | 'open' | 'gone'

interface EnvelopeProps {
  phase: EnvelopePhase
  interactive?: boolean
  onOpen?: () => void
  className?: string
}

const FLAP_GRADIENT = 'linear-gradient(180deg, #F5E9D1 0%, #EBD8B6 100%)'

/**
 * A CSS/SVG-crafted envelope: triangle flap that rotates open in 3D,
 * a wax heart-seal that splits in two, and an inner letter card that
 * slides up out of the pocket.
 */
export default function Envelope({
  phase,
  interactive = true,
  onOpen,
  className,
}: EnvelopeProps) {
  const reduced = useReducedMotion()
  const opened = phase === 'opening' || phase === 'open' || phase === 'gone'
  const gone = phase === 'gone'
  const letterUp = phase === 'open' || gone

  return (
    <motion.button
      type="button"
      aria-label="Open the envelope"
      aria-disabled={!interactive || opened}
      disabled={!interactive || opened}
      onClick={() => {
        if (!opened && interactive) onOpen?.()
      }}
      animate={
        gone
          ? { opacity: 0, y: 18, scale: 0.92 }
          : opened
            ? { y: -14, scale: 1.02, rotate: 0.6 }
            : reduced
              ? { y: 0, scale: 1 }
              : { y: [0, -9, 0], rotate: [0, 0.7, 0] }
      }
      transition={
        opened
          ? { type: 'spring', stiffness: 120, damping: 16 }
          : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
      }
      style={{ perspective: 1200 }}
      className={`relative block select-none ${className ?? ''}`}
    >
      <span className="relative block h-auto w-full" style={{ aspectRatio: '340 / 215' }}>
        {/* soft shadow beneath */}
        <span
          className="absolute left-1/2 top-[88%] h-[12%] w-[92%] -translate-x-1/2 rounded-full blur-md"
          style={{ background: 'rgba(8, 4, 10, 0.55)' }}
        />

        {/* back panel */}
        <span
          className="absolute inset-0 rounded-[10px]"
          style={{
            background: 'linear-gradient(180deg, #F7ECD5 0%, #EFDFC4 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(196, 168, 128, 0.55), inset 0 -6px 14px rgba(160, 124, 84, 0.18)',
          }}
        />

        {/* pocket interior shading */}
        <span
          className="absolute left-1/2 top-[52%] h-5 w-[62%] -translate-x-1/2 rounded-full"
          style={{ background: 'rgba(120, 84, 48, 0.10)', filter: 'blur(5px)' }}
        />

        {/* inner letter card */}
        <motion.span
          className="absolute bottom-[2%] left-[6%] right-[6%] rounded-[8px]"
          style={{ height: '68%', background: '#FDFBF5' }}
          initial={false}
          animate={letterUp ? { y: '-92%' } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.25 }}
        >
          <motion.span
            className="absolute inset-x-[8%] top-[9%] block h-[3px] rounded-full"
            style={{ background: 'rgba(196, 168, 128, 0.55)' }}
            initial={false}
            animate={letterUp ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="absolute inset-x-[8%] top-[26%] h-[1.5px] rounded-full bg-[rgba(196,168,128,0.4)]" />
          <span className="absolute inset-x-[8%] top-[36%] h-[1.5px] rounded-full bg-[rgba(196,168,128,0.4)]" />
          <span className="absolute inset-x-[8%] top-[46%] h-[1.5px] rounded-full bg-[rgba(196,168,128,0.4)]" />
        </motion.span>

        {/* front face: pocket + side tongues */}
        <span className="absolute inset-0">
          <svg
            viewBox="0 0 340 215"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2E4CA" />
                <stop offset="100%" stopColor="#E8D6B6" />
              </linearGradient>
              <linearGradient id="env-tongue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EFDFC2" />
                <stop offset="100%" stopColor="#E3CDA8" />
              </linearGradient>
              <linearGradient id="env-tongue-r" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EFDFC2" />
                <stop offset="100%" stopColor="#E3CDA8" />
              </linearGradient>
            </defs>
            {/* pocket (V-cut front) */}
            <path
              d="M 6 4 L 170 122 L 334 4 L 334 203 Q 334 209 328 209 L 12 209 Q 6 209 6 203 Z"
              fill="url(#env-pocket)"
            />
            {/* seam lines of the V */}
            <path d="M 6 4 L 170 122" stroke="rgba(124, 94, 66, 0.20)" strokeWidth="1.4" fill="none" />
            <path d="M 334 4 L 170 122" stroke="rgba(124, 94, 66, 0.20)" strokeWidth="1.4" fill="none" />
            {/* left tongue */}
            <path d="M 6 4 L 170 122 L 6 122 Z" fill="url(#env-tongue)" />
            {/* right tongue */}
            <path d="M 334 4 L 170 122 L 334 122 Z" fill="url(#env-tongue-r)" />
            {/* top fold highlights */}
            <path
              d="M 10 8 L 166 118"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M 330 8 L 174 118"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </span>

        {/* flap */}
        <motion.span
          className="absolute inset-0"
          initial={false}
          animate={{ rotateX: opened ? -170 : 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 13, mass: 1.1 }}
          style={{
            transformOrigin: '50% 0%',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            clipPath: 'polygon(0 0, 100% 0, 50% 57%)',
            background: FLAP_GRADIENT,
            WebkitClipPath: 'polygon(0 0, 100% 0, 50% 57%)',
          }}
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #F5E9D1 0%, #EBD8B6 100%)',
              boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.6)',
            }}
          />
        </motion.span>

        {/* wax heart seal */}
        <motion.span
          className="absolute left-1/2 top-[56.5%] z-10 block h-[15%] w-[13%] min-h-10 min-w-9 -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={opened ? { scale: 1.12 } : { scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Seal />
        </motion.span>
      </span>
    </motion.button>
  )
}

function Seal() {
  return (
    <>
      {/* base wax fades away as the halves fly apart */}
      <motion.span
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.4, ease: 'easeIn', delay: 0.14 }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 34% 30%, #C55252 0%, #963131 55%, #6E2020 100%)',
            boxShadow:
              '0 4px 12px rgba(30, 8, 8, 0.55), inset 0 -3px 6px rgba(40, 10, 10, 0.55), inset 0 2px 3px rgba(255,190,180,0.4)',
          }}
        />
        <span className="absolute inset-[20%]">
          <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
            <path
              d="M32 52 C 30 48 16 40 16 27 C 16 19 22 14 28 18 C 30 19.4 31.5 22 32 24.5 C 32.5 22 34 19.4 36 18 C 42 14 48 19 48 27 C 48 40 34 48 32 52 Z"
              fill="#AE3C3C"
              stroke="#7E2626"
              strokeWidth="1.5"
            />
            <path
              d="M28 22 C 26 20 24 21 24 23.5 C 24 26 28 27.5 30 26.5"
              fill="rgba(255,215,205,0.4)"
            />
          </svg>
        </span>
        <span
          className="absolute left-[18%] top-[10%] h-[26%] w-[34%] rounded-full"
          style={{ background: 'rgba(255, 240, 230, 0.45)', filter: 'blur(2px)' }}
        />
      </motion.span>
      {/* split halves */}
      <MotionHalves />
    </>
  )
}

function MotionHalves() {
  return (
    <>
      <motion.span
        className="absolute inset-0"
        initial={false}
        animate={{ x: -26, rotate: -16, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeIn', delay: 0.05 }}
        style={{ clipPath: 'inset(0 50% 0 0)' }}
      >
        <SealHalf />
      </motion.span>
      <motion.span
        className="absolute inset-0"
        initial={false}
        animate={{ x: 26, rotate: 16, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeIn', delay: 0.05 }}
        style={{ clipPath: 'inset(0 0 0 50%)' }}
      >
        <SealHalf />
      </motion.span>
    </>
  )
}

function SealHalf() {
  return <span className="block h-full w-full rounded-full" style={{ background: '#8E2828' }} />
}