import { useCallback, useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/* Tiny Web-Audio soundkit: no audio files needed, everything is      */
/* synthesized. Sound is never autoplayed — the toggle is only ever    */
/* triggered by a user click, and chimes only play once enabled.       */
/* ------------------------------------------------------------------ */

type Ctx = AudioContext

function createCtx(): Ctx | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    return new Ctor()
  } catch {
    return null
  }
}

class SoundKit {
  ctx: Ctx | null = null
  master: GainNode | null = null
  ambientTimer: number | null = null
  ambientStep = 0

  ensure() {
    if (!this.ctx) {
      this.ctx = createCtx()
      if (this.ctx) {
        this.master = this.ctx.createGain()
        this.master.gain.value = 0.45
        this.master.connect(this.ctx.destination)
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume()
  }

  private tone(
    freq: number,
    at: number,
    dur: number,
    type: OscillatorType = 'sine',
    volume = 0.14,
  ) {
    if (!this.ctx || !this.master) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + at)
    gain.gain.exponentialRampToValueAtTime(volume, this.ctx.currentTime + at + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + at + dur)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(this.ctx.currentTime + at)
    osc.stop(this.ctx.currentTime + at + dur + 0.05)
  }

  private noise(at: number, dur: number, freq: number, volume = 0.08) {
    if (!this.ctx || !this.master) return
    const length = Math.floor(this.ctx.sampleRate * dur)
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length)
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 1.4
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + at)
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + at + dur)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    src.start(this.ctx.currentTime + at)
  }

  playOpen() {
    if (!this.ctx) return
    this.noise(0, 0.09, 900, 0.05)
    this.tone(240, 0.02, 0.16, 'sine', 0.12)
    this.tone(320, 0.06, 0.12, 'sine', 0.06)
  }

  playCard() {
    if (!this.ctx) return
    this.noise(0, 0.4, 1400, 0.028)
  }

  playReveal() {
    if (!this.ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => this.tone(f, i * 0.16 + 0.05, 0.9, 'sine', 0.09))
    this.tone(1567.98, 0.7, 1.3, 'sine', 0.05)
  }

  startAmbient() {
    if (!this.ctx || this.ambientTimer !== null) return
    const step = () => {
      const scale = [261.63, 329.63, 392.0, 523.25, 659.25]
      const f = scale[this.ambientStep % scale.length]
      this.tone(f, 0, 2.4, 'sine', 0.02)
      this.ambientStep += 1
    }
    step()
    this.ambientTimer = window.setInterval(step, 2400)
  }

  stopAmbient() {
    if (this.ambientTimer !== null) {
      clearInterval(this.ambientTimer)
      this.ambientTimer = null
    }
  }

  suspend() {
    this.stopAmbient()
    if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend()
  }
}

const kit = new SoundKit()

export interface SurpriseSound {
  enabled: boolean
  toggle: () => void
  playOpen: () => void
  playCard: () => void
  playReveal: () => void
}

export function useSurpriseSound(): SurpriseSound {
  const [enabled, setEnabled] = useState(false)
  const enabledRef = useRef(false)

  useEffect(() => {
    enabledRef.current = enabled
    if (enabled) {
      kit.ensure()
      kit.startAmbient()
    } else {
      kit.stopAmbient()
    }
  }, [enabled])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    if (next) {
      kit.ensure()
      setEnabled(true)
    } else {
      kit.suspend()
      setEnabled(false)
    }
  }, [])

  const playOpen = useCallback(() => {
    if (enabledRef.current) kit.playOpen()
  }, [])

  const playCard = useCallback(() => {
    if (enabledRef.current) kit.playCard()
  }, [])

  const playReveal = useCallback(() => {
    if (enabledRef.current) kit.playReveal()
  }, [])

  return { enabled, toggle, playOpen, playCard, playReveal }
}