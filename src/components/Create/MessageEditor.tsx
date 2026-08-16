import { motion } from 'framer-motion'
import { ImagePlus, RefreshCw, X } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { MAX_MESSAGE_LENGTH } from '../../types'
import type { SurpriseConfig } from '../../types'

interface MessageEditorProps {
  config: SurpriseConfig
  onChange: (partial: Partial<SurpriseConfig>) => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-display text-base text-cream-50">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClasses =
  'w-full rounded-xl border border-white/10 bg-plum-900/60 px-4 py-3 text-cream-50 placeholder:text-plum-300 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/40'

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read failed'))
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('read failed'))
        return
      }
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function downscaleImage(dataUrl: string, maxDim = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('decode failed'))
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight))
        const width = Math.max(1, Math.round(img.naturalWidth * scale))
        const height = Math.max(1, Math.round(img.naturalHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('canvas unavailable')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      } catch (err) {
        reject(err)
      }
    }
    img.src = dataUrl
  })
}

export default function MessageEditor({ config, onChange }: MessageEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const hasPhoto = config.image.startsWith('data:')

  const handleFile = async (file: File) => {
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setUploading(true)
    try {
      const dataUrl = await downscaleImage(await readImageAsDataUrl(file))
      onChange({ image: dataUrl })
    } catch {
      setError('That photo could not be read — please try another one.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="glass-chrome space-y-5 rounded-3xl p-6 shadow-lifted">
      <Field label="To:">
        <input
          type="text"
          value={config.recipientName}
          onChange={(e) => onChange({ recipientName: e.target.value })}
          placeholder="their name"
          className={inputClasses}
        />
      </Field>
      <Field label="Your message:">
        <div className="relative">
          <textarea
            value={config.message}
            onChange={(e) => onChange({ message: e.target.value })}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={4}
            placeholder="Just wanted to remind you that you're someone very special."
            className={`${inputClasses} resize-none pb-9`}
          />
          <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-xs font-semibold text-plum-300">
            {config.message.length} / {MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </Field>
      <Field label="From:">
        <input
          type="text"
          value={config.senderName}
          onChange={(e) => onChange({ senderName: e.target.value })}
          placeholder="your name"
          className={inputClasses}
        />
      </Field>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-plum-900/50 px-4 py-3.5">
        <div>
          <p className="font-display text-base text-cream-50">Include the keepsake photo</p>
          <p className="mt-0.5 text-xs text-plum-300">A little polaroid tucked inside the card</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={config.includeImage}
          onClick={() => onChange({ includeImage: !config.includeImage })}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
            config.includeImage ? 'bg-gold-400' : 'bg-white/20'
          }`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            className={`inline-block h-5 w-5 rounded-full bg-white shadow ${
              config.includeImage ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {config.includeImage && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-plum-900/40 px-4 py-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
            }}
          />
          {hasPhoto ? (
            <div className="flex items-center gap-4">
              <img
                src={config.image}
                alt="Your keepsake photo"
                className="h-16 w-16 shrink-0 rounded-lg object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-cream-50">Your photo is tucked in</p>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 hover:text-gold-200"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Replace photo
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ image: '' })}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum-200 hover:text-cream-100"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-transparent py-3 text-plum-200 transition hover:border-gold-400/50 hover:bg-plum-800/50 hover:text-gold-300 disabled:opacity-60"
            >
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-semibold">
                {uploading ? 'Tucking your photo in…' : 'Add a photo'}
              </span>
              <span className="text-xs text-plum-300">JPG or PNG — it will be tucked in nicely</span>
            </button>
          )}
          {error && <p className="mt-2 text-xs font-semibold text-gold-300">{error}</p>}
        </div>
      )}
    </div>
  )
}