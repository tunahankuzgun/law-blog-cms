import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { TransitionProvider } from './Transition'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <TransitionProvider>{children}</TransitionProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
