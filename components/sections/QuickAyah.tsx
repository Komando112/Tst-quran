'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { useQuran } from '@/contexts/QuranContext'
import { useAudio } from '@/contexts/AudioContext'
import { useToast } from '@/hooks/useToast'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { quranApi } from '@/services/quranApi'
import { RECITERS, DEFAULT_RECITER_ID } from '@/lib/constants'
import { copyToClipboard } from '@/lib/utils'

export function QuickAyah() {
  const { surahs } = useQuran()
  const audio = useAudio()
  const { success, error } = useToast()

  const [selectedSurah, setSelectedSurah] = useLocalStorage<number>('quickSurah', 1)
  const [selectedAyah, setSelectedAyah] = useLocalStorage<number>('quickAyah', 1)
  const [selectedReciter, setSelectedReciter] = useLocalStorage<string>(
    'reciterId',
    DEFAULT_RECITER_ID
  )
  const [ayahText, setAyahText] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [maxAyahs, setMaxAyahs] = useState(0)

  // Load ayah text when surah or ayah changes
  useEffect(() => {
    const load = async () => {
      if (surahs.length === 0 || !selectedSurah) return

      const surah = surahs.find((s) => s.number === selectedSurah)
      if (surah) {
        setMaxAyahs(surah.numberOfAyahs)
        const finalAyah = selectedAyah > surah.numberOfAyahs ? surah.numberOfAyahs : selectedAyah
        setLoading(true)
        try {
          const surahDetail = await quranApi.getSurah(selectedSurah)
          const ayahData = surahDetail.ayahs[finalAyah - 1]
          if (ayahData) {
            setAyahText(ayahData.text)
          }
        } catch (err) {
          error('Failed to load ayah')
        } finally {
          setLoading(false)
        }
      }
    }
    load()
  }, [selectedSurah, selectedAyah, surahs, error])



  const handlePlay = () => {
    if (!selectedSurah) return
    try {
      const audioUrl = quranApi.getAudioUrl(selectedSurah, selectedReciter)
      audio.play(audioUrl)
      audio.setCurrentAyah(selectedAyah)
      success('Playing')
    } catch (err) {
      error('Failed to play audio')
    }
  }

  const handleCopy = async () => {
    if (await copyToClipboard(ayahText)) {
      success('Copied to clipboard')
    } else {
      error('Failed to copy')
    }
  }

  const surahOptions = surahs.map((s) => ({
    value: s.number,
    label: `${s.number}. ${s.name}`,
  }))

  const ayahOptions = Array.from({ length: maxAyahs }, (_, i) => ({
    value: i + 1,
    label: `Ayah ${i + 1}`,
  }))

  const reciterOptions = RECITERS.map((r) => ({
    value: r.id,
    label: r.name,
  }))

  return (
    <Card hoverable className="animate-fade-in">
      <CardHeader>
        <CardTitle>Quick Ayah Listener</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Surah</label>
            <Select
              options={surahOptions}
              value={selectedSurah || ''}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              aria-label="Select surah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ayah</label>
            <Select
              options={ayahOptions}
              value={selectedAyah || ''}
              onChange={(e) => setSelectedAyah(Number(e.target.value))}
              aria-label="Select ayah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reciter</label>
            <Select
              options={reciterOptions}
              value={selectedReciter || ''}
              onChange={(e) => setSelectedReciter(e.target.value)}
              aria-label="Select reciter"
            />
          </div>
        </div>

        {/* Ayah Display */}
        {loading ? (
          <div className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg bg-bg-lighter animate-pulse">
              <div className="h-8 bg-muted/20 rounded w-full" />
              <div className="h-8 bg-muted/20 rounded w-5/6" />
              <div className="h-6 bg-muted/20 rounded w-1/4 mt-4" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-bg-lighter rounded flex-1 animate-pulse" />
              <div className="h-10 bg-bg-lighter rounded flex-1 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 rounded-lg bg-bg-lighter border border-border-color hover:border-primary/30 transition-colors">
              <p className="quran-text text-xl md:text-2xl leading-relaxed text-balance mb-4">
                {ayahText}
              </p>
              <p className="text-right text-sm text-muted font-medium">
                {selectedSurah}:{selectedAyah}
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <Button
                variant="primary"
                onClick={handlePlay}
                fullWidth
                aria-label="Play ayah"
                className="col-span-1"
              >
                🔊 Listen
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                fullWidth
                aria-label="Copy ayah"
                className="col-span-1"
              >
                📋 Copy
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
