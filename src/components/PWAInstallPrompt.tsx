import React from 'react';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { useUserSettingsStore } from '@/stores/userSettingsStore';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className }) => {
  const { isInstallable, isInstalled, installApp, dismissInstallPrompt } = usePWA();
  const { theme } = useUserSettingsStore();

  // Não exibe se não for instalável ou já estiver instalado
  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      // Opcional: mostrar feedback de sucesso
      console.log('App instalado com sucesso!');
    }
  };

  const handleDismiss = () => {
    dismissInstallPrompt();
  };

  return (
    <Card 
      className={`
        fixed bottom-4 left-4 right-4 z-50 
        md:left-auto md:right-4 md:max-w-sm
        ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}
        backdrop-blur-md shadow-2xl
        animate-in slide-in-from-bottom-4 duration-500
        ${className}
      `}
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              id="pwa-install-title"
              className={`
                font-bold text-lg leading-tight mb-1
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}
            >
              Instalar App
            </h3>
            
            <p 
              id="pwa-install-description"
              className={`
                text-sm leading-relaxed mb-3
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
              `}
            >
              Instale o Festival de Rock 2025 para uma experiência mais rápida e acesso offline!
            </p>
            
            {/* Benefícios da instalação */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <Smartphone className="w-3 h-3 text-orange-500" aria-hidden="true" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Acesso rápido na tela inicial
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Monitor className="w-3 h-3 text-orange-500" aria-hidden="true" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Funciona offline
                </span>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="
                  flex-1 bg-gradient-to-r from-orange-500 to-red-500 
                  hover:from-orange-600 hover:to-red-600
                  text-white border-0 font-medium
                  transition-all duration-200
                  focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                "
                aria-label="Instalar aplicativo do Festival de Rock 2025"
              >
                <Download className="w-4 h-4 mr-1" aria-hidden="true" />
                Instalar
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
                  focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                `}
                aria-label="Dispensar prompt de instalação"
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

export default PWAInstallPrompt;