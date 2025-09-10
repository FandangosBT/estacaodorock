import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Camera, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { HoverImageGallery } from '@/components/ui/hover-image-gallery';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Array limpo apenas com imagens existentes
const muralImages = [
  '/mural/1.png',
  '/mural/135.jpg',
  '/mural/160.jpg',
  '/mural/1954-EFS-Sorocabana-3.gif',
  '/mural/1970efSorocabana.jpg',
  '/mural/bercampos-arm.jpg',
  '/mural/bercampos60.jpg',
  '/mural/Bernadino_de_Campos_3446.jpg',
  '/mural/Bernadino_de_Campos_3741.jpg',
  '/mural/bernardino_de_campos.jpg',
  '/mural/bernardinodecampos9391.jpg',
  '/mural/bernardinodecampos9411.jpg',
  '/mural/berncampos50.jpg',
  '/mural/berncampos9401.jpg',
  '/mural/berncampos9961.jpg',
  '/mural/berncampos9971.jpg',
  '/mural/estacao-frente.png',
  '/mural/estacao-frente2.png',
  '/mural/ferrovia.png',
];

const mockPhotos = [
  {
    id: 1,
    image: muralImages[0],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  },
  {
    id: 2,
    image: muralImages[1],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  },
  {
    id: 3,
    image: muralImages[2],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  },
  {
    id: 4,
    image: muralImages[7],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  },
  {
    id: 5,
    image: muralImages[8],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  },
  {
    id: 6,
    image: muralImages[9],
    likes: 0,
    liked: false,
    caption: 'Legenda será adicionada posteriormente'
  }
];

// Criar dados completos para modal (todas as imagens do mural) com legendas específicas
const allMuralPhotos = muralImages.map((image, index) => {
  const captions = [
    'Estação em Julho/2006.',
    'Relatórios do IBGE de 1946 e 1955, mostrando a distância das estações. Após várias retificações (plano de modernização da EFS) nos trechos da ferrovia, principalmente na serra de Botucatú/SP, a distância até São Paulo foi encurtada. Estação Bernardino de Campos - 31/12/46 - km 451 / Estação Bernardino de Campos - 31/12/55 - km 403',
    'Relatórios do IBGE de 1946 e 1955, mostrando a distância das estações. Após várias retificações (plano de modernização da EFS) nos trechos da ferrovia, principalmente na serra de Botucatú/SP, a distância até São Paulo foi encurtada. Estação Bernardino de Campos - 31/12/46 - km 451 / Estação Bernardino de Campos - 31/12/55 - km 403',
    'Em 1954, a linha paralela ao rio Paranapanema, até Presidente Epitácio, era oficialmente considerada parte da Linha Tronco da Estrada de Ferro Sorocabana.',
    '"Ferrovias do Brasil 1970" - DNEF apresentação: Flavio R. Cavalcanti',
    'Armazém ao lado da estação, em 22/10/2000. Foto Ralph M. Giesbrecht',
    'A estação apinhada de gente, c. 1960. Note que ainda não existe a eletrificação no trecho. Foto dos arquivos do Museu da Cia. Paulista, Jundiaí',
    'Fábrica refinação de milho 1939/1940. Existia um ramal para atender esta indústria.',
    'Povoado Douradão (1886)',
    'Referência geográfica do IBGE/1939.',
    'A cidade de Bernardino de Campos em 1939 (O Estado de S. Paulo, 19/12/1939).',
    'Movimento da estação no ano de 1940 (O Estado de S. Paulo, 19/12/1939).',
    'A estação antiga de Bernardino de Campos, em foto sem data (anos 1930?). Foto cedida por Antonio Rapette',
    'Bilhete para ir de Bernardino de Campos a Cerqueira Cesar em primeira classe, provavelmente nos anos 1940.',
    'A estação em 26/4/1996. Foto Carlos R. Almeida',
    'Elétrica da FEPASA em frente à estação em 1997 (Foto Sergio Salgado).',
    'Fachada da estação em 2006.',
    'Estação Ferroviária de Bernardino de Campos',
    '', // ferrovia.png - sem legenda conforme solicitado
  ];
  return {
    id: index + 1,
    image,
    likes: 0,
    liked: false,
    caption: captions[index] || `Imagem histórica ${index + 1}`
  };
});

// Novo tipo para fotos da galeria de 2025 (manifest)
type GalleryPhoto = {
  id: number;
  thumb: string;
  original: string;
  download: string;
  likes: number;
  liked: boolean;
  caption: string; // sem metadados por enquanto
};

type Manifest = {
  year: number;
  count: number;
  basePath: string;
  items: { name: string; thumb: string; original: string; download: string }[];
};

