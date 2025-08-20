import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QuizSection } from '@/components/QuizSection';
import { ExternalLink, Share2, Copy, Guitar } from 'lucide-react';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import { TapeCorner } from '@/components/ui/tape-element';

const InteractivitySection: React.FC = () => {
  const quizCardRef = useRef<HTMLDivElement>(null);
  const playlistCardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const enableAnimations = useMemo(() => !prefersReducedMotion, [prefersReducedMotion]);

  // Spotify Playlist URL fornecida pelo usuário
  const playlistUrl = 'https://open.spotify.com/playlist/0cAMjwxclrnN32qcZgQDZF?si=8sjKB77PTHynpNuybhQw6w';
  const embedUrl = `https://open.spotify.com/embed/playlist/0cAMjwxclrnN32qcZgQDZF?utm_source=generator&theme=0`;

  // Float orgânico para os cards
  useEffect(() => {
    if (!enableAnimations || !quizCardRef.current || !playlistCardRef.current) return;

    // Quiz card float
    const quizTween = gsap.to(quizCardRef.current, {
      y: '-8px',
      x: '3px',
      rotation: 0.5,
      duration: 3.2 + Math.random() * 0.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Playlist card float (offset para não sincronizar)
    const playlistTween = gsap.to(playlistCardRef.current, {
      y: '-10px',
      x: '-2px',
      rotation: -0.3,
      duration: 2.9 + Math.random() * 1.1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      quizTween.kill();
      playlistTween.kill();
    };
  }, [enableAnimations]);

  const handleCopyPlaylist = async () => {
    try {
      await navigator.clipboard.writeText(playlistUrl);
      toast.success('Link da playlist copiado!', {
        description: 'Cole onde quiser para compartilhar'
      });
    } catch (error) {
      toast.error('Erro ao copiar', {
        description: 'Tente novamente'
      });
    }
  };

  const handleSharePlaylist = async () => {
    const shareData = {
      title: 'Playlist Oficial - Estação do Rock Festival',
      text: '🎸 Ouça a playlist oficial do Estação do Rock Festival!',
      url: playlistUrl
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        handleCopyPlaylist();
      }
    } else {
      handleCopyPlaylist();
    }
  };

  return (
    <section 
      id="interatividade"
      aria-labelledby="interactivity-title"
      className="py-16 px-4 md:px-6 max-w-7xl mx-auto"
    >
      {/* Título da seção */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-12 px-2"
      >
        <h2
          id="interactivity-title"
          className="text-[clamp(1.6rem,8vw,2.25rem)] sm:text-3xl md:text-5xl font-bold uppercase tracking-normal sm:tracking-wide md:tracking-wider leading-tight text-white mb-4 overflow-visible"
        >
          Interatividade
        </h2>
        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto px-2">
          Descubra seu perfil roqueiro e ouça nossa playlist oficial
        </p>
      </motion.div>

      {/* Grid de duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Coluna Esquerda - Quiz */}
        <motion.div
          ref={quizCardRef}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative rotate-[1deg]"
        >
          <div className="relative overflow-hidden border-4 border-[#ff2a2a] rounded-none shadow-[10px_10px_0_#000] h-full bg-black/80 backdrop-blur-md tape-corners">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/rockstar.jpg')" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />

            {/* Fitas adesivas nas bordas (inferiores) */}
            <TapeCorner corner="bottom-left" className="opacity-90" />
            <TapeCorner corner="bottom-right" className="opacity-90" />

            <div className="relative p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-[#ff2a2a] drop-shadow-[3px_3px_0_#000] mb-2">
                  QUE ROQUEIRO VOCÊ É?
                </h3>
                <p className="text-white/85 text-sm">
                  Descubra que tipo de roqueiro você é
                </p>
              </div>
              
              {/* Conteúdo do Quiz */}
              <div className="bg-black/60 border-2 border-[#ff2a2a] rounded-none p-4 shadow-[6px_6px_0_#000]">
                <QuizSection />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coluna Direita - Playlist Spotify */}
        <motion.div
          ref={playlistCardRef}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative -rotate-[1deg]"
        >
          <div className="relative overflow-hidden border-4 border-[#ff2a2a] rounded-none shadow-[10px_10px_0_#000] h-full bg-black/80 backdrop-blur-md tape-corners">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/gig.jpg')" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden="true" />

            {/* Fitas adesivas nas bordas (inferiores) */}
            <TapeCorner corner="bottom-left" className="opacity-90" />
            <TapeCorner corner="bottom-right" className="opacity-90" />

            <div className="relative p-6">
              {/* Título estilo stencil */}
              <div className="text-center mb-6">
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white drop-shadow-[4px_4px_0_#000] mb-2">
                   PLAYLIST OFICIAL
                  </h3>
                <div className="w-full h-1 bg-[#ffbd00] border-2 border-black shadow-[2px_2px_0_#000] mb-2" />
                <p className="text-white/80 text-sm uppercase tracking-wide font-medium">
                  ESTAÇÃO DO ROCK FESTIVAL
                </p>
                
                {/* Botões de ação compactos */}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={handleSharePlaylist}
                    className="bg-[#ff2a2a] text-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-black hover:text-[#ff2a2a] hover:border-2 hover:border-[#ff2a2a] flex items-center justify-center gap-1 border-2 border-black shadow-[3px_3px_0_#000] font-queenrocker"
                    aria-label="Compartilhar playlist"
                    title="Compartilhar playlist"
                  >
                    <Share2 className="w-3 h-3" />
                    SHARE
                  </button>
                  <button
                    onClick={handleCopyPlaylist}
                    className="bg-white text-black px-3 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-black hover:text-white hover:border-2 hover:border-white flex items-center justify-center gap-1 border-2 border-black shadow-[3px_3px_0_#000] font-queenrocker"
                    aria-label="Copiar link da playlist"
                    title="Copiar link da playlist"
                  >
                    <Copy className="w-3 h-3" />
                    COPY
                  </button>
                </div>
              </div>

              {/* Spotify Embed */}
              <div className="relative rounded-none overflow-hidden mb-4 vinyl-frame tape-corners rotate-[-1deg]">
                <div className="p-1">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Playlist oficial do Estação do Rock Festival"
                    className="rounded-none"
                  />
                </div>
              </div>

              {/* CTA para abrir no Spotify */}
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ticket w-full flex items-center justify-center gap-3 py-3 px-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                aria-label="Ouvir no Spotify"
              >
                <ExternalLink className="w-5 h-5" />
                OUVIR NO SPOTIFY
              </a>
              
              <p className="text-xs text-white/60 text-center mt-3">
                Ouça as faixas que vão embalar o festival
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Informações de acessibilidade */}
      <div className="sr-only">
        <p>
          Esta seção contém um quiz interativo para descobrir seu perfil de roqueiro 
          e um player da playlist oficial do evento no Spotify.
        </p>
      </div>
    </section>
  );
};

export default InteractivitySection;