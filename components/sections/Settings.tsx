'use client'

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { storageService } from '@/services/storageService'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { success, error } = useToast()
  const [fontSize, setFontSize] = useState(18)

  const clearAllData = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        storageService.clear()
        success('تم حذف جميع البيانات بنجاح')
        window.location.reload()
      } catch (err) {
        error('فشل حذف البيانات')
      }
    }
  }

  const exportData = () => {
    try {
      const data = {
        bookmarks: storageService.getBookmarks(),
        history: storageService.getHistory(),
        theme: theme,
        fontSize: fontSize,
        exportDate: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `quran-backup-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
      success('تم تصدير البيانات بنجاح')
    } catch (err) {
      error('فشل تصدير البيانات')
    }
  }

  const FONT_SIZES = [14, 16, 18, 20, 22, 24]

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">المظهر</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الموضوع</label>
            <div className="flex gap-2">
              {['light', 'dark', 'system'].map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'primary' : 'outline'}
                  onClick={() => setTheme(t)}
                  className="flex-1"
                >
                  {t === 'light' && '☀️ فاتح'}
                  {t === 'dark' && '🌙 غامق'}
                  {t === 'system' && '⚙️ نظام'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium mb-2">
              حجم الخط
            </label>
            <select
              id="fontSize"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full rounded px-3 py-2 bg-bg-lighter text-sm border border-border-color focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">حول التطبيق</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted">الإصدار</p>
            <p className="font-semibold">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-muted">وصف</p>
            <p className="text-sm">تطبيق قرآني متكامل يوفر قراءة واستماع للقرآن الكريم مع ميزات متقدمة</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">إدارة البيانات</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            onClick={exportData}
            className="justify-start"
          >
            📥 تصدير البيانات
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={clearAllData}
            className="justify-start text-destructive border-destructive hover:bg-destructive/10"
          >
            🗑️ حذف جميع البيانات
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Legal */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">الخصوصية والقانون</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>• جميع البيانات يتم حفظها محليًا في جهازك</p>
          <p>• لا يتم إرسال أي بيانات شخصية إلى خوادم خارجية</p>
          <p>• التطبيق مفتوح المصدر ومتاح للاستخدام الحر</p>
        </CardContent>
      </Card>
    </div>
  )
}
