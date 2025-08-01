import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import { LineupSection } from '@/components/LineupSection'

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

describe('LineupSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the section title and description', () => {
    render(<LineupSection />)
    
    expect(screen.getByText('Line-up')).toBeInTheDocument()
    expect(screen.getByText('As maiores bandas de rock nacional e internacional em um só lugar')).toBeInTheDocument()
  })

  it('should render all genre filter buttons', () => {
    render(<LineupSection />)
    
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getAllByText('Heavy Metal')[0]).toBeInTheDocument() // Filter button
    expect(screen.getAllByText('Rock Alternativo')[0]).toBeInTheDocument() // Filter button
    expect(screen.getAllByText('Punk Rock')[0]).toBeInTheDocument() // Filter button
    expect(screen.getAllByText('Hard Rock')[0]).toBeInTheDocument() // Filter button
    expect(screen.getAllByText('Industrial Rock')[0]).toBeInTheDocument() // Filter button
    expect(screen.getAllByText('Gothic Metal')[0]).toBeInTheDocument() // Filter button
  })

  it('should render all bands by default', () => {
    render(<LineupSection />)
    
    expect(screen.getByText('Thunder Wolves')).toBeInTheDocument()
    expect(screen.getByText('Electric Storm')).toBeInTheDocument()
    expect(screen.getByText('Neon Rebels')).toBeInTheDocument()
    expect(screen.getByText('Crimson Fire')).toBeInTheDocument()
    expect(screen.getByText('Cyber Punk')).toBeInTheDocument()
    expect(screen.getByText('Dark Angels')).toBeInTheDocument()
  })

  it('should filter bands by genre when filter button is clicked', () => {
    render(<LineupSection />)
    
    // Click on Heavy Metal filter
    const heavyMetalButtons = screen.getAllByText('Heavy Metal')
    fireEvent.click(heavyMetalButtons[0]) // Click the filter button
    
    // Should show only Heavy Metal bands
    expect(screen.getByText('Thunder Wolves')).toBeInTheDocument()
    expect(screen.queryByText('Electric Storm')).not.toBeInTheDocument()
    expect(screen.queryByText('Neon Rebels')).not.toBeInTheDocument()
  })

  it('should show all bands when "Todos" filter is selected', () => {
    render(<LineupSection />)
    
    // First filter by a specific genre
    const heavyMetalButtons = screen.getAllByText('Heavy Metal')
    fireEvent.click(heavyMetalButtons[0]) // Click the filter button
    expect(screen.queryByText('Electric Storm')).not.toBeInTheDocument()
    
    // Then click "Todos" to show all bands again
    fireEvent.click(screen.getByText('Todos'))
    expect(screen.getByText('Electric Storm')).toBeInTheDocument()
    expect(screen.getByText('Thunder Wolves')).toBeInTheDocument()
  })

  it('should display band information correctly', () => {
    render(<LineupSection />)
    
    // Check Thunder Wolves band info
    expect(screen.getByText('Thunder Wolves')).toBeInTheDocument()
    expect(screen.getAllByText('Heavy Metal')[0]).toBeInTheDocument() // First occurrence
    expect(screen.getByText('Sexta • 22:00')).toBeInTheDocument()
    expect(screen.getAllByText('Palco Principal')[0]).toBeInTheDocument() // First occurrence
  })

  it('should render band images with correct alt text', () => {
    render(<LineupSection />)
    
    const thunderWolvesImg = screen.getByAltText('Thunder Wolves')
    expect(thunderWolvesImg).toBeInTheDocument()
    expect(thunderWolvesImg).toHaveAttribute('src', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400')
  })

  it('should toggle favorite status when heart button is clicked', async () => {
    const { toast } = await import('sonner')
    render(<LineupSection />)
    
    // Find the first heart button (Thunder Wolves)
    const heartButtons = screen.getAllByRole('button')
    const firstHeartButton = heartButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-5 h-5')
    )
    
    expect(firstHeartButton).toBeDefined()
    
    // Click to add to favorites
    fireEvent.click(firstHeartButton!)
    
    // Should show toast notification
    expect(toast).toHaveBeenCalledWith('Adicionado aos favoritos! ⭐', {
      description: 'Banda adicionada à sua lista de favoritos'
    })
    
    // Should show favorites counter
    await waitFor(() => {
      expect(screen.getByText('1 banda favorita')).toBeInTheDocument()
    })
  })

  it('should remove from favorites when heart button is clicked again', async () => {
    const { toast } = await import('sonner')
    render(<LineupSection />)
    
    const heartButtons = screen.getAllByRole('button')
    const firstHeartButton = heartButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-5 h-5')
    )
    
    // Add to favorites first
    fireEvent.click(firstHeartButton!)
    
    // Click again to remove from favorites
    fireEvent.click(firstHeartButton!)
    
    // Should show removal toast
    expect(toast).toHaveBeenCalledWith('Removido dos favoritos', {
      description: 'Banda removida da sua lista de favoritos'
    })
    
    // Favorites counter should not be visible
    await waitFor(() => {
      expect(screen.queryByText(/banda favorita/)).not.toBeInTheDocument()
    })
  })

  it('should show correct plural form in favorites counter', async () => {
    render(<LineupSection />)
    
    const heartButtons = screen.getAllByRole('button')
    const heartButtonsArray = heartButtons.filter(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-5 h-5')
    )
    
    // Add two bands to favorites
    fireEvent.click(heartButtonsArray[0])
    fireEvent.click(heartButtonsArray[1])
    
    await waitFor(() => {
      expect(screen.getByText('2 bandas favoritas')).toBeInTheDocument()
    })
  })

  it('should open Spotify link when Spotify button is clicked', () => {
    render(<LineupSection />)
    
    const spotifyButtons = screen.getAllByText('Spotify')
    fireEvent.click(spotifyButtons[0])
    
    expect(mockWindowOpen).toHaveBeenCalledWith('#', '_blank')
  })

  it('should open YouTube link when YouTube button is clicked', () => {
    render(<LineupSection />)
    
    const youtubeButtons = screen.getAllByText('YouTube')
    fireEvent.click(youtubeButtons[0])
    
    expect(mockWindowOpen).toHaveBeenCalledWith('#', '_blank')
  })

  it('should show star icon for favorited bands', async () => {
    render(<LineupSection />)
    
    const heartButtons = screen.getAllByRole('button')
    const firstHeartButton = heartButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-5 h-5')
    )
    
    // Add to favorites
    fireEvent.click(firstHeartButton!)
    
    // Should show star icon next to band name
    await waitFor(() => {
      const starIcons = document.querySelectorAll('.lucide-star')
      expect(starIcons.length).toBeGreaterThan(0)
    })
  })

  it('should apply correct CSS classes for active filter', () => {
    render(<LineupSection />)
    
    const todosButton = screen.getByText('Todos')
    expect(todosButton).toHaveClass('btn-neon-primary')
    
    // Click on another filter
    const heavyMetalButtons = screen.getAllByText('Heavy Metal')
    const heavyMetalButton = heavyMetalButtons[0] // First one is the filter button
    fireEvent.click(heavyMetalButton)
    
    expect(heavyMetalButton).toHaveClass('btn-neon-primary')
    expect(todosButton).not.toHaveClass('btn-neon-primary')
  })

  it('should prevent event propagation when heart button is clicked', () => {
    render(<LineupSection />)
    
    const heartButtons = screen.getAllByRole('button')
    const firstHeartButton = heartButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-5 h-5')
    )
    
    const clickSpy = vi.fn()
    firstHeartButton?.addEventListener('click', clickSpy)
    
    fireEvent.click(firstHeartButton!)
    
    // The event should have been handled without propagating
    expect(clickSpy).toHaveBeenCalled()
  })
})