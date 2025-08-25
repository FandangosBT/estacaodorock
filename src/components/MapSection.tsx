import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import gsap from 'gsap';
import { MapPin, ExternalLink, Copy } from 'lucide-react';

const PLUS_CODE = 'XGQF+H3 Bernardino de Campos, São Paulo';
const mapsQuery = encodeURIComponent(PLUS_CODE);
const embedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

const MapSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const enableAnimations = useMemo(() => !prefersReducedMotion, [prefersReducedMotion]);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PLUS_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* noop */ }
  }, []);

  // Efeito float galáxico - mais amplo e orgânico
  useEffect(() => {
    if (!enableAnimations || !cardRef.current) return;
    
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(cardRef.current, {
      y: -15,
      x: 8,
      rotation: 1,
      duration: 4,
      ease: 'sine.inOut',
    })
    .to(cardRef.current, {
      y: 12,
      x: -5,
      rotation: -0.8,
      duration: 3.5,
      ease: 'sine.inOut',
    })
    .to(cardRef.current, {
      y: -8,
      x: 3,
      rotation: 0.5,
      duration: 4.2,
      ease: 'sine.inOut',
    })
    .to(cardRef.current, {
      y: 0,
      x: 0,
      rotation: 0,
      duration: 3.8,
      ease: 'sine.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [enableAnimations]);

  return (
    <motion.section id="mapa" aria-labelledby="mapa-title" className="py-16 px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h2 id="mapa-title" className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
            Local do Evento
          </h2>
          <p className="mt-2 text-white/70 max-w-2xl mx-auto">
            Prefeitura Municipal de Bernardino de Campos - Antiga Estação Ferroviária
          </p>
        </header>

        <motion.div
          className="relative mx-auto max-w-5xl"
          initial={enableAnimations ? { opacity: 0, y: 16 } : undefined}
          whileInView={enableAnimations ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 shadow-2xl">
            {/* Card principal com float galáxico */}
            <div ref={cardRef} className="relative">
              {/* Head */}
              <div className="flex items-center justify-between gap-4 p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/20 ring-1 ring-yellow-400/30">
                    <MapPin className="h-5 w-5 text-yellow-300" aria-hidden />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-extrabold text-white uppercase tracking-wide">Como chegar</h3>
                    <p className="text-xs md:text-sm text-white/70">Spot padrão: {PLUS_CODE}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                    aria-label="Abrir no Google Maps"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Abrir no Maps
                  </a>
                  <button
                    onClick={onCopy}
                    className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 text-white px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                    aria-label="Copiar Plus Code"
                  >
                    <Copy className="h-4 w-4" aria-hidden />
                    Copiar código
                  </button>
                </div>
              </div>

              {/* Mapa */}
              <div className="relative">
                {!loaded && (
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.08),rgba(255,255,255,0.12),rgba(255,255,255,0.08))] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite]" aria-hidden />
                )}
                <div className="aspect-[16/9] w-full">
                  <iframe
                    title="Mapa do evento - Prefeitura Municipal de Bernardino de Campos - Antiga Estação Ferroviária"
                    src={embedSrc}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setLoaded(true)}
                  />
                </div>
              </div>

              {/* Footer com ações */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 md:p-5">
                <p className="text-sm text-white/70 text-center sm:text-left">
                  Dica: use "Rotas" para navegação turn-by-turn até a antiga estação ferroviária.
                </p>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-yellow-400/90 hover:bg-yellow-400 text-black px-4 py-2 text-sm font-extrabold uppercase tracking-wide focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                  aria-label="Abrir rotas no Google Maps"
                >
                  Rotas no Google Maps
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>

            {/* Glow/Halo galáxico */}
            <div className="pointer-events-none absolute -inset-0.5 rounded-[1.1rem] opacity-0 md:opacity-100 ring-1 ring-yellow-300/20 blur-md" aria-hidden />
          </div>

          {/* Live region para feedback de cópia */}
          <span aria-live="polite" className="sr-only">{copied ? 'Plus Code copiado para a área de transferência.' : ''}</span>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.section>
  );
};

export default MapSection;