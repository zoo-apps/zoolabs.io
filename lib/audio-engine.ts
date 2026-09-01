// Web Audio Engine & Multi-Agent Discord-like Voice System for Zoo Labs
// Supports: Real Microphone Capture with VAD (Voice Activity Detection),
// Multi-Agent Web Speech Synthesis with distinct species acoustics,
// AudioContext frequency analysers for live speaking waves, and spatial sound cues.

export interface AudioVoiceSettings {
  pitch: number
  rate: number
  volume: number
  toneFreq?: number
}

// Species-specific voice and acoustic profile
export const ANIMAL_VOICE_PROFILES: Record<string, AudioVoiceSettings> = {
  blue: { pitch: 1.08, rate: 0.96, volume: 1.0, toneFreq: 440 }, // Beluga: warm, melodic
  wolf: { pitch: 1.15, rate: 1.05, volume: 1.0, toneFreq: 520 }, // Wolf: focused, scholarly
  elephant: { pitch: 0.62, rate: 0.88, volume: 1.0, toneFreq: 120 }, // Elephant: deep, resonant bass
  giraffe: { pitch: 0.92, rate: 0.92, volume: 1.0, toneFreq: 300 }, // Giraffe: visionary, calm
  tiger: { pitch: 0.78, rate: 1.02, volume: 1.0, toneFreq: 220 }, // Tiger: crisp, authoritative security
  leopard: { pitch: 1.22, rate: 1.18, volume: 1.0, toneFreq: 640 }, // Leopard: fast tracer, nimble
  rhino: { pitch: 0.70, rate: 0.85, volume: 1.0, toneFreq: 160 }, // Rhino: rigorous logician
  hippo: { pitch: 0.82, rate: 1.00, volume: 1.0, toneFreq: 200 }, // Hippo: sturdy builder
}

class ZooAudioEngine {
  private audioCtx: AudioContext | null = null
  private micStream: MediaStream | null = null
  private analyser: AnalyserNode | null = null
  private micSource: MediaStreamAudioSourceNode | null = null
  private isMuted: boolean = false
  private isDeafened: boolean = false
  private isListening: boolean = false
  private vadInterval: any = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private onUserSpeakingCallbacks: ((speaking: boolean, level: number) => void)[] = []
  private onAgentSpeakingCallbacks: ((agentId: string, speaking: boolean) => void)[] = []

  // Initialize or resume AudioContext
  public getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  // Start capturing human microphone with Voice Activity Detection
  public async startMicrophone(
    onSpeakingChange?: (speaking: boolean, level: number) => void
  ): Promise<boolean> {
    if (onSpeakingChange) {
      this.onUserSpeakingCallbacks.push(onSpeakingChange)
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('Microphone access not supported in this browser environment')
        return false
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      this.micStream = stream
      const ctx = this.getAudioContext()

      this.analyser = ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.4

      this.micSource = ctx.createMediaStreamSource(stream)
      this.micSource.connect(this.analyser)

      this.isListening = true
      this.startVADLoop()
      this.playCue('join')

      return true
    } catch (err) {
      console.warn('Microphone permission denied or audio device not found:', err)
      return false
    }
  }

