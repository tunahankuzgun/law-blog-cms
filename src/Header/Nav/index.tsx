'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { TransitionLink, useTransition } from '@/components/PageTransition'
import { SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export const HeaderNav: React.FC<{
  data: HeaderType
  isMobile?: boolean
  onNavigate?: () => void
}> = ({ data, isMobile = false, onNavigate }) => {
  const { startTransition } = useTransition()
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const isHomePage = pathname === '/'

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (onNavigate) onNavigate()
    startTransition(href)
  }

  return (
    <nav className={`flex ${isMobile ? 'flex-col items-start gap-10' : 'gap-3 items-center'}`}>
      {navItems.map(({ link }, i) => {
        const href =
          link.type === 'reference' &&
          typeof link.reference?.value === 'object' &&
          link.reference.value.slug
            ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${link.reference.value.slug}`
            : link.url

        if (!href) return null

        return (
          <TransitionLink
            key={i}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className={
              isMobile
                ? 'text-xl font-medium text-white transition-colors relative group'
                : isHomePage
                  ? 'text-white'
                  : ''
            }
          >
            {link.label}
          </TransitionLink>
        )
      })}
      <TransitionLink
        href="/search"
        onClick={(e) => handleClick(e, '/search')}
        className={`${isMobile ? 'mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors' : ''}`}
      >
        <SearchIcon className={`text-primary ${isMobile ? 'w-5 h-5' : 'w-5'}`} />
        {isMobile && <span className="font-medium text-gray-900 dark:text-white">Search</span>}
      </TransitionLink>
    </nav>
  )
}
