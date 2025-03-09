'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect, useRef, useCallback, useContext, createContext } from 'react'

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (onClick) onClick(e)

      // Start the transition animation and handle navigation
      startTransition(href.toString())
    },
    [href, onClick, startTransition],
  )

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

// Provider component
export const TransitionContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextRoute, setNextRoute] = useState<string | null>(null)

  const startTransition = useCallback(
    (href: string) => {
      setIsTransitioning(true)
      setNextRoute(href)

      // Navigate after animation has started (halfway through)
      setTimeout(() => {
        router.push(href)
      }, 1000)

      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
        setNextRoute(null)
      }, 2000)
    },
    [router],
  )

  const contextValue = {
    isTransitioning,
    startTransition,
  }

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
      <PageTransitionEffect isTransitioning={isTransitioning} />
    </TransitionContext.Provider>
  )
}

// Hook to access transition context
export const useTransition = () => useContext(TransitionContext)

// The actual transition animation component
const PageTransitionEffect: React.FC<{
  isTransitioning: boolean
}> = ({ isTransitioning }) => {
  const [windowHeight, setWindowHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    // Set the window dimensions on client side
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)

    // Update dimensions on window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="transition-effect"
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Main transition overlay */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-primary"
            initial={{ height: 0 }}
            animate={{
              height: [0, windowHeight, windowHeight, 0],
              bottom: [0, 0, 0, 0],
            }}
            exit={{ height: 0 }}
            transition={{
              duration: 2,
              times: [0, 0.4, 0.6, 1],
              ease: 'easeInOut',
            }}
          />

          {/* Secondary wave effect */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 bg-primary/80"
            initial={{ height: 0 }}
            animate={{
              height: [0, windowHeight * 0.9, windowHeight * 0.9, 0],
              bottom: [0, 0, 0, 0],
            }}
            exit={{ height: 0 }}
            transition={{
              duration: 2,
              delay: 0.1,
              times: [0, 0.4, 0.6, 1],
              ease: 'easeInOut',
            }}
          />

          {/* Tertiary wave effect */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 bg-primary/60"
            initial={{ height: 0 }}
            animate={{
              height: [0, windowHeight * 0.8, windowHeight * 0.8, 0],
              bottom: [0, 0, 0, 0],
            }}
            exit={{ height: 0 }}
            transition={{
              duration: 2,
              delay: 0.2,
              times: [0, 0.4, 0.6, 1],
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
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.8],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 1.6,
              delay: 0.2,
              times: [0, 0.3, 0.7, 1],
              ease: 'easeInOut',
            }}
          >
            <div className="text-primary-foreground font-bold text-4xl md:text-6xl tracking-wider">
              Bilgiç Hukuk
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Legacy PageTransition component for backward compatibility
export const PageTransition: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <>{children}</>
}
