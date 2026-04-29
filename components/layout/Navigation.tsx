'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export type NavTab = 'verse' | 'quick' | 'mushaf' | 'read' | 'audio' | 'bookmarks' | 'settings'

interface NavigationProps {
  activeTab?: NavTab
  onTabChange?: (tab: NavTab) => void
}

export function Navigation({ activeTab = 'verse', onTabChange }: NavigationProps) {
  const [active, setActive] = useState<NavTab>(activeTab)

  const handleTabClick = (tab: NavTab) => {
    setActive(tab)
    onTabChange?.(tab)
  }

  const tabs: Array<{ id: NavTab; label: string; icon: string }> = [
    { id: 'verse', label: 'Verse', icon: '📖' },
    { id: 'quick', label: 'Quick', icon: '⚡' },
    { id: 'mushaf', label: 'Mushaf', icon: '📚' },
    { id: 'read', label: 'Read', icon: '👁️' },
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="border-b border-border-color bg-background">
      <div className="overflow-x-auto">
        <div className="flex min-w-max md:min-w-full md:justify-start gap-1 px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap',
                active === tab.id
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-bg-lighter'
              )}
              aria-selected={active === tab.id}
              role="tab"
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