export const GaleriaSection = () => {
  // Estado unificado para todas as fotos (grid + modal)
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([]);
  const [showModal, setShowModal] = useState(false);
  // Índice alvo (pedido pelo usuário)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Índice efetivamente exibido (para crossfade suave)
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [fadingOverlay, setFadingOverlay] = useState(false);
  // Portal root element for Modal para evitar overflow/transform em iOS
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    let el = document.getElementById('modal-root') as HTMLElement | null;
    let created = false;
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-root';
      document.body.appendChild(el);
      created = true;
    }
    setPortalEl(el);
    return () => {
      if (created && el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  // Carregar manifest da galeria 2025
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch('/galeria/2025/manifest.json', { signal: controller.signal });
        if (!res.ok) throw new Error('Falha ao carregar manifest da galeria');
        const manifest: Manifest = await res.json();
        if (cancelled) return;
        const photos: GalleryPhoto[] = manifest.items.map((it, idx) => ({
          id: idx + 1,
          thumb: it.thumb,
          original: it.original,
          download: it.download || it.original,
          likes: 0,
          liked: false,
          caption: ''
        }));
        setAllPhotos(photos);
      } catch (e) {
        // fallback silencioso: mantém vazio; poderia exibir um aviso no futuro
        console.error(e);
      }
    }
    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);
  
  // Prefetch das imagens vizinhas para transições mais rápidas
  useEffect(() => {
    if (!allPhotos.length) return;
    const nextIdx = (displayedIndex + 1) % allPhotos.length;
    const prevIdx = (displayedIndex - 1 + allPhotos.length) % allPhotos.length;
    const preload = (idx: number) => {
      const url = allPhotos[idx]?.original;
      if (!url) return;
      const img = new Image();
      img.src = url;
    };
    preload(nextIdx);
    preload(prevIdx);
  }, [displayedIndex, allPhotos]);
  
  // Refs para foco e acessibilidade
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Refs de layout: header e footer do modal para cálculo de altura disponível
  const headerElRef = useRef<HTMLDivElement>(null);
  const footerElRef = useRef<HTMLDivElement>(null);
  // Refs para medir e adaptar (ResizeObserver) e para swipe
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const activeImageRef = useRef<HTMLImageElement>(null);
  const overlayImageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // Derivar fotos da grid a partir do estado unificado (primeiras 6)
  const gridPhotos = allPhotos.slice(0, 6);

  // Função unificada para curtir (funciona tanto na grid quanto no modal)
  const handleLike = (photoIndex: number, isGridPhoto = false) => {
    if (isGridPhoto) {
      // Se for da grid, encontrar o índice correspondente no array completo
      const actualIndex = photoIndex - 1; // IDs 1-6 para a grid
      setAllPhotos(prev => prev.map((photo, idx) => 
        idx === actualIndex 
          ? { 
              ...photo, 
              liked: !photo.liked, 
              likes: photo.liked ? photo.likes - 1 : photo.likes + 1 
            }
          : photo
      ));
    } else {
      // Se for do modal, usar o índice diretamente
      setAllPhotos(prev => prev.map((photo, idx) => 
        idx === photoIndex 
          ? { 
              ...photo, 
              liked: !photo.liked, 
              likes: photo.liked ? photo.likes - 1 : photo.likes + 1 
            }
          : photo
      ));
    }
  };

  const startTransitionTo = (nextIdx: number) => {
    if (!allPhotos.length) return;
    if (nextIdx === displayedIndex) return;
    setPrevIndex(displayedIndex);
    setDisplayedIndex(nextIdx);
    setBaseLoaded(false);
    setFadingOverlay(false);
  };

  const nextImage = () => {
    if (!allPhotos.length) return;
    const nextIdx = (displayedIndex + 1) % allPhotos.length;
    startTransitionTo(nextIdx);
  };

  const prevImage = () => {
    if (!allPhotos.length) return;
    const prevIdx = (displayedIndex - 1 + allPhotos.length) % allPhotos.length;
    startTransitionTo(prevIdx);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Swipe em dispositivos touch (modal)
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchStartTime.current = Date.now();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    // Mantém para futura ampliação (poderia adicionar feedback visual)
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = Math.abs(t.clientY - touchStartY.current);
    const dt = Date.now() - touchStartTime.current;

    const SWIPE_THRESHOLD = 50; // px
    const SWIPE_TIME = 600; // ms
    const MAX_VERTICAL_DRIFT = 80; // px

    if (Math.abs(dx) > SWIPE_THRESHOLD && dt < SWIPE_TIME && dy < MAX_VERTICAL_DRIFT) {
      if (dx < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Adaptar altura do container da imagem com ResizeObserver (altura baseada no viewport menos header/footer)
  useEffect(() => {
    if (!showModal) return;
    const container = imageContainerRef.current;
    if (!container) return;

    const updateFromImage = () => {
      const headerH = headerElRef.current?.getBoundingClientRect().height ?? 0;
      const footerH = footerElRef.current?.getBoundingClientRect().height ?? 0;
      const margin = 28; // folga visual
      const byViewport = Math.floor(window.innerHeight * 0.88);
      const available = Math.max(220, Math.min(window.innerHeight - headerH - footerH - margin, byViewport));
      container.style.height = `${available}px`;
    };

    const ro = new ResizeObserver(() => updateFromImage());
    if (activeImageRef.current) ro.observe(activeImageRef.current);
    window.addEventListener('resize', updateFromImage);
    // chamada inicial
    updateFromImage();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateFromImage);
      if (container) container.style.height = '';
    };
  }, [showModal, displayedIndex, baseLoaded]);

  // Navegação por teclado e foco inicial
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
      }
    };

    // Foco inicial no botão fechar para acessibilidade
    const focusCloseButton = () => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Timeout para garantir que o modal foi renderizado
    const focusTimeout = setTimeout(focusCloseButton, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimeout);
    };
  }, [showModal]);

  const currentPhoto = allPhotos[displayedIndex];
