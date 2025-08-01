"use client"

import React, { useEffect, useRef } from 'react'

interface GrungeBackgroundProps {
  intensity?: number
  color?: string
  overlay?: boolean
  className?: string
  children?: React.ReactNode
}

const GrungeBackground: React.FC<GrungeBackgroundProps> = ({
  intensity = 0.3,
  color = '#0f0f0f',
  overlay = true,
  className = '',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Check if canvas has valid dimensions
      if (canvas.width <= 0 || canvas.height <= 0) {
        return
      }

      // Create noise texture
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255 * intensity
        data[i] = noise     // Red
        data[i + 1] = noise // Green
        data[i + 2] = noise // Blue
        data[i + 3] = noise * 0.5 // Alpha
      }

      ctx.putImageData(imageData, 0, 0)

      // Add grunge scratches
      ctx.globalCompositeOperation = 'multiply'
      ctx.strokeStyle = color
      ctx.lineWidth = Math.random() * 3 + 1

      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height
        const endX = startX + (Math.random() - 0.5) * 200
        const endY = startY + (Math.random() - 0.5) * 200
        
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }

      // Add distressed spots
      ctx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 30 + 10
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity * 0.8})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    updateCanvas()

    const handleResize = () => {
      updateCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [intensity, color])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: overlay ? 'multiply' : 'normal' }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export default GrungeBackground
export { GrungeBackground }