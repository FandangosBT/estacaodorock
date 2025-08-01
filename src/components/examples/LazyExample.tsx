import React from 'react'
import { createLazyComponent, createLazyBandComponent, usePreloadOnHover } from '@/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BandCardSkeleton } from '@/components/ui/skeleton-loaders'

// Simulated heavy component
const SimulatedHeavyComponent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Componente Pesado Carregado</CardTitle>
      <CardDescription>Este componente foi carregado com lazy loading</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Conteúdo do componente pesado simulado.</p>
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm">Dados carregados com sucesso!</p>
      </div>
    </CardContent>
  </Card>
)

// Heavy component that we want to lazy load
const LazyHeavyComponent = React.lazy(() => 
  new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => resolve({ default: SimulatedHeavyComponent }), 1000)
  })
)

// Create lazy component with skeleton loading
const LazyHeavyWithSkeleton = createLazyComponent(
  () => new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => resolve({ default: SimulatedHeavyComponent }), 2000)
  }),
  {
    skeletonType: 'band-card',
    loadingProps: {
      message: 'Carregando componente pesado...',
      size: 'lg'
    }
  }
)

// Create lazy component with band skeleton
const LazyBandComponent = createLazyBandComponent(
  () => new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => resolve({ default: SimulatedHeavyComponent }), 1500)
  })
)

export function LazyExample() {
  const [showLazy, setShowLazy] = React.useState(false)
  const [showPreload, setShowPreload] = React.useState(false)
  
  // Preload on hover
  const preloadProps = usePreloadOnHover(
    () => new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => resolve({ default: SimulatedHeavyComponent }), 500)
    })
  )
  
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Lazy Loading Examples</CardTitle>
          <CardDescription>
            Demonstração de carregamento sob demanda de componentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Lazy Loading Básico</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Componente carregado sob demanda com spinner padrão
              </p>
              <React.Suspense fallback={<div>Carregando...</div>}>
                <LazyHeavyComponent />
              </React.Suspense>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Lazy Loading com Skeleton</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Componente carregado com skeleton de banda
              </p>
              <LazyHeavyWithSkeleton />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Lazy Loading com Band Skeleton</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Componente criado com createLazyBandComponent
              </p>
              <LazyBandComponent />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Preload on Hover</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Passe o mouse sobre o botão para fazer preload do componente
              </p>
              <Button 
                {...preloadProps}
                variant="outline"
                className="transition-colors"
              >
                Hover para Preload {preloadProps.isPreloaded && '✓'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}