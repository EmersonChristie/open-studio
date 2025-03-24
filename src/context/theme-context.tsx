'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Helper function to safely get localStorage value
const getStorageTheme = (key: string, fallback: Theme): Theme => {
  if (typeof window === 'undefined') return fallback
  try {
    const value = localStorage.getItem(key)
    return (value as Theme) || fallback
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return fallback
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() =>
    getStorageTheme(storageKey, defaultTheme)
  )

  // Handle hydration mismatch by re-setting state on client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (theme: Theme) => {
      root.classList.remove('light', 'dark') // Remove existing theme classes
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const effectiveTheme = theme === 'system' ? systemTheme : theme
      root.classList.add(effectiveTheme) // Add the new theme class
    }

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    applyTheme(theme)

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  const setTheme = (theme: Theme) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, theme)
      } catch (error) {
        console.error('Error setting localStorage:', error)
      }
    }
    _setTheme(theme)
  }

  const value = {
    theme,
    setTheme,
  }

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
