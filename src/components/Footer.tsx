'use client'

import Image from 'next/image'

export default function Footer() {
  const handleSuccinctClick = () => {
    window.open('https://www.succinct.xyz/', '_blank')
  }

  return (
    <footer className="backdrop-blur-sm border-t border-opacity-20" style={{ backgroundColor: 'rgba(1, 15, 34, 0.8)', borderColor: '#FE11C5' }}>
      <div className="container mx-auto text-center py-3 px-6">
        <div className="flex items-center justify-center space-x-3">
          
          <button
            onClick={handleSuccinctClick}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <Image
              src="/images/succinct-icon.svg"
              alt="Succinct"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </button>

          <span 
            className="text-xs font-normal" 
            style={{ 
              fontFamily: 'var(--font-press-start-2p)',
              color: 'rgba(254, 17, 197, 0.8)',
              letterSpacing: '0.05em'
            }}
          >
              • 2025 • Built by @Delta_web3 •
          </span>

        </div>
      </div>
    </footer>
  )
}