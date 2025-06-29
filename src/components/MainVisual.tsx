'use client'

import CategoryCard from './CategoryCard'
import { CATEGORIES, Category } from '@/types/category'

interface MainVisualProps {
  onCategoryClick: (category: Category) => void
}

export default function MainVisual({ onCategoryClick }: MainVisualProps) {
  return (
    <div 
      className="relative w-full min-h-screen flex items-center justify-center"
      style={{ 
        backgroundColor: '#010F22',
        paddingTop: '65px', // For header - reduced by 5px
        paddingBottom: '45px' // For footer - reduced by 5px
      }}
    >
      {/* Main Container - Perfect Fit */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          
        {/* Categories - Responsive spacing optimized for 6 categories */}
        <div className="flex flex-col justify-center min-h-[calc(100vh-130px)] space-y-1 md:space-y-3 py-4">
          {CATEGORIES.map((category, index) => (
            <div 
              key={category.id}
              className="animate-slide-in"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: 'both'
              }}
            >
              <CategoryCard
                category={category}
                onCategoryClick={onCategoryClick}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>

    </div>
  )
}