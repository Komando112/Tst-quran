'use client'

import React, { useState, useEffect, useCallback } from 'react'
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

export function FullSurahAudio() {
  const { surahs } = useQuran()
  const audio = useAudio()
  const { success, error } = useToast()

  const [selectedSurah, setSelectedSurah] = useLocalStorage<number>('audioSurah', 1)
  const [selectedReciter, setSelectedReciter] = useLocalStorage<string>(
    'reciterId',
    DEFAULT_RECITER_ID
  )
  const [surahDetail, setSurahDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const loadSurah = useCallback(async (surahNumber: number) => {
    setLoading(true)
    try {
      const detail = await quranApi.getSurah(surahNumber)
      setSurahDetail(detail)
    } catch (err) {
      error('Failed to load surah')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    if (selectedSurah) {
      loadSurah(selectedSurah)
    }
  }, [selectedSurah, loadSurah])

  const playAyah = (ayahNumber: number) => {
    if (!selectedSurah || !selectedReciter) return
    try {
      const audioUrl = quranApi.getAudioUrl(selectedSurah, selectedReciter)
      audio.play(audioUrl)
      audio.setCurrentAyah(ayahNumber)
      success(`Playing ayah ${ayahNumber}`)
    } catch (err) {
      error('Failed to play')
    }
  }

  const playFullSurah = () => {
    if (!selectedSurah || !selectedReciter) return
    try {
      const audioUrl = quranApi.getAudioUrl(selectedSurah, selectedReciter)
      audio.play(audioUrl)
      success('Playing full surah')
    } catch (err) {
      error('Failed to play')
    }
  }

  const surahOptions = surahs.map((s) => ({
    value: s.number,
    label: `${s.number}. ${s.name}`,
  }))

  const reciterOptions = RECITERS.map((r) => ({
    value: r.id,
    label: r.name,
  }))

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Full Surah Audio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
              <label className="block text-sm font-medium mb-2">Reciter</label>
              <Select
                options={reciterOptions}
                value={selectedReciter || ''}
                onChange={(e) => setSelectedReciter(e.target.value)}
                aria-label="Select reciter"
              />
            </div>
            {surahDetail && (
              <div className="flex items-end">
                <Button variant="primary" fullWidth onClick={playFullSurah}>
                  ▶ Play All
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        surahDetail && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{surahDetail.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {surahDetail.ayahs.map((ayah: any) => (
                  <div
                    key={ayah.number}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-lighter transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{ayah.text.substring(0, 50)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          audio.currentAyah === ayah.numberInSurah
                            ? 'bg-primary text-white'
                            : 'bg-bg-lighter'
                        }`}
                      >
                        {ayah.numberInSurah}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAyah(ayah.numberInSurah)}
                        aria-label={`Play ayah ${ayah.numberInSurah}`}
                      >
                        ▶
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
