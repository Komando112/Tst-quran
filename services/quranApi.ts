import { QURAN_API_BASE, ERROR_MESSAGES } from '@/lib/constants'
import { Surah, SurahDetail, Ayah } from '@/types/quran'

const DEFAULT_TIMEOUT = 10000

async function fetchWithTimeout(
  url: string,
  timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export const quranApi = {
  async getSurahs(): Promise<Surah[]> {
    try {
      const response = await fetchWithTimeout(`${QURAN_API_BASE}/surah`)

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FETCH_SURAHS_FAILED)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching surahs:', error)
      throw new Error(ERROR_MESSAGES.FETCH_SURAHS_FAILED)
    }
  },

  async getSurah(surahNumber: number): Promise<SurahDetail> {
    try {
      const response = await fetchWithTimeout(
        `${QURAN_API_BASE}/surah/${surahNumber}`
      )

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.FETCH_SURAH_FAILED)
      }

      const data = await response.json()
      return data.data || null
    } catch (error) {
      console.error(`Error fetching surah ${surahNumber}:`, error)
      throw new Error(ERROR_MESSAGES.FETCH_SURAH_FAILED)
    }
  },

  async getAyahByNumber(
    surahNumber: number,
    ayahNumber: number
  ): Promise<Ayah> {
    try {
      const response = await fetchWithTimeout(
        `${QURAN_API_BASE}/ayah/${surahNumber}:${ayahNumber}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch ayah')
      }

      const data = await response.json()
      return data.data || null
    } catch (error) {
      console.error(`Error fetching ayah ${surahNumber}:${ayahNumber}:`, error)
      throw new Error('Failed to fetch ayah')
    }
  },

  async getVerseOfDay(): Promise<{ surah: number; ayah: number }> {
    try {
      // Get a random surah and ayah
      const surahNumber = Math.floor(Math.random() * 114) + 1
      const surah = await this.getSurah(surahNumber)
      const ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1
      return { surah: surahNumber, ayah: ayahNumber }
    } catch (error) {
      console.error('Error getting verse of day:', error)
      // Fallback to Al-Fatiha
      return { surah: 1, ayah: 1 }
    }
  },

  getAudioUrl(surahNumber: number, reciterId: string): string {
    // Map reciter IDs to their CDN paths
    const reciterPaths: { [key: string]: string } = {
      'abdul-basit-murattal': 'abdul_basit_murattal/mp3',
      'abdul-basit-mujawwad': 'abdul_basit_mujawwad/mp3',
      'abdur-rahman-as-sudais': 'abdur_rahman_as_sudais/mp3',
      'abu-bakr-ash-shatri': 'abu_bakr_ash_shatri/mp3',
      'ahmed-ibn-ali-al-ajmi': 'ahmed_ibn_ali_al_ajmi/mp3',
      'fares-abbad': 'fares_abbad/mp3',
      'karim-mansoori': 'karim_mansoori/mp3',
      'mahmoud-al-banna': 'mahmoud_al_banna/mp3',
      'mishary-alafasy': 'mishary_alafasy/mp3',
    }

    const reciterPath = reciterPaths[reciterId] || reciterPaths['abdul-basit-murattal']
    const paddedSurah = String(surahNumber).padStart(3, '0')

    return `https://cdn.islamic.network/quran_audio/256/${reciterPath}/${paddedSurah}.mp3`
  },
}
