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
        <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 110, damping: 16 }}
            className="w-full max-w-md rounded-[24px] border border-cream-300/70 bg-white/80 p-7 text-center shadow-lifted backdrop-blur sm:p-9"
          >
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-blush-200/70">
              <Sparkles className="h-6 w-6 text-rose-400" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-2xl text-cocoa-700 sm:text-[1.7rem]">
              Your little surprise is ready ✨
            </h1>
            <p className="mt-2 font-sans text-sm text-cocoa-500">
              Tuck this link somewhere lovely — a text, a message, an email.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-cream-300/70 bg-cream-50 px-4 py-3">
              <span className="min-w-0 flex-1 break-all text-left font-sans text-[13px] leading-snug text-cocoa-600">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy link"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blush-200/80 text-cocoa-700 transition hover:bg-blush-300"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-sage-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full bg-rose-400 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-rose-500"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-full bg-blush-300 px-4 py-3 text-sm font-bold text-cocoa-800 shadow-soft transition hover:bg-blush-400"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share
              </button>
              <button
                type="button"
                onClick={() => window.open(shareUrl, '_blank', 'noopener,noreferrer')}
                className="flex items-center justify-center gap-1.5 rounded-full bg-sage-300 px-4 py-3 text-sm font-bold text-cocoa-800 shadow-soft transition hover:bg-sage-400"
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
              className="mx-auto mt-6 flex items-center gap-2 font-sans text-sm text-cocoa-400 underline-offset-4 transition hover:text-cocoa-600 hover:underline"
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
        className="fixed bottom-4 left-4 z-30 flex size-11 items-center justify-center rounded-full border border-cream-300/70 bg-white/80 shadow-soft backdrop-blur transition hover:bg-white"
        aria-label="Back to customising your surprise"
        title="Back to customising"
      >
        <Heart className="h-4 w-4 text-cocoa-600" aria-hidden="true" />
      </Link>
    </>
  )
}