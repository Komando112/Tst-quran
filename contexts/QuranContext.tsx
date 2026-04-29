'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Surah, SurahDetail } from '@/types/quran'
import { quranApi } from '@/services/quranApi'

interface QuranContextType {
  surahs: Surah[]
  currentSurah: SurahDetail | null
  loading: boolean
  error: string | null
  fetchSurahs: () => Promise<void>
  fetchSurah: (surahNumber: number) => Promise<void>
  setError: (error: string | null) => void
}

const QuranContext = createContext<QuranContextType | undefined>(undefined)

export function QuranProvider({ children }: { children: ReactNode }) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<SurahDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSurahs = async () => {
    if (surahs.length > 0) return

    setLoading(true)
    setError(null)

    try {
      const data = await quranApi.getSurahs()
      setSurahs(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch surahs'
      setError(message)
      console.error('Error fetching surahs:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSurah = async (surahNumber: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await quranApi.getSurah(surahNumber)
      setCurrentSurah(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch surah'
      setError(message)
      console.error(`Error fetching surah ${surahNumber}:`, err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurahs()
  }, [])

  return (
    <QuranContext.Provider
      value={{
        surahs,
        currentSurah,
        loading,
        error,
        fetchSurahs,
        fetchSurah,
        setError,
      }}
    >
      {children}
    </QuranContext.Provider>
  )
}

export function useQuran() {
  const context = useContext(QuranContext)
  if (!context) {
    throw new Error('useQuran must be used within QuranProvider')
  }
  return context
}
