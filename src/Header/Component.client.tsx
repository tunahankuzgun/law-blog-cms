'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [scrollYValue, setScrollYValue] = useState(0)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  useEffect(() => {
    const handleScroll = () => {
      setScrollYValue(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-1000 ${scrollYValue > 95 ? 'bg-background/80 backdrop-blur-sm' : ''}`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="py-8 flex justify-between">
          <Logo loading="eager" priority="high" className="" href="/" />
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
