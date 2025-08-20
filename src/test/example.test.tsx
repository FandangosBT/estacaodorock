import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

describe('Example tests', () => {
  beforeEach(() => {
    cleanup() // Evitar interferências do DOM entre testes
  })

  it('should add numbers correctly', () => {
    const add = (a: number, b: number) => a + b
    expect(add(2, 3)).toBe(5)
  })

  it('should render a simple component', () => {
    const TestComponent = () => <div>Hello World</div>
    render(<TestComponent />)
    
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle async operations', async () => {
    const asyncFn = async () => {
      return new Promise(resolve => setTimeout(() => resolve('done'), 100))
    }
    
    const result = await asyncFn()
    expect(result).toBe('done')
  })

  it('should mock functions correctly', () => {
    const mockFn = vi.fn()
    mockFn('test')
    
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should render with router', () => {
    const TestComponent = () => (
      <BrowserRouter>
        <div>Router Test</div>
      </BrowserRouter>
    )
    
    render(<TestComponent />)
    expect(screen.getByText('Router Test')).toBeInTheDocument()
  })

  it('should handle button clicks', () => {
    const handleClick = vi.fn()
    const TestComponent = ({ children, onClick }: any) => (
      <button data-testid="test-button" onClick={onClick}>
        {children}
      </button>
    )
    
    render(<TestComponent onClick={handleClick}>Click me</TestComponent>)
    
    const button = screen.getByTestId('test-button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should work with queries', async () => {
    const TestComponent = () => (
      <div>
        <h1>Title</h1>
        <p>Description</p>
      </div>
    )
    
    render(<TestComponent />)
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should handle form inputs', () => {
    const TestForm = () => (
      <form>
        <input type="text" placeholder="Enter name" />
        <button type="submit">Submit</button>
      </form>
    )
    
    render(<TestForm />)
    
    const input = screen.getByPlaceholderText('Enter name')
    fireEvent.change(input, { target: { value: 'John Doe' } })
    
    expect(input).toHaveValue('John Doe')
  })
})