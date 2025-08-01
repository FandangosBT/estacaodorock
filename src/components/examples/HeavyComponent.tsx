import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Cpu, Zap } from 'lucide-react'

// Simulate a heavy component with complex rendering
export function HeavyComponent() {
  const [renderTime, setRenderTime] = React.useState<number>(0)
  const [isLoaded, setIsLoaded] = React.useState(false)
  
  // Simulate heavy computation
  React.useEffect(() => {
    const startTime = performance.now()
    
    // Simulate some heavy work
    const heavyWork = () => {
      let result = 0
      for (let i = 0; i < 100000; i++) {
        result += Math.random() * Math.sin(i) * Math.cos(i)
      }
      return result
    }
    
    // Simulate async loading
    const timer = setTimeout(() => {
      heavyWork()
      const endTime = performance.now()
      setRenderTime(endTime - startTime)
      setIsLoaded(true)
    }, 500) // Simulate 500ms loading time
    
    return () => clearTimeout(timer)
  }, [])
  
  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 animate-spin" />
            <span>Processando componente pesado...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Componente Pesado Carregado</span>
        </CardTitle>
        <CardDescription>
          Este componente simula um carregamento pesado e foi carregado sob demanda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            Tempo de renderização: {renderTime.toFixed(2)}ms
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 8 }, (_, i) => (
            <Badge key={i} variant="secondary">
              Item {i + 1}
            </Badge>
          ))}
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Dados Simulados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>CPU Usage: {Math.floor(Math.random() * 100)}%</div>
            <div>Memory: {Math.floor(Math.random() * 1000)}MB</div>
            <div>Network: {Math.floor(Math.random() * 100)}Mbps</div>
            <div>Latency: {Math.floor(Math.random() * 50)}ms</div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          ✅ Componente carregado com sucesso via lazy loading
        </div>
      </CardContent>
    </Card>
  )
}