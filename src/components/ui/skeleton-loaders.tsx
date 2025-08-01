import React from 'react'
import { Skeleton } from './skeleton'
import { Card, CardContent, CardHeader } from './card'
import { cn } from '@/lib/utils'

// Skeleton para card de banda
export function BandCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="space-y-2">
        <Skeleton className="h-48 w-full" /> {/* Imagem da banda */}
        <Skeleton className="h-6 w-3/4" /> {/* Nome da banda */}
        <Skeleton className="h-4 w-1/2" /> {/* Gênero */}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" /> {/* Ícone */}
          <Skeleton className="h-4 w-24" /> {/* Dia */}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" /> {/* Ícone */}
          <Skeleton className="h-4 w-20" /> {/* Horário */}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" /> {/* Ícone */}
          <Skeleton className="h-4 w-32" /> {/* Palco */}
        </div>
        <div className="flex space-x-2 mt-4">
          <Skeleton className="h-9 w-20" /> {/* Botão favorito */}
          <Skeleton className="h-9 w-24" /> {/* Botão detalhes */}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton para item de programação
export function ProgramItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-4 p-4 border rounded-lg', className)}>
      <div className="flex-shrink-0">
        <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar/ícone */}
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" /> {/* Nome da banda */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-16" /> {/* Horário */}
          <Skeleton className="h-4 w-24" /> {/* Palco */}
          <Skeleton className="h-4 w-12" /> {/* Duração */}
        </div>
      </div>
      <div className="flex-shrink-0">
        <Skeleton className="h-8 w-8" /> {/* Botão ação */}
      </div>
    </div>
  )
}

// Skeleton para lista de bandas
export function BandListSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <BandCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Skeleton para lista de programação
export function ProgramListSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ProgramItemSkeleton key={index} />
      ))}
    </div>
  )
}

// Skeleton para filtros
export function FiltersSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Skeleton className="h-10 w-24" /> {/* Filtro 1 */}
      <Skeleton className="h-10 w-32" /> {/* Filtro 2 */}
      <Skeleton className="h-10 w-28" /> {/* Filtro 3 */}
      <Skeleton className="h-10 w-20" /> {/* Filtro 4 */}
    </div>
  )
}

// Skeleton para seção completa
export function SectionSkeleton({ 
  title = true, 
  filters = true, 
  content = 'bands',
  className 
}: { 
  title?: boolean
  filters?: boolean
  content?: 'bands' | 'program'
  className?: string 
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Título */}
          <Skeleton className="h-4 w-96" /> {/* Descrição */}
        </div>
      )}
      
      {filters && <FiltersSkeleton />}
      
      {content === 'bands' ? (
        <BandListSkeleton />
      ) : (
        <ProgramListSkeleton />
      )}
    </div>
  )
}

// Skeleton para detalhes de banda
export function BandDetailsSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="space-y-4">
        <Skeleton className="h-64 w-full" /> {/* Imagem grande */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" /> {/* Nome */}
          <Skeleton className="h-5 w-1/2" /> {/* Gênero */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" /> {/* Label */}
          <Skeleton className="h-4 w-full" /> {/* Descrição linha 1 */}
          <Skeleton className="h-4 w-full" /> {/* Descrição linha 2 */}
          <Skeleton className="h-4 w-3/4" /> {/* Descrição linha 3 */}
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" /> {/* Label apresentações */}
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" /> {/* Apresentação 1 */}
            <Skeleton className="h-12 w-full" /> {/* Apresentação 2 */}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24" /> {/* Botão social 1 */}
          <Skeleton className="h-10 w-24" /> {/* Botão social 2 */}
          <Skeleton className="h-10 w-24" /> {/* Botão social 3 */}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton para navegação/header
export function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-between p-4 border-b', className)}>
      <Skeleton className="h-8 w-32" /> {/* Logo */}
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" /> {/* Nav item 1 */}
        <Skeleton className="h-8 w-20" /> {/* Nav item 2 */}
        <Skeleton className="h-8 w-24" /> {/* Nav item 3 */}
      </div>
      <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar/menu */}
    </div>
  )
}

// Skeleton para página completa
export function PageSkeleton({ 
  header = true,
  content = 'bands',
  className 
}: { 
  header?: boolean
  content?: 'bands' | 'program'
  className?: string 
}) {
  return (
    <div className={cn('min-h-screen', className)}>
      {header && <HeaderSkeleton />}
      <div className="container mx-auto p-6">
        <SectionSkeleton content={content} />
      </div>
    </div>
  )
}