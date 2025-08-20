"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Download, Share2, X } from 'lucide-react';
import gsap from 'gsap';

interface StoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  slides: { src: string; alt: string }[];
  initialIndex?: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const StoryModal: React.FC<StoryModalProps> = ({ open, onOpenChange, title = 'Stories', slides, initialIndex = 0 }) => {
  const [index, setIndex] = useState(initialIndex);
  const [showEndActions, setShowEndActions] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const progressRefs = useRef<HTMLDivElement[]>([]);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const DURATION = 4; // segundos por story

  useEffect(() => {
    if (!open) {
      setIndex(initialIndex);
      setShowEndActions(false);
      killProgress();
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (!imgRef.current) return;
    gsap.fromTo(
      imgRef.current,
      { autoAlpha: 0, scale: 0.98 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, [index, open]);

  useEffect(() => {
    if (!open) return;
    resetProgressBars();
    animateCurrentProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, open]);

  const killProgress = () => {
    if (progressTween.current) {
      progressTween.current.kill();
      progressTween.current = null;
    }
  };

  const resetProgressBars = () => {
    slides.forEach((_, i) => {
      const el = progressRefs.current[i];
      if (!el) return;
      if (i < index) {
        gsap.set(el, { width: '100%' });
      } else if (i === index) {
        gsap.set(el, { width: '0%' });
      } else {
        gsap.set(el, { width: '0%' });
      }
    });
    setShowEndActions(false);
  };

  const animateCurrentProgress = () => {
    killProgress();
    const currentBar = progressRefs.current[index];
    if (!currentBar) return;
    progressTween.current = gsap.to(currentBar, {
      width: '100%',
      duration: DURATION,
      ease: 'none',
      onComplete: () => {
        if (index < slides.length - 1) {
          next();
        } else {
          setShowEndActions(true);
        }
      },
    });
  };

  const prev = () => {
    setIndex((i) => clamp(i - 1, 0, slides.length - 1));
  };
  const next = () => {
    setIndex((i) => clamp(i + 1, 0, slides.length - 1));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onOpenChange(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    killProgress(); // evitar avanço durante gesto
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prev();
      else next();
    } else {
      // retoma animação se não houve swipe
      animateCurrentProgress();
    }
    touchStartX.current = null;
  };

  const current = slides[index];

  const downloadCurrent = () => {
    const a = document.createElement('a');
    a.href = current.src;
    const fileName = current.src.split('/').pop() || `slide-${index + 1}.png`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const shareCurrent = async () => {
    try {
      const response = await fetch(current.src);
      const blob = await response.blob();
      const file = new File([blob], current.src.split('/').pop() || `slide-${index + 1}.png`, { type: blob.type || 'image/png' });

      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          text: `${title || 'Story'} — slide ${index + 1}/${slides.length}`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: title || 'Story',
          text: `${title || 'Story'} — slide ${index + 1}/${slides.length}\n${window.location.origin}`,
          url: current.src,
        });
      } else {
        window.open(current.src, '_blank');
      }
    } catch (e) {
      window.open(current.src, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] sm:max-w-[430px] max-h-[92vh] p-0 bg-black outline-none overflow-hidden"
        onKeyDown={onKeyDown}
      >
        {/* Header com ações (fora da arte) */}
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-white font-queenrocker text-lg md:text-xl uppercase tracking-wider">{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs md:text-sm font-semibold" aria-live="polite">{index + 1}/{slides.length}</span>
              <button
                onClick={downloadCurrent}
                className="px-2 py-1 text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Baixar slide atual"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={shareCurrent}
                className="px-2 py-1 text-white/90 hover:text-white border border-white/30 hover:border-white/60 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Compartilhar slide atual"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <DialogClose className="text-white/80 hover:text-white p-1 rounded-md border border-transparent hover:border-white/30" aria-label="Fechar">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <div
          ref={containerRef}
          className={`relative w-full ${showEndActions ? 'h-[72vh] md:h-[76vh]' : 'h-[78vh] md:h-[82vh]'} bg-black flex items-center justify-center select-none`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-live="polite"
        >
          {/* Barra de progresso estilo stories */}
          <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
            {slides.map((_, i) => (
              <div key={i} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden" aria-hidden>
                <div
                  ref={(el) => {
                    if (el) progressRefs.current[i] = el;
                  }}
                  className={`h-full bg-white ${i < index ? 'w-full' : 'w-0'}`}
                />
              </div>
            ))}
          </div>

          {/* Imagem responsiva em 9:16 dentro da altura disponível */}
          <div className="relative aspect-[9/16] h-full w-auto flex items-center justify-center">
            <img
              ref={imgRef}
              src={current.src}
              alt={current.alt}
              className="max-h-full max-w-full h-full w-auto object-contain"
              draggable={false}
            />
          </div>

          {/* Controles navegação */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white z-20"
            onClick={() => { killProgress(); prev(); }}
            aria-label="Slide anterior"
            disabled={index === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white z-20"
            onClick={() => { killProgress(); next(); }}
            aria-label="Próximo slide"
            disabled={index === slides.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicadores inferiores (opcional) */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-[#ffbd00]' : 'w-3 bg-white/40'}`}
                aria-hidden
              />)
            )}
          </div>
        </div>

        {/* Ações finais no último slide (fora da arte) */}
        {showEndActions && index === slides.length - 1 && (
          <div className="px-4 pb-4 pt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => { setIndex(0); setShowEndActions(false); }}
              className="px-4 py-2 text-white border border-white/40 hover:border-white/70 rounded-md bg-transparent hover:bg-white/10 text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Ver novamente
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-white border border-white/40 hover:border-white/70 rounded-md bg-transparent hover:bg-white/10 text-xs font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Sair
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;