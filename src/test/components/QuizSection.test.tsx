import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { cleanup as cleanupPure } from '@testing-library/react/pure'
import userEvent from '@testing-library/user-event'
import { QuizSection } from '@/components/QuizSection'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: vi.fn()
}))

let mockShare: ReturnType<typeof vi.fn>
let mockWriteText: ReturnType<typeof vi.fn>

// Helper: clica no último botão que corresponde ao nome (lida com duplicatas de transição)
async function clickLastByRoleName(user: ReturnType<typeof userEvent.setup>, name: RegExp) {
  await waitFor(() => {
    const matches = screen.getAllByRole('button', { name })
    expect(matches.length).toBeGreaterThan(0)
  })
  const matches = screen.getAllByRole('button', { name })
  await user.click(matches[matches.length - 1])
}

// Espera utilitária para transições
const waitMs = (ms: number) => new Promise(res => setTimeout(res, ms))

// Helper para completar o quiz até o resultado "CLÁSSICO ATEMPORAL"
async function completeClassicResultFlow(user: ReturnType<typeof userEvent.setup>) {
  // Padrões para clicar sempre na opção CLÁSSICA de cada pergunta
  const classicOptionPatterns: RegExp[] = [
    /Fechei os olhos e cantei junto com o solo/i, // Q1 classic
    /Freddie Mercury \(Queen\)/i, // Q2 classic
    /Harmonia e composição melódica/i, // Q3 classic
    /Ela precisa contar uma história em ordem/i, // Q4 classic
    /Uma arte de composição e performance/i, // Q5 classic
    /Banda com arranjos épicos e performance vocal intensa/i, // Q6 classic
    /Num toca-discos analógico com capa na mão/i, // Q7 classic
    /sabe que toda boa música é atemporal/i, // Q8 classic
  ]

  // Garantir que estamos prontos: a primeira opção clássica deve estar presente
  await screen.findAllByRole('button', { name: classicOptionPatterns[0] }, { timeout: 7000 })

  for (let i = 0; i < classicOptionPatterns.length; i++) {
    // Clicar na opção clássica da pergunta i
    await clickLastByRoleName(user, classicOptionPatterns[i])

    // Dar tempo para a transição antes de buscar a próxima pergunta
    await waitMs(350)

    if (i < classicOptionPatterns.length - 1) {
      // Aguardar que uma opção da próxima pergunta esteja disponível (a clássica da próxima)
      await screen.findAllByRole('button', { name: classicOptionPatterns[i + 1] }, { timeout: 7000 })
    }
  }

  // Aguardar que a tela de resultado esteja pronta (botão SHARE presente)
  await screen.findByRole('button', { name: 'SHARE' }, { timeout: 15000 })

  // E então validar o título do resultado
  await screen.findByText('CLÁSSICO ATEMPORAL', {}, { timeout: 15000 })
}

