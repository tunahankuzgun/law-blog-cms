'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useState } from 'react'

import type { Theme } from './types'

import { useTheme } from '..'
import { themeLocalStorageKey } from './types'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const { setHeaderTheme } = useHeaderTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setHeaderTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <div className="min-w-[86px]">
      <Select onValueChange={onThemeChange} value={value}>
        <SelectTrigger
          aria-label="Select a theme"
          className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
        >
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
