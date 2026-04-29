'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'
import { quranApi } from '@/services/quranApi'
import { cn } from '@/lib/utils'

interface SearchResult {
  surah: number
  ayah: number
  surahName: string
  text: string
}

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState<'text' | 'surah'>('text')
  const { error } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      if (searchType === 'surah') {
        const surahNum = parseInt(query)
        if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
          error('رقم السورة يجب أن يكون بين 1 و 114')
          setLoading(false)
          return
        }
        const surah = await quranApi.getSurah(surahNum)
        const formattedResults: SearchResult[] = surah.ayahs.map((ayah, index) => ({
          surah: surah.number,
          ayah: index + 1,
          surahName: surah.name,
          text: ayah.text,
        }))
        setResults(formattedResults)
      } else {
        // Text search - search across all surahs
        const surahs = await quranApi.getSurahs()
        const foundResults: SearchResult[] = []

        for (const surah of surahs) {
          const surahDetail = await quranApi.getSurah(surah.number)
          surahDetail.ayahs.forEach((ayah, index) => {
            if (ayah.text.includes(query)) {
              foundResults.push({
                surah: surah.number,
                ayah: index + 1,
                surahName: surah.name,
                text: ayah.text,
              })
            }
          })
        }

        setResults(foundResults.slice(0, 50)) // Limit to 50 results
      }
    } catch (err) {
      error('فشل البحث')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type */}
            <div className="flex gap-2">
              {(['text', 'surah'] as const).map((type) => (
                <Button
                  key={type}
                  variant={searchType === type ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType(type)}
                  type="button"
                >
                  {type === 'text' ? '🔍 بحث نصي' : '📖 بحث السورة'}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchType === 'text'
                    ? 'ابحث عن كلمة أو عبارة...'
                    : 'أدخل رقم السورة (1-114)...'
                }
                className="flex-1"
              />
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !query.trim()}
              >
                {loading ? '⏳' : '🔍'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            تم العثور على {results.length} نتيجة
          </p>
          {results.map((result, idx) => (
            <Card key={idx} hoverable>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">
                      {result.surahName} - الآية {result.ayah}
                    </p>
                  </div>
                  <p className="quran-text text-lg leading-relaxed text-balance">
                    {result.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted">لم يتم العثور على نتائج</p>
              <p className="text-sm text-muted/70 mt-2">حاول بحثًا آخر</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!query && results.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted mb-4">ابدأ البحث عن الآيات</p>
              <p className="text-sm text-muted/70">
                {searchType === 'text'
                  ? 'ابحث عن أي كلمة في القرآن الكريم'
                  : 'أدخل رقم السورة لعرض جميع آياتها'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
