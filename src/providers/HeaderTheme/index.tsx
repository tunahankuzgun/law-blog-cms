'use client'
import React, { createContext, useContext, useState } from 'react'

type HeaderThemeContextType = {
  headerTheme: string | null
  setHeaderTheme: (theme: string | null) => void
}

const HeaderThemeContext = createContext<HeaderThemeContextType>({
  headerTheme: null,
  setHeaderTheme: () => {},
})

export const HeaderThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerTheme, setHeaderTheme] = useState<string | null>(null)

  return (
    <HeaderThemeContext.Provider value={{ headerTheme, setHeaderTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  )
}

export const useHeaderTheme = () => useContext(HeaderThemeContext)
