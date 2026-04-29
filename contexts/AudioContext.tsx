'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { audioService, AudioState } from '@/services/audioService'

interface AudioContextType extends AudioState {
  play: (url?: string) => void
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setCurrentAyah: (ayah: number | null) => void
  setVolume: (volume: number) => void
  getVolume: () => number
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentAyah: null,
    url: null,
  })

  useEffect(() => {
    const unsubscribe = audioService.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [])

  const value: AudioContextType = {
    ...state,
    play: (url?: string) => audioService.play(url),
    pause: () => audioService.pause(),
    stop: () => audioService.stop(),
    seek: (time: number) => audioService.seek(time),
    setCurrentAyah: (ayah: number | null) => audioService.setCurrentAyah(ayah),
    setVolume: (volume: number) => audioService.setVolume(volume),
    getVolume: () => audioService.getVolume(),
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
