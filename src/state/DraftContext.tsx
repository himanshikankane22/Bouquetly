import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SurpriseConfig } from '../types'
import { REVEAL_IMAGE_PATH } from '../utils/constants'
import { nowIso } from '../utils/store'

const DRAFT_KEY = 'little-something-draft-v1'

export function emptyDraft(): SurpriseConfig {
  return {
    recipientName: '',
    senderName: '',
    message: '',
    image: REVEAL_IMAGE_PATH,
    includeImage: true,
    flowers: [{ type: 'rose', quantity: 3 }],
    wrappingStyle: 'kraft',
    ribbonStyle: 'satin',
    arrangementStyle: 'fan',
    backgroundStyle: 'cream',
    createdAt: nowIso(),
  }
}

function loadDraft(): SurpriseConfig {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SurpriseConfig
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.flowers)) {
        return { ...emptyDraft(), ...parsed }
      }
    }
  } catch {
    /* fall through to empty draft */
  }
  return emptyDraft()
}

interface DraftContextValue {
  draft: SurpriseConfig
  setDraft: (next: SurpriseConfig) => void
  updateDraft: (partial: Partial<SurpriseConfig>) => void
  resetDraft: () => void
}

const DraftContext = createContext<DraftContextValue | null>(null)

export function DraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<SurpriseConfig>(() => loadDraft())

  const setDraft = useCallback((next: SurpriseConfig) => {
    setDraftState(next)
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
    } catch {
      /* storage unavailable — in-memory only */
    }
  }, [])

  const updateDraft = useCallback(
    (partial: Partial<SurpriseConfig>) => {
      setDraftState((prev) => {
        const next = { ...prev, ...partial }
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft())
  }, [setDraft])

  const value = useMemo(
    () => ({ draft, setDraft, updateDraft, resetDraft }),
    [draft, setDraft, updateDraft, resetDraft],
  )

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
}

export function useDraft(): DraftContextValue {
  const ctx = useContext(DraftContext)
  if (!ctx) throw new Error('useDraft must be used within DraftProvider')
  return ctx
}