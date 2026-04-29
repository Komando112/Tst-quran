'use client'

import React, { useState } from 'react'
import { Navigation, type NavTab } from '@/components/layout/Navigation'
import { VersOfDay } from '@/components/sections/VersOfDay'
import { QuickAyah } from '@/components/sections/QuickAyah'
import { MushafReader } from '@/components/sections/MushafReader'
import { FullSurahRead } from '@/components/sections/FullSurahRead'
import { FullSurahAudio } from '@/components/sections/FullSurahAudio'

export function MainContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('verse')

  return (
    <div className="w-full">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="px-4 py-6 md:px-6 md:py-8 max-w-4xl mx-auto">
        {activeTab === 'verse' && <VersOfDay />}
        {activeTab === 'quick' && <QuickAyah />}
        {activeTab === 'mushaf' && <MushafReader />}
        {activeTab === 'read' && <FullSurahRead />}
        {activeTab === 'audio' && <FullSurahAudio />}
      </div>
    </div>
  )
}
