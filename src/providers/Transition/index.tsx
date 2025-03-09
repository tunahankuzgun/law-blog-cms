'use client'

import React from 'react'
import { TransitionContextProvider } from '@/components/PageTransition'

export const TransitionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <TransitionContextProvider>{children}</TransitionContextProvider>
}
