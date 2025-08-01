import React from 'react'
import { cn } from '@/lib/utils'

interface SkipLink {
  href: string
  label: string
}

const skipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Pular para o conteúdo principal' },
  { href: '#lineup', label: 'Pular para o lineup' },
  { href: '#programacao', label: 'Pular para a programação' },
  { href: '#galeria', label: 'Pular para a galeria' },
  { href: '#quiz', label: 'Pular para o quiz' },
]

export function SkipLinks() {
  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            'sr-only focus:not-sr-only',
            'absolute top-4 left-4 z-[9999]',
            'bg-primary text-primary-foreground',
            'px-4 py-2 rounded-md',
            'font-medium text-sm',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'hover:bg-primary/90'
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              const target = document.querySelector(link.href)
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                // Focus the target element if it's focusable
                if (target instanceof HTMLElement && target.tabIndex >= 0) {
                  target.focus()
                }
              }
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default SkipLinks