'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useState, useEffect } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Menu, X } from 'lucide-react'
import { useTransition } from '@/components/PageTransition'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const { headerTheme } = useHeaderTheme()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { animationPhase } = useTransition()

  // Close the mobile menu when the uncovering phase starts
  useEffect(() => {
    if (animationPhase === 'uncovering') {
      setIsNavOpen(false)
    }
  }, [animationPhase])

  const handleNavigate = () => {
    // Don't close the menu immediately, let the animation handle it
    return
  }

  return (
    <header
      className="sticky top-0 z-20 transition-all duration-300 bg-background/60 backdrop-blur-sm"
      {...(headerTheme ? { 'data-theme': headerTheme } : {})}
    >
      <div className="container">
        <div className="py-[29px] md:py-8 flex justify-between items-center">
          <Logo
            loading="eager"
            priority="high"
            className="w-[30.6px] md:w-auto"
            href="/"
            theme={headerTheme || 'auto'}
          />
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <HeaderNav data={data} />
          </div>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isNavOpen && (
        <div
          className="fixed inset-0 z-[100] md:hidden transition-opacity duration-300"
          onClick={() => setIsNavOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-[300px] text-white bg-black shadow-xl transform transition-transform duration-300 ease-out flex flex-col h-[100dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-end p-6 border-b bg-black z-10">
              <button
                onClick={() => setIsNavOpen(false)}
                className="p-2 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex-1 px-8 py-10 text-white bg-black overflow-y-auto">
              <HeaderNav data={data} isMobile onNavigate={handleNavigate} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
