'use client'

import React, { useState, useEffect } from 'react'
import { Navigation, type NavTab } from '@/components/layout/Navigation'
import { Welcome } from '@/components/sections/Welcome'
import { VersOfDay } from '@/components/sections/VersOfDay'
import { QuickAyah } from '@/components/sections/QuickAyah'
import { MushafReader } from '@/components/sections/MushafReader'
import { FullSurahRead } from '@/components/sections/FullSurahRead'
import { FullSurahAudio } from '@/components/sections/FullSurahAudio'
import { Search } from '@/components/sections/Search'
import { Bookmarks } from '@/components/sections/Bookmarks'
import { Settings } from '@/components/sections/Settings'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function MainContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('verse')
  const [hasVisited, setHasVisited] = useLocalStorage<boolean>('hasVisited', false)

  useEffect(() => {
    if (!hasVisited) {
      setActiveTab('welcome' as any)
      setHasVisited(true)
    }
  }, [hasVisited, setHasVisited])

  return (
    <div className="w-full">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 py-6 md:px-6 md:py-8 max-w-4xl mx-auto">
        {activeTab === 'welcome' && <Welcome />}
        {activeTab === 'verse' && <VersOfDay />}
        {activeTab === 'quick' && <QuickAyah />}
        {activeTab === 'mushaf' && <MushafReader />}
        {activeTab === 'read' && <FullSurahRead />}
        {activeTab === 'audio' && <FullSurahAudio />}
        {activeTab === 'search' && <Search />}
        {activeTab === 'bookmarks' && <Bookmarks />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  )
}
