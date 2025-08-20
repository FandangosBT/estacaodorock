import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../test-utils'
import { GaleriaSection } from '@/components/GaleriaSection'

describe.skip('GaleriaSection', () => {
  beforeEach(() => {
    // Reset any state before each test
  })

  it('should render the section title and description', () => {
    render(<GaleriaSection />)
    
    expect(screen.getByText('GALERIA SOCIAL')).toBeInTheDocument()
    expect(screen.getByText('Compartilhe sua experiência! Envie suas fotos e concorra aos prêmios especiais do festival.')).toBeInTheDocument()
  })

  it('should render the upload button', () => {
    render(<GaleriaSection />)
    
    expect(screen.getByText('Envie sua Selfie!')).toBeInTheDocument()
  })

  it('should display all photos from mock data', () => {
    render(<GaleriaSection />)
    
    // Check if all usernames are displayed
    expect(screen.getByText('@rockfan_2025')).toBeInTheDocument()
    expect(screen.getByText('@metalhead_sp')).toBeInTheDocument()
    expect(screen.getByText('@festival_lover')).toBeInTheDocument()
    expect(screen.getByText('@rocknroll_life')).toBeInTheDocument()
    expect(screen.getByText('@guitar_hero')).toBeInTheDocument()
    expect(screen.getByText('@rock_goddess')).toBeInTheDocument()
  })

  it('should display correct initial like counts', () => {
    render(<GaleriaSection />)
    
    expect(screen.getByText('47')).toBeInTheDocument() // @rockfan_2025
    expect(screen.getByText('23')).toBeInTheDocument() // @metalhead_sp
    expect(screen.getByText('89')).toBeInTheDocument() // @festival_lover
    expect(screen.getAllByText('12')[1]).toBeInTheDocument() // Rockstars do Dia statistic // @rocknroll_life
    expect(screen.getByText('156')).toBeInTheDocument() // @guitar_hero
    expect(screen.getByText('34')).toBeInTheDocument() // @rock_goddess
  })

  it('should display "TOP DA GALERA" badges for top photos', () => {
    render(<GaleriaSection />)
    
    const topBadges = screen.getAllByText('TOP DA GALERA')
    expect(topBadges).toHaveLength(3) // Photos with isTop: true
  })

  it('should display "ROCKSTAR DO DIA" badges for rockstar photos', () => {
    render(<GaleriaSection />)
    
    const rockstarBadges = screen.getAllByText('ROCKSTAR DO DIA')
    expect(rockstarBadges).toHaveLength(3) // Photos with isRockstar: true
  })

  it('should render all photo images with correct alt text', () => {
    render(<GaleriaSection />)
    
    expect(screen.getByAltText('Foto de @rockfan_2025')).toBeInTheDocument()
    expect(screen.getByAltText('Foto de @metalhead_sp')).toBeInTheDocument()
    expect(screen.getByAltText('Foto de @festival_lover')).toBeInTheDocument()
    expect(screen.getByAltText('Foto de @rocknroll_life')).toBeInTheDocument()
    expect(screen.getByAltText('Foto de @guitar_hero')).toBeInTheDocument()
    expect(screen.getByAltText('Foto de @rock_goddess')).toBeInTheDocument()
  })

  it('should increment like count when heart button is clicked', () => {
    render(<GaleriaSection />)
    
    // Find the first photo's like button (should be @rockfan_2025 with 47 likes)
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    // Click the first like button
    fireEvent.click(likeButtons[0])
    
    // The like count should increase from 47 to 48
    expect(screen.getByText('48')).toBeInTheDocument()
    expect(screen.queryByText('47')).not.toBeInTheDocument()
  })

  it('should decrement like count when heart button is clicked on already liked photo', () => {
    render(<GaleriaSection />)
    
    // Find @metalhead_sp photo which is already liked (23 likes)
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    // Click the second like button (@metalhead_sp)
    fireEvent.click(likeButtons[1])
    
    // The like count should decrease from 23 to 22
    expect(screen.getByText('22')).toBeInTheDocument()
    expect(screen.queryByText('23')).not.toBeInTheDocument()
  })

  it('should toggle heart icon fill state when clicked', () => {
    render(<GaleriaSection />)
    
    // Get all heart icons
    const heartIcons = document.querySelectorAll('svg')
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    // Click the first like button
    fireEvent.click(likeButtons[0])
    
    // The heart should now be filled (we can't easily test CSS classes in jsdom)
    // But we can verify the button is still there and functional
    expect(likeButtons[0]).toBeInTheDocument()
  })

  it('should display statistics section', () => {
    render(<GaleriaSection />)
    
    expect(screen.getByText('247')).toBeInTheDocument()
    expect(screen.getByText('Fotos Enviadas')).toBeInTheDocument()
    
    expect(screen.getByText('1.2k')).toBeInTheDocument()
    expect(screen.getByText('Curtidas')).toBeInTheDocument()
    
    expect(screen.getAllByText('12')[1]).toBeInTheDocument() // Rockstars do Dia statistic
    expect(screen.getByText('Rockstars do Dia')).toBeInTheDocument()
  })

  it('should render correct number of photos', () => {
    render(<GaleriaSection />)
    
    // Should render 6 photos based on mockPhotos array
    const photoContainers = document.querySelectorAll('img')
    expect(photoContainers).toHaveLength(6)
  })

  it('should render heart icons for all photos', () => {
    render(<GaleriaSection />)
    
    // Each photo should have a heart icon in its like button
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    expect(likeButtons).toHaveLength(6)
  })

  it('should handle multiple like clicks correctly', () => {
    render(<GaleriaSection />)
    
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    // Click the first like button twice
    fireEvent.click(likeButtons[0]) // 47 -> 48
    fireEvent.click(likeButtons[0]) // 48 -> 47
    
    // Should be back to original count
    expect(screen.getByText('47')).toBeInTheDocument()
  })

  it('should render crown icons for top photos', () => {
    render(<GaleriaSection />)
    
    // Crown icons should be present in TOP DA GALERA badges
    const topBadges = screen.getAllByText('TOP DA GALERA')
    expect(topBadges).toHaveLength(3)
  })

  it('should render star icons for rockstar photos', () => {
    render(<GaleriaSection />)
    
    // Star icons should be present in ROCKSTAR DO DIA badges
    const rockstarBadges = screen.getAllByText('ROCKSTAR DO DIA')
    expect(rockstarBadges).toHaveLength(3)
  })

  it('should render camera and upload icons in the upload button', () => {
    render(<GaleriaSection />)
    
    const uploadButton = screen.getByText('Envie sua Selfie!')
    expect(uploadButton).toBeInTheDocument()
    
    // The button should contain camera and upload icons (rendered as SVGs)
    const buttonElement = uploadButton.closest('button')
    const svgElements = buttonElement?.querySelectorAll('svg')
    expect(svgElements?.length).toBeGreaterThan(0)
  })

  it('should maintain photo order', () => {
    render(<GaleriaSection />)
    
    const usernames = [
      '@rockfan_2025',
      '@metalhead_sp', 
      '@festival_lover',
      '@rocknroll_life',
      '@guitar_hero',
      '@rock_goddess'
    ]
    
    usernames.forEach(username => {
      expect(screen.getByText(username)).toBeInTheDocument()
    })
  })

  it('should show correct badge combinations', () => {
    render(<GaleriaSection />)
    
    // @festival_lover should have both TOP and ROCKSTAR badges
    expect(screen.getByText('@festival_lover')).toBeInTheDocument()
    
    // @guitar_hero should have both TOP and ROCKSTAR badges  
    expect(screen.getByText('@guitar_hero')).toBeInTheDocument()
    
    // @rockfan_2025 should have only TOP badge
    expect(screen.getByText('@rockfan_2025')).toBeInTheDocument()
    
    // @metalhead_sp should have only ROCKSTAR badge
    expect(screen.getByText('@metalhead_sp')).toBeInTheDocument()
  })

  it('should handle like state persistence during multiple interactions', () => {
    render(<GaleriaSection />)
    
    const likeButtons = screen.getAllByRole('button').filter(button => 
      button.querySelector('svg') && button.textContent !== 'Envie sua Selfie!'
    )
    
    // Like first photo
    fireEvent.click(likeButtons[0]) // 47 -> 48
    expect(screen.getByText('48')).toBeInTheDocument()
    
    // Like second photo (which was already liked)
    fireEvent.click(likeButtons[1]) // 23 -> 22
    expect(screen.getByText('22')).toBeInTheDocument()
    
    // First photo should still show 48
    expect(screen.getByText('48')).toBeInTheDocument()
  })
})

// Nova suíte de testes mínima para a versão atualizada da Galeria
describe('GaleriaSection (atualizado)', () => {
  it('renderiza título e subtítulo com link de prévia', () => {
    render(<GaleriaSection />)
    expect(screen.getByText('Um Pedaço da História')).toBeInTheDocument()
    expect(screen.getByText('Linha Tronco da Estrada de Ferro Sorocabana')).toBeInTheDocument()
  })
})