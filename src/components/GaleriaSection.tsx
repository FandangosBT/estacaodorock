import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  // Grid completo dentro do modal
  const [gridCount, setGridCount] = useState(60);
  const gridSentinelRef = useRef<HTMLDivElement | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  // Índice alvo (pedido pelo usuário)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Índice efetivamente exibido (para crossfade suave)
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [baseLoaded, setBaseLoaded] = useState(false);
  const [fadingOverlay, setFadingOverlay] = useState(false);
  // Fonte da imagem de overlay (pode ser o thumb ao abrir a viewer)
  const [overlaySrc, setOverlaySrc] = useState<string | null>(null);
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

  // Dev helper: abrir o modal automaticamente com hash #openGallery (somente em dev)
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.hash.includes('openGallery')) {
      setShowModal(true);
      setViewerOpen(false);
      setTimeout(() => { try { modalRef.current?.scrollTo?.({ top: 0 }); } catch {} }, 50);
    }
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
    // Usa a imagem atual como overlay durante a transição
    setPrevIndex(displayedIndex);
    setOverlaySrc(allPhotos[displayedIndex]?.original || null);
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
    setViewerOpen(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setViewerOpen(false);
  };

  const openViewerAt = (idx: number) => {
    // Exibe o thumb imediatamente como overlay enquanto carrega o original
    setDisplayedIndex(idx);
    setPrevIndex(idx);
    setOverlaySrc(allPhotos[idx]?.thumb || null);
    setBaseLoaded(false);
    setFadingOverlay(false);
    setViewerOpen(true);
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

    const getViewportHeight = () => (typeof window !== 'undefined' && (window as any).visualViewport?.height) || window.innerHeight;

    const updateFromImage = () => {
      const headerH = headerElRef.current?.getBoundingClientRect().height ?? 0;
      const footerH = footerElRef.current?.getBoundingClientRect().height ?? 0;
      const margin = 24; // folga visual menor para maximizar a área da imagem
      const viewportH = getViewportHeight();
      const maxByViewport = Math.floor(viewportH * 0.92);
      const available = Math.max(200, Math.min(viewportH - headerH - footerH - margin, maxByViewport));
      container.style.height = `${available}px`;

      // Ajusta a largura do card do modal para acompanhar a largura ideal da imagem
      const img = activeImageRef.current;
      const card = modalRef.current;
      if (img && card && img.naturalWidth && img.naturalHeight) {
        const aspect = img.naturalWidth / img.naturalHeight;
        const idealWidth = Math.min(Math.floor(available * aspect), Math.floor(window.innerWidth - 32));
        // Limite superior opcional para não exceder designs grandes
        const clamped = Math.max(280, Math.min(idealWidth, 1200));
        card.style.width = `${clamped}px`;
      }
    };

    const ro = new ResizeObserver(() => updateFromImage());
    if (activeImageRef.current) ro.observe(activeImageRef.current);

    // Ouvir mudanças de viewport visual (iOS toolbars, etc.)
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const onVVResize = () => updateFromImage();
    vv?.addEventListener?.('resize', onVVResize);
    vv?.addEventListener?.('scroll', onVVResize);

    window.addEventListener('resize', updateFromImage);
    // chamada inicial e após baseLoaded para garantir cálculo com dimensões reais
    updateFromImage();

    return () => {
      ro.disconnect();
      vv?.removeEventListener?.('resize', onVVResize);
      vv?.removeEventListener?.('scroll', onVVResize);
      window.removeEventListener('resize', updateFromImage);
      if (container) container.style.height = '';
      if (modalRef.current) modalRef.current.style.width = '';
    };
  }, [showModal, viewerOpen, displayedIndex, baseLoaded]);

  // Navegação por teclado e foco inicial
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (viewerOpen) {
            setViewerOpen(false);
          } else {
            closeModal();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (viewerOpen) prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (viewerOpen) nextImage();
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
  }, [showModal, viewerOpen]);

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

  // Grid incremental: observar sentinela e aumentar contagem
  useEffect(() => {
    if (!showModal) return;
    const el = gridSentinelRef.current;
    if (!el) return;
    const step = 60;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setGridCount((c) => Math.min((allPhotos?.length || 0), c + step));
        }
      });
    }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [showModal, allPhotos?.length]);

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transform-gpu will-change-transform [backface-visibility:hidden]"
        >
          {/* Overlay animado com blur */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            aria-hidden="true"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Card com borda gradiente e glassmorphism */
          // Ajustado para o cartão se adaptar ao tamanho real da imagem (sem largura forçada)
          }
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative z-10 w-full max-w-[min(1200px,calc(100vw-2rem))] h-[92vh] max-h-[92vh] flex flex-col min-h-0 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95, rotateX: 8, y: 12 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, rotateX: 4, y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div className="p-[1px] h-full rounded-2xl bg-gradient-to-r from-[#ff2a2a] via-[#ffbd00] to-[#ff2a2a]">
              <div className="relative h-full bg-black/70 border border-white/10 rounded-2xl flex flex-col min-h-0">
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
                    <button
                      ref={closeButtonRef}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Se o viewer estiver aberto, fecha apenas o viewer e retorna ao grid
                        if (viewerOpen) {
                          setViewerOpen(false);
                        } else {
                          // Caso contrário, fecha o modal completo
                          closeModal();
                        }
                      }}
                      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-white/40 focus:outline-none"
                      aria-label={viewerOpen ? "Fechar visualização e voltar ao grid" : "Fechar galeria (pressione ESC)"}
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
                  srcSet={`${photo.thumb} 320w, ${photo.thumb} 480w, ${photo.original} 800w`}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 33vw"
                  alt={photo.caption || `Foto ${photo.id}`}
                  className="w-full h-auto object-cover aspect-square"
                  loading="lazy"
                  decoding="async"
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
                <div className="relative flex flex-col flex-1 min-h-0">
                  {/* GRID de thumbs rolável */}
                  <div data-testid="gallery-grid-scroll" className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-3 pt-3 pb-4 transform-gpu will-change-transform [backface-visibility:hidden] [contain:paint]" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
                    {allPhotos.length === 0 ? (
                      <div className="text-center text-white/70 py-10">Carregando fotos…</div>
                    ) : (
                      <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {allPhotos.slice(0, gridCount).map((p, idx) => (
                          <li key={idx}>
                            <button
                              type="button"
                              onClick={() => openViewerAt(idx)}
                              className="group w-full h-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 rounded-md overflow-hidden border border-white/10 bg-black/30"
                            >
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                  src={p.thumb}
                                  alt={p.caption || `Foto ${idx + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {allPhotos.length > gridCount && (
                      <div ref={gridSentinelRef} className="h-8 w-full" aria-hidden="true" />
                    )}
                  </div>

                  {/* LIGHTBOX overlay dentro do modal */}
                  {viewerOpen && (
                    <div className="absolute inset-0 z-20 bg-black/60">
                      <div className="absolute inset-0 flex flex-col">
                        <div
                          ref={imageContainerRef}
                          className="relative flex items-center justify-center w-full flex-1 px-2 md:px-4 transform-gpu will-change-transform [backface-visibility:hidden]"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-md z-10">
                            {displayedIndex + 1} / {allPhotos.length}
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                            aria-label="Imagem anterior"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                            type="button"
                          >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                          </button>

                          <img
                            ref={activeImageRef}
                            src={allPhotos[displayedIndex]?.original}
                            alt={allPhotos[displayedIndex]?.caption || `Foto ${displayedIndex + 1}`}
                            className="w-auto h-auto max-h-full max-w-full object-contain shadow-2xl select-none transform-gpu [backface-visibility:hidden] will-change-transform"
                            onLoad={() => setBaseLoaded(true)}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                            draggable={false}
                          />

                          {prevIndex !== null && (
                            <div
                              className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ease-in-out pointer-events-none transform-gpu [backface-visibility:hidden] will-change-opacity ${fadingOverlay ? 'opacity-0' : 'opacity-100'}`}
                              onTransitionEnd={() => { setPrevIndex(null); setFadingOverlay(false); setOverlaySrc(null); }}
                            >
                              <img
                                ref={overlayImageRef}
                                src={overlaySrc || allPhotos[prevIndex]?.original}
                                alt={allPhotos[prevIndex!]?.caption || `Foto ${prevIndex + 1}`}
                                className="w-auto h-auto max-h-full max-w-full object-contain shadow-2xl select-none transform-gpu [backface-visibility:hidden] will-change-transform"
                                draggable={false}
                              />
                            </div>
                          )}

                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                            aria-label="Próxima imagem"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                            type="button"
                          >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                        </div>

                        <div ref={footerElRef} className="p-3 md:p-4 border-t border-white/10 bg-black/70">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 font-medium text-sm md:text-base leading-relaxed">
                                {allPhotos[displayedIndex]?.caption}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setViewerOpen(false)}
                                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-white/40 focus:outline-none"
                                aria-label="Fechar visualização"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
