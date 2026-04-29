export class AudioService {
  private currentAudio: HTMLAudioElement | null = null
  private listeners: ((state: AudioState) => void)[] = []

  private state: AudioState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentAyah: null,
    url: null,
  }

  constructor() {
    this.setupAudioElement()
  }

  private setupAudioElement() {
    if (typeof window === 'undefined') return

    this.currentAudio = new Audio()
    this.currentAudio.addEventListener('play', () => this.updateState())
    this.currentAudio.addEventListener('pause', () => this.updateState())
    this.currentAudio.addEventListener('timeupdate', () => this.updateState())
    this.currentAudio.addEventListener('loadedmetadata', () => this.updateState())
    this.currentAudio.addEventListener('ended', () => this.onAudioEnded())
    this.currentAudio.addEventListener('error', (e) =>
      console.error('Audio error:', e)
    )
  }

  private updateState() {
    if (!this.currentAudio) return

    this.state = {
      ...this.state,
      isPlaying: !this.currentAudio.paused,
      currentTime: this.currentAudio.currentTime,
      duration: this.currentAudio.duration || 0,
    }

    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state))
  }

  private onAudioEnded() {
    this.state.isPlaying = false
    this.notifyListeners()
  }

  play(url?: string) {
    if (!this.currentAudio) this.setupAudioElement()

    if (url && url !== this.state.url) {
      this.currentAudio!.src = url
      this.state.url = url
    }

    this.currentAudio!.play()
      .then(() => this.updateState())
      .catch((error) => console.error('Play error:', error))
  }

  pause() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.updateState()
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.updateState()
    }
  }

  seek(time: number) {
    if (this.currentAudio) {
      this.currentAudio.currentTime = time
      this.updateState()
    }
  }

  setVolume(volume: number) {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  getVolume(): number {
    return this.currentAudio?.volume || 0.5
  }

  setCurrentAyah(ayah: number | null) {
    this.state.currentAyah = ayah
    this.notifyListeners()
  }

  subscribe(listener: (state: AudioState) => void) {
    this.listeners.push(listener)
    // Send current state immediately
    listener(this.state)
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getState(): AudioState {
    return { ...this.state }
  }
}

export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  currentAyah: number | null
  url: string | null
}

export const audioService = new AudioService()
