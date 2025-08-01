import React, { Suspense, ComponentType, LazyExoticComponent } from 'react'
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BandCardSkeleton, 
  ProgramItemSkeleton, 
  SectionSkeleton,
  PageSkeleton 
} from '@/components/ui/skeleton-loaders'

// Loading component with spinner
interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

function LoadingSpinner({ message = 'Carregando...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// Error boundary for lazy loaded components
interface LazyErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class LazyErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>,
  LazyErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error; retry: () => void }> }>) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): LazyErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo)
  }
  
  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }
  
  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} retry={this.retry} />
    }
    
    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="text-destructive">
        <h3 className="text-lg font-semibold">Erro ao carregar componente</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
      </div>
      <button
        onClick={retry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}

// Skeleton loading types
type SkeletonType = 'spinner' | 'band-card' | 'program-item' | 'section' | 'page' | 'custom'

// Lazy loading wrapper options
interface LazyWrapperOptions {
  loading?: React.ComponentType<LoadingSpinnerProps>
  error?: React.ComponentType<{ error: Error; retry: () => void }>
  loadingProps?: LoadingSpinnerProps
  retryCount?: number
  retryDelay?: number
  skeletonType?: SkeletonType
  skeletonProps?: {
    count?: number
    content?: 'bands' | 'program'
    title?: boolean
    filters?: boolean
    header?: boolean
    className?: string
  }
}

// Create skeleton loading component based on type
function createSkeletonComponent(type: SkeletonType, props: any = {}) {
  switch (type) {
    case 'band-card':
      return () => <BandCardSkeleton {...props} />
    case 'program-item':
      return () => <ProgramItemSkeleton {...props} />
    case 'section':
      return () => <SectionSkeleton {...props} />
    case 'page':
      return () => <PageSkeleton {...props} />
    case 'spinner':
    default:
      return LoadingSpinner
  }
}

// Enhanced lazy loading with retry logic
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyWrapperOptions = {}
) {
  const {
    loading: LoadingComponent,
    error: ErrorComponent,
    loadingProps = {},
    retryCount = 3,
    retryDelay = 1000,
    skeletonType = 'spinner',
    skeletonProps = {}
  } = options
  
  // Determine the loading component to use
  const FinalLoadingComponent = LoadingComponent || createSkeletonComponent(skeletonType, skeletonProps)
  
  // Create a wrapper for the import function with retry logic
  const importWithRetry = async (attempt = 1): Promise<{ default: T }> => {
    try {
      return await importFn()
    } catch (error) {
      if (attempt < retryCount) {
        console.warn(`Lazy loading attempt ${attempt} failed, retrying in ${retryDelay}ms...`, error)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return importWithRetry(attempt + 1)
      }
      throw error
    }
  }
  
  const LazyComponent = React.lazy(importWithRetry)
  
  // Return wrapped component with Suspense and Error Boundary
  const WrappedComponent = (props: any) => (
    <LazyErrorBoundary fallback={ErrorComponent}>
      <Suspense fallback={<FinalLoadingComponent {...loadingProps} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  )
  
  return WrappedComponent
}

// Preload utility for better UX
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): Promise<{ default: T }> {
  return importFn()
}

// Hook for conditional preloading
export function usePreloadOnHover<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  enabled = true
) {
  const [isPreloaded, setIsPreloaded] = React.useState(false)
  
  const preload = React.useCallback(() => {
    if (!enabled || isPreloaded) return
    
    preloadComponent(importFn)
      .then(() => setIsPreloaded(true))
      .catch(error => console.warn('Preload failed:', error))
  }, [importFn, enabled, isPreloaded])
  
  return {
    onMouseEnter: preload,
    onFocus: preload,
    isPreloaded
  }
}

// Hook for intersection-based preloading
export function usePreloadOnIntersection<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: IntersectionObserverInit = {}
) {
  const [isPreloaded, setIsPreloaded] = React.useState(false)
  const elementRef = React.useRef<HTMLElement>(null)
  
  React.useEffect(() => {
    const element = elementRef.current
    if (!element || isPreloaded) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadComponent(importFn)
            .then(() => setIsPreloaded(true))
            .catch(error => console.warn('Intersection preload failed:', error))
          observer.disconnect()
        }
      },
      { threshold: 0.1, ...options }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [importFn, isPreloaded, options])
  
  return {
    ref: elementRef,
    isPreloaded
  }
}

// Utility functions for specific festival components
export function createLazyBandComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: Omit<LazyWrapperOptions, 'skeletonType'> = {}
) {
  return createLazyComponent(importFn, {
    ...options,
    skeletonType: 'band-card',
    skeletonProps: {
      count: 6,
      ...options.skeletonProps
    }
  })
}

export function createLazyProgramComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: Omit<LazyWrapperOptions, 'skeletonType'> = {}
) {
  return createLazyComponent(importFn, {
    ...options,
    skeletonType: 'section',
    skeletonProps: {
      content: 'program',
      title: true,
      filters: true,
      ...options.skeletonProps
    }
  })
}

export function createLazyPageComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: Omit<LazyWrapperOptions, 'skeletonType'> = {}
) {
  return createLazyComponent(importFn, {
    ...options,
    skeletonType: 'page',
    skeletonProps: {
      header: true,
      content: 'bands',
      ...options.skeletonProps
    }
  })
}

// Utility for creating route-based lazy components
export function createLazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  routeName: string
) {
  return createLazyComponent(importFn, {
    loadingProps: {
      message: `Carregando ${routeName}...`,
      size: 'lg'
    }
  })
}