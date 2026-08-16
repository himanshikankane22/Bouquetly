import { Sparkles } from 'lucide-react'
import type { SurpriseConfig } from '../../types'

export default function CardPreview({ config }: { config: SurpriseConfig }) {
  return (
    <div className="paper-lines mx-auto w-full max-w-sm rotate-[-0.5deg] rounded-2xl bg-cream-50/95 p-8 shadow-lifted">
      {config.includeImage &&
        (config.image.startsWith('data:') ? (
          <div className="mb-7 flex items-center justify-center rounded-lg border-[6px] border-white bg-cream-100 p-1 shadow-sm">
            <img
              src={config.image}
              alt="Your keepsake photo"
              className="max-h-44 w-auto rounded-sm object-cover"
            />
          </div>
        ) : (
          <div className="mb-7 flex flex-col items-center justify-center gap-1.5 rounded-lg border-[6px] border-white bg-gradient-to-br from-blush-100 via-blush-50 to-peach-100 px-6 py-7 shadow-sm">
            <Sparkles size={20} className="text-rose-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-cocoa-400">your photo</span>
          </div>
        ))}
      <p className="font-display text-lg text-cocoa-700">
        To {config.recipientName.trim() ? config.recipientName : 'you'}
      </p>
      {config.message.trim() ? (
        <p className="mt-2.5 font-hand text-xl leading-relaxed text-cocoa-600">{config.message}</p>
      ) : (
        <p className="mt-2.5 font-hand text-xl italic text-cocoa-300">your words here…</p>
      )}
      <p className="mt-5 font-hand text-lg text-cocoa-500">
        — from {config.senderName.trim() ? config.senderName : '…'}
      </p>
    </div>
  )
}