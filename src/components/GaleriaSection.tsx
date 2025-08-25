import { useState, useEffect, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Heart, Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { HoverImageGallery } from '@/components/ui/hover-image-gallery';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

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

export const GaleriaSection = () => {
  // Estado unificado para todas as fotos (grid + modal)
  const [allPhotos, setAllPhotos] = useState(allMuralPhotos);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  
  // Refs para foco e acessibilidade
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Refs para medir e adaptar (ResizeObserver) e para swipe
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // Derivar fotos da grid a partir do estado unificado
  const gridPhotos = allPhotos.slice(0, 6).map((photo, index) => ({
    ...photo,
    id: index + 1 // IDs da grid (1-6)
  }));

  // Função unificada para curtir (funciona tanto na grid quanto no modal)
  const handleLike = (photoIndex: number, isGridPhoto = false) => {
    if (isGridPhoto) {
      // Se for da grid, encontrar o índice correspondente no array completo
      const actualIndex = photoIndex - 1; // Grid usa IDs 1-6, array usa índices 0-5
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
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

  // Adaptar altura do container da imagem com ResizeObserver
  useEffect(() => {
    if (!showModal) return;
    const img = imageRef.current;
    const container = imageContainerRef.current;
    if (!img || !container) return;

    const updateFromImage = () => {
      const rect = img.getBoundingClientRect();
      const styles = window.getComputedStyle(container);
      const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const target = Math.min(rect.height + paddingY, window.innerHeight * 0.75);
      const finalH = Math.max(300, target);
      container.style.height = `${finalH}px`;
    };

    const ro = new ResizeObserver(() => updateFromImage());
    ro.observe(img);
    window.addEventListener('resize', updateFromImage);
    // chamada inicial
    updateFromImage();

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateFromImage);
      // limpa altura customizada ao fechar ou trocar imagem
      if (container) container.style.height = '';
    };
  }, [showModal, currentImageIndex]);

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

  const currentPhoto = allPhotos[currentImageIndex];
const isLongCaption = currentImageIndex === 1 || currentImageIndex === 2;
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
    setIsBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
  };
  check();
  const ro = new ResizeObserver(() => check());
  ro.observe(el);
  return () => {
    ro.disconnect();
  };
}, [isLongCaption, currentImageIndex, showModal]);

