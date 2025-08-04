"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PreHome({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const microcopyRef = useRef<HTMLParagraphElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Timeline de pulse contínuo para logo e botão
    const pulse = gsap.timeline({ repeat: -1, yoyo: true });
    pulse.to([logoRef.current, buttonRef.current], {
      scale: 1.05,
      duration: 0.75,
      ease: "power1.inOut",
    });
  }, []);

  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onEnter(); // Transição para Page Loader
      },
    });

    // Reproduz áudio do apito
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // Shake do logo sincronizado com o áudio
    tl.to(logoRef.current, {
      keyframes: [
        { x: -10 },
        { x: 10 },
        { x: -8 },
        { x: 8 },
        { x: -5 },
        { x: 5 },
        { x: 0 },
      ],
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Botão faz bounce e desaparece
    tl.to(
      buttonRef.current,
      {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.7)",
      },
      "<" // Começa junto com o shake
    );

    // Microcopy fade-out
    tl.to(
      microcopyRef.current,
      {
        opacity: 0,
        duration: 0.3,
      },
      "<"
    );

    // Fade-out do container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <audio ref={audioRef} src="/audio/train-whistle.MP3" preload="auto" />

      {/* Logo pulsante com shake via GSAP */}
      <img
        ref={logoRef}
        src="/logo.svg"
        alt="Estação Rock"
        className="w-[220px] md:w-[260px] lg:w-[300px] mb-12"
      />

      {/* Botão Entrar */}
      <button
        ref={buttonRef}
        onClick={handleEnter}
        className="px-8 py-3 bg-[#ffbd00] text-black font-bold rounded-lg shadow-[0_0_20px_#ffbd00aa] hover:scale-105 hover:shadow-[0_0_30px_#ffbd00ff] transition-all"
      >
        Entrar
      </button>

      {/* Microcopy */}
      <p
        ref={microcopyRef}
        className="text-white/80 text-sm mt-6 transition-opacity duration-500"
      >
        Aperte o play e já comece a sair da linha!
      </p>
    </div>
  );
}