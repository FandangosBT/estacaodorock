import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import { HeroSection } from '@/components/HeroSection'

// Mock the AnimatedCanvas component
vi.mock('@/components/AnimatedCanvas', () => ({
  AnimatedCanvas: () => <div data-testid="animated-canvas">Animated Canvas</div>
}))

// Mock the hero image
vi.mock('@/assets/hero-festival.jpg', () => ({
  default: 'mocked-hero-image.jpg'
}))

// Mock scrollIntoView
const mockScrollIntoView = vi.fn()
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true
})

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock getElementById
    const mockElement = { scrollIntoView: mockScrollIntoView }
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any)
  })

  it('should render the main title and year', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Festival de Rock')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('should render the subtitle with event description', () => {
    render(<HeroSection />)
    
    expect(screen.getByText(/A experiência musical mais intensa do ano está chegando/)).toBeInTheDocument()
    expect(screen.getByText(/Prepare-se para três dias de puro rock e energia!/)).toBeInTheDocument()
  })

  it('should display festival stats', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('20+ Bandas')).toBeInTheDocument()
    expect(screen.getByText('3 Palcos')).toBeInTheDocument()
    expect(screen.getByText('50mil+ Pessoas')).toBeInTheDocument()
  })

  it('should render CTA buttons', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Entrar na Experiência')).toBeInTheDocument()
    expect(screen.getByText('Ver Programação')).toBeInTheDocument()
  })

  it('should display event date and location', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('15, 16 e 17 de Agosto')).toBeInTheDocument()
    expect(screen.getByText('São Paulo • Brasil')).toBeInTheDocument()
  })

  it('should render the animated canvas background', () => {
    render(<HeroSection />)
    
    expect(screen.getByTestId('animated-canvas')).toBeInTheDocument()
  })

  it('should render the hero background image', () => {
    render(<HeroSection />)
    
    const heroImg = screen.getByAltText('Festival de Rock 2025')
    expect(heroImg).toBeInTheDocument()
    expect(heroImg).toHaveAttribute('src', 'mocked-hero-image.jpg')
  })

  it('should scroll to lineup section when "Entrar na Experiência" button is clicked', () => {
    render(<HeroSection />)
    
    const experienceButton = screen.getByText('Entrar na Experiência')
    fireEvent.click(experienceButton)
    
    expect(document.getElementById).toHaveBeenCalledWith('lineup')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('should scroll to programacao section when "Ver Programação" button is clicked', () => {
    render(<HeroSection />)
    
    const programacaoButton = screen.getByText('Ver Programação')
    fireEvent.click(programacaoButton)
    
    expect(document.getElementById).toHaveBeenCalledWith('programacao')
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('should render scroll indicator', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Explore')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<HeroSection />)
    
    const heroImg = screen.getByAltText('Festival de Rock 2025')
    expect(heroImg).toHaveAttribute('alt', 'Festival de Rock 2025')
    
    // Check if buttons are properly accessible
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    buttons.forEach(button => {
      expect(button).toBeVisible()
    })
  })

  it('should apply loading animation classes', () => {
    render(<HeroSection />)
    
    // The component should have loaded state applied
    const mainContent = screen.getByText('Festival de Rock').closest('div')
    expect(mainContent).toHaveClass('opacity-100', 'translate-y-0')
  })
})