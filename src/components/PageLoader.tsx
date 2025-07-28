import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface PageLoaderProps {
  onComplete: () => void;
}

const PageLoader = ({ onComplete }: PageLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Afinando os instrumentos…",
    "Ligando as caixas…",
    "Testando o microfone…",
    "Quase lá, roqueiro!"
  ];

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 4000; // 4 segundos mínimo

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const naturalProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      setProgress(naturalProgress);

      // Trocar mensagem a cada 1 segundo
      const messageInterval = Math.floor(elapsed / 1000);
      if (messageInterval < messages.length) {
        setMessageIndex(messageInterval);
      }

      if (naturalProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete(), 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md w-full px-6">
        {/* Mesa de Som Animada */}
        <div className="relative mx-auto w-64 h-32 bg-gradient-to-b from-muted to-muted/80 rounded-lg border-2 border-border shadow-2xl">
          <div className="absolute inset-2 bg-background/20 rounded">
            {/* Sliders */}
            <div className="flex justify-between items-center h-full px-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative w-2 h-16 bg-muted-foreground/30 rounded-full">
                  <div 
                    className="absolute w-4 h-3 bg-primary rounded-full -left-1 transition-all duration-1000 ease-in-out"
                    style={{ 
                      top: `${20 + Math.sin(Date.now() / 1000 + i) * 20}%`,
                      animation: `pulse 2s infinite ${i * 0.2}s`
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Equalizadores */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-1 bg-electric/60 rounded-full animate-pulse" 
                     style={{ 
                       height: `${8 + Math.random() * 12}px`,
                       animationDelay: `${i * 0.1}s`
                     }} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar - Corda de Guitarra */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-gradient-to-r from-electric via-primary to-electric transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Efeito de "vibração" da corda */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </div>
            </div>
            
            {/* "Trastes" da guitarra */}
            <div className="absolute inset-0 flex justify-between items-center px-2">
              {[0, 25, 50, 75, 100].map((pos) => (
                <div key={pos} className="w-0.5 h-4 bg-muted-foreground/40" />
              ))}
            </div>
          </div>

          {/* Porcentagem */}
          <div className="text-primary font-bold text-xl tracking-wider">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Mensagem Dinâmica */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-muted-foreground text-lg font-medium animate-fade-in">
            {messages[messageIndex]}
          </p>
        </div>

        {/* Indicadores de Som */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 bg-electric rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;