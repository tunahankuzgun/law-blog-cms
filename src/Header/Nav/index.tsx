'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { TransitionLink } from '@/components/PageTransition'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType; isMobile?: boolean }> = ({
  data,
  isMobile = false,
}) => {
  const navItems = data?.navItems || []

  return (
    <nav className={`flex ${isMobile ? 'flex-col items-start gap-10' : 'gap-3 items-center'}`}>
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={
              isMobile ? 'text-xl font-medium text-white transition-colors relative group' : ''
            }
          />
        )
      })}
      <TransitionLink
        href="/search"
        className={`${isMobile ? 'mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors' : ''}`}
      >
        <SearchIcon className={`text-primary ${isMobile ? 'w-5 h-5' : 'w-5'}`} />
        {isMobile && <span className="font-medium text-gray-900 dark:text-white">Search</span>}
      </TransitionLink>
    </nav>
  )
}
