"use client"

import React from 'react'

interface TapeElementProps {
  variant?: 'horizontal' | 'vertical' | 'diagonal'
  color?: 'yellow' | 'white' | 'red' | 'black'
  size?: 'sm' | 'md' | 'lg'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  rotation?: number
  className?: string
  children?: React.ReactNode
}

const TapeElement: React.FC<TapeElementProps> = ({
  variant = 'horizontal',
  color = 'yellow',
  size = 'md',
  position = 'center',
  rotation = 0,
  className = '',
  children
}) => {
  const colorClasses = {
    yellow: 'bg-yellow-400 border-yellow-500',
    white: 'bg-gray-100 border-gray-300',
    red: 'bg-red-500 border-red-600',
    black: 'bg-gray-800 border-gray-900'
  }

  const sizeClasses = {
    sm: variant === 'horizontal' ? 'w-16 h-4' : 'w-4 h-16',
    md: variant === 'horizontal' ? 'w-24 h-6' : 'w-6 h-24',
    lg: variant === 'horizontal' ? 'w-32 h-8' : 'w-8 h-32'
  }

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }

  const baseRotation = {
    horizontal: 0,
    vertical: 90,
    diagonal: 45
  }

  const finalRotation = baseRotation[variant] + rotation

  return (
    <div 
      className={`absolute ${positionClasses[position]} ${className}`}
      style={{ transform: `translate(-50%, -50%) rotate(${finalRotation}deg)` }}
    >
      <div 
        className={`
          ${colorClasses[color]} 
          ${sizeClasses[size]}
          border-2 border-dashed
          shadow-lg
          relative
          overflow-hidden
          before:absolute before:inset-0
          before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
          after:absolute after:inset-0
          after:bg-gradient-to-b after:from-black/10 after:via-transparent after:to-black/20
        `}
      >
        {/* Tape texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-black/20"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/30"></div>
        </div>
        
        {/* Content */}
        {children && (
          <div className="relative z-10 flex items-center justify-center h-full text-xs font-bold text-black/80">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Preset tape components
const TapeCorner: React.FC<{ corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', className?: string }> = ({ corner, className }) => (
  <TapeElement
    variant="diagonal"
    color="yellow"
    size="md"
    position={corner}
    rotation={corner.includes('right') ? -45 : 45}
    className={className}
  />
)

const TapeStrip: React.FC<{ orientation: 'horizontal' | 'vertical', className?: string }> = ({ orientation, className }) => (
  <TapeElement
    variant={orientation}
    color="white"
    size="lg"
    position="center"
    className={className}
  />
)

export default TapeElement
export { TapeElement, TapeCorner, TapeStrip }