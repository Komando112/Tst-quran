'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'

export function Welcome() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Welcome to Quran App
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          A beautiful and comprehensive Quran application for reading, listening, and learning.
          Access all 114 surahs with beautiful typography and audio from 18 reciters.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">📖 Read</h3>
            <p className="text-muted">
              Experience the Quran with beautiful typography and adjustable font sizes. 
              Perfect for extended reading sessions.
            </p>
          </CardContent>
        </Card>

        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">🔊 Listen</h3>
            <p className="text-muted">
              Choose from 18 professional reciters and listen to the complete Quran. 
              Supports playback control and progress tracking.
            </p>
          </CardContent>
        </Card>

        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">🔍 Search</h3>
            <p className="text-muted">
              Quickly find any ayah by text or surah number. Advanced search capabilities 
              for better discovery.
            </p>
          </CardContent>
        </Card>

        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">⭐ Bookmark</h3>
            <p className="text-muted">
              Save your favorite ayahs and add personal notes. Your bookmarks are 
              saved locally on your device.
            </p>
          </CardContent>
        </Card>

        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">🌙 Themes</h3>
            <p className="text-muted">
              Switch between light, dark, or system themes. Customize your reading 
              experience to your preference.
            </p>
          </CardContent>
        </Card>

        <Card hoverable>
          <CardContent className="pt-6 space-y-3">
            <h3 className="text-xl font-semibold">📱 Responsive</h3>
            <p className="text-muted">
              Fully responsive design works seamlessly on phones, tablets, and desktops. 
              Optimized for all screen sizes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardContent className="pt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4 text-muted">
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-primary">1</div>
                <div>
                  <p className="font-semibold text-foreground">Explore the Features</p>
                  <p className="text-sm">Use the tabs at the top to access different features: Verse, Quick Ayah, Mushaf, Read, Audio, Search, Bookmarks, and Settings.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl font-bold text-primary">2</div>
                <div>
                  <p className="font-semibold text-foreground">Customize Your Experience</p>
                  <p className="text-sm">Go to Settings to adjust your theme, font size, and manage your data. Your preferences are saved automatically.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl font-bold text-primary">3</div>
                <div>
                  <p className="font-semibold text-foreground">Start Reading or Listening</p>
                  <p className="text-sm">Choose "Verse of Day" for daily inspiration, "Quick Ayah" for instant lookup, or "Audio" to listen to your favorite reciter.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl font-bold text-primary">4</div>
                <div>
                  <p className="font-semibold text-foreground">Save Your Favorites</p>
                  <p className="text-sm">Use the Bookmarks feature to save meaningful ayahs and add your own notes. Everything is stored locally on your device.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-lighter rounded-lg p-4 text-sm">
            <p className="font-semibold text-foreground mb-2">💡 Pro Tip</p>
            <p className="text-muted">
              All your data is stored locally on your device. Use the Settings section to export your bookmarks as a backup.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-4xl font-bold text-primary">114</p>
            <p className="text-muted">Surahs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-4xl font-bold text-primary">6,236</p>
            <p className="text-muted">Ayahs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center space-y-2">
            <p className="text-4xl font-bold text-primary">18</p>
            <p className="text-muted">Reciters</p>
          </CardContent>
        </Card>
      </div>

      {/* About Reciters */}
      <Card>
        <CardContent className="pt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Our Reciters</h2>
          <p className="text-muted">
            We feature 18 professional Quran reciters, carefully selected for their exceptional
            pronunciation and beautiful recitation. Each reciter brings their unique voice and
            style to the Quranic text.
          </p>
          <div className="bg-bg-lighter rounded-lg p-4">
            <p className="text-sm text-muted">
              You can select your preferred reciter in the Settings or when playing audio.
              Your choice will be remembered for your next visit.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">🔒 Privacy & Data</h3>
          <p className="text-sm text-muted">
            This application is completely offline. All your data bookmarks, notes, and preferences
            are stored locally on your device. We don&apos;t collect any personal information or track
            your usage. Your privacy is our priority.
          </p>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-2xl font-semibold">Ready to Begin?</h2>
        <p className="text-muted">
          Click on any tab above to start exploring. Enjoy your Quranic journey!
        </p>
      </div>
    </div>
  )
}
