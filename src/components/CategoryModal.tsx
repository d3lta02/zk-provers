'use client'

import { useState, useEffect, useRef } from 'react'
import { Category } from '@/types/category'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
  zIndex?: number
}

export default function CategoryModal({ isOpen, onClose, category, zIndex = 50 }: CategoryModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [activeSectionTab, setActiveSectionTab] = useState<string>('')
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

  // Dragging & Resizing functionality
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
      // Multiple panel positioning
      const isMobile = window.innerWidth < 768
      if (isMobile) {
        setPosition({ x: 20, y: 50 })
        setSize({ width: window.innerWidth - 40, height: window.innerHeight - 100 })
      } else {
        // Center the modal on screen
        const modalWidth = 1200
        const modalHeight = 650
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
      
      // Tab management
      if (category.sections) {
        setActiveTab('sections')
        setActiveSectionTab(Object.keys(category.sections)[0] || '')
      } else {
        setActiveTab('overview')
      }
    }
  }, [isOpen, category, zIndex])

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

  if (!isOpen || !category) return null

  // Use Case title optimization function
  const getUseCaseTitle = (useCase: string) => {
    // Detect common titles and shorten them
    const commonTitles: { [key: string]: string } = {
      'Real-time Ethereum proving': 'Real-time Proving',
      'High-frequency trading systems': 'HFT Systems',
      'Interactive gaming applications': 'Gaming Apps',
      'Enterprise blockchain solutions': 'Enterprise Solutions',
      'Blockchain proof generation': 'Proof Generation',
      'Bridge applications': 'Bridge Apps',
      'AI agent verification': 'AI Verification',
      'Game state proving': 'Game States',
      'Network monitoring and analytics': 'Monitoring',
      'Performance optimization': 'Optimization',
      'Resource allocation tracking': 'Resource Tracking',
      'Verifiable gaming with real-time events': 'Gaming Events',
      'Financial exchanges with provable auctions': 'Financial Exchanges',
      'Healthcare doctor matching systems': 'Healthcare Matching',
      'Web2 applications becoming verifiable': 'Web2 Integration'
    }
    
    // Use exact match if available
    if (commonTitles[useCase]) {
      return commonTitles[useCase]
    }
    
    // Take first 3 words and clean up
    const words = useCase.split(' ')
    if (words.length <= 3) {
      return useCase
    }
    
    // Shorten long titles
    return words.slice(0, 3).join(' ') + '...'
  }

  // Optimized tab system
  const tabs = category.sections ? [
    { id: 'sections', label: 'Guide', category: 'guide' },
    { id: 'overview', label: 'About', category: 'general' },
    { id: 'blog', label: 'Deep Dive', category: 'content' }
  ] : category.blogSummary ? [
    { id: 'overview', label: 'About', category: 'general' },
    { id: 'blog', label: 'Deep Dive', category: 'content' },
    { id: 'specs', label: 'Specs', category: 'technical' }
  ] : [
    { id: 'overview', label: 'About', category: 'general' },
    { id: 'specs', label: 'Specs', category: 'technical' }
  ]

  // Site color system
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'guide': return '#4F8BFF'
      case 'content': return '#FE11C5'
      case 'technical': return '#2563EB'
      case 'general': return '#60A5FA'
      default: return '#FE11C5'
    }
  }

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
      
      {/* Modal Window */}
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

        {/* Tab Navigation */}
        <div 
          className="flex border-b"
                style={{ 
            backgroundColor: '#0a1628', 
            borderColor: 'rgba(254, 17, 197, 0.2)' 
          }}
        >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-3 text-xs font-normal transition-all duration-200 border-r flex-1
                ${activeTab === tab.id ? 'border-b-2' : ''}
              `}
                  style={{
                  fontFamily: 'var(--font-press-start-2p)',
                color: activeTab === tab.id ? '#FFFFFF' : 'rgba(254, 17, 197, 0.6)',
                borderRightColor: 'rgba(254, 17, 197, 0.2)',
                borderBottomColor: activeTab === tab.id ? getCategoryColor(tab.category) : 'transparent',
                  backgroundColor: activeTab === tab.id ? 'rgba(254, 17, 197, 0.1)' : 'transparent',
                  letterSpacing: '0.05em'
                  }}
                >
              <div className="flex items-center justify-center space-x-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: getCategoryColor(tab.category) }}
                />
                <span>{tab.label}</span>
              </div>
                </button>
              ))}
            </div>

        {/* Content Area */}
          <div 
          className="flex flex-col"
            style={{ 
              backgroundColor: '#010F22',
            height: 'calc(100% - 80px)'
            }}
          >
              
          {/* Sections Tab Content */}
              {activeTab === 'sections' && category.sections && (
                <div className="flex h-full">
              {/* Section Navigation */}
                  <div 
                    className="w-48 border-r overflow-y-auto"
                style={{ backgroundColor: '#0a1628', borderColor: 'rgba(254, 17, 197, 0.2)' }}
                  >
                    <div className="p-3">
                      <h4 
                        className="text-xs font-normal mb-3" 
                        style={{ 
                          fontFamily: 'var(--font-press-start-2p)',
                      color: '#FFFFFF',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Sections
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(category.sections).map(([key, section]) => (
                          <button
                            key={key}
                            onClick={() => setActiveSectionTab(key)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all duration-200`}
                            style={{
                          fontFamily: 'var(--font-press-start-2p)',
                          color: activeSectionTab === key ? '#FFFFFF' : 'rgba(254, 17, 197, 0.7)',
                              backgroundColor: activeSectionTab === key ? 'rgba(254, 17, 197, 0.1)' : 'transparent',
                          border: activeSectionTab === key ? '1px solid rgba(254, 17, 197, 0.3)' : '1px solid transparent',
                          fontSize: '0.65rem'
                            }}
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {activeSectionTab && category.sections[activeSectionTab] && (
                    <div className="space-y-6">
                          <h3 
                        className="text-lg font-normal mb-4" 
                            style={{ 
                              fontFamily: 'var(--font-press-start-2p)',
                          color: '#FFFFFF',
                              letterSpacing: '0.05em'
                            }}
                          >
                            {category.sections[activeSectionTab].title}
                          </h3>
                      
                      <div 
                        className="leading-relaxed text-sm prose-sm" 
                        style={{ 
                          color: 'rgba(254, 17, 197, 0.9)',
                          fontFamily: 'var(--font-press-start-2p)',
                          fontSize: '0.75rem',
                          lineHeight: '1.6'
                        }}
                      >
                            {category.sections[activeSectionTab].content}
                        </div>

                        {category.sections[activeSectionTab].highlights && (
                          <div>
                            <h4 
                            className="text-sm font-normal mb-4" 
                              style={{ 
                                fontFamily: 'var(--font-press-start-2p)',
                              color: '#FFFFFF',
                                letterSpacing: '0.05em'
                              }}
                            >
                            Key Points
                            </h4>
                          <div className="space-y-3">
                              {category.sections[activeSectionTab].highlights?.map((highlight, index) => (
                                <div 
                                  key={index}
                                className="flex items-start space-x-4 pl-4 border-l-2"
                                  style={{ 
                                  borderLeftColor: 'rgba(254, 17, 197, 0.3)'
                                  }}
                                >
                                  <div 
                                    className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                                    style={{ backgroundColor: '#FE11C5' }}
                                  />
                                <span 
                                  className="text-sm leading-relaxed" 
                                  style={{ 
                                    color: 'rgba(254, 17, 197, 0.9)',
                                    fontFamily: 'var(--font-press-start-2p)',
                                    fontSize: '0.7rem',
                                    lineHeight: '1.6'
                                  }}
                                >
                                    {highlight}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
                  </div>
                </div>
              )}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
            <div className="p-6 space-y-6 overflow-y-auto">
                  <div>
                  <h3 
                  className="text-lg font-normal mb-4" 
                    style={{ 
                      fontFamily: 'var(--font-press-start-2p)',
                    color: '#FFFFFF',
                      letterSpacing: '0.05em'
                    }}
                  >
                    About
                    </h3>
                <div 
                  className="leading-relaxed text-sm" 
                  style={{ 
                    color: 'rgba(254, 17, 197, 0.9)',
                    fontFamily: 'var(--font-press-start-2p)',
                    fontSize: '0.75rem',
                    lineHeight: '1.6'
                  }}
                >
                      {category.details.overview}
                </div>
                  </div>
                  
                  <div>
                  <h3 
                  className="text-lg font-normal mb-4" 
                    style={{ 
                      fontFamily: 'var(--font-press-start-2p)',
                    color: '#FFFFFF',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Key Features
                    </h3>
                <div className="space-y-3">
                      {category.features.map((feature, index) => (
                        <div 
                          key={index}
                      className="flex items-start space-x-4 pl-4 border-l-2"
                      style={{ 
                        borderLeftColor: 'rgba(254, 17, 197, 0.3)'
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: '#FE11C5' }}
                      />
                      <span 
                        className="text-sm" 
                        style={{ 
                          color: 'rgba(254, 17, 197, 0.9)',
                          fontFamily: 'var(--font-press-start-2p)',
                          fontSize: '0.7rem',
                          lineHeight: '1.6'
                        }}
                      >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

          {/* Deep Dive (Blog) Tab */}
          {activeTab === 'blog' && category.blogSummary && (
            <div className="overflow-y-auto">
              <div className="p-6">
                <div 
                  className="text-sm leading-relaxed blog-content"
                  style={{ 
                    color: 'rgba(254, 17, 197, 0.9)',
                    fontFamily: 'var(--font-press-start-2p)',
                    fontSize: '0.75rem',
                    lineHeight: '1.7'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: category.blogSummary
                      .replace(/^# (.+)$/gm, '<h1 style="font-family: var(--font-press-start-2p); color: #FFFFFF; font-size: 1rem; margin-bottom: 1.5rem; letter-spacing: 0.05em; line-height: 1.4;">$1</h1>')
                      .replace(/^## (.+)$/gm, '<h2 style="font-family: var(--font-press-start-2p); color: #FFFFFF; font-size: 0.875rem; margin: 2rem 0 1rem 0; letter-spacing: 0.05em; line-height: 1.4;">$1</h2>')
                      .replace(/^\*\*(.+?):\*\*/gm, '<div style="margin: 1rem 0 0.5rem 0;"><strong style="color: #FFFFFF; font-family: var(--font-press-start-2p); font-size: 0.8rem; display: block; margin-bottom: 0.5rem;">$1:</strong></div>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: #FFFFFF;">$1</strong>')
                      .replace(/^- (.+)$/gm, '<div style="margin: 0.75rem 0; padding-left: 1.5rem; border-left: 2px solid rgba(254, 17, 197, 0.3); position: relative;"><div style="position: absolute; left: -6px; top: 0.6rem; width: 4px; height: 4px; background: #FE11C5; border-radius: 50%;"></div>$1</div>')
                      .replace(/^(\d+)\. (.+)$/gm, '<div style="margin: 0.75rem 0; padding-left: 1.5rem; border-left: 2px solid rgba(254, 17, 197, 0.3); position: relative;"><span style="position: absolute; left: -1.2rem; top: 0; color: #FFFFFF; font-family: var(--font-press-start-2p); font-size: 0.7rem;">$1.</span>$2</div>')
                      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre style="background: rgba(254, 17, 197, 0.1); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; border-left: 3px solid #FE11C5; overflow-x: auto; font-size: 0.7rem; font-family: monospace; color: rgba(254, 17, 197, 0.9);"><code>$2</code></pre>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #FFFFFF; text-decoration: underline; font-weight: bold;" target="_blank" rel="noopener">$1</a>')
                      .replace(/\n\n/g, '<div style="margin: 1rem 0;"></div>')
                  }}
                />
              </div>
            </div>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 
                  className="text-lg font-normal mb-4" 
                  style={{ 
                    fontFamily: 'var(--font-press-start-2p)',
                    color: '#FFFFFF',
                    letterSpacing: '0.05em'
                  }}
                >
                  Technical Specifications
                  </h3>
                <div className="space-y-4">
                    {category.details.technical.map((tech, index) => (
                      <div 
                        key={index}
                      className="flex items-start space-x-4 pl-4 border-l-2"
                      style={{ 
                        borderLeftColor: 'rgba(254, 17, 197, 0.3)'
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-normal mt-1 flex-shrink-0"
                        style={{ 
                          backgroundColor: '#FE11C5', 
                          color: '#010F22',
                          fontFamily: 'var(--font-press-start-2p)'
                        }}
                        >
                          {index + 1}
                        </div>
                      <span 
                        className="text-sm leading-relaxed" 
                        style={{ 
                          color: 'rgba(254, 17, 197, 0.9)',
                          fontFamily: 'var(--font-press-start-2p)',
                          fontSize: '0.7rem',
                          lineHeight: '1.6'
                        }}
                      >
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              <div>
                <h3 
                  className="text-lg font-normal mb-4" 
                  style={{ 
                    fontFamily: 'var(--font-press-start-2p)',
                    color: '#FFFFFF',
                    letterSpacing: '0.05em'
                  }}
                >
                  Applications
                  </h3>
                <div className="space-y-4">
                    {category.details.useCases.map((useCase, index) => (
                      <div 
                        key={index}
                      className="pl-4 border-l-2"
                      style={{ 
                        borderLeftColor: 'rgba(254, 17, 197, 0.3)'
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-normal flex-shrink-0"
                        style={{ 
                            backgroundColor: 'rgba(254, 17, 197, 0.2)', 
                            color: '#FE11C5',
                            fontFamily: 'var(--font-press-start-2p)',
                            border: '1px solid rgba(254, 17, 197, 0.4)'
                        }}
                      >
                          {index + 1}
                        </div>
                        <span 
                          className="font-normal text-sm" 
                          style={{ 
                            fontFamily: 'var(--font-press-start-2p)',
                            color: '#FFFFFF',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {getUseCaseTitle(useCase)}
                          </span>
                        </div>
                      <p 
                        className="text-sm leading-relaxed pl-9" 
                        style={{ 
                          color: 'rgba(254, 17, 197, 0.9)',
                          fontFamily: 'var(--font-press-start-2p)',
                          fontSize: '0.7rem',
                          lineHeight: '1.6'
                        }}
                      >
                          {useCase}
                        </p>
                      </div>
                    ))}
                </div>
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