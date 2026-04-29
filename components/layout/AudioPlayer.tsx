'use client'

import React from 'react'
import { useAudio } from '@/contexts/AudioContext'
import { formatTime } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function AudioPlayer() {
  const audio = useAudio()

  if (!audio.url) {
    return null
  }

  const percentage = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border-color bg-background shadow-lg">
      {/* Progress bar */}
      <div className="w-full h-1 bg-bg-lighter">
        <div
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="px-4 py-4 md:px-6">
        {/* Time display and progress */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-muted">{formatTime(audio.currentTime)}</span>
          <div className="flex-1 h-2 rounded-full bg-bg-lighter cursor-pointer">
            <input
              type="range"
              min="0"
              max={audio.duration || 0}
              value={audio.currentTime}
              onChange={(e) => audio.seek(Number(e.target.value))}
              className="w-full h-2 opacity-0 cursor-pointer absolute"
              aria-label="Audio progress"
            />
          </div>
          <span className="text-muted">{formatTime(audio.duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => audio.pause()}
            disabled={!audio.isPlaying}
            aria-label="Pause"
          >
            ⏸
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (audio.isPlaying) {
                audio.pause()
              } else if (audio.url) {
                audio.play(audio.url)
              }
            }}
            aria-label={audio.isPlaying ? 'Pause' : 'Play'}
          >
            {audio.isPlaying ? '⏸ Playing' : '▶ Play'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => audio.stop()}
            aria-label="Stop"
          >
            ⏹
          </Button>
        </div>
      </div>
    </div>
  )
}
