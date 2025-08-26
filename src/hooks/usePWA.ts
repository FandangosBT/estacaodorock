import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

interface PWAActions {
  installApp: () => Promise<boolean>;
  updateApp: () => void;
  checkForUpdates: () => void;
  dismissInstallPrompt: () => void;
}

export const usePWA = (): PWAState & PWAActions => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
  });

  // Verifica se o app já está instalado
  const checkIfInstalled = useCallback(() => {
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Registra o Service Worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Verifica por atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });
        
        // Escuta mensagens do Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            setState(prev => ({ ...prev, isUpdateAvailable: true }));
          }
        });
        
        return registration;
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Instala o app
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!state.installPrompt) {
      return false;
    }

    try {
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstallable: false, 
          installPrompt: null,
          isInstalled: true 
        }));
        return true;
      } else {
        setState(prev => ({ ...prev, installPrompt: null }));
        return false;
      }
    } catch (error) {
      console.error('Erro durante instalação:', error);
      return false;
    }
  }, [state.installPrompt]);

  // Atualiza o app
  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, []);

  // Verifica por atualizações
  const checkForUpdates = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    }
  }, []);

  // Dispensa o prompt de instalação
  const dismissInstallPrompt = useCallback(() => {
    setState(prev => ({ ...prev, isInstallable: false, installPrompt: null }));
  }, []);

  // Efeitos para configurar listeners
  useEffect(() => {
    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setState(prev => ({ 
        ...prev, 
        isInstallable: true, 
        installPrompt: installEvent 
      }));
    };

    // Listener para mudanças de conexão
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false, 
        installPrompt: null 
      }));
    };

    // Adiciona listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Inicialização
    checkIfInstalled();
    registerServiceWorker();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIfInstalled, registerServiceWorker]);

  // Verifica por atualizações periodicamente
  useEffect(() => {
    const interval = setInterval(checkForUpdates, 60000); // A cada minuto
    return () => clearInterval(interval);
  }, [checkForUpdates]);

  return {
    ...state,
    installApp,
    updateApp,
    checkForUpdates,
    dismissInstallPrompt,
  };
};

export default usePWA;