const isLongCaption = false; // sem metadados longos por enquanto
const captionRef = useRef<HTMLDivElement>(null);
const [hasOverflow, setHasOverflow] = useState(false);
const [isAtBottom, setIsAtBottom] = useState(false);
const showIndicator = isLongCaption && hasOverflow && !isAtBottom;

useEffect(() => {
  if (!isLongCaption) {
    setHasOverflow(false);
    setIsAtBottom(false);
    return;
  }
  const el = captionRef.current;
  if (!el) return;
  const check = () => {
    const overflow = el.scrollHeight > el.clientHeight + 1;
    setHasOverflow(overflow);
    setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
  };
  check();
  const ro = new ResizeObserver(() => check());
  ro.observe(el);
  return () => {
    ro.disconnect();
  };
}, [isLongCaption, displayedIndex, showModal]);

  // Quando a imagem base carregar, inicia fade-out do overlay (imagem anterior)
  useEffect(() => {
    if (prevIndex !== null && baseLoaded) {
      // inicia fade no próximo frame para garantir transição
      const id = requestAnimationFrame(() => setFadingOverlay(true));
      return () => cancelAnimationFrame(id);
    }
  }, [prevIndex, baseLoaded]);

const handleCaptionScroll = () => {
  const el = captionRef.current;
  if (!el) return;
  setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
};

  const Modal = ({ children, title }: { children: ReactNode; title: string }) => {
    // Travar scroll do body enquanto o modal estiver aberto
    useEffect(() => {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }, []);

    const content = (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 [perspective:800px] [transform-style:preserve-3d]"
        >
          {/* Overlay animado com blur */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
            onClick={closeModal}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />

          {/* Card com borda gradiente e glassmorphism */
          // Ajustado para o cartão se adaptar ao tamanho real da imagem (sem largura forçada)
          }
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 w-full max-w-[min(1200px,calc(100vw-2rem))] max-h-[92vh] flex flex-col overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.95, rotateX: 8, y: 12 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, rotateX: 4, y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="p-[1px] rounded-2xl bg-gradient-to-r from-[#ff2a2a] via-[#ffbd00] to-[#ff2a2a]">
              <div className="relative bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl">
                {/* Brilho superior sutil */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl"
                  aria-hidden="true"
                />

                {/* Header */}
                <div ref={headerElRef} className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
                  <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                    {title}
                  </h2>
                  <div className="flex items-center gap-2">
                    {currentPhoto && (
                      <a
                        href={currentPhoto.download}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-white/40 focus:outline-none"
                        aria-label="Baixar imagem original"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      ref={closeButtonRef}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeModal();
                      }}
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-white/40 focus:outline-none"
                      aria-label="Fechar galeria (pressione ESC)"
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </>
    );

    if (typeof window === 'undefined') return null;
    if (!portalEl) return null;
    return createPortal(content, portalEl);
  };

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="galeria-title" className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#f0f0f0] text-center drop-shadow-[0_0_4px_#ff2a2a] mb-4">
            Nossa Última Edição
          </h2>
          <p className="text-center text-white/80 max-w-3xl mx-auto text-lg md:text-xl mb-10">
            O Estação Rock Festival 2025 foi um sucesso! Confira nas imagens.
          </p>
          
          {/* Hover Image Gallery - Seção Especial */}
          <div className="mb-16 flex flex-col items-center">
            <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide text-[#ffbd00] text-center mb-2">
              GALERIA INTERATIVA
            </h3>
            <p className="text-[#f0f0f0] text-center text-sm uppercase font-medium mb-8 opacity-80">
              Passe o mouse (desktop) ou toque/arraste (mobile) para navegar
            </p>
            <div className="flex justify-center">
              <HoverImageGallery 
                images={(allPhotos.length ? allPhotos.slice(0, 5).map(p => p.original) : muralImages.slice(0, 5))}
              />
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {gridPhotos.map((photo) => (
              <div 
                key={photo.id}
                className="relative border border-white/10 bg-[#111] rounded-md overflow-hidden shadow-md transition hover:scale-[1.01]"
              >
                {/* Fitas Adesivas Decorativas */}
                <div className="absolute top-0 left-1/4 w-8 h-4 bg-[#ffbd00] transform -rotate-[6deg] z-10 opacity-80"></div>
                <div className="absolute bottom-0 right-1/3 w-6 h-3 bg-[#ffbd00] transform rotate-[3deg] z-10 opacity-80"></div>

                {/* Photo */}
                <img 
                  src={photo.thumb}
                  alt={photo.caption || `Foto ${photo.id}`}
                  className="w-full h-auto object-cover aspect-square"
                  loading="lazy"
                />

                {/* Removido: botões de curtir nas thumbs */}
              </div>
            ))}
          </div>

          {/* Ver Mais Button */}
          <div className="text-center mt-12">
            <button
              onClick={openModal}
              className="bg-[#ff2a2a] text-[#f0f0f0] px-6 py-3 rounded-lg uppercase font-bold border border-white/10 hover:bg-[#e02121] transition-all hover:scale-105 focus:ring-2 focus:ring-white/30 focus:outline-none flex items-center gap-2 mx-auto"
              aria-label="Abrir galeria completa com todas as fotos"
            >
              <Camera className="w-5 h-5" />
              VER MAIS FOTOS
            </button>
          </div>

          {/* Modal do Carrossel */}
          <AnimatePresence initial={false} mode="wait">
            {showModal && (
              <Modal title="Galeria Completa">
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Container da Imagem - Crossfade suave (overlay da anterior sobre a nova) */}
                  <div
                    ref={imageContainerRef}
                    className="relative flex items-center justify-center w-full max-h-[85vh] px-2 md:px-4"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Seta Esquerda - Posição Fixa */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                      aria-label="Imagem anterior (seta esquerda)"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      type="button"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Imagem base (nova) - não absoluta: define a largura do modal */}
                    <img
                      ref={activeImageRef}
                      src={currentPhoto?.original}
                      alt={currentPhoto?.caption || `Foto ${displayedIndex + 1}`}
                      className="w-auto h-auto max-h-full max-w-full object-contain shadow-2xl select-none"
                      onLoad={() => setBaseLoaded(true)}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                      draggable={false}
                    />

                    {/* Overlay com a imagem anterior (fade-out) */}
                    {prevIndex !== null && (
                      <div
                        className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ease-in-out ${fadingOverlay ? 'opacity-0' : 'opacity-100'}`}
                        onTransitionEnd={() => {
                          // Finaliza overlay apos o fade-out
                          setPrevIndex(null);
                          setFadingOverlay(false);
                        }}
                      >
                        <img
                          ref={overlayImageRef}
                          src={allPhotos[prevIndex]?.original}
                          alt={allPhotos[prevIndex!]?.caption || `Foto ${prevIndex + 1}`}
                          className="w-auto h-auto max-h-full max-w-full object-contain shadow-2xl select-none"
                          draggable={false}
                        />
                      </div>
                    )}

                    {/* Seta Direita - Posição Fixa */}
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                      aria-label="Próxima imagem (seta direita)"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                      type="button"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Contador - Posição Consistente */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-10">
                      {displayedIndex + 1} / {allPhotos.length}
                    </div>
                  </div>

                  {/* Info da Imagem - Layout Melhorado */}
                  <div ref={footerElRef} className="p-4 md:p-6 border-t border-white/10 bg-black/50 backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {isLongCaption ? (
                          <div className="relative">
                            <div
                              id="caption-scroll"
                              ref={captionRef}
                              onScroll={handleCaptionScroll}
                              role="region"
                              aria-label="Legenda completa (role para ver tudo)"
                              tabIndex={0}
                              className="text-white font-medium mb-2 text-base leading-relaxed max-h-[45vh] sm:max-h-40 md:max-h-48 overflow-y-auto pr-2 touch-pan-y overscroll-y-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                            >
                              {currentPhoto?.caption}
                            </div>
                            {showIndicator && (
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-black/60 flex items-end justify-end px-2 pb-1 transition-opacity duration-300"
                              >
                                <span className="text-white/70 text-[11px] uppercase tracking-wide bg-black/30 rounded px-1.5 py-0.5">
                                  role para ver tudo
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-white font-medium mb-2 text-base leading-relaxed">
                            {currentPhoto?.caption}
                          </p>
                        )}
                        <p className="text-white/60 text-sm">
                          Imagem {displayedIndex + 1} de {allPhotos.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// Removido: LinkPreview (Wikipedia) e dependências associadas
