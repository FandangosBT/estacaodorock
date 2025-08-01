import React from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { useUserSettingsStore } from '@/stores/userSettingsStore';

interface PWAUpdatePromptProps {
  className?: string;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ className }) => {
  const { isUpdateAvailable, updateApp } = usePWA();
  const { theme } = useUserSettingsStore();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Não exibe se não houver atualização ou se foi dispensado
  if (!isUpdateAvailable || isDismissed) {
    return null;
  }

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card 
      className={`
        fixed top-4 left-4 right-4 z-50 
        md:left-auto md:right-4 md:max-w-sm
        ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}
        backdrop-blur-md shadow-2xl
        animate-in slide-in-from-top-4 duration-500
        ${className}
      `}
      role="dialog"
      aria-labelledby="pwa-update-title"
      aria-describedby="pwa-update-description"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              id="pwa-update-title"
              className={`
                font-bold text-lg leading-tight mb-1
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}
            >
              Atualização Disponível
            </h3>
            
            <p 
              id="pwa-update-description"
              className={`
                text-sm leading-relaxed mb-3
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
              `}
            >
              Uma nova versão do Festival de Rock 2025 está disponível com melhorias e correções.
            </p>
            
            {/* Benefícios da atualização */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <Download className="w-3 h-3 text-blue-500" aria-hidden="true" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Melhorias de performance
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <RefreshCw className="w-3 h-3 text-blue-500" aria-hidden="true" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Correções de bugs
                </span>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                size="sm"
                className="
                  flex-1 bg-gradient-to-r from-blue-500 to-purple-500 
                  hover:from-blue-600 hover:to-purple-600
                  text-white border-0 font-medium
                  transition-all duration-200
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                "
                aria-label="Atualizar aplicativo do Festival de Rock 2025"
              >
                <RefreshCw className="w-4 h-4 mr-1" aria-hidden="true" />
                Atualizar
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className={`
                  px-3 transition-colors duration-200
                  ${theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
                aria-label="Dispensar notificação de atualização"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAUpdatePrompt;