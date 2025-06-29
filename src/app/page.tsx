'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MainVisual from '@/components/MainVisual'
import CategoryModal from '@/components/CategoryModal'
import ZKQuoteModal from '@/components/ZKQuoteModal'
import { Category } from '@/types/category'

export default function Home() {
  const [openPanels, setOpenPanels] = useState<{ category: Category; id: string }[]>([])
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Background music control
  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error)
          setIsMusicPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isMusicPlaying])

  // Auto-restart music when it ends
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        if (isMusicPlaying) {
          audio.currentTime = 0
          audio.play().catch(error => {
            console.log('Audio restart failed:', error)
            setIsMusicPlaying(false)
          })
        }
      }
      
      audio.addEventListener('ended', handleEnded)
      return () => audio.removeEventListener('ended', handleEnded)
    }
  }, [isMusicPlaying])

  const handleCategoryClick = (category: Category) => {
    const panelId = `${category.id}-${Date.now()}`
    
    if (isMobile) {
      // Mobile: Only one panel at a time
      setOpenPanels([{ category, id: panelId }])
    } else {
      // Desktop: Max 2 panels
      setOpenPanels(prev => {
        // Check if category already open
        const existingPanel = prev.find(panel => panel.category.id === category.id)
        if (existingPanel) {
          return prev // Don't open duplicate
        }
        
        // Add new panel, remove oldest if more than 2
        const newPanels = [...prev, { category, id: panelId }]
        return newPanels.slice(-2) // Keep only last 2 panels
      })
    }
  }

  const handleClosePanel = (panelId: string) => {
    setOpenPanels(prev => prev.filter(panel => panel.id !== panelId))
  }

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying)
  }

  return (
    <div className="relative w-full min-h-screen" style={{ backgroundColor: '#010F22' }}>
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        preload="auto"
        loop
        style={{ display: 'none' }}
      />
      
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Header 
          isMusicPlaying={isMusicPlaying}
          onMusicToggle={handleMusicToggle}
        />
      </div>
      
      {/* Main Content - Responsive height */}
      <div className="relative w-full min-h-screen">
        <MainVisual 
          onCategoryClick={handleCategoryClick}
        />
      </div>
      
      {/* Footer - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <Footer />
      </div>
      
      {/* Multiple Panels */}
      {openPanels.map((panel, index) => {
        // Use special modal for Prover ZK Quote
        if (panel.category.id === 0) {
          return (
            <ZKQuoteModal
              key={panel.id}
              isOpen={true}
              onClose={() => handleClosePanel(panel.id)}
              category={panel.category}
              zIndex={50 + index}
            />
          )
        }
        
        // Use normal modal for other categories
        return (
      <CategoryModal
            key={panel.id}
            isOpen={true}
            onClose={() => handleClosePanel(panel.id)}
            category={panel.category}
            zIndex={50 + index}
      />
        )
      })}
    </div>
  )
}