const handleCaptionScroll = () => {
  const el = captionRef.current;
  if (!el) return;
  setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
};

  const Modal = ({ children, title }: { children: ReactNode; title: string }) => {
    const content = (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-6xl max-h-[95vh] overflow-hidden bg-black/90 border border-white/20 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <h2 id="modal-title" className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              {title}
            </h2>
            <button
              ref={closeButtonRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
              }}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition focus:ring-2 focus:ring-white/30 focus:outline-none"
              aria-label="Fechar galeria (pressione ESC)"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );

    if (typeof window === 'undefined') return null;
    if (!portalEl) return null;
    return createPortal(content, portalEl);
  };

  return (
    <motion.section id="galeria" aria-labelledby="galeria-title" className="bg-black py-20 px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="galeria-title" className="text-5xl lg:text-6xl font-bold uppercase tracking-wide text-[#f0f0f0] text-center drop-shadow-[0_0_4px_#ff2a2a] mb-4">
            Um Pedaço da História
          </h2>
          <p className="text-center text-white/80 max-w-3xl mx-auto text-lg md:text-xl mb-10">
            Conheça um pedacinho da história da{" "}
            <LinkPreview href="https://pt.wikipedia.org/wiki/Linha_Tronco_(Estrada_de_Ferro_Sorocabana)">
              <span className="font-semibold">Linha Tronco da Estrada de Ferro Sorocabana</span>
            </LinkPreview>
          </p>
          
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
                images={muralImages.slice(0, 5)}
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
                  src={photo.image} 
                  alt={photo.caption}
                  className="w-full h-auto object-cover aspect-square"
                />

                {/* Curtidas */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#0f0f0f]/80 px-2 py-1 rounded-full border border-white/10">
                  <button
                    onClick={() => handleLike(photo.id, true)}
                    className="p-1 hover:scale-110 transition-transform focus:ring-2 focus:ring-white/30 focus:outline-none rounded-full"
                    aria-label={`${photo.liked ? 'Remover' : 'Adicionar'} curtida`}
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
          {showModal && (
            <Modal title="Galeria Completa">
              <div className="flex flex-col flex-1 min-h-0">
                {/* Container da Imagem - Responsivo via ResizeObserver e sem onLoad */}
                <div
                  ref={imageContainerRef}
                  className="bg-white relative flex items-center justify-center max-h-[75vh] px-16 py-4"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Seta Esquerda - Posição Fixa */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                    aria-label="Imagem anterior (seta esquerda)"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Imagem central (sem onLoad) */}
                  <img
                    ref={imageRef}
                    src={currentPhoto.image}
                    alt={currentPhoto.caption}
                    className="max-h-full max-w-full object-contain shadow-2xl"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />

                  {/* Seta Direita - Posição Fixa */}
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all duration-200 focus:ring-2 focus:ring-white/30 focus:outline-none shadow-lg"
                    aria-label="Próxima imagem (seta direita)"
                    style={{ minWidth: '44px', minHeight: '44px' }}
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Contador - Posição Consistente */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-10">
                    {currentImageIndex + 1} / {allPhotos.length}
                  </div>
                </div>

                {/* Info da Imagem - Layout Melhorado */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-black/50 backdrop-blur-sm flex-shrink-0">
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
                            {currentPhoto.caption}
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
                          {currentPhoto.caption}
                        </p>
                      )}
                    <p className="text-white/60 text-sm">
                      Imagem {currentImageIndex + 1} de {allPhotos.length}
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// Link preview minimalista para Wikipedia, com fallback de imagem
function LinkPreview({
  href,
  children,
  fallbackSrc = "/article-preview.png",
}: {
  href: string;
  children: ReactNode;
  fallbackSrc?: string;
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ title?: string; description?: string; image?: string; site?: string } | null>(null)

  const url = useMemo(() => {
    try { return new URL(href) } catch { return null }
  }, [href])

  const domain = url?.hostname.replace(/^www\./, "") || ""

  useEffect(() => {
    if (!open || !url) return

    let cancelled = false
    async function fetchPreview() {
      setLoading(true)
      setError(null)
      try {
        const isWikipedia = /(^|\.)wikipedia\.org$/.test(url.hostname) && url.pathname.startsWith("/wiki/")
        if (isWikipedia) {
          const lang = url.hostname.split(".")[0] || "pt"
          const titlePath = decodeURIComponent(url.pathname.replace("/wiki/", ""))
          const api = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titlePath)}`
          const res = await fetch(api)
          if (!res.ok) throw new Error("Falha ao obter resumo da Wikipedia")
          const json = await res.json()
          if (cancelled) return
          setData({
            title: json.title,
            description: json.extract || json.description,
            image: json.thumbnail?.source,
            site: "Wikipedia",
          })
        } else {
          setData({ title: url.href, description: domain, image: undefined, site: domain })
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Erro ao carregar preview")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPreview()
    return () => { cancelled = true }
  }, [open, url, domain])

  const previewImage = data?.image || fallbackSrc

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-4 decoration-white/40 hover:decoration-[#ff2a2a] hover:text-[#ff2a2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2a2a]/60 rounded-sm"
          aria-label={`Abrir ${domain || "link"} em nova aba`}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        <div className="flex items-start gap-3">
          <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-md bg-white/5">
            <img
              src={previewImage}
              alt={data?.title ? `Prévia: ${data.title}` : "Prévia do artigo"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                if (img.src !== window.location.origin + fallbackSrc) {
                  img.src = fallbackSrc
                }
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate" title={data?.title || domain}>
              {data?.title || domain}
            </p>
            <p className="text-xs text-white/70 mt-1 line-clamp-3">
              {loading ? "Carregando prévia…" : (data?.description || (error ? "Não foi possível carregar a prévia." : domain))}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}