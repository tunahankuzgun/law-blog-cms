'use client'

import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useContext, createContext } from 'react'
import { useTheme } from '@/providers/Theme'
// Create a context to manage navigation state
interface TransitionContextType {
  isTransitioning: boolean
  startTransition: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  startTransition: () => {},
})

// Custom Link component that intercepts navigation
export const TransitionLink: React.FC<React.ComponentProps<typeof Link>> = ({
  href,
  onClick,
  children,
  ...props
}) => {
  const { startTransition } = useContext(TransitionContext)
  const pathname = usePathname()

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Get the destination path
      const destination = href.toString()

      // Parse the URLs to compare them properly
      const currentPath = pathname
      const destinationPath = destination.split('?')[0] // Remove query params for comparison

      // If navigating to the same page, don't trigger the animation
      if (currentPath === destinationPath) {
        if (onClick) onClick(e)
        return
      }

      // Otherwise, prevent default navigation and start the transition
      e.preventDefault()
      if (onClick) onClick(e)

      // Start the transition animation and handle navigation
      startTransition(destination)
    },
    [href, onClick, startTransition, pathname],
  )

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

// Animation phases
type AnimationPhase = 'none' | 'covering' | 'navigating' | 'holding' | 'uncovering'

// Provider component
export const TransitionContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname() // Get current pathname
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextRoute, setNextRoute] = useState<string | null>(null)
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('none')
  const [routingComplete, setRoutingComplete] = useState(false)
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null)
  const [targetPathname, setTargetPathname] = useState<string | null>(null)

  // Handle navigation after the covering animation completes
  useEffect(() => {
    if (animationPhase === 'navigating' && nextRoute) {
      // Extract the pathname from the next route
      // This handles both absolute and relative paths
      const url = new URL(nextRoute, window.location.origin)
      setTargetPathname(url.pathname)

      // Navigate to the new route
      router.push(nextRoute)
    }
  }, [animationPhase, nextRoute, router])

  // Detect when pathname has changed to match our target
  useEffect(() => {
    if (targetPathname && pathname === targetPathname && animationPhase === 'navigating') {
      // Small buffer to ensure content has rendered
      setTimeout(() => {
        setRoutingComplete(true)
        setHoldStartTime(Date.now())
        setAnimationPhase('holding')
      }, 200)
    }
  }, [pathname, targetPathname, animationPhase])

  // Handle the holding phase (pause before uncovering)
  useEffect(() => {
    if (animationPhase === 'holding' && routingComplete && holdStartTime) {
      const MINIMUM_HOLD_TIME = 500 // 1.5 seconds minimum display time

      const elapsedTime = Date.now() - holdStartTime
      const remainingTime = Math.max(0, MINIMUM_HOLD_TIME - elapsedTime)

      // Wait before starting the uncovering phase
      const timer = setTimeout(() => {
        setAnimationPhase('uncovering')
      }, remainingTime)

      return () => clearTimeout(timer)
    }
  }, [animationPhase, routingComplete, holdStartTime])

  // Handle the end of the animation
  useEffect(() => {
    if (animationPhase === 'uncovering') {
      // End the transition after the uncovering animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setNextRoute(null)
        setAnimationPhase('none')
        setRoutingComplete(false)
        setHoldStartTime(null)
      }, 1000) // This should match the duration of the uncovering animation

      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  const startTransition = useCallback((href: string) => {
    setIsTransitioning(true)
    setNextRoute(href)
    setAnimationPhase('covering')
    setRoutingComplete(false)
    setTargetPathname(null) // Reset target pathname

    // After the covering animation completes, move to the navigating phase
    setTimeout(() => {
      setAnimationPhase('navigating')
    }, 1000) // This should match the duration of the covering animation
  }, [])

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}
      <PageTransitionEffect isTransitioning={isTransitioning} animationPhase={animationPhase} />
    </TransitionContext.Provider>
  )
}

// Hook to access transition context
export const useTransition = () => useContext(TransitionContext)

// The actual transition animation component
const PageTransitionEffect: React.FC<{
  isTransitioning: boolean
  animationPhase: AnimationPhase
}> = ({ isTransitioning, animationPhase }) => {
  const [windowHeight, setWindowHeight] = useState(0)
  const { theme } = useTheme()

  // Set up window dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    // Initial setup
    handleResize()

    // Update on resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Determine the animation state based on the phase
  const getAnimationProps = () => {
    switch (animationPhase) {
      case 'covering':
        return { height: [0, windowHeight], bottom: [0, 0] }
      case 'uncovering':
        return { height: [windowHeight, 0], bottom: [0, 0] }
      case 'navigating':
      case 'holding':
        return { height: windowHeight, bottom: 0 }
      default:
        return { height: 0, bottom: 0 }
    }
  }

  // Is the animation in an active phase?
  const isAnimating = animationPhase === 'covering' || animationPhase === 'uncovering'

  // Is the logo visible?
  const isLogoVisible = animationPhase === 'navigating' || animationPhase === 'holding'

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Main transition overlay */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 bg-background"
        initial={{ height: 0 }}
        animate={getAnimationProps()}
        transition={{
          duration: isAnimating ? 1 : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Text animation */}
      <motion.div
        className="fixed z-[60] flex items-center justify-center w-full pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isLogoVisible ? 1 : 0,
          scale: isLogoVisible ? 1 : 0.8,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      >
        <Image
          src={`/${encodeURIComponent(theme === 'dark' ? 'bilgic-hukuk-loading.png' : 'bilgic-hukuk-loading-dark.png')}`}
          alt="Bilgiç Hukuk Logo"
          width={400}
          height={133}
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  )
}

// Legacy PageTransition component for backward compatibility
export const PageTransition: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <>{children}</>
}
