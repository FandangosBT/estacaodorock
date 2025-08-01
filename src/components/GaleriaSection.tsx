import { useState } from 'react';
import { Heart, Camera, Star, Crown, Upload } from 'lucide-react';
import { HoverImageGallery } from '@/components/ui/hover-image-gallery';

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
    <section id="galeria" className="bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold uppercase tracking-wide text-[#f0f0f0] text-center drop-shadow-[0_0_4px_#ff2a2a] mb-4">
            MURAL DO CAOS
          </h2>
          <p className="text-[#ffbd00] text-center text-sm uppercase font-medium mt-2 mb-6">
            Mostre sua rebeldia! Envie suas fotos e entre na galeria dos destemidos.
          </p>
          
          {/* Upload Button */}
          <button className="bg-[#ff2a2a] text-[#f0f0f0] px-4 py-2 rounded uppercase font-semibold border border-white/10 hover:bg-[#e02121] transition flex items-center gap-2 mx-auto">
            <span className="text-lg">📸</span>
            MANDE SUA FOTO!
          </button>
        </div>

        {/* Hover Image Gallery - Seção Especial */}
        <div className="mb-16 flex flex-col items-center">
          <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide text-[#ffbd00] text-center mb-2">
            GALERIA INTERATIVA
          </h3>
          <p className="text-[#f0f0f0] text-center text-sm uppercase font-medium mb-8 opacity-80">
            Passe o mouse sobre as imagens para navegar
          </p>
          <div className="flex justify-center">
            <HoverImageGallery 
              images={[
                "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=550&h=550&fit=crop",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=550&h=550&fit=crop",
                "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=550&h=550&fit=crop",
                "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=550&h=550&fit=crop",
                "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=550&h=550&fit=crop"
              ]}
            />
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className="relative border border-white/10 bg-[#111] rounded-md overflow-hidden shadow-md transition hover:scale-[1.01]"
            >
              {/* Top Badges - Fitas Adesivas */}
              {photo.isTop && (
                <div className="absolute top-2 left-2 z-10 bg-[#ff2a2a] text-[#f0f0f0] px-2 py-1 text-xs font-bold uppercase tracking-wide transform -rotate-[6deg] border border-white/20">
                  <Crown className="w-3 h-3 mr-1 inline" />
                  TOP
                </div>
              )}

              {photo.isRockstar && (
                <div className="absolute top-2 right-2 z-10 bg-[#ff2a2a] text-[#f0f0f0] px-2 py-1 text-xs font-bold uppercase tracking-wide transform rotate-[3deg] border border-white/20">
                  <Star className="w-3 h-3 mr-1 fill-current inline" />
                  ROCKSTAR
                </div>
              )}

              {/* Fitas Adesivas Decorativas */}
              <div className="absolute top-0 left-1/4 w-8 h-4 bg-[#ffbd00] transform -rotate-[6deg] z-10 opacity-80"></div>
              <div className="absolute bottom-0 right-1/3 w-6 h-3 bg-[#ffbd00] transform rotate-[3deg] z-10 opacity-80"></div>

              {/* Photo */}
              <img 
                src={photo.image} 
                alt={`Foto de ${photo.username}`}
                className="w-full h-auto object-cover aspect-square"
              />

              {/* Username */}
              <div className="text-white text-xs font-bold px-4 mt-2 uppercase tracking-tight">
                {photo.username}
              </div>

              {/* Curtidas */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#0f0f0f]/80 px-2 py-1 rounded-full border border-white/10">
                <button
                  onClick={() => handleLike(photo.id)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      photo.liked ? 'fill-current text-[#ff2a2a]' : 'text-[#ff2a2a]'
                    }`} 
                  />
                </button>
                <span className="text-[#f0f0f0] text-sm">{photo.likes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-white/20 rounded-md p-6 text-center">
              <div className="text-3xl font-bold text-[#ff2a2a] mb-2">247</div>
              <div className="text-[#f0f0f0] text-sm uppercase font-medium">Fotos Enviadas</div>
            </div>
            <div className="bg-[#111] border border-white/20 rounded-md p-6 text-center">
              <div className="text-3xl font-bold text-[#ff2a2a] mb-2">1.2k</div>
              <div className="text-[#f0f0f0] text-sm uppercase font-medium">Curtidas</div>
            </div>
            <div className="bg-[#111] border border-white/20 rounded-md p-6 text-center">
              <div className="text-3xl font-bold text-[#ff2a2a] mb-2">12</div>
              <div className="text-[#f0f0f0] text-sm uppercase font-medium">Rockstars do Dia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};