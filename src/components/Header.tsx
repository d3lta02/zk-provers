'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'

interface HeaderProps {
  isMusicPlaying: boolean
  onMusicToggle: () => void
}

export default function Header({ isMusicPlaying, onMusicToggle }: HeaderProps) {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const texts = useMemo(() => ['Blog', 'Quotes', 'Explorer', 'Prove', 'Hypercube', 'vApps', '2FA'], [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = texts[currentIndex]
      
      if (isDeleting) {
        // Delete operation
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
        }
      } else {
        // Type operation
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1500) // Wait 1.5 seconds
        }
      }
    }, isDeleting ? 100 : 150) // Delete faster

    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, isDeleting, texts])

  const handleLogoClick = () => {
    window.location.reload()
  }

  return (
    <header className="backdrop-blur-sm border-b border-opacity-20" style={{ backgroundColor: 'rgba(1, 15, 34, 0.8)', borderColor: '#FE11C5' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Space */}
          <div className="flex-1"></div>
          
          {/* Logo + Typing Text - Center */}
          <div className="flex items-center space-x-6">
            <div
              onClick={handleLogoClick}
              className="transition-opacity duration-300 hover:opacity-80"
              style={{ cursor: 'default' }}
            >
              <Image
                src="/images/succinct-logo.svg"
                alt="Succinct Quotes"
                width={160}
                height={32}
                className="h-7 w-auto"
                priority
              />
            </div>
            
            {/* Typing Effect - Pixel Font */}
            <div className="flex items-center">
              <span 
                className="text-base font-normal"
                style={{ 
                  fontFamily: 'var(--font-press-start-2p)',
                  color: '#FE11C5',
                  letterSpacing: '0.1em'
                }}
              >
                {currentText}
              </span>
              <span 
                className="ml-2 animate-pulse text-base"
                style={{ 
                  fontFamily: 'var(--font-press-start-2p)',
                  color: '#FE11C5' 
                }}
              >
                |
              </span>
            </div>
          </div>

          {/* Music Control - Right */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={onMusicToggle}
              className="p-2 rounded-lg transition-colors duration-300 hover:scale-110"
              style={{
                backgroundColor: 'rgba(254, 17, 197, 0.1)',
                color: '#FE11C5'
              }}
            >
              {/* Pixel Art Sound Icon */}
              <div 
                className="w-6 h-6 relative"
                style={{
                  imageRendering: 'pixelated',
                  filter: isMusicPlaying ? 'none' : 'opacity(0.5)'
                }}
              >
                {/* Speaker Base */}
                <div 
                  className="absolute"
                  style={{
                    left: '2px',
                    top: '8px',
                    width: '6px',
                    height: '8px',
                    backgroundColor: '#FE11C5',
                    imageRendering: 'pixelated'
                  }}
                />
                {/* Speaker Cone */}
                <div 
                  className="absolute"
                  style={{
                    left: '8px',
                    top: '6px',
                    width: '4px',
                    height: '12px',
                    backgroundColor: '#FE11C5',
                    clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)',
                    imageRendering: 'pixelated'
                  }}
                />
                {/* Sound Waves */}
                {isMusicPlaying && (
                  <>
                    <div 
                      className="absolute animate-pulse"
                      style={{
                        left: '14px',
                        top: '9px',
                        width: '2px',
                        height: '6px',
                        backgroundColor: '#FE11C5',
                        imageRendering: 'pixelated'
                      }}
                    />
                    <div 
                      className="absolute animate-pulse"
                      style={{
                        left: '18px',
                        top: '7px',
                        width: '2px',
                        height: '10px',
                        backgroundColor: '#FE11C5',
                        imageRendering: 'pixelated',
                        animationDelay: '0.2s'
                      }}
                    />
                    <div 
                      className="absolute animate-pulse"
                      style={{
                        left: '22px',
                        top: '5px',
                        width: '2px',
                        height: '14px',
                        backgroundColor: '#FE11C5',
                        imageRendering: 'pixelated',
                        animationDelay: '0.4s'
                      }}
                    />
                  </>
                )}
                {/* Muted X */}
                {!isMusicPlaying && (
                  <div 
                    className="absolute"
                    style={{
                      left: '16px',
                      top: '4px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#FE11C5',
                      clipPath: 'polygon(0 0, 100% 0, 50% 50%, 100% 100%, 0 100%, 50% 50%)',
                      imageRendering: 'pixelated'
                    }}
                  />
                )}
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  )
}