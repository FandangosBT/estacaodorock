import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { cleanup as cleanupPure } from '@testing-library/react/pure'
import { useDevicePerformance } from '@/utils/performance'

// Extended Navigator interface for testing
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

describe('useDevicePerformance', () => {
  let originalNavigator: Navigator
  let originalWindow: Window & typeof globalThis

  beforeEach(() => {
    originalNavigator = global.navigator
    originalWindow = global.window
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore globals
    global.navigator = originalNavigator
    global.window = originalWindow
    // Use pure cleanup to avoid act nesting issues
    cleanupPure()
  })

  it('should detect low-end device when deviceMemory <= 4GB', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 2,
      hardwareConcurrency: 8,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(true)
    expect(result.current.deviceInfo.memory).toBe(2)
    expect(result.current.deviceInfo.cores).toBe(8)
    expect(result.current.deviceInfo.saveData).toBe(false)
  })

  it('should detect low-end device when hardwareConcurrency <= 4 cores', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 8,
      hardwareConcurrency: 2,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(true)
    expect(result.current.deviceInfo.memory).toBe(8)
    expect(result.current.deviceInfo.cores).toBe(2)
    expect(result.current.deviceInfo.saveData).toBe(false)
  })

  it('should detect low-end device when Save-Data is enabled', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      connection: { saveData: true }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(true)
    expect(result.current.deviceInfo.memory).toBe(8)
    expect(result.current.deviceInfo.cores).toBe(8)
    expect(result.current.deviceInfo.saveData).toBe(true)
  })

  it('should detect high-end device when all criteria are above thresholds', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(false)
    expect(result.current.deviceInfo.memory).toBe(8)
    expect(result.current.deviceInfo.cores).toBe(8)
    expect(result.current.deviceInfo.saveData).toBe(false)
  })

  it('should handle missing navigator properties gracefully', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator
      // No deviceMemory, hardwareConcurrency, or connection
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(false) // Default to false when no data available
    expect(result.current.deviceInfo.memory).toBeUndefined()
    expect(result.current.deviceInfo.cores).toBeUndefined()
    expect(result.current.deviceInfo.saveData).toBe(false)
  })

  it('should handle missing connection object gracefully', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 8,
      hardwareConcurrency: 8,
      connection: undefined
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(false)
    expect(result.current.deviceInfo.memory).toBe(8)
    expect(result.current.deviceInfo.cores).toBe(8)
    expect(result.current.deviceInfo.saveData).toBe(false)
    expect(result.current.deviceInfo.connection).toBeUndefined()
  })

  // SSR behavior relies on window being undefined, which is incompatible with jsdom/react-dom rendering.
  // We document the expected behavior but skip in this environment.
  ;((typeof window === 'undefined') ? it : it.skip)('should handle server-side rendering (no window)', () => {
    // Simulate SSR by removing window (only runs when window is actually undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).window = undefined

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(false)
    expect(result.current.deviceInfo).toEqual({})
  })

  it('should return boundary conditions as low-end exactly at thresholds', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 4,
      hardwareConcurrency: 4,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(true) // <= 4 should be low-end
  })

  it('should return high-end when above thresholds', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 6,
      hardwareConcurrency: 6,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(false)
  })

  it('should provide consistent results on multiple renders', () => {
    const mockNav: ExtendedNavigator = {
      ...originalNavigator,
      deviceMemory: 2,
      hardwareConcurrency: 2,
      connection: { saveData: false }
    }
    global.navigator = mockNav as any

    const { result, rerender } = renderHook(() => useDevicePerformance())

    expect(result.current.isLowEnd).toBe(true)
    expect(result.current.deviceInfo.memory).toBe(2)

    // Rerender should give consistent results (hook values are computed on mount)
    rerender()
    
    expect(result.current.isLowEnd).toBe(true)
    expect(result.current.deviceInfo.memory).toBe(2)
  })
})