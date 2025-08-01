import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BandCardSkeleton,
  BandListSkeleton,
  ProgramItemSkeleton,
  ProgramListSkeleton,
  FiltersSkeleton,
  SectionSkeleton,
  BandDetailsSkeleton,
  HeaderSkeleton,
  PageSkeleton
} from '@/components/ui/skeleton-loaders'
import { createLazyBandComponent, createLazyProgramComponent } from '@/utils'

// Simulated heavy components
const HeavyBandList = React.lazy(() => 
  new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    Banda {i + 1}
                  </div>
                  <CardTitle>Banda Exemplo {i + 1}</CardTitle>
                  <CardDescription>Rock Alternativo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Sábado • 20:00 • Palco Principal
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      })
    }, 2000)
  })
)

const HeavyProgramList = React.lazy(() => 
  new Promise<{ default: React.ComponentType }>((resolve) => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Performance {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    {18 + i}:00 • Palco Principal • 45min
                  </p>
                </div>
                <Button size="sm">Ver Detalhes</Button>
              </div>
            ))}
          </div>
        )
      })
    }, 1500)
  })
)

// Create lazy components with skeleton loading
const LazyBandList = createLazyBandComponent(
  () => Promise.resolve({ default: HeavyBandList })
)

const LazyProgramList = createLazyProgramComponent(
  () => Promise.resolve({ default: HeavyProgramList })
)

export function SkeletonExample() {
  const [showBands, setShowBands] = React.useState(false)
  const [showProgram, setShowProgram] = React.useState(false)
  const [activeDemo, setActiveDemo] = React.useState<string>('components')

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading States</CardTitle>
          <CardDescription>
            Demonstração dos diferentes tipos de skeleton loading para o Festival Berna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="sections">Seções</TabsTrigger>
              <TabsTrigger value="lazy">Lazy Loading</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Componentes Individuais</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Card de Banda</h4>
                    <BandCardSkeleton />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Item de Programação</h4>
                    <ProgramItemSkeleton />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Filtros</h4>
                  <FiltersSkeleton />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Header/Navegação</h4>
                  <HeaderSkeleton />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Seções Completas</h3>
                
                <div>
                  <h4 className="font-medium mb-2">Lista de Bandas</h4>
                  <BandListSkeleton count={3} />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Lista de Programação</h4>
                  <ProgramListSkeleton count={4} />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Seção com Título e Filtros</h4>
                  <SectionSkeleton content="bands" />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Detalhes de Banda</h4>
                  <BandDetailsSkeleton />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lazy" className="space-y-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Lazy Loading com Skeleton</h3>
                
                <div className="space-y-4">
                  <div>
                    <Button 
                      onClick={() => setShowBands(!showBands)}
                      variant="outline"
                      className="mb-4"
                    >
                      {showBands ? 'Ocultar' : 'Carregar'} Lista de Bandas
                    </Button>
                    
                    {showBands && (
                      <div>
                        <h4 className="font-medium mb-2">Lista de Bandas (2s de carregamento)</h4>
                        <React.Suspense fallback={<BandListSkeleton />}>
                          <HeavyBandList />
                        </React.Suspense>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      onClick={() => setShowProgram(!showProgram)}
                      variant="outline"
                      className="mb-4"
                    >
                      {showProgram ? 'Ocultar' : 'Carregar'} Programação
                    </Button>
                    
                    {showProgram && (
                      <div>
                        <h4 className="font-medium mb-2">Programação (1.5s de carregamento)</h4>
                        <React.Suspense fallback={<ProgramListSkeleton />}>
                          <HeavyProgramList />
                        </React.Suspense>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Lazy Components com Skeleton Automático</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Estes componentes usam skeleton loading automaticamente:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={() => setShowBands(!showBands)}
                          variant="secondary"
                        >
                          LazyBandComponent
                        </Button>
                        <Button 
                          onClick={() => setShowProgram(!showProgram)}
                          variant="secondary"
                        >
                          LazyProgramComponent
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}