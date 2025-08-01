import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { QuizSection } from '@/components/QuizSection'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: vi.fn()
}))

// Mock window.open
const mockWindowOpen = vi.fn()
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
})

// Mock navigator.share and navigator.clipboard
const mockShare = vi.fn()
const mockWriteText = vi.fn()
Object.defineProperty(navigator, 'share', {
  value: mockShare,
  writable: true
})
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true
})

describe('QuizSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the quiz title and description', () => {
    render(<QuizSection />)
    
    expect(screen.getByText('Quiz Rock')).toBeInTheDocument()
    expect(screen.getByText('Descubra que tipo de roqueiro você é e ganhe um cupom exclusivo!')).toBeInTheDocument()
  })

  it('should render the first question', () => {
    render(<QuizSection />)
    
    expect(screen.getByText('Qual é a sua banda de rock favorita?')).toBeInTheDocument()
    expect(screen.getByText('🎸 Metallica')).toBeInTheDocument()
    expect(screen.getByText('⚡ AC/DC')).toBeInTheDocument()
    expect(screen.getByText('🔥 Foo Fighters')).toBeInTheDocument()
    expect(screen.getByText('🎭 My Chemical Romance')).toBeInTheDocument()
  })

  it('should show progress bar with correct initial values', () => {
    render(<QuizSection />)
    
    expect(screen.getByText('1/4')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
  })

  it('should advance to next question when an option is selected', async () => {
    render(<QuizSection />)
    
    // Click on first option
    fireEvent.click(screen.getByText('🎸 Metallica'))
    
    // Wait for animation and state update
    await waitFor(() => {
      expect(screen.getByText('Como você curte um show de rock?')).toBeInTheDocument()
    })
    
    // Progress should update
    expect(screen.getByText('2/4')).toBeInTheDocument()
  })

  it('should show question indicators and update them correctly', async () => {
    render(<QuizSection />)
    
    // Initially, first indicator should be active
    const indicators = screen.getAllByRole('generic').filter(el => 
      el.className.includes('w-3 h-3 rounded-full')
    )
    expect(indicators).toHaveLength(4)
    
    // Answer first question
    fireEvent.click(screen.getByText('🎸 Metallica'))
    
    await waitFor(() => {
      expect(screen.getByText('Como você curte um show de rock?')).toBeInTheDocument()
    })
  })

  it('should complete the quiz and show result after answering all questions', async () => {
    const { toast } = await import('sonner')
    render(<QuizSection />)
    
    // Answer all questions to get "classic" result
    fireEvent.click(screen.getByText('🎸 Metallica'))
    
    await waitFor(() => {
      expect(screen.getByText('Como você curte um show de rock?')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja'))
    
    await waitFor(() => {
      expect(screen.getByText('Qual instrumento te representa?')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('🎸 Guitarra elétrica'))
    
    await waitFor(() => {
      expect(screen.getByText('Seu estilo de rock preferido:')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('🌟 Rock Clássico'))
    
    // Should show result
    await waitFor(() => {
      expect(screen.getByText('Roqueiro Clássico')).toBeInTheDocument()
    })
    
    expect(toast).toHaveBeenCalledWith('Quiz concluído! 🎉', {
      description: 'Descubra que tipo de roqueiro você é!'
    })
  })

  it('should show correct result based on answers', async () => {
    render(<QuizSection />)
    
    // Answer questions to get "hardcore" result
    fireEvent.click(screen.getByText('🎸 Metallica'))
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('🤘 Na primeira fileira gritando'))
    })
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('🥁 Bateria'))
    })
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('⚫ Heavy Metal'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Roqueiro Clássico')).toBeInTheDocument()
      expect(screen.getByText('🎸')).toBeInTheDocument()
      expect(screen.getByText('CLASSIC20')).toBeInTheDocument()
    })
  })

  it('should display result traits correctly', async () => {
    render(<QuizSection />)
    
    // Complete quiz to get classic result
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      expect(screen.getByText('Nostálgico')).toBeInTheDocument()
      expect(screen.getByText('Autêntico')).toBeInTheDocument()
      expect(screen.getByText('Tradicionalista')).toBeInTheDocument()
      expect(screen.getByText('Apaixonado por história')).toBeInTheDocument()
    })
  })

  it('should show coupon section in result', async () => {
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      expect(screen.getByText('🎫 Seu Cupom Exclusivo')).toBeInTheDocument()
      expect(screen.getByText('CLASSIC20')).toBeInTheDocument()
      expect(screen.getByText('Use este cupom para ganhar desconto nos ingressos!')).toBeInTheDocument()
    })
  })

  it('should open WhatsApp when redeem coupon button is clicked', async () => {
    const { toast } = await import('sonner')
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      const redeemButton = screen.getByText('Resgatar no WhatsApp')
      fireEvent.click(redeemButton)
    })
    
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/?text='),
      '_blank'
    )
    
    expect(toast).toHaveBeenCalledWith('Cupom enviado para WhatsApp! 🎫', {
      description: 'Resgate seu desconto agora mesmo'
    })
  })

  it('should share result when share button is clicked', async () => {
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      const shareButton = screen.getByText('Compartilhar Resultado')
      fireEvent.click(shareButton)
    })
    
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Meu Resultado - Festival de Rock 2025',
      text: expect.stringContaining('Descobri que sou um Roqueiro Clássico!'),
      url: window.location.href
    })
  })

  it('should copy to clipboard when navigator.share is not available', async () => {
    const { toast } = await import('sonner')
    // Temporarily remove navigator.share
    const originalShare = navigator.share
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true
    })
    
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      const shareButton = screen.getByText('Compartilhar Resultado')
      fireEvent.click(shareButton)
    })
    
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining('Descobri que sou um Roqueiro Clássico!')
    )
    
    expect(toast).toHaveBeenCalledWith('Resultado copiado!', {
      description: 'Cole onde quiser para compartilhar'
    })
    
    // Restore navigator.share
    navigator.share = originalShare
  })

  it('should reset quiz when "Fazer Novamente" button is clicked', async () => {
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      const resetButton = screen.getByText('Fazer Novamente')
      fireEvent.click(resetButton)
    })
    
    // Should be back to first question
    expect(screen.getByText('Qual é a sua banda de rock favorita?')).toBeInTheDocument()
    expect(screen.getByText('1/4')).toBeInTheDocument()
  })

  it('should render 5 stars in the result', async () => {
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      // Should have 5 star icons
      const stars = document.querySelectorAll('.lucide-star')
      expect(stars).toHaveLength(5)
    })
  })

  it('should show correct result description', async () => {
    render(<QuizSection />)
    
    // Complete quiz
    fireEvent.click(screen.getByText('🎸 Metallica'))
    await waitFor(() => fireEvent.click(screen.getByText('🍺 Relaxando com uma cerveja')))
    await waitFor(() => fireEvent.click(screen.getByText('🎸 Guitarra elétrica')))
    await waitFor(() => fireEvent.click(screen.getByText('🌟 Rock Clássico')))
    
    await waitFor(() => {
      expect(screen.getByText(/Você é um verdadeiro conhecedor dos clássicos!/)).toBeInTheDocument()
    })
  })
})