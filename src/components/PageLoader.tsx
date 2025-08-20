"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDevicePerformance } from "@/utils/performance";
import { useAudio } from "@/contexts/AudioContext";
import gsap from "gsap";

const baseMessages = [
  "Aquecendo os motores...",
  "O trem do rock está chegando...",
  "Prepare-se para a viagem sonora!",
  "Quase lá...",
  "Você vai sentir o peso do rock!",
];

export default function PageLoader({ onFinish, userGesture }: { onFinish: () => void; userGesture?: boolean }) {
  const { isLowEnd } = useDevicePerformance();
  const { playSound, setAudioEnabled, audioEnabled, stopBackgroundMusic, stopAllSounds } = useAudio();
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const logoBtnRef = useRef<HTMLButtonElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const shineRef = useRef<HTMLSpanElement | null>(null);
  const whistleTimeoutRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  // Evita re-execuções do agendamento de áudio em re-renders
  const scheduledOnceRef = useRef(false);

  // Iniciar música de fundo se houve gesto do usuário na tela anterior (mantido para compatibilidade)
  useEffect(() => {
    if (!userGesture) return;
    if (scheduledOnceRef.current) {
      return; // já agendado neste ciclo de navegação
    }
    scheduledOnceRef.current = true;

    if (!audioEnabled) {
      try {
        setAudioEnabled(true);
      } catch (e) {
        console.warn("🎵 Loader: setAudioEnabled failed", e);
      }
    }

    const bgTimer = window.setTimeout(() => {
      // Sem música de fundo por enquanto
    }, 2200);

    return () => {
      window.clearTimeout(bgTimer);
      stopBackgroundMusic();
    };
  }, [userGesture, audioEnabled, setAudioEnabled, stopBackgroundMusic]);

  // Durações do loader (apenas o necessário)
  const durations = useMemo(() => {
    return { videoDelay: 200, messageInterval: 3000, fadeDuration: 1000 };
  }, []);

  // Agendadores visuais (vídeo aparece) e mensagens rotativas
  useEffect(() => {
    const videoTimer = setTimeout(() => setShowVideo(true), durations.videoDelay);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % baseMessages.length);
    }, durations.messageInterval);

    return () => {
      clearTimeout(videoTimer);
      clearInterval(messageInterval);
      stopBackgroundMusic();
      // Garantia de parar quaisquer efeitos sonoros em andamento ao desmontar
      if (whistleTimeoutRef.current) {
        window.clearTimeout(whistleTimeoutRef.current);
      }
      stopAllSounds();
    };
  }, [durations.videoDelay, durations.messageInterval, stopBackgroundMusic, stopAllSounds]);

  // Sincroniza saída com o término real do vídeo
  const handleVideoEnded = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopBackgroundMusic();
    setFadeOut(true);
    // Aguardar o fade para transicionar
    window.setTimeout(() => {
      onFinish();
    }, durations.fadeDuration);
  }, [durations.fadeDuration, onFinish, stopBackgroundMusic]);

  // Skip também respeita fade-out e evita chamadas duplicadas
  const handleSkip = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    stopBackgroundMusic();
    setFadeOut(true);
    window.setTimeout(() => {
      onFinish();
    }, durations.fadeDuration);
  }, [durations.fadeDuration, onFinish, stopBackgroundMusic]);

  // Easter Egg: clique na logo ativa áudio (gesto), toca apito por 2s e habilita som do vídeo do loader
  const handleLogoActivate = useCallback(async () => {
    try {
      if (!audioEnabled) setAudioEnabled(true);
      await playSound("/audio/train-whistle.MP3", { loop: false });
      // Parar o apito após 2s (one-shot controlado)
      whistleTimeoutRef.current = window.setTimeout(() => {
        stopAllSounds();
      }, 2000);

      if (videoRef.current) {
        videoRef.current.muted = false;
        // Garantir reprodução com áudio após gesto
        try {
          await videoRef.current.play();
        } catch {}
      }

      // Feedback visual: brilho/shine + micro-scale, respeitando dispositivos low-end
      if (logoImgRef.current) {
        if (!isLowEnd) {
          gsap.fromTo(
            logoImgRef.current,
            { filter: "drop-shadow(0 0 0 rgba(255,255,255,0)) brightness(1)" },
            {
              filter: "drop-shadow(0 0 18px rgba(255,255,255,0.95)) brightness(1.2)",
              duration: 0.35,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            }
          );
        } else {
          // fallback mais leve
          gsap.to(logoImgRef.current, { scale: 1.03, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
        }
      }
      if (logoBtnRef.current && !isLowEnd) {
        gsap.fromTo(
          logoBtnRef.current,
          { scale: 1 },
          { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      }
      if (shineRef.current && !isLowEnd) {
        gsap.set(shineRef.current, { opacity: 0, x: "-150%" });
        gsap.to(shineRef.current, {
          opacity: 0.9,
          x: "150%",
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => gsap.set(shineRef.current!, { opacity: 0 }),
        });
      }
    } catch (e) {
      console.warn("Easter egg falhou:", e);
    }
  }, [audioEnabled, setAudioEnabled, playSound, stopAllSounds, isLowEnd]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fadeDuration / 1000 }}
          aria-live="polite"
          role="status"
        >
          {/* Vídeo de fundo */}
          <motion.video
            ref={videoRef}
            className="absolute w-full h-full object-cover"
            src="/video/loader-trem.mp4"
            autoPlay
            playsInline
            // loop removido para permitir sincronização com término real
            muted
            preload="auto"
            // poster removido para evitar flash do placeholder
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady && showVideo ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ visibility: videoReady && showVideo ? "visible" : "hidden" }}
            aria-hidden={true}
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onEnded={handleVideoEnded}
          />

          {/* Layer de loader */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <motion.button
              ref={logoBtnRef}
              type="button"
              onClick={handleLogoActivate}
              className="w-40 outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded relative"
              initial={false}
              animate={{ scale: [0.98, 1.04, 0.99, 1], opacity: 1 }}
              transition={{
                duration: isLowEnd ? 1.2 : 2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              aria-label="Easter egg: tocar apito por 2 segundos e liberar áudio do vídeo"
            >
              <img ref={logoImgRef} src="/logo.svg" alt="Logo Estação do Rock" className="w-full h-auto" />
              {/* Shine overlay */}
              <span
                ref={shineRef}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-6 -inset-x-10 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-md"
                style={{ transform: "translateX(-150%) rotate(8deg)" }}
              />
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                className="mt-6 text-[#f0f0f0] uppercase tracking-widest text-sm"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {baseMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>

            {/* Botão para pular loader */}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-6 text-gray-300 text-xs underline opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded"
            >
              Pular introdução
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}