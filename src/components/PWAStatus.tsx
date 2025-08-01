import React from 'react';
import { Wifi, WifiOff, Smartphone, Monitor, Download, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';
import { useUserSettingsStore } from '@/stores/userSettingsStore';

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PWAStatus: React.FC<PWAStatusProps> = ({ 
  className, 
  showDetails = false 
}) => {
  const { 
    isOnline, 
    isInstalled, 
    isInstallable, 
    isUpdateAvailable,
    installApp,
    updateApp,
    checkForUpdates
  } = usePWA();
  const { theme } = useUserSettingsStore();

  const getConnectionStatus = () => {
    return {
      icon: isOnline ? Wifi : WifiOff,
      label: isOnline ? 'Online' : 'Offline',
      color: isOnline ? 'text-green-500' : 'text-red-500',
      bgColor: isOnline ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
    };
  };

  const getInstallStatus = () => {
    if (isInstalled) {
      return {
        icon: Smartphone,
        label: 'Instalado',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20'
      };
    }
    if (isInstallable) {
      return {
        icon: Download,
        label: 'Instalável',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20'
      };
    }
    return {
      icon: Monitor,
      label: 'Web App',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20'
    };
  };

  const connectionStatus = getConnectionStatus();
  const installStatus = getInstallStatus();
  const ConnectionIcon = connectionStatus.icon;
  const InstallIcon = installStatus.icon;

  if (!showDetails) {
    // Versão compacta - apenas badges
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge 
          variant="outline" 
          className={`
            ${connectionStatus.bgColor} ${connectionStatus.color} border-current
            flex items-center gap-1 px-2 py-1
          `}
        >
          <ConnectionIcon className="w-3 h-3" aria-hidden="true" />
          <span className="text-xs font-medium">{connectionStatus.label}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className={`
            ${installStatus.bgColor} ${installStatus.color} border-current
            flex items-center gap-1 px-2 py-1
          `}
        >
          <InstallIcon className="w-3 h-3" aria-hidden="true" />
          <span className="text-xs font-medium">{installStatus.label}</span>
        </Badge>
        
        {isUpdateAvailable && (
          <Badge 
            variant="outline" 
            className="
              bg-purple-100 dark:bg-purple-900/20 text-purple-500 border-current
              flex items-center gap-1 px-2 py-1
            "
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            <span className="text-xs font-medium">Atualização</span>
          </Badge>
        )}
      </div>
    );
  }

  // Versão detalhada - card completo
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-orange-500" aria-hidden="true" />
          Status do PWA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status de Conexão */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${connectionStatus.bgColor}`}>
              <ConnectionIcon className={`w-4 h-4 ${connectionStatus.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Conexão
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isOnline ? 'Conectado à internet' : 'Modo offline ativo'}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${connectionStatus.bgColor} ${connectionStatus.color} border-current`}
          >
            {connectionStatus.label}
          </Badge>
        </div>
        
        {/* Status de Instalação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${installStatus.bgColor}`}>
              <InstallIcon className={`w-4 h-4 ${installStatus.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Instalação
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {isInstalled 
                  ? 'App instalado no dispositivo' 
                  : isInstallable 
                    ? 'Disponível para instalação'
                    : 'Executando no navegador'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${installStatus.bgColor} ${installStatus.color} border-current`}
            >
              {installStatus.label}
            </Badge>
            {isInstallable && (
              <Button
                size="sm"
                onClick={installApp}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Instalar
              </Button>
            )}
          </div>
        </div>
        
        {/* Status de Atualização */}
        {(isUpdateAvailable || isInstalled) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isUpdateAvailable 
                  ? 'bg-purple-100 dark:bg-purple-900/20' 
                  : 'bg-gray-100 dark:bg-gray-900/20'
              }`}>
                <RefreshCw className={`w-4 h-4 ${
                  isUpdateAvailable ? 'text-purple-500' : 'text-gray-500'
                }`} aria-hidden="true" />
              </div>
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Atualizações
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isUpdateAvailable 
                    ? 'Nova versão disponível' 
                    : 'Versão atual atualizada'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isUpdateAvailable && (
                <Badge 
                  variant="outline" 
                  className="bg-purple-100 dark:bg-purple-900/20 text-purple-500 border-current"
                >
                  Disponível
                </Badge>
              )}
              <Button
                size="sm"
                variant={isUpdateAvailable ? "default" : "outline"}
                onClick={isUpdateAvailable ? updateApp : checkForUpdates}
                className={isUpdateAvailable ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
              >
                {isUpdateAvailable ? 'Atualizar' : 'Verificar'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Informações adicionais */}
        <div className={`pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            PWA (Progressive Web App) oferece experiência nativa com funcionalidades offline.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAStatus;