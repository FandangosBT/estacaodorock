import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Music, Star } from 'lucide-react';
import { toast } from 'sonner';

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

  const genres = ['Todos', ...Array.from(new Set(bands.map(band => band.genre)))];

  const filteredBands = selectedGenre === 'Todos' 
    ? bands 
    : bands.filter(band => band.genre === selectedGenre);

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

  return (
    <section id="lineup" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gradient-neon uppercase tracking-wider">
            Line-up
          </h2>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            As maiores bandas de rock nacional e internacional em um só lugar
          </p>
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {genres.map((genre) => (
            <Button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedGenre === genre 
                  ? 'btn-neon-primary' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary border border-border'
              }`}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Bands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBands.map((band, index) => (
            <div
              key={band.id}
              className="card-neon group cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in 0.6s ease-out forwards'
              }}
            >
              {/* Band Image */}
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={band.image}
                  alt={band.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(band.id);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                    favorites.has(band.id)
                      ? 'bg-secondary text-secondary-foreground glow-secondary'
                      : 'bg-black/50 text-white hover:bg-secondary/20'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.has(band.id) ? 'fill-current' : ''}`} 
                  />
                </button>

                {/* Performance Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Music className="w-4 h-4" />
                    <span>{band.day} • {band.time}</span>
                  </div>
                  <div className="text-accent text-sm font-semibold">
                    {band.stage}
                  </div>
                </div>
              </div>

              {/* Band Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-glow-primary">
                    {band.name}
                  </h3>
                  {favorites.has(band.id) && (
                    <Star className="w-5 h-5 text-secondary fill-current" />
                  )}
                </div>
                
                <p className="text-accent font-semibold">
                  {band.genre}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 pt-2">
                  {band.spotify && (
                    <Button
                      size="sm"
                      className="btn-neon-accent"
                      onClick={() => window.open(band.spotify, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Spotify
                    </Button>
                  )}
                  {band.youtube && (
                    <Button
                      size="sm"
                      className="bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
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

        {/* Favorites Counter */}
        {favorites.size > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/20 rounded-full border border-secondary/30">
              <Heart className="w-5 h-5 text-secondary fill-current" />
              <span className="text-secondary font-semibold">
                {favorites.size} banda{favorites.size !== 1 ? 's' : ''} favorita{favorites.size !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};