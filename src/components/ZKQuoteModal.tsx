'use client'

import { useState, useEffect, useRef } from 'react'
import { Category, CATEGORIES } from '@/types/category'

interface ZKQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
  zIndex?: number
}

export default function ZKQuoteModal({ isOpen, onClose, category, zIndex = 50 }: ZKQuoteModalProps) {
  const [currentTypewriterQuote, setCurrentTypewriterQuote] = useState('')
  const [typewriterIndex, setTypewriterIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [revealedCategory, setRevealedCategory] = useState('')
  const [revealedQuote, setRevealedQuote] = useState('')
  const [revealedGif, setRevealedGif] = useState('')
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 900, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Dragging & Resizing functionality (same as CategoryModal)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
      
      if (isResizing) {
        const newWidth = Math.max(600, resizeStart.width + (e.clientX - resizeStart.x))
        const newHeight = Math.max(400, resizeStart.height + (e.clientY - resizeStart.y))
        setSize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStart])

  // Reset position and size when modal opens
  useEffect(() => {
    if (isOpen && category) {
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        setPosition({ x: 20, y: 50 })
        setSize({ width: window.innerWidth - 40, height: window.innerHeight - 100 })
      } else {
        // Center the modal on screen
        const modalWidth = 900
        const modalHeight = 600
        const centerX = (window.innerWidth - modalWidth) / 2
        const centerY = (window.innerHeight - modalHeight) / 2
        
        // Add slight offset for multiple panels
        const offset = (zIndex - 50) * 30
        setPosition({ 
          x: Math.max(50, centerX + offset), 
          y: Math.max(50, centerY + offset) 
        })
        setSize({ width: modalWidth, height: modalHeight })
      }
    }
  }, [isOpen, category, zIndex])

  // Typewriter effect
  useEffect(() => {
    if (!isOpen || !category?.quotes?.typewriterQuotes) return

    const quotes = category.quotes.typewriterQuotes
    const currentQuote = quotes[typewriterIndex]

    if (charIndex < currentQuote.length) {
      const timer = setTimeout(() => {
        setCurrentTypewriterQuote(currentQuote.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Quote completed, wait then move to next
      const timer = setTimeout(() => {
        setCharIndex(0)
        setCurrentTypewriterQuote('')
        setTypewriterIndex((prev) => (prev + 1) % quotes.length)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, category, typewriterIndex, charIndex])

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRevealed(false)
      setCurrentTypewriterQuote('')
      setTypewriterIndex(0)
      setCharIndex(0)
    }
  }, [isOpen])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    const rect = modalRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    })
    setIsResizing(true)
  }

  const getRandomQuote = () => {
    if (!category?.quotes?.categoryQuotes) return

    const categoryNames = Object.keys(category.quotes.categoryQuotes)
    const randomCategoryName = categoryNames[Math.floor(Math.random() * categoryNames.length)]
    const categoryQuotes = category.quotes.categoryQuotes[randomCategoryName]
    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
    
    // Fixed category matching logic with correct mappings
    let correspondingCategory = null
    
    // Correct mapping from quote category names to actual category titles
    const categoryMapping: { [key: string]: string } = {
      'Network Architecture & PROVE Token': 'Network Architecture & $PROVE',
      'Network Explorer': 'Succinct Network Explorer',
      'SP1-2FA': 'SP1-2FA',
      'SP1 Hypercube': 'SP1 Hypercube',
      'Verifiable Applications (vApps)': 'vApps: Verifiable Applications'
    }
    
    const mappedTitle = categoryMapping[randomCategoryName]
    if (mappedTitle) {
      correspondingCategory = CATEGORIES.find(cat => cat.title === mappedTitle)
    }
    
    // If still not found, try direct matching with category titles
    if (!correspondingCategory) {
      correspondingCategory = CATEGORIES.find(cat => 
        cat.title.toLowerCase() === randomCategoryName.toLowerCase() ||
        cat.title.toLowerCase().includes(randomCategoryName.toLowerCase().split(' ')[0]) ||
        randomCategoryName.toLowerCase().includes(cat.title.toLowerCase().split(' ')[0])
      )
    }

    // Final fallback to default quote GIF if no match found
    const finalGif = correspondingCategory?.gifFileName || 'quote-4x.gif'

    setRevealedCategory(randomCategoryName)
    setRevealedQuote(randomQuote)
    setRevealedGif(finalGif)
    setIsRevealed(true)
  }

  const shareOnX = () => {
    const tweetText = `${revealedQuote}\n\n#ZKQuotes #Succinct #ProveWithUs\n@SuccinctLabs`
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(tweetUrl, '_blank')
  }

  const resetToQuotes = () => {
    setIsRevealed(false)
    setCurrentTypewriterQuote('')
    setTypewriterIndex(0)
    setCharIndex(0)
  }

  if (!isOpen || !category || category.id !== 0) return null

  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{ 
          backgroundColor: 'rgba(1, 15, 34, 0.4)',
          backdropFilter: 'blur(1px)'
        }}
        onClick={onClose}
      />
      
      {/* Modal Window - CategoryModal Design */}
      <div
        ref={modalRef}
        className="absolute rounded-xl overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          background: 'linear-gradient(135deg, #010F22 0%, #0a1628 50%, #16213e 100%)',
          border: '1px solid rgba(254, 17, 197, 0.3)',
          boxShadow: '0 25px 80px rgba(254, 17, 197, 0.2), 0 0 40px rgba(254, 17, 197, 0.1)',
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-grab select-none"
          style={{ 
            background: 'linear-gradient(135deg, #0a1628 0%, #16213e 100%)',
            borderBottom: '1px solid rgba(254, 17, 197, 0.2)'
          }}
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className="flex-1 min-w-0">
            <h1 
              className="text-sm font-normal truncate mb-1"
              style={{ 
                fontFamily: 'var(--font-press-start-2p)',
                color: '#FFFFFF',
                letterSpacing: '0.05em'
              }}
            >
              {category.title}
            </h1>
            <p 
              className="text-xs truncate"
              style={{ 
                fontFamily: 'var(--font-press-start-2p)',
                color: 'rgba(254, 17, 197, 0.7)',
                fontSize: '0.65rem'
              }}
            >
              {category.description}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-110 ml-4"
            style={{ 
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              color: '#FF6B6B',
              border: '1px solid rgba(255, 107, 107, 0.4)'
            }}
          >
            ×
          </button>
        </div>

        {/* Content Area */}
        <div 
          className="flex flex-col"
          style={{ 
            backgroundColor: '#010F22',
            height: 'calc(100% - 80px)'
          }}
        >
          {!isRevealed ? (
            // Quote Generation View
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
              {/* Main GIF - Larger size */}
              <div className="flex-shrink-0">
                <img 
                  src={`/images/${category.gifFileName}`}
                  alt="ZK Quote"
                  className="w-80 h-40 object-contain rounded-lg"
                  style={{ 
                    border: '2px solid rgba(254, 17, 197, 0.3)',
                    boxShadow: '0 10px 40px rgba(254, 17, 197, 0.2)'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `/website-succinct/480x192/${category.gifFileName}`
                  }}
                />
              </div>

              {/* Typewriter Quote */}
              <div className="flex-1 flex items-center justify-center min-h-[120px]">
                <p 
                  className="text-center leading-relaxed max-w-2xl"
                  style={{ 
                    fontFamily: 'var(--font-press-start-2p)',
                    color: 'rgba(254, 17, 197, 0.9)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                  }}
                >
                  {currentTypewriterQuote}
                  <span className="animate-pulse ml-1" style={{ color: '#FE11C5' }}>|</span>
                </p>
              </div>

              {/* Reveal Button and Text */}
              <div className="flex-shrink-0 text-center space-y-4">
                <button
                  onClick={getRandomQuote}
                  className="px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(254, 17, 197, 0.2) 0%, rgba(254, 17, 197, 0.1) 100%)',
                    border: '1px solid rgba(254, 17, 197, 0.4)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-press-start-2p)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    boxShadow: '0 5px 20px rgba(254, 17, 197, 0.2)'
                  }}
                >
                  Reveal ZK Quote
                </button>
                
                <p 
                  className="text-center text-xs"
                  style={{ 
                    fontFamily: 'var(--font-press-start-2p)',
                    color: 'rgba(254, 17, 197, 0.6)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  and share on X to spread Succinct and ZK.
                </p>
              </div>
            </div>
          ) : (
            // Revealed Quote View
            <div className="flex-1 flex flex-col p-8 space-y-6">
              {/* Category Title */}
              <div className="text-center">
                <h3 
                  className="text-lg font-normal mb-2" 
                  style={{ 
                    fontFamily: 'var(--font-press-start-2p)',
                    color: '#FFFFFF',
                    letterSpacing: '0.05em'
                  }}
                >
                  You got the {revealedCategory} Quote
                </h3>
              </div>

              {/* Category GIF - Larger size */}
              <div className="flex justify-center">
                <img 
                  src={`/images/${revealedGif}`}
                  alt={revealedCategory}
                  className="w-80 h-40 object-contain rounded-lg"
                  style={{ 
                    border: '2px solid rgba(254, 17, 197, 0.3)',
                    boxShadow: '0 10px 40px rgba(254, 17, 197, 0.2)'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = `/website-succinct/480x192/${revealedGif}`
                  }}
                />
              </div>

              {/* Revealed Quote */}
              <div className="flex-1 flex items-center justify-center">
                <div 
                  className="p-6 rounded-lg max-w-2xl text-center"
                  style={{ 
                    backgroundColor: 'rgba(254, 17, 197, 0.1)',
                    border: '1px solid rgba(254, 17, 197, 0.3)'
                  }}
                >
                  <p 
                    className="leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-press-start-2p)',
                      color: 'rgba(254, 17, 197, 0.9)',
                      fontSize: '0.8rem',
                      lineHeight: '1.6'
                    }}
                  >
                    {revealedQuote}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={shareOnX}
                  className="px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(254, 17, 197, 0.2) 0%, rgba(254, 17, 197, 0.1) 100%)',
                    border: '1px solid rgba(254, 17, 197, 0.4)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-press-start-2p)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  Share on X
                </button>
                <button
                  onClick={resetToQuotes}
                  className="px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(254, 17, 197, 0.1)',
                    border: '1px solid rgba(254, 17, 197, 0.3)',
                    color: 'rgba(254, 17, 197, 0.9)',
                    fontFamily: 'var(--font-press-start-2p)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em'
                  }}
                >
                  Get Another Quote
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hidden md:block"
          style={{ 
            backgroundColor: 'rgba(254, 17, 197, 0.6)',
            borderTopLeftRadius: '4px'
          }}
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    </div>
  )
} 