"use client"

import React, { useEffect, useRef } from 'react'

interface LightningTextProps {
  text?: string
  size?: number
  color?: string
  delay?: number
  className?: string
}

// Thunder class component
class Thunder {
  lifespan: number
  maxlife: number
  color: string
  glow: string
  x: number
  y: number
  width: number
  direct: number
  max: number
  segments: Array<{
    direct: number
    length: number
    change: number
  }>

  constructor(options: any = {}) {
    this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 10)
    this.maxlife = this.lifespan
    this.color = options.color || '#fefefe'
    this.glow = options.glow || '#ff0000'
    this.x = options.x || Math.random() * window.innerWidth
    this.y = options.y || Math.random() * window.innerHeight
    this.width = options.width || 2
    this.direct = options.direct || Math.random() * Math.PI * 2
    this.max = options.max || Math.round(Math.random() * 10 + 20)
    this.segments = [...new Array(this.max)].map(() => ({
      direct: this.direct + (Math.PI * Math.random() * 0.2 - 0.1),
      length: Math.random() * 20 + 80,
      change: Math.random() * 0.04 - 0.02
    }))
  }

  update(index: number, array: Thunder[]) {
    this.segments.forEach(s => {
      s.direct += s.change
      if (Math.random() > 0.96) s.change *= -1
    })
    if (this.lifespan > 0) {
      this.lifespan--
    } else {
      this.remove(index, array)
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.lifespan <= 0) return
    
    ctx.beginPath()
    ctx.globalAlpha = this.lifespan / this.maxlife
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.width
    ctx.shadowBlur = 32
    ctx.shadowColor = this.glow
    ctx.moveTo(this.x, this.y)
    
    let prev = { x: this.x, y: this.y }
    this.segments.forEach(s => {
      const x = prev.x + Math.cos(s.direct) * s.length
      const y = prev.y + Math.sin(s.direct) * s.length
      prev = { x, y }
      ctx.lineTo(x, y)
    })
    
    ctx.stroke()
    ctx.closePath()
    ctx.shadowBlur = 0
    
    const strength = Math.random() * 80 + 40
    const light = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, strength)
    light.addColorStop(0, 'rgba(255, 0, 0, 0.6)')
    light.addColorStop(0.1, 'rgba(255, 255, 0, 0.4)')
    light.addColorStop(0.4, 'rgba(255, 0, 0, 0.2)')
    light.addColorStop(0.65, 'rgba(255, 255, 0, 0.1)')
    light.addColorStop(0.8, 'rgba(255, 0, 0, 0)')
    
    ctx.beginPath()
    ctx.fillStyle = light
    ctx.arc(this.x, this.y, strength, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }

  remove(index: number, array: Thunder[]) {
    array.splice(index, 1)
  }
}

// Text class
class TextRenderer {
  size: number
  copy: string
  color: string
  delay: number
  basedelay: number
  bound: { width: number; height: number }
  x: number
  y: number
  data: ImageData
  index: number

  constructor(options: any = {}, canvasWidth: number, canvasHeight: number) {
    const pool = document.createElement('canvas')
    const buffer = pool.getContext('2d')!
    pool.width = canvasWidth
    pool.height = canvasHeight
    buffer.fillStyle = '#0f0f0f'
    buffer.fillRect(0, 0, pool.width, pool.height)

    this.size = options.size || 60
    this.copy = (options.copy || 'ROCK FESTIVAL') + ' '
    this.color = options.color || '#ff0000'
    this.delay = options.delay || 2
    this.basedelay = this.delay
    
    buffer.font = `900 ${this.size}px Impact, Arial Black, sans-serif`
    this.bound = {
      width: buffer.measureText(this.copy).width,
      height: this.size * 1.5
    }
    
    // Center the text
    this.x = canvasWidth * 0.5 - this.bound.width * 0.5
    this.y = canvasHeight * 0.5 - this.bound.height * 0.5

    buffer.strokeStyle = this.color
    buffer.lineWidth = 2
    buffer.strokeText(this.copy, 0, this.bound.height * 0.8)
    this.data = buffer.getImageData(0, 0, this.bound.width, this.bound.height)
    this.index = 0
  }

  update(thunder: Thunder[]) {
    if (this.index >= this.bound.width) {
      this.index = 0
      return
    }
    
    const data = this.data.data
    for (let i = this.index * 4; i < data.length; i += 4 * this.data.width) {
      const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3]
      if (bitmap > 255 && Math.random() > 0.92) {
        const x = this.x + this.index
        const y = this.y + i / this.bound.width / 4
        thunder.push(new Thunder({ x, y, glow: this.color }))
      }
    }
    
    if (this.delay-- < 0) {
      this.index += 2
      this.delay += this.basedelay
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.data, this.x, this.y, 0, 0, this.index, this.bound.height)
  }
}

const LightningText: React.FC<LightningTextProps> = ({ 
  text = 'ROCK FESTIVAL', 
  size = 60, 
  color = '#ff0000', 
  delay = 2,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const thunderRef = useRef<Thunder[]>([])
  const textRef = useRef<TextRenderer | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    
    canvas.width = w
    canvas.height = h
    
    // Initialize text
    textRef.current = new TextRenderer({ copy: text, size, color, delay }, w, h)

    const loop = () => {
      // Update
      textRef.current?.update(thunderRef.current)
      thunderRef.current.forEach((l, i) => l.update(i, thunderRef.current))
      
      // Render
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = '#0f0f0f'
      ctx.fillRect(0, 0, w, h)
      
      ctx.globalCompositeOperation = 'screen'
      textRef.current?.render(ctx)
      thunderRef.current.forEach(l => l.render(ctx))
      
      animationRef.current = requestAnimationFrame(loop)
    }

    loop()

    const handleResize = () => {
      const newWidth = canvas.offsetWidth
      const newHeight = canvas.offsetHeight
      canvas.width = newWidth
      canvas.height = newHeight
      
      if (textRef.current) {
        textRef.current = new TextRenderer({ copy: text, size, color, delay }, newWidth, newHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [text, size, color, delay])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    thunderRef.current.push(new Thunder({ x, y, glow: color }))
  }

  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-crosshair"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default LightningText
export { LightningText }