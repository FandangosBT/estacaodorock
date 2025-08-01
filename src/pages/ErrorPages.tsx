import React from 'react';
import { AlertTriangle, Home, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title: string;
  message: string;
  icon: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customActions?: React.ReactNode;
}

const ErrorPageLayout: React.FC<ErrorPageProps> = ({
  title,
  message,
  icon,
  showHomeButton = true,
  showBackButton = true,
  customActions
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-8 text-center text-white">
        <div className="flex justify-center mb-6">
          {icon}
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          {title}
        </h1>
        
        <p className="text-white/80 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-md transition-colors backdrop-blur-sm border border-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
          )}
          
          {showHomeButton && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </button>
          )}
        </div>

        {customActions && (
          <div className="mt-6">
            {customActions}
          </div>
        )}
      </div>
    </div>
  );
};

// Página 404
export const NotFoundPage: React.FC = () => (
  <ErrorPageLayout
    title="404 - Página Não Encontrada"
    message="A página que você está procurando não existe ou foi movida. Que tal voltar ao festival?"
    icon={<AlertTriangle className="h-20 w-20 text-yellow-400" />}
  />
);

// Página de erro 500
export const ServerErrorPage: React.FC = () => (
  <ErrorPageLayout
    title="500 - Erro do Servidor"
    message="Nossos servidores estão enfrentando dificuldades técnicas. Nossa equipe já foi notificada e está trabalhando para resolver o problema."
    icon={<AlertTriangle className="h-20 w-20 text-red-400" />}
    customActions={
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors backdrop-blur-sm border border-white/30"
      >
        Recarregar Página
      </button>
    }
  />
);

// Página de erro de rede
export const NetworkErrorPage: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorPageLayout
      title={isOnline ? "Erro de Conexão" : "Sem Conexão"}
      message={isOnline 
        ? "Não foi possível conectar aos nossos servidores. Verifique sua conexão e tente novamente."
        : "Você está offline. Verifique sua conexão com a internet e tente novamente."
      }
      icon={isOnline 
        ? <Wifi className="h-20 w-20 text-orange-400" />
        : <WifiOff className="h-20 w-20 text-red-400" />
      }
      customActions={
        <div className="space-y-2">
          <div className={`text-sm ${
            isOnline ? 'text-green-400' : 'text-red-400'
          }`}>
            Status: {isOnline ? 'Online' : 'Offline'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors backdrop-blur-sm border border-white/30"
          >
            Tentar Novamente
          </button>
        </div>
      }
    />
  );
};

// Página de acesso negado
export const ForbiddenPage: React.FC = () => (
  <ErrorPageLayout
    title="403 - Acesso Negado"
    message="Você não tem permissão para acessar esta página. Entre em contato com o administrador se acredita que isso é um erro."
    icon={<AlertTriangle className="h-20 w-20 text-orange-400" />}
    showBackButton={false}
  />
);

// Página de manutenção
export const MaintenancePage: React.FC = () => (
  <ErrorPageLayout
    title="Em Manutenção"
    message="Estamos realizando melhorias no sistema. Voltaremos em breve com novidades incríveis para o festival!"
    icon={<AlertTriangle className="h-20 w-20 text-blue-400" />}
    showBackButton={false}
    showHomeButton={false}
    customActions={
      <div className="text-sm text-white/60">
        Tempo estimado: 30 minutos
      </div>
    }
  />
);