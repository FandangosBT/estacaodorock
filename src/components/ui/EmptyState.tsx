import React from 'react';
import { Music, Users, Calendar, Image, Search, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type?: 'music' | 'users' | 'events' | 'gallery' | 'search' | 'favorites' | 'generic';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  description,
  action,
  className,
  size = 'md'
}) => {
  const getIcon = () => {
    const iconClasses = cn(
      'text-gray-400',
      size === 'sm' ? 'h-12 w-12' : size === 'md' ? 'h-16 w-16' : 'h-20 w-20'
    );

    switch (type) {
      case 'music':
        return <Music className={iconClasses} />;
      case 'users':
        return <Users className={iconClasses} />;
      case 'events':
        return <Calendar className={iconClasses} />;
      case 'gallery':
        return <Image className={iconClasses} />;
      case 'search':
        return <Search className={iconClasses} />;
      case 'favorites':
        return <Heart className={iconClasses} />;
      default:
        return <Music className={iconClasses} />;
    }
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center text-center',
    size === 'sm' ? 'py-8 px-4' : size === 'md' ? 'py-12 px-6' : 'py-16 px-8',
    className
  );

  const titleClasses = cn(
    'font-semibold text-gray-900 mb-2',
    size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
  );

  const descriptionClasses = cn(
    'text-gray-600 mb-6 max-w-md',
    size === 'sm' ? 'text-sm' : 'text-base'
  );

  return (
    <div className={containerClasses}>
      <div className="mb-4">
        {getIcon()}
      </div>
      
      <h3 className={titleClasses}>
        {title}
      </h3>
      
      <p className={descriptionClasses}>
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Componentes específicos para casos comuns
export const EmptyFavorites: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => (
  <EmptyState
    type="favorites"
    title="Nenhum favorito ainda"
    description="Explore as bandas e shows do festival e adicione seus favoritos para não perder nada!"
    action={onExplore ? {
      label: "Explorar Lineup",
      onClick: onExplore
    } : undefined}
  />
);

export const EmptySearch: React.FC<{ query?: string; onClear?: () => void }> = ({ query, onClear }) => (
  <EmptyState
    type="search"
    title={query ? `Nenhum resultado para "${query}"` : "Digite algo para pesquisar"}
    description={query 
      ? "Tente usar termos diferentes ou verifique a ortografia."
      : "Pesquise por bandas, gêneros musicais ou palcos do festival."
    }
    action={query && onClear ? {
      label: "Limpar Pesquisa",
      onClick: onClear
    } : undefined}
  />
);

export const EmptyGallery: React.FC<{ onUpload?: () => void }> = ({ onUpload }) => (
  <EmptyState
    type="gallery"
    title="Galeria vazia"
    description="Ainda não há fotos compartilhadas. Seja o primeiro a compartilhar momentos épicos do festival!"
    action={onUpload ? {
      label: "Compartilhar Foto",
      onClick: onUpload
    } : undefined}
  />
);

export const EmptyEvents: React.FC<{ onExplore?: () => void }> = ({ onExplore }) => (
  <EmptyState
    type="events"
    title="Nenhum evento encontrado"
    description="Não há eventos programados para este período. Confira a programação completa do festival."
    action={onExplore ? {
      label: "Ver Programação",
      onClick: onExplore
    } : undefined}
  />
);

export const EmptyLineup: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    type="music"
    title="Lineup em breve"
    description="O lineup completo do festival será divulgado em breve. Fique ligado para não perder nenhuma novidade!"
    action={onRefresh ? {
      label: "Atualizar",
      onClick: onRefresh
    } : undefined}
  />
);

export default EmptyState;