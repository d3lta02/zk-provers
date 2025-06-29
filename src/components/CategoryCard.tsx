'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Category } from '@/types/category'

interface CategoryCardProps {
  category: Category
  onCategoryClick: (category: Category) => void
}

export default function CategoryCard({ 
  category, 
  onCategoryClick
}: CategoryCardProps) {
  const [gifLoaded, setGifLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // GIF preload
  useEffect(() => {
    const img = document.createElement('img')
    img.onload = () => setGifLoaded(true)
    img.onerror = () => console.warn(`${category.title} GIF could not be loaded`)
    img.src = `/website-succinct/480x192/${category.gifFileName}`
  }, [category])

  const handleCardClick = () => {
    onCategoryClick(category)
  }

  // Check if this is the ZK Quotes category (id: 0)
  const isZKQuotes = category.id === 0

  return (
    <>
      {/* Desktop Layout */}
      <div 
        className="hidden md:flex items-center cursor-pointer transition-all duration-300 group w-full"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
        transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
      }}
    >
      
        {/* GIF Container - Desktop size */}
      <div 
        className="relative rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0"
        style={{ 
          width: '240px', 
          height: '96px',
          border: isHovered ? '2px solid rgba(254, 17, 197, 0.5)' : '2px solid transparent',
          boxShadow: isHovered 
            ? '0 8px 25px rgba(254, 17, 197, 0.2)' 
            : '0 4px 15px rgba(0, 0, 0, 0.1)',
            imageRendering: 'pixelated'
        }}
      >
          {/* Loading placeholder */}
        {!gifLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
            <div 
              className="text-xs animate-pulse"
              style={{ 
                fontFamily: 'var(--font-press-start-2p)',
                color: '#FE11C5' 
              }}
            >
              LOADING...
            </div>
          </div>
        )}
          
          {/* GIF - Desktop size */}
          {gifLoaded && (
            <Image
              src={`/website-succinct/480x192/${category.gifFileName}`}
              alt={category.title}
            width={240}
            height={96}
            className="w-full h-full object-cover transition-all duration-300"
              unoptimized
              draggable={false}
            style={{
              filter: isHovered ? 'brightness(1.1)' : 'brightness(1.0)',
                imageRendering: 'pixelated'
            }}
          />
          )}
        </div>

        {/* Title - Desktop */}
      <div className="flex-1 flex items-center justify-center ml-8">
          <h3 
          className="text-xl font-normal transition-all duration-300 text-center leading-relaxed"
            style={{ 
            fontFamily: 'var(--font-press-start-2p)',
              color: isZKQuotes 
                ? (isHovered ? '#FFFFFF' : '#FE11C5') 
                : (isHovered ? '#FE11C5' : '#FFFFFF'),
              textShadow: isHovered 
              ? '0 0 15px rgba(254, 17, 197, 0.6)' 
              : 'none',
            letterSpacing: '0.05em'
            }}
          >
            {category.title}
          </h3>
      </div>
    </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden flex flex-col items-center cursor-pointer transition-all duration-300 group w-full p-3"
        onClick={handleCardClick}
        style={{
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        
        {/* GIF Container - Mobile size */}
        <div 
          className="relative rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 mb-3"
          style={{ 
            width: '200px',
            height: '80px',
            border: isHovered ? '2px solid rgba(254, 17, 197, 0.5)' : '2px solid transparent',
            boxShadow: isHovered 
              ? '0 8px 25px rgba(254, 17, 197, 0.2)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)',
            imageRendering: 'pixelated'
          }}
        >
          {/* Loading placeholder */}
          {!gifLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
              <div 
                className="text-xs animate-pulse px-2 text-center"
                style={{ 
                  fontFamily: 'var(--font-press-start-2p)',
                  color: '#FE11C5' 
                }}
              >
                LOADING...
              </div>
            </div>
          )}
            
          {/* GIF - Mobile size */}
          {gifLoaded && (
            <Image
              src={`/website-succinct/480x192/${category.gifFileName}`}
              alt={category.title}
              width={200}
              height={80}
              className="w-full h-full object-cover transition-all duration-300"
              unoptimized
              draggable={false}
              style={{
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1.0)',
                imageRendering: 'pixelated'
              }}
            />
          )}
        </div>

        {/* Title - Mobile */}
        <div className="flex items-center justify-center">
          <h3 
            className="text-sm font-normal transition-all duration-300 text-center leading-relaxed px-2"
            style={{ 
              fontFamily: 'var(--font-press-start-2p)',
              color: isZKQuotes 
                ? (isHovered ? '#FFFFFF' : '#FE11C5') 
                : (isHovered ? '#FE11C5' : '#FFFFFF'),
              textShadow: isHovered 
                ? '0 0 15px rgba(254, 17, 197, 0.6)' 
                : 'none',
              letterSpacing: '0.05em'
            }}
          >
            {category.title}
          </h3>
        </div>
      </div>
    </>
  )
} 