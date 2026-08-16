import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Copy, Eye, Heart, RefreshCw, Share2, Sparkles } from 'lucide-react'
import RevealExperience from '../components/Reveal/RevealExperience'
import FloatingPetals from '../components/Shared/FloatingPetals'
import { totalStems } from '../data/flowers'
import { useDraft } from '../state/DraftContext'
import { buildShareUrl, encodeSurprise } from '../utils/store'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export default function Preview() {
  const { draft, resetDraft } = useDraft()
  const navigate = useNavigate()
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const hasFlowers = totalStems(draft.flowers) > 0

  useEffect(() => {
    document.title = 'A Little Something For You'
  }, [])

  useEffect(() => {
    if (!hasFlowers) navigate('/create', { replace: true })
  }, [hasFlowers, navigate])

  const handleGenerate = useCallback(() => {
    const id = encodeSurprise(draft)
    setShareUrl(buildShareUrl(id))
  }, [draft])

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return
    const ok = await copyText(shareUrl)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    }
  }, [shareUrl])

  const handleShare = useCallback(async () => {
    if (!shareUrl) return
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'A Little Something For You',
          text: 'I made you a little something… open it carefully 💌',
          url: shareUrl,
        })
        return
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    await handleCopy()
  }, [shareUrl, handleCopy])

  if (shareUrl) {
    return (
      <div
        className="relative min-h-screen overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E1826 0%, #16121C 55%, #120F1A 100%)' }}
      >
        <FloatingPetals count={12} sparkles />
        <div aria-hidden="true" className="night-vignette pointer-events-none absolute inset-0" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 110, damping: 16 }}
            className="glass-chrome w-full max-w-md rounded-[24px] p-7 text-center shadow-lifted sm:p-9"
          >
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-400/20 ring-1 ring-gold-400/40">
              <Sparkles className="h-6 w-6 text-gold-300" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-2xl text-cream-50 sm:text-[1.7rem]">
              Your little surprise is ready ✨
            </h1>
            <p className="mt-2 font-sans text-sm text-plum-200">
              Tuck this link somewhere lovely — a text, a message, an email.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-plum-900/60 px-4 py-3">
              <span className="min-w-0 flex-1 break-all text-left font-sans text-[13px] leading-snug text-cream-100">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy link"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-cream-100 transition hover:bg-white/20"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-sage-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="press rounded-full bg-gold-400 px-4 py-3 text-sm font-bold text-plum-950 shadow-glow-gold transition hover:bg-gold-300"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="press flex items-center justify-center gap-1.5 rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-cream-50 transition hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share
              </button>
              <button
                type="button"
                onClick={() => window.open(shareUrl, '_blank', 'noopener,noreferrer')}
                className="press flex items-center justify-center gap-1.5 rounded-full bg-sage-500/20 px-4 py-3 text-sm font-bold text-sage-300 ring-1 ring-sage-400/40 transition hover:bg-sage-500/30"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                resetDraft()
                navigate('/create')
              }}
              className="mx-auto mt-6 flex items-center gap-2 font-sans text-sm text-plum-200 underline-offset-4 transition hover:text-gold-300 hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Make another one
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <>
      <RevealExperience config={draft} variant="preview" onGenerate={handleGenerate} />
      <Link
        to="/create"
        className="glass-chrome fixed bottom-4 left-4 z-30 flex size-11 items-center justify-center rounded-full shadow-lifted transition hover:bg-white/10"
        aria-label="Back to customising your surprise"
        title="Back to customising"
      >
        <Heart className="h-4 w-4 text-gold-300" aria-hidden="true" />
      </Link>
    </>
  )
}