  // Stop capturing microphone
  public stopMicrophone() {
    this.isListening = false
    if (this.vadInterval) {
      clearInterval(this.vadInterval)
      this.vadInterval = null
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop())
      this.micStream = null
    }
    if (this.micSource) {
      this.micSource.disconnect()
      this.micSource = null
    }
    this.notifyUserSpeaking(false, 0)
    this.playCue('leave')
  }

  // Mute / Unmute microphone input
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted
      })
    }
    this.playCue(this.isMuted ? 'mute' : 'unmute')
    return this.isMuted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }

  // Deafen / Undeafen audio output
  public toggleDeafen(): boolean {
    this.isDeafened = !this.isDeafened
    if (this.isDeafened && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    return this.isDeafened
  }

  public getIsDeafened(): boolean {
    return this.isDeafened
  }

  // Speak agent message using Web Speech API + species profile
  public speakAgent(
    agentId: string,
    text: string,
    onComplete?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.isDeafened || typeof window === 'undefined') {
        resolve()
        return
      }

      // Play soft bioacoustic chime
      this.playAcousticChime(agentId)

      if ('speechSynthesis' in window) {
        // Cancel any pending speech
        window.speechSynthesis.cancel()

        // Clean text of markdown / symbols
        const cleanText = text
          .replace(/[#*_`~[\]()]/g, ' ')
          .replace(/https?:\/\/\S+/g, 'link')
          .trim()

        if (!cleanText) {
          resolve()
          return
        }

        const utterance = new SpeechSynthesisUtterance(cleanText)
        const profile = ANIMAL_VOICE_PROFILES[agentId.toLowerCase()] || ANIMAL_VOICE_PROFILES.blue

        utterance.pitch = profile.pitch
        utterance.rate = profile.rate
        utterance.volume = profile.volume

        // Select suitable voice
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          if (agentId.toLowerCase() === 'elephant' || agentId.toLowerCase() === 'rhino') {
            const deepVoice = voices.find((v) => /daniel|alex|male|george/i.test(v.name))
            if (deepVoice) utterance.voice = deepVoice
          } else if (agentId.toLowerCase() === 'blue' || agentId.toLowerCase() === 'giraffe') {
            const friendlyVoice = voices.find((v) => /samantha|karen|victoria|female/i.test(v.name))
            if (friendlyVoice) utterance.voice = friendlyVoice
          } else if (agentId.toLowerCase() === 'wolf' || agentId.toLowerCase() === 'leopard') {
            const crispVoice = voices.find((v) => /karen|moira|tessa|fiona/i.test(v.name))
            if (crispVoice) utterance.voice = crispVoice
          }
        }

        this.notifyAgentSpeaking(agentId, true)

        utterance.onend = () => {
          this.notifyAgentSpeaking(agentId, false)
          this.currentUtterance = null
          if (onComplete) onComplete()
          resolve()
        }

        utterance.onerror = () => {
          this.notifyAgentSpeaking(agentId, false)
          this.currentUtterance = null
          if (onComplete) onComplete()
          resolve()
        }

        this.currentUtterance = utterance
        window.speechSynthesis.speak(utterance)
      } else {
        // Fallback: simulate speaking for 2.5s
        this.notifyAgentSpeaking(agentId, true)
        setTimeout(() => {
          this.notifyAgentSpeaking(agentId, false)
          if (onComplete) onComplete()
          resolve()
        }, 2500)
      }
    })
  }

  // Stop all agent speaking
  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    this.notifyAgentSpeaking('all', false)
  }

  // Subscribe to human speaker VAD updates
  public onUserSpeaking(callback: (speaking: boolean, level: number) => void): () => void {
    this.onUserSpeakingCallbacks.push(callback)
    return () => {
      this.onUserSpeakingCallbacks = this.onUserSpeakingCallbacks.filter((cb) => cb !== callback)
    }
  }

  // Subscribe to agent speaking updates
  public onAgentSpeaking(callback: (agentId: string, speaking: boolean) => void): () => void {
    this.onAgentSpeakingCallbacks.push(callback)
    return () => {
      this.onAgentSpeakingCallbacks = this.onAgentSpeakingCallbacks.filter((cb) => cb !== callback)
    }
  }

  // Audio cues: Join, Leave, Mute, Ping, Echolocation
  public playCue(type: 'join' | 'leave' | 'mute' | 'unmute' | 'ping' | 'click' | 'echolocation') {
    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime

      if (type === 'join') {
        // Two-tone ascending chime
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()

        osc1.frequency.setValueAtTime(440, now)
        osc2.frequency.setValueAtTime(660, now + 0.1)

        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)

        osc1.start(now)
        osc1.stop(now + 0.12)
        osc2.start(now + 0.1)
        osc2.stop(now + 0.35)
      } else if (type === 'leave') {
        // Descending chime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.setValueAtTime(550, now)
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.2)
        gain.gain.setValueAtTime(0.07, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.25)
      } else if (type === 'mute') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.setValueAtTime(320, now)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
      } else if (type === 'unmute') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.setValueAtTime(480, now)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
      } else if (type === 'ping' || type === 'click') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.frequency.setValueAtTime(880, now)
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.08)
      } else if (type === 'echolocation') {
        // High frequency beluga click train
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(1400 + i * 200, now + i * 0.04)
          gain.gain.setValueAtTime(0.04, now + i * 0.04)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.03)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + i * 0.04)
          osc.stop(now + i * 0.04 + 0.03)
        }
      }
    } catch (e) {
      // Ignore audio cue errors if AudioContext is blocked
    }
  }

  // Harmonic acoustic chime when agent begins response
  private playAcousticChime(agentId: string) {
    try {
      const ctx = this.getAudioContext()
      const now = ctx.currentTime
      const profile = ANIMAL_VOICE_PROFILES[agentId.toLowerCase()] || ANIMAL_VOICE_PROFILES.blue
      const baseFreq = profile.toneFreq || 440

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18)

      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)
    } catch (e) {
      // AudioContext muted/unsupported
    }
  }

  // Real-time Voice Activity Detection (VAD) Loop
  private startVADLoop() {
    if (this.vadInterval) clearInterval(this.vadInterval)

    const buffer = new Uint8Array(this.analyser ? this.analyser.frequencyBinCount : 128)
    let wasSpeaking = false

    this.vadInterval = setInterval(() => {
      if (!this.analyser || this.isMuted) {
        if (wasSpeaking) {
          wasSpeaking = false
          this.notifyUserSpeaking(false, 0)
        }
        return
      }

      this.analyser.getByteFrequencyData(buffer)

      // Calculate Root-Mean-Square (RMS) volume level
      let sum = 0
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i]
      }
      const rms = Math.sqrt(sum / buffer.length)
      const normalizedLevel = Math.min(100, Math.round((rms / 128) * 100))

      // VAD Threshold: > 18 triggers speaking ring
      const isSpeaking = normalizedLevel > 18

      if (isSpeaking !== wasSpeaking || isSpeaking) {
        wasSpeaking = isSpeaking
        this.notifyUserSpeaking(isSpeaking, normalizedLevel)
      }
    }, 80)
  }

  private notifyUserSpeaking(speaking: boolean, level: number) {
    this.onUserSpeakingCallbacks.forEach((cb) => cb(speaking, level))
  }

  private notifyAgentSpeaking(agentId: string, speaking: boolean) {
    this.onAgentSpeakingCallbacks.forEach((cb) => cb(agentId, speaking))
  }
}

// Singleton export
export const zooAudio = typeof window !== 'undefined' ? new ZooAudioEngine() : ({} as ZooAudioEngine)
