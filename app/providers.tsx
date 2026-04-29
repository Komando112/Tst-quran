'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { QuranProvider } from '@/contexts/QuranContext'
import { AudioProvider } from '@/contexts/AudioContext'
import { BookmarksProvider } from '@/contexts/BookmarksContext'
import { ToastContainer } from '@/components/ui/Toast'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QuranProvider>
        <AudioProvider>
          <BookmarksProvider>
            {children}
            <ToastContainer />
          </BookmarksProvider>
        </AudioProvider>
      </QuranProvider>
    </ThemeProvider>
  )
}
