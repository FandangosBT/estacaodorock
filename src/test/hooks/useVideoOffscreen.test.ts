import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVideoOffscreen } from '@/utils/performance'
import { createMockIntersectionObserver } from '../test-utils'

// Mock video element with play/pause methods
const createMockVideoElement = (initialPaused = true) => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  paused: initialPaused,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as any)

describe('useVideoOffscreen', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockUnobserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let observerCallback: IntersectionObserverCallback

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create controllable IntersectionObserver mock
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockDisconnect = vi.fn()

    global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with isVisible false', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    const { result } = renderHook(() => useVideoOffscreen(videoRef))

    expect(result.current.isVisible).toBe(false)
  })

  it('should create IntersectionObserver with default options', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    renderHook(() => useVideoOffscreen(videoRef))

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '0px', threshold: 0.1 }
    )
    expect(mockObserve).toHaveBeenCalledWith(videoElement)
  })

  it('should create IntersectionObserver with custom options', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }
    const options = {
      rootMargin: '50px',
      threshold: 0.5,
    }

    renderHook(() => useVideoOffscreen(videoRef, options))

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '50px', threshold: 0.5 }
    )
  })

  it('should not create observer when videoRef.current is null', () => {
    const videoRef = { current: null }

    renderHook(() => useVideoOffscreen(videoRef))

    expect(global.IntersectionObserver).not.toHaveBeenCalled()
    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('should update isVisible when video enters viewport', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    const { result } = renderHook(() => useVideoOffscreen(videoRef))

    expect(result.current.isVisible).toBe(false)

    // Simulate video entering viewport
    const mockEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([mockEntry], {} as IntersectionObserver)
    })

    expect(result.current.isVisible).toBe(true)
  })

  it('should update isVisible when video leaves viewport', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    const { result } = renderHook(() => useVideoOffscreen(videoRef))

    // First, set video as visible
    const enterMockEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enterMockEntry], {} as IntersectionObserver)
    })

    expect(result.current.isVisible).toBe(true)

    // Then simulate leaving viewport
    const exitMockEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitMockEntry], {} as IntersectionObserver)
    })

    expect(result.current.isVisible).toBe(false)
  })

  it('should resume video when entering viewport if resumeWhenVisible is true (default)', () => {
    const videoElement = createMockVideoElement(true) // paused initially
    const videoRef = { current: videoElement }

    renderHook(() => useVideoOffscreen(videoRef))

    // First enter viewport to set isVisible = true
    const enter1 = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enter1], {} as IntersectionObserver)
    })

    // Then leave viewport while playing to set wasPlayingRef = true
    videoElement.paused = false
    const exitEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitEntry], {} as IntersectionObserver)
    })

    // Video should be paused after leaving
    expect(videoElement.pause).toHaveBeenCalled()

    // Reset paused state to allow play()
    videoElement.paused = true

    // Now enter viewport again and expect resume
    const enter2 = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enter2], {} as IntersectionObserver)
    })

    expect(videoElement.play).toHaveBeenCalled()
  })

  it('should pause video when leaving viewport if pauseWhenOffscreen is true (default)', () => {
    const videoElement = createMockVideoElement(false) // playing initially
    const videoRef = { current: videoElement }

    renderHook(() => useVideoOffscreen(videoRef))

    // First set as visible
    const enterEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enterEntry], {} as IntersectionObserver)
    })

    // Then leave viewport
    const exitEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitEntry], {} as IntersectionObserver)
    })

    expect(videoElement.pause).toHaveBeenCalled()
  })

  it('should not pause video when leaving viewport if pauseWhenOffscreen is false', () => {
    const videoElement = createMockVideoElement(false) // playing initially
    const videoRef = { current: videoElement }

    renderHook(() => 
      useVideoOffscreen(videoRef, { pauseWhenOffscreen: false })
    )

    // First set as visible
    const enterEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enterEntry], {} as IntersectionObserver)
    })

    // Then leave viewport
    const exitEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitEntry], {} as IntersectionObserver)
    })

    expect(videoElement.pause).not.toHaveBeenCalled()
  })

  it('should not resume video when entering viewport if resumeWhenVisible is false', () => {
    const videoElement = createMockVideoElement(true) // paused initially
    const videoRef = { current: videoElement }

    renderHook(() => 
      useVideoOffscreen(videoRef, { resumeWhenVisible: false })
    )

    // Simulate entering viewport
    const enterEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enterEntry], {} as IntersectionObserver)
    })

    expect(videoElement.play).not.toHaveBeenCalled()
  })

  it('should not pause already paused video', () => {
    const videoElement = createMockVideoElement(true) // already paused
    const videoRef = { current: videoElement }

    renderHook(() => useVideoOffscreen(videoRef))

    // First set as visible
    const enterEntry = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enterEntry], {} as IntersectionObserver)
    })

    // Then leave viewport
    const exitEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitEntry], {} as IntersectionObserver)
    })

    expect(videoElement.pause).not.toHaveBeenCalled()
  })

  it('should handle play() promise rejection gracefully', () => {
    const videoElement = createMockVideoElement(true)
    // Make play() reject
    videoElement.play.mockRejectedValue(new Error('Autoplay policy violation'))
    const videoRef = { current: videoElement }

    renderHook(() => useVideoOffscreen(videoRef))

    // Enter viewport first
    const enter1 = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([enter1], {} as IntersectionObserver)
    })

    // Then leave viewport while playing to set wasPlayingRef = true
    videoElement.paused = false
    const exitEntry = {
      isIntersecting: false,
      target: videoElement,
    } as IntersectionObserverEntry

    act(() => {
      observerCallback([exitEntry], {} as IntersectionObserver)
    })

    // Now set paused = true and enter again; play() will reject but should not throw
    videoElement.paused = true
    const enter2 = {
      isIntersecting: true,
      target: videoElement,
    } as IntersectionObserverEntry

    expect(() => {
      act(() => {
        observerCallback([enter2], {} as IntersectionObserver)
      })
    }).not.toThrow()

    expect(videoElement.play).toHaveBeenCalled()
  })

  it('should disconnect observer on unmount', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    const { unmount } = renderHook(() => useVideoOffscreen(videoRef))

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should recreate observer when options change', () => {
    const videoElement = createMockVideoElement()
    const videoRef = { current: videoElement }

    const { rerender } = renderHook(
      ({ options }) => useVideoOffscreen(videoRef, options),
      { 
        initialProps: { 
          options: { rootMargin: '0px', threshold: 0.1 } 
        } 
      }
    )

    expect(mockDisconnect).toHaveBeenCalledTimes(0)
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1)

    // Change options
    rerender({ 
      options: { rootMargin: '50px', threshold: 0.5 } 
    })

    expect(mockDisconnect).toHaveBeenCalledTimes(1)
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(2)
  })
})