'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useLayoutEffect } from 'react'

const PageClient: React.FC = () => {
  const { setHeaderTheme } = useHeaderTheme()

  // Debug theme values on initial render and any changes

  // Use useLayoutEffect to set the theme immediately before paint
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

  useIsomorphicLayoutEffect(() => {
    // Read from localStorage directly to ensure we get the most current value
    const storedTheme =
      localStorage.getItem('payload-theme') || localStorage.getItem('theme') || 'dark'

    // Use the stored theme directly instead of relying on the theme context value
    setHeaderTheme(storedTheme)

    // Reset header theme when component unmounts
    return () => {
      setHeaderTheme(null)
    }
  }, [setHeaderTheme])
  return <React.Fragment />
}

export default PageClient
