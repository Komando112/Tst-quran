'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { storageService } from '@/services/storageService'

export interface Bookmark {
  id: string
  surah: number
  ayah: number
  surahName: string
  text: string
  createdAt: number
  notes?: string
}

interface BookmarksContextType {
  bookmarks: Bookmark[]
  addBookmark: (surah: number, ayah: number, surahName: string, text: string) => void
  removeBookmark: (id: string) => void
  isBookmarked: (surah: number, ayah: number) => boolean
  updateNotes: (id: string, notes: string) => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load bookmarks from storage
  useEffect(() => {
    const saved = storageService.getBookmarks()
    setBookmarks(saved)
    setIsLoaded(true)
  }, [])

  const addBookmark = (surah: number, ayah: number, surahName: string, text: string) => {
    const newBookmark: Bookmark = {
      id: `${surah}-${ayah}-${Date.now()}`,
      surah,
      ayah,
      surahName,
      text,
      createdAt: Date.now(),
    }

    const updated = [...bookmarks, newBookmark]
    setBookmarks(updated)
    storageService.saveBookmarks(updated)
  }

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id)
    setBookmarks(updated)
    storageService.saveBookmarks(updated)
  }

  const isBookmarked = (surah: number, ayah: number) => {
    return bookmarks.some((b) => b.surah === surah && b.ayah === ayah)
  }

  const updateNotes = (id: string, notes: string) => {
    const updated = bookmarks.map((b) =>
      b.id === id ? { ...b, notes } : b
    )
    setBookmarks(updated)
    storageService.saveBookmarks(updated)
  }

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        updateNotes,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarksProvider')
  }
  return context
}
