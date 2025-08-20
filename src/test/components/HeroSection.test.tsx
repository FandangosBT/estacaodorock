import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen } from '../test-utils'
import { cleanup } from '@testing-library/react'
import HeroSection from '@/components/HeroSection'

// Mocks
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<any>('framer-motion')
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false)
  }
})

vi.mock('@/utils/performance', () => {
  return {
    useVideoOffscreen: vi.fn(),
    useDevicePerformance: vi.fn(() => ({ isLowEnd: false }))
  }
})

// Helpers to get mocked fns with typing
import { useReducedMotion } from 'framer-motion'
import { useVideoOffscreen, useDevicePerformance } from '@/utils/performance'

describe('HeroSection (vídeos e performance)', () => {
  beforeEach(() => {
    // Isolar DOM entre testes, pois o projeto desativa o cleanup automático
    cleanup()
    vi.clearAllMocks()
    ;(useReducedMotion as unknown as Mock).mockReturnValue(false)
    ;(useDevicePerformance as unknown as Mock).mockReturnValue({ isLowEnd: false })
  })

  it('deve renderizar os dois elementos de vídeo (fundo e principal)', () => {
    const { container } = render(<HeroSection />)

    // Vídeo principal identificado por aria-label/título
    const mainVideo = screen.getByLabelText('Vídeo do lineup do Estação Rock 2025')
    expect(mainVideo).toBeInTheDocument()
    expect(mainVideo).toHaveAttribute('title', 'Lineup Estação Rock 2025')

    // Deve haver 2 <video> no total: fundo + principal
    const videos = container.querySelectorAll('video')
    expect(videos.length).toBe(2)
  })

  it('deve configurar autoplay/loop/muted corretamente quando não há preferência de redução de movimento e device não é low-end', () => {
    const { container } = render(<HeroSection />)

    const videos = Array.from(container.querySelectorAll('video'))
    expect(videos.length).toBe(2)

    // Ambos os vídeos devem estar com autoplay e loop ativos; o principal também é muted
    // Boolean attributes aparecem como atributo presente (string vazia) em JSDOM
    videos.forEach((v) => {
      expect(v).toHaveAttribute('autoplay')
      expect(v).toHaveAttribute('loop')
      expect(v).toHaveAttribute('playsinline')
    })

    const mainVideo = screen.getByLabelText('Vídeo do lineup do Estação Rock 2025') as HTMLVideoElement
    // Verificar via propriedade booleana para maior robustez em JSDOM
    expect(mainVideo.muted).toBe(true)
    expect(mainVideo.getAttribute('poster')).toBe('/station.png')

    // Fonte do vídeo principal
    const source = mainVideo.querySelector('source')
    expect(source).toBeTruthy()
    expect(source?.getAttribute('src')).toBe('/video/LINEUP2.mp4')
    expect(source?.getAttribute('type')).toBe('video/mp4')
  })

  it('deve desativar autoplay e loop quando useReducedMotion retornar true', () => {
    ;(useReducedMotion as unknown as Mock).mockReturnValue(true)

    const { container } = render(<HeroSection />)
    const mainVideo = screen.getByLabelText('Vídeo do lineup do Estação Rock 2025')

    // Com reduced motion, autoplay/loop não devem estar presentes no principal
    expect(mainVideo).not.toHaveAttribute('autoplay')
    expect(mainVideo).not.toHaveAttribute('loop')

    // E controles devem estar visíveis (controls presente)
    expect(mainVideo).toHaveAttribute('controls')

    // O de fundo também não deve ter autoplay/loop
    const videos = Array.from(container.querySelectorAll('video')).filter(v => v !== mainVideo)
    const bgVideo = videos[0]
    expect(bgVideo).not.toHaveAttribute('autoplay')
    expect(bgVideo).not.toHaveAttribute('loop')
  })

  it('deve habilitar controles quando o device for low-end', () => {
    ;(useDevicePerformance as unknown as Mock).mockReturnValue({ isLowEnd: true })

    render(<HeroSection />)

    const mainVideo = screen.getByLabelText('Vídeo do lineup do Estação Rock 2025')
    expect(mainVideo).toHaveAttribute('controls')
  })

  it('deve invocar useVideoOffscreen para ambos os vídeos com opções corretas', () => {
    const spy = useVideoOffscreen as unknown as Mock

    render(<HeroSection />)

    // Duas invocações: fundo (rootMargin 100px) e principal (rootMargin 50px)
    expect(spy).toHaveBeenCalledTimes(2)

    const margins = (spy as any).mock.calls.map(([, options]: any[]) => options?.rootMargin)
    expect(margins).toContain('100px')
    expect(margins).toContain('50px')

    const flags = (spy as any).mock.calls.map(([, options]: any[]) => ({
      pauseWhenOffscreen: options?.pauseWhenOffscreen,
      resumeWhenVisible: options?.resumeWhenVisible,
    }))

    flags.forEach((f: any) => {
      expect(f.pauseWhenOffscreen).toBe(true)
      expect(f.resumeWhenVisible).toBe(true)
    })
  })
})