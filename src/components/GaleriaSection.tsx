import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Camera, Star, Crown, Upload } from 'lucide-react';

const mockPhotos = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop",
    likes: 47,
    username: "@rockfan_2025",
    isTop: true,
    isRockstar: false,
    liked: false
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop",
    likes: 23,
    username: "@metalhead_sp",
    isTop: false,
    isRockstar: true,
    liked: true
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=300&fit=crop",
    likes: 89,
    username: "@festival_lover",
    isTop: true,
    isRockstar: true,
    liked: false
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    likes: 12,
    username: "@rocknroll_life",
    isTop: false,
    isRockstar: false,
    liked: false
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    likes: 156,
    username: "@guitar_hero",
    isTop: true,
    isRockstar: true,
    liked: true
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=300&fit=crop",
    likes: 34,
    username: "@rock_goddess",
    isTop: false,
    isRockstar: false,
    liked: false
  }
];

export const GaleriaSection = () => {
  const [photos, setPhotos] = useState(mockPhotos);

  const handleLike = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            liked: !photo.liked, 
            likes: photo.liked ? photo.likes - 1 : photo.likes + 1 
          }
        : photo
    ));
  };

  return (
    <section className="min-h-screen bg-background py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-electric via-primary to-accent bg-clip-text text-transparent">
            GALERIA SOCIAL
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Compartilhe sua experiência! Envie suas fotos e concorra aos prêmios especiais do festival.
          </p>
          
          {/* Upload Button */}
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-electric to-accent hover:from-electric-glow hover:to-accent-glow text-black font-bold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-electric/50"
          >
            <Camera className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Envie sua Selfie!
            <Upload className="ml-2 h-4 w-4 group-hover:translate-y-[-2px] transition-transform" />
          </Button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className="relative group"
            >
              {/* Polaroid Card */}
              <div className="bg-white p-4 rounded-lg shadow-2xl transform rotate-1 group-hover:rotate-0 transition-all duration-300 hover:scale-105 relative">
                {/* Top Badges */}
                {photo.isTop && (
                  <div className="absolute -top-2 -right-2 z-20">
                    <Badge className="bg-gradient-to-r from-electric to-accent text-black font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      <Crown className="w-3 h-3 mr-1" />
                      TOP DA GALERA
                    </Badge>
                  </div>
                )}

                {photo.isRockstar && (
                  <div className="absolute -top-2 -left-2 z-20">
                    <Badge className="bg-gradient-to-r from-accent to-primary text-white font-bold px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      ROCKSTAR DO DIA
                    </Badge>
                  </div>
                )}

                {/* Photo */}
                <div className="aspect-square overflow-hidden rounded-md mb-4 bg-muted">
                  <img 
                    src={photo.image} 
                    alt={`Foto de ${photo.username}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Photo Info */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{photo.username}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(photo.id)}
                      className={`p-2 transition-all duration-200 ${
                        photo.liked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-all duration-200 ${
                          photo.liked ? 'fill-current scale-110' : 'hover:scale-110'
                        }`} 
                      />
                    </Button>
                    <span className="text-sm font-medium text-gray-600">{photo.likes}</span>
                  </div>
                </div>

                {/* Tape Effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-6 bg-yellow-200 opacity-80 rounded-sm shadow-md transform rotate-12"></div>
                </div>
              </div>

              {/* Floating Effects for Top Photos */}
              {photo.isTop && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 right-4 w-8 h-8 bg-electric rounded-full opacity-30 animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-accent rounded-full opacity-40 animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="p-6 bg-card rounded-xl border border-electric/20 shadow-lg">
              <div className="text-3xl font-bold text-electric mb-2">247</div>
              <div className="text-muted-foreground">Fotos Enviadas</div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-accent/20 shadow-lg">
              <div className="text-3xl font-bold text-accent mb-2">1.2k</div>
              <div className="text-muted-foreground">Curtidas</div>
            </div>
            <div className="p-6 bg-card rounded-xl border border-primary/20 shadow-lg">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">Rockstars do Dia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};