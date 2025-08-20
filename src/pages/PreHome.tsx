"use client";

import { useEffect, useRef, useState } from "react";

export default function PreHome({ onEnter }: { onEnter: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let fallbackTimeout: number | undefined;

    const goNext = () => {
      // Evita múltiplas chamadas
      if (fallbackTimeout !== undefined) {
        window.clearTimeout(fallbackTimeout);
        fallbackTimeout = undefined;
      }
      onEnter();
    };

    const handleEnded = () => goNext();
    const handleError = () => {
      // Ativa fallback visual e deixa o timeout seguir com a navegação
      setUseFallback(true);
    };

    v.addEventListener("ended", handleEnded);
    v.addEventListener("error", handleError);

    // Tentar garantir o play (alguns browsers podem bloquear, mas como está mudo deve tocar)
    v.play().catch(() => {
      // Se falhar, ativamos fallback visual e aguardamos o timeout existente
      setUseFallback(true);
    });

    // Fallback: se o vídeo não disparar ended (ou for muito curto), seguimos após 3.2s
    fallbackTimeout = window.setTimeout(goNext, 3200);

    return () => {
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("error", handleError);
      if (fallbackTimeout !== undefined) window.clearTimeout(fallbackTimeout);
    };
  }, [onEnter]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        preload="auto"
        autoPlay
        playsInline
        muted
        poster="/logo.svg"
        aria-label="Abertura animada Estação do Rock"
        onError={() => setUseFallback(true)}
      >
        <source src="/video/animated-logo.mp4" type="video/mp4" />
        <p>Seu navegador não suporta vídeo HTML5.</p>
      </video>

      {useFallback && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black"
          aria-hidden="true"
        >
          <img
            src="/logo.svg"
            alt="Logomarca Estação do Rock"
            className="w-40 h-40 md:w-56 md:h-56 animate-pulse drop-shadow-[6px_6px_0_#ff2a2a]"
            loading="eager"
            decoding="sync"
          />
        </div>
      )}
    </div>
  );
}