import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { AudioPlayer } from '@/components/layout/AudioPlayer'
import { MainContent } from '@/components/MainContent'

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      <main className="flex-1 overflow-y-auto pb-24">
        <MainContent />
      </main>
      <AudioPlayer />
    </div>
  )
}
