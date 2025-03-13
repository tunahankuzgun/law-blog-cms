'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [scrollYValue, setScrollYValue] = useState(0)
  const { headerTheme } = useHeaderTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollYValue(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-300 ${
        scrollYValue > 10 ? 'bg-background/80 backdrop-blur-sm' : ''
      }`}
      {...(headerTheme ? { 'data-theme': headerTheme } : {})}
    >
      <div className="container">
        <div className="py-8 flex justify-between">
          <Logo
            loading="eager"
            priority="high"
            className=""
            href="/"
            theme={headerTheme || undefined}
          />
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
