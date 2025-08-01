import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import { 
  useDebounce, 
  useDebouncedCallback, 
  useThrottledCallback,
  usePerformanceMonitor,
  useIntersectionObserver
} from '../../utils/performance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Activity, Clock, Search, Zap } from 'lucide-react'

// Componente de demonstração
const PerformanceDemo = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const [throttleCount, setThrottleCount] = useState(0)
  const [debounceCount, setDebounceCount] = useState(0)

  // Hooks de performance
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  const debouncedCallback = useDebouncedCallback(() => {
    setDebounceCount(prev => prev + 1)
  }, 300)
  
  const throttledCallback = useThrottledCallback(() => {
    setThrottleCount(prev => prev + 1)
  }, 500)

  // Monitor de performance
  usePerformanceMonitor('performance-demo')

  // Intersection Observer para lazy loading
  const { ref: targetRef, isIntersecting: isVisible } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '50px'
  })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Demonstração dos Utilitários de Performance</h1>
        <p className="text-muted-foreground">
          Teste as funcionalidades de debounce, throttle, monitoramento e lazy loading
        </p>
      </div>

      {/* Performance Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Monitor de Performance
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real de renders e uso de memória
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {clickCount}
              </div>
              <div className="text-sm text-muted-foreground">Interações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {searchTerm.length}
              </div>
              <div className="text-sm text-muted-foreground">Caracteres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {debouncedSearch.length}
              </div>
              <div className="text-sm text-muted-foreground">Debounced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {debounceCount + throttleCount}
              </div>
              <div className="text-sm text-muted-foreground">Callbacks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debounce Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Debounce Demo
            </CardTitle>
            <CardDescription>
              Digite para ver o debounce em ação (500ms de delay)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Digite algo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Valor atual:</span>
                <Badge variant="outline">{searchTerm || 'vazio'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Valor debounced:</span>
                <Badge variant="secondary">{debouncedSearch || 'vazio'}</Badge>
              </div>
            </div>
            <Button onClick={debouncedCallback} className="w-full">
              Callback Debounced (300ms) - Executado {debounceCount}x
            </Button>
          </CardContent>
        </Card>

        {/* Throttle Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5" />
              Throttle Demo
            </CardTitle>
            <CardDescription>
              Clique rapidamente para ver o throttle (1000ms de intervalo)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setClickCount(prev => prev + 1)}
              className="w-full"
              variant="outline"
            >
              Clique Rápido - Total: {clickCount}
            </Button>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Cliques totais:</span>
                <Badge variant="outline">{clickCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Callbacks throttled:</span>
                <Badge variant="secondary">{throttleCount}</Badge>
              </div>
            </div>
            <Button onClick={throttledCallback} className="w-full">
              Callback Throttled (500ms) - Executado {throttleCount}x
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Intersection Observer Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Intersection Observer Demo
          </CardTitle>
          <CardDescription>
            Role para baixo para ver o elemento aparecer na viewport
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto border rounded p-4">
            <div className="h-64 bg-muted rounded mb-4 flex items-center justify-center">
              <p className="text-muted-foreground">Role para baixo...</p>
            </div>
            <div className="h-64 bg-muted rounded mb-4 flex items-center justify-center">
              <p className="text-muted-foreground">Continue rolando...</p>
            </div>
            <div 
              ref={targetRef as any}
              className={`h-32 rounded flex items-center justify-center transition-all duration-500 ${
                isVisible 
                  ? 'bg-green-100 border-2 border-green-500 scale-105' 
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  isVisible ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {isVisible ? '👀 Visível!' : '🙈 Não visível'}
                </div>
                <Badge variant={isVisible ? 'default' : 'secondary'}>
                  {isVisible ? 'Na viewport' : 'Fora da viewport'}
                </Badge>
              </div>
            </div>
            <div className="h-64 bg-muted rounded mt-4 flex items-center justify-center">
              <p className="text-muted-foreground">Fim do conteúdo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Performance */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Dicas de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">🔍</span>
              <span><strong>Debounce:</strong> Use para campos de busca e validação de formulários</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">⚡</span>
              <span><strong>Throttle:</strong> Use para eventos de scroll, resize e cliques frequentes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span><strong>Monitor:</strong> Acompanhe renders lentos (&gt;16ms) e uso de memória</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">👁️</span>
              <span><strong>Intersection Observer:</strong> Implemente lazy loading e animações baseadas em visibilidade</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

const meta: Meta<typeof PerformanceDemo> = {
  title: 'Utils/Performance',
  component: PerformanceDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstração interativa dos utilitários de performance: debounce, throttle, monitoramento e intersection observer.'
      }
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  name: 'Demonstração Interativa',
  parameters: {
    docs: {
      description: {
        story: 'Interface completa para testar todos os utilitários de performance com exemplos práticos e monitoramento em tempo real.'
      }
    }
  }
}