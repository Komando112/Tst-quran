'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useQuran } from '@/contexts/QuranContext'
import { useAudio } from '@/contexts/AudioContext'
import { useToast } from '@/hooks/useToast'
import { quranApi } from '@/services/quranApi'
import { copyToClipboard, shareText } from '@/lib/utils'
import { DEFAULT_RECITER_ID } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface VerseData {
  surah: number
  ayah: number
  text: string
  surahName: string
  ayahNumber: number
}

export function VersOfDay() {
  const { surahs } = useQuran()
  const audio = useAudio()
  const { success, error } = useToast()
  const [verse, setVerse] = useState<VerseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [reciterId] = useLocalStorage<string>('reciterId', DEFAULT_RECITER_ID)

  useEffect(() => {
    loadVerseOfDay()
  }, [surahs])

  const loadVerseOfDay = async () => {
    setLoading(true)
    try {
      const { surah, ayah } = await quranApi.getVerseOfDay()
      const surahDetail = await quranApi.getSurah(surah)
      const ayahData = surahDetail.ayahs[ayah - 1]

      setVerse({
        surah,
        ayah,
        text: ayahData.text,
        surahName: surahDetail.name,
        ayahNumber: ayah,
      })
    } catch (err) {
      error('Failed to load verse of the day')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = async () => {
    if (!verse) return
    try {
      const audioUrl = quranApi.getAudioUrl(verse.surah, reciterId)
      audio.play(audioUrl)
      success('Playing now')
    } catch (err) {
      error('Failed to play audio')
    }
  }

  const handleCopy = async () => {
    if (!verse) return
    const text = `${verse.text}\n\n${verse.surahName}:${verse.ayahNumber}`
    if (await copyToClipboard(text)) {
      success('Copied to clipboard')
    } else {
      error('Failed to copy')
    }
  }

  const handleShare = () => {
    if (!verse) return
    if (shareText('Verse of the Day', verse.text)) {
      success('Shared successfully')
    } else {
      error('Share not supported')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!verse) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted text-center py-8">Failed to load verse of the day</p>
          <Button fullWidth onClick={loadVerseOfDay} variant="primary">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card hoverable className="animate-fade-in">
      <CardHeader>
        <CardTitle>Verse of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Verse Text */}
        <div className="mb-6 p-4 rounded-lg bg-bg-lighter">
          <p className="quran-text text-2xl leading-relaxed mb-4 text-balance">
            {verse.text}
          </p>
          <p className="text-right text-sm text-muted">
            {verse.surahName} {verse.ayah}:{verse.ayahNumber}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant="primary"
            onClick={handlePlay}
            className="w-full"
            aria-label="Play audio"
          >
            🔊 Listen
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full"
            aria-label="Copy verse"
          >
            📋 Copy
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full"
            aria-label="Share verse"
          >
            📤 Share
          </Button>
          <Button
            variant="outline"
            onClick={loadVerseOfDay}
            className="w-full"
            aria-label="Get another verse"
          >
            🔄 Another
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
