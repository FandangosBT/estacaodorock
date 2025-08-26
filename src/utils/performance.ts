import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

// React hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// React hook for debounced callbacks
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  
  return useCallback(
    debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay, ...deps]
  )
}

// React hook for throttled callbacks
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  
  return useCallback(
    throttle((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay, ...deps]
  )
}

// Memoization with expiration
interface MemoCache<T> {
  value: T
  timestamp: number
  expiry: number
}

class MemoizedCache<K, V> {
  private cache = new Map<K, MemoCache<V>>()
  private defaultTTL: number
  
  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL
  }
  
  get(key: K): V | undefined {
    const cached = this.cache.get(key)
    if (!cached) return undefined
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key)
      return undefined
    }
    
    return cached.value
  }
  
  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl ?? this.defaultTTL)
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      expiry
    })
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  size(): number {
    return this.cache.size
  }
}

// Global cache instance
const globalCache = new MemoizedCache()

// Memoize function with TTL
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl?: number,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new MemoizedCache<string, ReturnType<T>>(ttl)
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    let result = cache.get(key)
    if (result === undefined) {
      result = fn(...args)
      cache.set(key, result)
    }
    
    return result
  }) as T
}

// React hook for memoized async operations
export function useMemoizedAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  deps: React.DependencyList,
  ttl = 5 * 60 * 1000
): {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: (...args: Args) => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const cacheKey = useMemo(() => JSON.stringify(deps), deps)
  
  const fetchData = useCallback(async (...args: Args) => {
    const cached = globalCache.get(cacheKey) as T | undefined
    if (cached) {
      setData(cached)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await asyncFn(...args)
      setData(result)
      globalCache.set(cacheKey, result, ttl)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [asyncFn, cacheKey, ttl])
  
  useEffect(() => {
    fetchData(...([] as any as Args))
  }, deps)
  
  return { data, loading, error, refetch: fetchData }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>()
  private static measures = new Map<string, number>()
  
  static mark(name: string): void {
    this.marks.set(name, performance.now())
  }
  
  static measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark)
    if (!startTime) {
      console.warn(`Start mark '${startMark}' not found`)
      return 0
    }
    
    const duration = performance.now() - startTime
    this.measures.set(name, duration)
    
    if (typeof import.meta !== 'undefined' && import.meta.env.MODE !== 'production') console.debug(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
    
    return duration
  }
  
  static getMeasure(name: string): number | undefined {
    return this.measures.get(name)
  }
  
  static getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures)
  }
  
  static clear(): void {
    this.marks.clear()
    this.measures.clear()
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor(name: string) {
  useEffect(() => {
    PerformanceMonitor.mark(`${name}-start`)
    
    return () => {
      PerformanceMonitor.measure(name, `${name}-start`)
    }
  }, [])
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      { threshold: 0.1, ...options }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [hasIntersected, options])
  
  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected
  }
}

// Virtual scrolling utilities
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 5
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  return { startIndex, endIndex }
}

// React hook for virtual scrolling
export function useVirtualScrolling({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  itemCount: number
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const { startIndex, endIndex } = useMemo(
    () => calculateVisibleRange(scrollTop, containerHeight, itemHeight, itemCount, overscan),
    [scrollTop, containerHeight, itemHeight, itemCount, overscan]
  )
  
  const totalHeight = itemCount * itemHeight
  const offsetY = startIndex * itemHeight
  
  const handleScroll = useThrottledCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    },
    16 // ~60fps
  )
  
  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// Device performance detection
export function useDevicePerformance() {
  const [isLowEnd, setIsLowEnd] = useState<boolean>(false)
  const [deviceInfo, setDeviceInfo] = useState<{
    memory?: number
    cores?: number
    saveData?: boolean
    connection?: any
  }>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nav = navigator as any
    
    // Collect device info
    const memory = nav.deviceMemory || undefined
    const cores = nav.hardwareConcurrency || undefined
    const saveData = nav.connection?.saveData || false
    const connection = nav.connection || undefined

    setDeviceInfo({ memory, cores, saveData, connection })

    // Low-end heuristic: deviceMemory ≤ 4GB OR hardwareConcurrency ≤ 4 OR Save-Data=on
    const isLowEndDevice = 
      (memory && memory <= 4) ||
      (cores && cores <= 4) ||
      saveData

    setIsLowEnd(Boolean(isLowEndDevice))
  }, [])

  return { isLowEnd, deviceInfo }
}

// Video optimization hook for offscreen pause/resume
export function useVideoOffscreen(
  videoRef: React.RefObject<HTMLVideoElement>,
  options: {
    rootMargin?: string
    threshold?: number
    pauseWhenOffscreen?: boolean
    resumeWhenVisible?: boolean
  } = {}
) {
  const [isVisible, setIsVisible] = useState(false)
  const wasPlayingRef = useRef(false)
  
  const {
    rootMargin = '0px',
    threshold = 0.1,
    pauseWhenOffscreen = true,
    resumeWhenVisible = true
  } = options

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible
        const nowVisible = entry.isIntersecting
        
        setIsVisible(nowVisible)
        
        if (!wasVisible && nowVisible && resumeWhenVisible) {
          // Entering viewport - resume if it was playing
          if (wasPlayingRef.current && video.paused) {
            video.play().catch(() => {
              // Ignore autoplay policy errors
            })
          }
        } else if (wasVisible && !nowVisible && pauseWhenOffscreen) {
          // Leaving viewport - pause and remember state
          if (!video.paused) {
            wasPlayingRef.current = true
            video.pause()
          }
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [videoRef, rootMargin, threshold, pauseWhenOffscreen, resumeWhenVisible, isVisible])

  return { isVisible }
}

const __DEV__ = typeof import.meta !== 'undefined' ? import.meta.env.MODE !== 'production' : true