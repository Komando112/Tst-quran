'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useQuran } from '@/contexts/QuranContext'
import { useAudio } from '@/contexts/AudioContext'
import { useToast } from '@/hooks/useToast'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { quranApi } from '@/services/quranApi'
import { DEFAULT_RECITER_ID } from '@/lib/constants'

export function MushafReader() {
  const { surahs } = useQuran()
  const audio = useAudio()
  const { success, error } = useToast()

  const [selectedSurah, setSelectedSurah] = useLocalStorage<number>('mushafSurah', 1)
  const [selectedReciter] = useLocalStorage<string>('reciterId', DEFAULT_RECITER_ID)
  const [surahDetail, setSurahDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchAyah, setSearchAyah] = useState('')
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null)

  useEffect(() => {
    if (selectedSurah) {
      loadSurah(selectedSurah)
    }
  }, [selectedSurah])

  const loadSurah = async (surahNumber: number) => {
    setLoading(true)
    try {
      const detail = await quranApi.getSurah(surahNumber)
      setSurahDetail(detail)
    } catch (err) {
      error('Failed to load surah')
    } finally {
      setLoading(false)
    }
  }

  const playAyah = (ayahNumber: number) => {
    if (!selectedSurah) return
    try {
      const audioUrl = quranApi.getAudioUrl(selectedSurah, selectedReciter)
      audio.play(audioUrl)
      audio.setCurrentAyah(ayahNumber)
      success('Playing ayah')
    } catch (err) {
      error('Failed to play')
    }
  }

  const surahOptions = surahs.map((s) => ({
    value: s.number,
    label: `${s.number}. ${s.name}`,
  }))

  const filteredAyahs = surahDetail?.ayahs.filter((ayah: any) =>
    ayah.numberInSurah.toString().includes(searchAyah)
  ) || []

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Mushaf Reader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Surah</label>
              <Select
                options={surahOptions}
                value={selectedSurah || ''}
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                aria-label="Select surah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search Ayah</label>
              <Input
                placeholder="Ayah number..."
                value={searchAyah}
                onChange={(e) => setSearchAyah(e.target.value)}
                aria-label="Search ayah"
              />
            </div>
          </div>

          {surahDetail && (
            <div className="text-sm text-muted mb-4">
              <p>
                {surahDetail.name} • {surahDetail.numberOfAyahs} Ayahs •{' '}
                {surahDetail.revelationType}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        filteredAyahs.map((ayah: any) => (
          <Card key={ayah.number} hoverable>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4 mb-3">
                <p className="quran-text text-xl leading-relaxed flex-1">
                  {ayah.text}
                </p>
                <span className="text-lg font-bold text-accent flex-shrink-0">
                  {ayah.numberInSurah}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => playAyah(ayah.numberInSurah)}
                  aria-label={`Play ayah ${ayah.numberInSurah}`}
                >
                  🔊 Play
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
