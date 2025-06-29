'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  gifSrc: string
  pngSrc: string
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  gifSrc, 
  pngSrc 
}: ImageModalProps) {
  const [showFinal, setShowFinal] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="mb-6">
            <div className="relative w-full h-96 mb-4">
              <Image
                src={showFinal ? pngSrc : gifSrc}
                alt={title}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowFinal(false)}
                className={`px-4 py-2 rounded ${
                  !showFinal 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Animation (GIF)
              </button>
              <button
                onClick={() => setShowFinal(true)}
                className={`px-4 py-2 rounded ${
                  showFinal 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Final Version (PNG)
              </button>
            </div>
          </div>
          
          <div className="text-gray-600">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}