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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    audio.seek(Number(e.target.value))
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border-color bg-background shadow-lg z-40 animate-slide-up">
      {/* Thin progress bar */}
      <div className="w-full h-1 bg-bg-lighter">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75"
          style={{
            width: `${audio.duration ? (audio.currentTime / audio.duration) * 100 : 0}%`,
          }}
        />
      </div>

      <div className="px-3 py-3 md:px-6 md:py-4 space-y-3">
        {/* Time display and seekbar */}
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="text-muted font-mono tabular-nums w-10">
            {formatTime(audio.currentTime)}
          </span>

          {/* Seekbar with range input */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={audio.duration || 0}
              value={audio.currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-full bg-bg-lighter appearance-none cursor-pointer transition-all
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              aria-label="Audio progress"
            />
          </div>

          <span className="text-muted font-mono tabular-nums w-10 text-right">
            {formatTime(audio.duration)}
          </span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => audio.seek(Math.max(0, audio.currentTime - 10))}
            aria-label="Rewind 10 seconds"
            title="Rewind"
          >
            -10s
          </Button>

          <div className="flex-1 flex items-center justify-center gap-2">
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
              className="min-w-24"
            >
              {audio.isPlaying ? '⏸ Pause' : '▶ Play'}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => audio.seek(Math.min(audio.duration, audio.currentTime + 10))}
            aria-label="Forward 10 seconds"
            title="Forward"
          >
            +10s
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => audio.stop()}
            aria-label="Stop"
            title="Stop"
            className="hidden md:flex"
          >
            ⏹
          </Button>
        </div>

        {/* Current ayah indicator */}
        {audio.currentAyah && (
          <div className="text-center text-xs text-muted">
            Ayah {audio.currentAyah}
          </div>
        )}
      </div>
    </div>
  )
}
