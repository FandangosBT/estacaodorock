import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useUserSettingsStore, AnimationLevel } from '@/stores'

interface AccessibilityContextType {
  // Animation settings
  animationLevel: AnimationLevel
  setAnimationLevel: (level: AnimationLevel) => void
  shouldReduceMotion: boolean
  
  // Visual settings
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  fontSize: 'small' | 'medium' | 'large'
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  
  // Motion settings
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
  
  // Utility functions
  toggleAnimations: () => void
  toggleHighContrast: () => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const {
    animationLevel,
    setAnimationLevel,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
  } = useUserSettingsStore()
  
  const shouldReduceMotion = React.useMemo(() => {
    if (reducedMotion) return true
    if (animationLevel === 'none') return true
    // Check system preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [reducedMotion, animationLevel])
  
  const toggleAnimations = () => {
    const levels: AnimationLevel[] = ['full', 'reduced', 'none']
    const currentIndex = levels.indexOf(animationLevel)
    const nextIndex = (currentIndex + 1) % levels.length
    setAnimationLevel(levels[nextIndex])
  }
  
  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
  }
  
  const increaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1])
    }
  }
  
  const decreaseFontSize = () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1])
    }
  }
  
  // Apply accessibility settings to DOM
  useEffect(() => {
    const root = document.documentElement
    
    // Animation level
    root.classList.remove('animations-full', 'animations-reduced', 'animations-none')
    root.classList.add(`animations-${animationLevel}`)
    
    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large')
    root.classList.add(`font-${fontSize}`)
    
    // Reduced motion
    if (shouldReduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }
  }, [animationLevel, highContrast, fontSize, shouldReduceMotion])
  
  // Listen for system reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      // Force re-evaluation of shouldReduceMotion
      const root = document.documentElement
      if (mediaQuery.matches || reducedMotion || animationLevel === 'none') {
        root.style.setProperty('--animation-duration', '0.01ms')
        root.style.setProperty('--transition-duration', '0.01ms')
      } else {
        root.style.removeProperty('--animation-duration')
        root.style.removeProperty('--transition-duration')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [reducedMotion, animationLevel])
  
  const value: AccessibilityContextType = {
    animationLevel,
    setAnimationLevel,
    shouldReduceMotion,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    toggleAnimations,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
  }
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}