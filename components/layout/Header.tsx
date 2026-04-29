'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FONT_SIZES, THEMES } from '@/lib/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 16)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-40 border-b border-border-color bg-background shadow-sm">
      <div className="px-3 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              ق
            </div>
            <div className="hidden xs:block">
              <h1 className="text-lg md:text-xl font-bold text-foreground">Quran</h1>
              <p className="text-xs text-muted leading-tight">Read, Listen</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Font Size - Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-bg-lighter rounded-lg px-3 py-1">
              <label htmlFor="fontSize" className="text-xs text-muted whitespace-nowrap">
                Font:
              </label>
              <select
                id="fontSize"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="rounded px-2 py-1 bg-transparent text-sm border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:bg-primary focus-visible:text-white"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center gap-1 rounded-lg bg-bg-lighter p-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'px-2 py-1 rounded text-sm transition-colors duration-200 flex-shrink-0',
                    theme === t.id
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-foreground'
                  )}
                  title={t.name}
                  aria-label={`Switch to ${t.name} theme`}
                >
                  {t.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Font Size */}
        <div className="md:hidden mt-3">
          <label htmlFor="fontSize-mobile" className="text-xs text-muted mb-1 block">
            Font Size
          </label>
          <select
            id="fontSize-mobile"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full rounded px-2 py-2 bg-bg-lighter text-sm border border-border-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
