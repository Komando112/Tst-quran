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
import { copyToClipboard, shareText } from '@/lib/utils'
import { DEFAULT_RECITER_ID } from '@/lib/constants'

export function FullSurahRead() {
  const { surahs } = useQuran()
  const audio = useAudio()
  const { success, error } = useToast()

  const [selectedSurah, setSelectedSurah] = useLocalStorage<number>('fullReadSurah', 1)
  const [selectedReciter] = useLocalStorage<string>('reciterId', DEFAULT_RECITER_ID)
  const [surahDetail, setSurahDetail] = useState<any>(null)
  const [loading, setLoading] = useState(false)

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

  const playFullSurah = () => {
    if (!selectedSurah) return
    try {
      const audioUrl = quranApi.getAudioUrl(selectedSurah, selectedReciter)
      audio.play(audioUrl)
      success('Playing full surah')
    } catch (err) {
      error('Failed to play')
    }
  }

  const copyFullText = async () => {
    if (!surahDetail) return
    const text = surahDetail.ayahs.map((a: any) => a.text).join('\n\n')
    if (await copyToClipboard(text)) {
      success('Copied full surah')
    } else {
      error('Failed to copy')
    }
  }

  const shareFullText = () => {
    if (!surahDetail) return
    const text = `${surahDetail.name}\n\nRead on Quran App`
    if (shareText(surahDetail.name, text)) {
      success('Shared successfully')
    }
  }

  const surahOptions = surahs.map((s) => ({
    value: s.number,
    label: `${s.number}. ${s.name}`,
  }))

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Full Surah Reading</CardTitle>
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
            {surahDetail && (
              <div className="flex items-end gap-2">
                <Button variant="primary" fullWidth onClick={playFullSurah}>
                  🔊 Play Full Surah
                </Button>
              </div>
            )}
          </div>

          {surahDetail && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button variant="outline" size="sm" onClick={copyFullText}>
                📋 Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={shareFullText}>
                📤 Share
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        surahDetail && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{surahDetail.name}</h2>
                <p className="text-muted text-sm">
                  {surahDetail.numberOfAyahs} Ayahs • {surahDetail.revelationType}
                </p>
              </div>

              <div className="space-y-4">
                {surahDetail.ayahs.map((ayah: any) => (
                  <div key={ayah.number} className="border-b border-border-color pb-4 last:border-b-0">
                    <p className="quran-text text-2xl leading-relaxed mb-2 text-balance">
                      {ayah.text}
                    </p>
                    <div className="flex justify-end items-center gap-2">
                      <span className="text-sm text-muted">
                        Ayah {ayah.numberInSurah}
                      </span>
                      <span className="text-lg font-bold text-accent">
                        {ayah.numberInSurah}
                      </span>
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
