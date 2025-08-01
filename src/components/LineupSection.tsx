import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Music, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import { useAsyncOperation } from '@/hooks/use-global-state';
import '@/styles/rock-styles.css';

interface Band {
  id: string;
  name: string;
  genre: string;
  day: string;
  time: string;
  stage: string;
  image: string;
  spotify?: string;
  youtube?: string;
  instagram?: string;
  isFavorite: boolean;
}

const bands: Band[] = [
  {
    id: '1',
    name: 'Thunder Wolves',
    genre: 'Heavy Metal',
    day: 'Sexta',
    time: '22:00',
    stage: 'Palco Principal',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  },
  {
    id: '2',
    name: 'Electric Storm',
    genre: 'Rock Alternativo',
    day: 'Sábado',
    time: '20:30',
    stage: 'Palco Principal',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  },
  {
    id: '3',
    name: 'Neon Rebels',
    genre: 'Punk Rock',
    day: 'Domingo',
    time: '19:00',
    stage: 'Palco Alternativo',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  },
  {
    id: '4',
    name: 'Crimson Fire',
    genre: 'Hard Rock',
    day: 'Sexta',
    time: '20:00',
    stage: 'Palco Principal',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  },
  {
    id: '5',
    name: 'Cyber Punk',
    genre: 'Industrial Rock',
    day: 'Sábado',
    time: '18:00',
    stage: 'Palco Eletrônico',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  },
  {
    id: '6',
    name: 'Dark Angels',
    genre: 'Gothic Metal',
    day: 'Domingo',
    time: '21:30',
    stage: 'Palco Principal',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    spotify: '#',
    youtube: '#',
    instagram: '#',
    isFavorite: false
  }
];

export const LineupSection = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [bandsData, setBandsData] = useState<Band[]>([]);
  const { execute, isLoading, error } = useAsyncOperation('lineup-section');

  // Simula carregamento de dados das bandas
  useEffect(() => {
    execute(async () => {
      // Simula uma requisição para buscar dados das bandas
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBandsData(bands);
      return bands;
    }, {
      onError: (err) => {
        console.error('Erro ao carregar lineup:', err);
        toast.error('Erro ao carregar lineup das bandas');
      }
    });
  }, [execute]);

  const genres = ['Todos', ...Array.from(new Set(bandsData.map(band => band.genre)))];

  const filteredBands = selectedGenre === 'Todos' 
    ? bandsData 
    : bandsData.filter(band => band.genre === selectedGenre);

  const toggleFavorite = (bandId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bandId)) {
      newFavorites.delete(bandId);
      toast("Removido dos favoritos", {
        description: "Banda removida da sua lista de favoritos"
      });
    } else {
      newFavorites.add(bandId);
      toast("Adicionado aos favoritos! ⭐", {
        description: "Banda adicionada à sua lista de favoritos"
      });
    }
    setFavorites(newFavorites);
  };

  // Exibe loading enquanto carrega
  if (isLoading) {
    return (
      <section id="lineup" className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold uppercase text-white tracking-wider" style={{textShadow: '3px 3px 0px #ff2a2a, 6px 6px 10px rgba(255, 42, 42, 0.3)'}}>
              LINE-UP
            </h2>
            <p className="text-sm text-white/80 max-w-2xl mx-auto">
              Carregando as melhores bandas do rock...
            </p>
          </div>
          <div className="flex justify-center">
            <Loading 
              size="xl" 
              variant="dots" 
              text="Carregando lineup..." 
            />
          </div>
        </div>
      </section>
    );
  }

  // Exibe erro se houver falha
  if (error) {
    return (
      <section id="lineup" className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold uppercase text-white tracking-wider" style={{textShadow: '3px 3px 0px #ff2a2a, 6px 6px 10px rgba(255, 42, 42, 0.3)'}}>
              LINE-UP
            </h2>
          </div>
          <div className="flex justify-center">
            <div className="text-center max-w-md">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-white uppercase">Erro ao Carregar Lineup</h3>
              <p className="text-white/80 mb-6 text-sm">Não foi possível carregar as informações das bandas.</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-black font-bold uppercase"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="lineup" className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold uppercase text-white tracking-wider" style={{textShadow: '3px 3px 0px #ff2a2a, 6px 6px 10px rgba(255, 42, 42, 0.3)'}}>
            LINE-UP
          </h2>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            As maiores bandas de rock nacional e internacional em um só lugar
          </p>
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {genres.map((genre) => (
            <Button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-3 font-bold uppercase tracking-wide transition-all duration-300 border-2 ${
                selectedGenre === genre 
                  ? 'bg-red-600 text-black font-bold border-red-600' 
                  : 'bg-transparent border-white text-white hover:bg-red-600 hover:text-black'
              }`}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Bands Grid */}
        {filteredBands.length === 0 ? (
           <div className="flex justify-center py-16">
             <EmptyState 
               type="music"
               title="Nenhuma banda encontrada"
               description={`Não encontramos bandas para o gênero "${selectedGenre}". Tente outro filtro.`}
               action={{
                 label: "Ver Todas as Bandas",
                 onClick: () => setSelectedGenre('Todos')
               }}
             />
           </div>
         ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBands.map((band, index) => (
              <div
                key={band.id}
                className="bg-gray-900 border border-gray-700 p-4 group cursor-pointer hover:scale-105 transition-transform duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fade-in 0.6s ease-out forwards'
                }}
              >
              {/* Band Image */}
              <div className="relative overflow-hidden mb-4">
                <img
                  src={band.image}
                  alt={`Foto da banda ${band.name}, gênero ${band.genre}`}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(band.id);
                  }}
                  className={`absolute top-4 right-4 p-2 transition-all duration-300 ${
                    favorites.has(band.id)
                      ? 'text-red-500'
                      : 'text-white hover:text-red-500'
                  }`}
                  aria-label={`${favorites.has(band.id) ? 'Remover' : 'Adicionar'} ${band.name} dos favoritos`}
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.has(band.id) ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Performance Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Music className="w-4 h-4" />
                    <span>{band.day} • {band.time}</span>
                  </div>
                  <div className="text-blue-300 text-xs font-semibold">
                    {band.stage}
                  </div>
                </div>
              </div>

              {/* Band Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-yellow-400 drop-shadow-md text-2xl font-bold uppercase">
                    {band.name}
                  </h3>
                  {favorites.has(band.id) && (
                    <Star className="w-5 h-5 text-red-500 fill-current" />
                  )}
                </div>
                
                <p className="text-white text-xs">
                  {band.genre}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 pt-2">
                  {band.spotify && (
                    <Button
                      size="sm"
                      className="bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 text-xs font-bold uppercase"
                      onClick={() => window.open(band.spotify, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Spotify
                    </Button>
                  )}
                  {band.youtube && (
                    <Button
                      size="sm"
                      className="bg-black border border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-all duration-300 text-xs font-bold uppercase"
                      onClick={() => window.open(band.youtube, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      YouTube
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Favorites Counter */}
        {favorites.size > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-600/20 border border-red-600">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="text-white font-bold uppercase text-sm">
                {favorites.size} banda{favorites.size !== 1 ? 's' : ''} favorita{favorites.size !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};