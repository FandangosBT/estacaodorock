"use client"

import { useRef, useEffect } from 'react'

interface GrungeNoiseProps {
  patternSize?: number
  patternScaleX?: number
  patternScaleY?: number
  patternRefreshInterval?: number
  patternAlpha?: number
  className?: string
}

function GrungeNoise({
  patternSize = 150,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 3,
  patternAlpha = 25,
  className = ""
}: GrungeNoiseProps) {
  const grainRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let frame = 0

    const patternCanvas = document.createElement('canvas')
    patternCanvas.width = patternSize
    patternCanvas.height = patternSize
    const patternCtx = patternCanvas.getContext('2d')
    if (!patternCtx) return
    
    const patternData = patternCtx.createImageData(patternSize, patternSize)
    const patternPixelDataLength = patternSize * patternSize * 4

    const resize = () => {
      const width = window.innerWidth * window.devicePixelRatio
      const height = window.innerHeight * window.devicePixelRatio
      
      // Check if dimensions are valid
      if (width <= 0 || height <= 0) {
        return
      }
      
      canvas.width = width
      canvas.height = height
      ctx.scale(patternScaleX, patternScaleY)
    }

    const updatePattern = () => {
      for (let i = 0; i < patternPixelDataLength; i += 4) {
        const value = Math.random() * 255
        patternData.data[i] = value
        patternData.data[i + 1] = value
        patternData.data[i + 2] = value
        patternData.data[i + 3] = patternAlpha
      }
      patternCtx.putImageData(patternData, 0, 0)
    }

    const drawGrain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const pattern = ctx.createPattern(patternCanvas, 'repeat')
      if (pattern) {
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        updatePattern()
        drawGrain()
      }
      frame++
      requestAnimationFrame(loop)
    }

    const handleResize = () => resize()
    window.addEventListener('resize', handleResize)
    resize()
    loop()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha])

  return (
    <canvas 
      className={`absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay ${className}`} 
      ref={grainRef} 
    />
  )
}

export { GrungeNoise }