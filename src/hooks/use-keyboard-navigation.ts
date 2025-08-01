import { useEffect, useCallback, useRef } from 'react'
import { useAccessibility } from '@/contexts/AccessibilityContext'

interface UseKeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableTabTrapping?: boolean
  enableEscapeKey?: boolean
  onEscape?: () => void
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = true,
    enableTabTrapping = false,
    enableEscapeKey = true,
    onEscape
  } = options
  
  const containerRef = useRef<HTMLElement>(null)
  const { shouldReduceMotion } = useAccessibility()

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])'
    ].join(', ')
    
    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const focusableElements = getFocusableElements()
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (enableArrowKeys && focusableElements.length > 0) {
          event.preventDefault()
          const nextIndex = (currentIndex + 1) % focusableElements.length
          focusableElements[nextIndex]?.focus()
        }
        break
        
      case 'ArrowUp':
      case 'ArrowLeft':
        if (enableArrowKeys && focusableElements.length > 0) {
          event.preventDefault()
          const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
          focusableElements[prevIndex]?.focus()
        }
        break
        
      case 'Tab':
        if (enableTabTrapping && focusableElements.length > 0) {
          if (event.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0) {
              event.preventDefault()
              focusableElements[focusableElements.length - 1]?.focus()
            }
          } else {
            // Tab (forward)
            if (currentIndex >= focusableElements.length - 1) {
              event.preventDefault()
              focusableElements[0]?.focus()
            }
          }
        }
        break
        
      case 'Escape':
        if (enableEscapeKey) {
          event.preventDefault()
          onEscape?.()
        }
        break
        
      case 'Home':
        if (focusableElements.length > 0) {
          event.preventDefault()
          focusableElements[0]?.focus()
        }
        break
        
      case 'End':
        if (focusableElements.length > 0) {
          event.preventDefault()
          focusableElements[focusableElements.length - 1]?.focus()
        }
        break
    }
  }, [enableArrowKeys, enableTabTrapping, enableEscapeKey, onEscape, getFocusableElements])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const focusFirst = useCallback(() => {
    const focusableElements = getFocusableElements()
    focusableElements[0]?.focus()
  }, [getFocusableElements])

  const focusLast = useCallback(() => {
    const focusableElements = getFocusableElements()
    focusableElements[focusableElements.length - 1]?.focus()
  }, [getFocusableElements])

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return {
    containerRef,
    focusFirst,
    focusLast,
    announceToScreenReader,
    getFocusableElements
  }
}

export default useKeyboardNavigation