describe('QuizSection', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.clearAllMocks()
    user = userEvent.setup()
    
    // Definir mocks de navegador por teste para evitar state bleed
    mockShare = vi.fn()
    mockWriteText = vi.fn()
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    cleanupPure()
  })

  it('should render the first question', () => {
    const { getByText, getByRole } = render(<QuizSection />)
    
    expect(getByText('Qual frase mais representa seu estado de espírito em um show?')).toBeInTheDocument()
    expect(getByRole('button', { name: /Perdi a noção do tempo/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /Entrei no pogo/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /O grave bateu no peito/i })).toBeInTheDocument()
    expect(getByRole('button', { name: /Fechei os olhos e cantei/i })).toBeInTheDocument()
  })

  it('should show progress bar with correct initial values', () => {
    const { getByText } = render(<QuizSection />)
    
    expect(getByText('1/8')).toBeInTheDocument()
    expect(getByText('PROGRESSO')).toBeInTheDocument()
  })

  it('should advance to next question when an option is selected', async () => {
    render(<QuizSection />)
    
    // Click on first option
    await clickLastByRoleName(user, /Perdi a noção do tempo/i)
    
    // Wait for animation and state update
    await waitFor(() => {
      expect(screen.getByText('Com quem você teria uma conversa de bar?')).toBeInTheDocument()
    })
    
    // Progress should update
    expect(screen.getByText('2/8')).toBeInTheDocument()
  })

  it('should show question indicators and update them correctly', async () => {
    const { container } = render(<QuizSection />)
    
    // Initially, indicators equals questions length
    const indicators = container.querySelectorAll('.tape-indicator')
    expect(indicators).toHaveLength(8)
    
    // Answer first question
    await clickLastByRoleName(user, /Perdi a noção do tempo/i)
    
    await waitFor(() => {
      expect(screen.getByText('Com quem você teria uma conversa de bar?')).toBeInTheDocument()
    })
  })

  it('should complete the quiz and show result after answering all questions', async () => {
    const { toast } = await import('sonner')
    render(<QuizSection />)
    
    // Answer all questions to get a deterministic result (classic)
    await clickLastByRoleName(user, /Fechei os olhos e cantei junto com o solo/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Freddie Mercury \(Queen\)/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Harmonia e composição melódica/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Ela precisa contar uma história em ordem/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Uma arte de composição e performance/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Banda com arranjos épicos e performance vocal intensa/i)
    await waitMs(350)
    await clickLastByRoleName(user, /Num toca-discos analógico com capa na mão/i)
    await waitMs(350)
    await clickLastByRoleName(user, /sabe que toda boa música é atemporal/i)
    
    // Should show result
    await screen.findByRole('button', { name: 'SHARE' }, { timeout: 15000 })
    expect(screen.getByText('CLÁSSICO ATEMPORAL')).toBeInTheDocument()
    
    expect(toast).toHaveBeenCalledWith('Quiz concluído! 🎉', {
      description: 'Descubra seu arquétipo roqueiro no festival',
    })

    // sanity: result action buttons visíveis
    expect(screen.getByRole('button', { name: 'SHARE' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'REFAZER' })).toBeInTheDocument()
  })

  it('should display result traits correctly', async () => {
    render(<QuizSection />)
    
    // Complete quiz to get classic result
    await completeClassicResultFlow(user)
    
    await waitFor(() => {
      expect(screen.getByText('Clássico')).toBeInTheDocument()
      expect(screen.getByText('Sábio')).toBeInTheDocument()
      expect(screen.getByText('Atemporal')).toBeInTheDocument()
      expect(screen.getByText('Tradicionalista')).toBeInTheDocument()
    })
  }, 15000)

  it('should share result when share button is clicked', async () => {
    render(<QuizSection />)
    
    // Completar quiz para obter resultado clássico
    await completeClassicResultFlow(user)
    
    const shareButton = await screen.findByRole('button', { name: 'SHARE' })
    await user.click(shareButton)
    
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Meu Resultado - Festival de Rock 2025',
      text: expect.stringContaining('Descobri que sou um CLÁSSICO ATEMPORAL!'),
      url: window.location.href
    })
  }, 15000)

  it('should copy to clipboard when navigator.share is not available', async () => {
    const { toast } = await import('sonner')
    // Temporariamente remove navigator.share
    const originalShare = navigator.share as any
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    
    render(<QuizSection />)
    
    // Completar quiz para obter clássico
    await completeClassicResultFlow(user)
    
    const shareButton = await screen.findByRole('button', { name: 'SHARE' })
    await user.click(shareButton)
    
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining('Descobri que sou um CLÁSSICO ATEMPORAL!')
    )
    
    expect(toast).toHaveBeenCalledWith('Resultado copiado!', {
      description: 'Cole onde quiser para compartilhar'
    })
    
    // Restaurar navigator.share
    Object.defineProperty(navigator, 'share', { value: originalShare, writable: true, configurable: true })
  }, 15000)

  it('should reset quiz when "REFAZER" button is clicked', async () => {
    render(<QuizSection />)
    
    // Completar quiz até o resultado
    await completeClassicResultFlow(user)
    
    // Clicar em refazer e aguardar retornar à primeira pergunta
    const resetButton = screen.getByRole('button', { name: 'REFAZER' })
    await user.click(resetButton)
    
    await waitFor(() => {
      expect(screen.getByText('Qual frase mais representa seu estado de espírito em um show?')).toBeInTheDocument()
      expect(screen.getByText('1/8')).toBeInTheDocument()
    })
  }, 15000)

  it('should render 5 stars in the result', async () => {
    const { container } = render(<QuizSection />)
    
    // Completar quiz até o resultado
    await completeClassicResultFlow(user)
    
    await waitFor(() => {
      // Deve possuir 5 ícones de estrela com classe Lucide
      const stars = container.querySelectorAll('svg[class*="lucide-star"]')
      expect(stars).toHaveLength(5)
    })
  }, 15000)

  it('should show correct result description', async () => {
    render(<QuizSection />)
    
    // Completar quiz até o resultado
    await completeClassicResultFlow(user)
    
    await waitFor(() => {
      expect(screen.getByText(/Você é guardião da essência do rock!/)).toBeInTheDocument()
    })
  }, 15000)
})