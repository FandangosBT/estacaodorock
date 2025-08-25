"use client";

import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useVideoOffscreen, useDevicePerformance } from '@/utils/performance';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { isLowEnd } = useDevicePerformance();
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Flags para o vídeo principal, mantendo comportamento consistente com preferências/performance
  const mainAutoplay = !prefersReducedMotion;
  const mainLoop = !prefersReducedMotion;
  const mainControls = prefersReducedMotion || isLowEnd;

  // Pause videos when offscreen for performance
  useVideoOffscreen(backgroundVideoRef, {
    rootMargin: '100px',
    pauseWhenOffscreen: true,
    resumeWhenVisible: true
  });

  useVideoOffscreen(mainVideoRef, {
    rootMargin: '50px',
    pauseWhenOffscreen: true,
    resumeWhenVisible: true
  });

  return (
    <section 
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Vídeo de fundo (galáxia) cobrindo toda a seção */}
      <video
        ref={backgroundVideoRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        autoPlay={!prefersReducedMotion}
        loop={!prefersReducedMotion}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/video/galaxy-pb.mp4" type="video/mp4" />
      </video>

      {/* Overlay sutil para contraste */}
      <div className="absolute inset-0 z-0 bg-black/30" aria-hidden="true"></div>

      {/* Container flutuante usando FloatingPanel */}
      <div className="relative z-10 w-full">
        <FloatingPanel>
          <video
            ref={mainVideoRef}
            className="block w-full h-auto object-contain bg-transparent no-native-controls"
            autoPlay={mainAutoplay}
            loop={mainLoop}
            muted
            playsInline
            preload="auto"
            poster="/station.png"
            aria-label="Vídeo do lineup do Estação Rock 2025"
            title="Lineup Estação Rock 2025"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            x-webkit-airplay="deny"
          >
            <source src="/video/LINEUP2.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo HTML5.
          </video>
        </FloatingPanel>
      </div>
    </section>
  );
}