'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageModal from './ImageModal'

interface ImageItem {
  id: number
  title: string
  description: string
  gifSrc: string
  pngSrc: string
  thumbnailSrc: string
}

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)
  
  // Sample data - You can update this section after adding your own files
  const images: ImageItem[] = [
    {
      id: 1,
      title: "Section 1",
      description: "Detailed description of the first section will be here.",
      gifSrc: "/images/section1.gif",
      pngSrc: "/images/section1.png",
      thumbnailSrc: "/images/section1.png"
    },
    {
      id: 2,
      title: "Section 2", 
      description: "Detailed description of the second section will be here.",
      gifSrc: "/images/section2.gif",
      pngSrc: "/images/section2.png",
      thumbnailSrc: "/images/section2.png"
    },
    {
      id: 3,
      title: "Section 3",
      description: "Detailed description of the third section will be here.",
      gifSrc: "/images/section3.gif",
      pngSrc: "/images/section3.png", 
      thumbnailSrc: "/images/section3.png"
    },
    {
      id: 4,
      title: "Section 4",
      description: "Detailed description of the fourth section will be here.",
      gifSrc: "/images/section4.gif",
      pngSrc: "/images/section4.png",
      thumbnailSrc: "/images/section4.png"
    },
    {
      id: 5,
      title: "Section 5",
      description: "Detailed description of the fifth section will be here.",
      gifSrc: "/images/section5.gif",
      pngSrc: "/images/section5.png",
      thumbnailSrc: "/images/section5.png"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Interactive Image Gallery
        </h2>
        <p className="text-gray-600">
          Click on images to view details and compare animation and final versions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div 
            key={image.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative h-64">
              <Image
                src={image.thumbnailSrc}
                alt={image.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {image.title}
              </h3>
              <p className="text-gray-600 text-sm">
                Click to view details
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title={selectedImage.title}
          description={selectedImage.description}
          gifSrc={selectedImage.gifSrc}
          pngSrc={selectedImage.pngSrc}
        />
      )}
    </div>
  )
}