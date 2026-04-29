export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
}

export interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajdah: boolean
}

export interface SurahDetail {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  ayahs: Ayah[]
}

export interface Reciter {
  id: string
  name: string
  category: 'male' | 'female'
  audioUrls: {
    [surahNumber: number]: string
  }
}

export interface VerseOfDay {
  surah: number
  ayah: number
  text: string
}

export interface QuranContextType {
  surahs: Surah[]
  currentSurah: SurahDetail | null
  loading: boolean
  error: string | null
  fetchSurahs: () => Promise<void>
  fetchSurah: (surahNumber: number) => Promise<void>
  setError: (error: string | null) => void
}

export interface AudioContextType {
  currentAudio: HTMLAudioElement | null
  isPlaying: boolean
  currentTime: number
  duration: number
  currentAyah: number | null
  play: () => void
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setAudio: (audio: HTMLAudioElement, ayah?: number) => void
  setCurrentAyah: (ayah: number | null) => void
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}
