import { useState } from 'react'

interface PolaroidPhotoProps {
  src: string
  alt: string
  caption?: string
  className?: string
  /** called if the image fails to load (e.g. the sender hasn't added their photo yet) */
  onError?: () => void
}

/** A keepsake photo presented like a real Polaroid, tucked into the letter. */
export default function PolaroidPhoto({
  src,
  alt,
  caption = 'for you ♡',
  className,
  onError,
}: PolaroidPhotoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <figure className={`rounded-[6px] bg-white p-2.5 pb-1.5 shadow-soft ${className ?? ''}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        onError={() => {
          setFailed(true)
          onError?.()
        }}
        className="aspect-[3/2] w-full rounded-[3px] object-cover"
      />
      <figcaption className="select-none py-1 text-center font-hand text-xl leading-none text-cocoa-500">
        {caption}
      </figcaption>
    </figure>
  )
}