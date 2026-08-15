import LZString from 'lz-string'
import type { SurpriseConfig } from '../types'

export function nowIso(): number {
  return Date.now()
}

export function makeId(length = 5): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  let out = ''
  const values = crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i++) out += chars[values[i] % chars.length]
  return out
}

/**
 * The surprise is encoded entirely inside the URL so the link works from any
 * browser, session, or device — no database required.
 *
 * encodedId = lz-compressed, base64-safe (a-zA-Z0-9-_)
 */
export function encodeSurprise(config: SurpriseConfig): string {
  const payload = JSON.stringify(config)
  return LZString.compressToEncodedURIComponent(payload)
}

export function decodeSurprise(encoded: string): SurpriseConfig | null {
  try {
    const payload = LZString.decompressFromEncodedURIComponent(encoded)
    if (!payload) return null
    const parsed = JSON.parse(payload) as SurpriseConfig
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray(parsed.flowers) ||
      typeof parsed.message !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function buildShareUrl(id: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/surprise/${id}`
}