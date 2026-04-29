'use client'

import React, { useState } from 'react'
import { useBookmarks } from '@/contexts/BookmarksContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatTime } from '@/lib/utils'

export function Bookmarks() {
  const { bookmarks, removeBookmark, updateNotes } = useBookmarks()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notes, setNotes] = useState<string>('')
  const [sortBy, setSortBy] = useState<'date' | 'surah'>('date')

  const sorted = [...bookmarks].sort((a, b) => {
    if (sortBy === 'date') {
      return b.createdAt - a.createdAt
    }
    return a.surah - b.surah
  })

  const startEdit = (bookmark: any) => {
    setEditingId(bookmark.id)
    setNotes(bookmark.notes || '')
  }

  const saveEdit = (id: string) => {
    updateNotes(id, notes)
    setEditingId(null)
    setNotes('')
  }

  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted mb-4">لا توجد إشارات مرجعية بعد</p>
            <p className="text-sm text-muted/70">قم بإضافة إشارات مرجعية من خلال الضغط على زر الإشارة المرجعية</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted">الترتيب:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'surah')}
          className="rounded px-3 py-2 bg-bg-lighter text-sm border border-border-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="date">التاريخ الأحدث</option>
          <option value="surah">رقم السورة</option>
        </select>
        <span className="text-xs text-muted mr-auto">
          {bookmarks.length} إشارة مرجعية
        </span>
      </div>

      {/* Bookmarks list */}
      <div className="space-y-3">
        {sorted.map((bookmark) => (
          <Card key={bookmark.id} hoverable>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">
                      {bookmark.surahName} - الآية {bookmark.ayah}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(bookmark.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    ×
                  </Button>
                </div>

                {/* Ayah text */}
                <p className="quran-text text-lg leading-relaxed text-balance mb-3">
                  {bookmark.text}
                </p>

                {/* Notes section */}
                {editingId === bookmark.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أضف ملاحظاتك..."
                      className="w-full rounded px-3 py-2 bg-bg-lighter text-sm border border-border-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => saveEdit(bookmark.id)}
                      >
                        حفظ
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {bookmark.notes ? (
                      <div className="bg-bg-lighter rounded p-3 text-sm">
                        <p className="text-muted/70 mb-2">الملاحظات:</p>
                        <p className="text-foreground">{bookmark.notes}</p>
                        <button
                          onClick={() => startEdit(bookmark)}
                          className="text-primary text-xs mt-2 hover:underline"
                        >
                          تعديل
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(bookmark)}
                        className="text-primary text-xs hover:underline"
                      >
                        + أضف ملاحظة
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
