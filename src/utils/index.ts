// Lazy loading utilities
export {
  createLazyComponent,
  createLazyBandComponent,
  createLazyProgramComponent,
  createLazyPageComponent,
  preloadComponent,
  usePreloadOnHover,
  usePreloadOnIntersection,
  createLazyRoute
} from './lazyLoad'

// Performance utilities
export {
  debounce,
  throttle,
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
  memoizeWithTTL,
  useMemoizedAsync,
  PerformanceMonitor,
  usePerformanceMonitor,
  useIntersectionObserver,
  calculateVisibleRange,
  useVirtualScrolling
} from './performance'