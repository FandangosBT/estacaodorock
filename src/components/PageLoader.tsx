"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDevicePerformance } from "@/utils/performance";
import { useAudio } from "@/contexts/AudioContext";
import gsap from "gsap";

const baseMessages = [
  "Aquecendo os motores...",
  // Removida: "O trem do rock está chegando...",
  "Prepare-se para uma viagem sonora!",
  "Quase lá...",
  "Você vai sentir o peso do rock!",
];

export default function PageLoader({ onFinish, userGesture }: { onFinish: () => void; userGesture?: boolean }) {
  const { isLowEnd } = useDevicePerformance();
  const { setAudioEnabled, audioEnabled, stopBackgroundMusic, playSound } = useAudio();
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const logoBtnRef = useRef<HTMLButtonElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
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
  }, [userGesture, scheduledOnceRef, audioEnabled, setAudioEnabled, stopBackgroundMusic]);

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
    };
  }, [durations.videoDelay, durations.messageInterval, stopBackgroundMusic]);

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

  // Botão de Play: habilita áudio, libera som do vídeo e toca apito
  const handleLogoActivate = useCallback(async () => {
    try {
      // Esconde CTA com fade-out
      setCtaVisible(false);

      const whistleUrl = "/audio/train-whistle.MP3"; // Corrigido para corresponder ao arquivo em public

      // Habilita áudio global se ainda não estiver ativo
      if (!audioEnabled) setAudioEnabled(true);

      // Toca o efeito sonoro do apito; se acabou de habilitar o áudio,
      // agenda para o próximo frame para garantir o estado atualizado
      if (!audioEnabled) {
        requestAnimationFrame(() => {
          try {
            playSound(whistleUrl, { volume: 1 });
          } catch (err) {
            console.warn("Falha ao tocar apito (raf):", err);
          }
        });
      } else {
        try {
          await playSound(whistleUrl, { volume: 1 });
        } catch (err) {
          console.warn("Falha ao tocar apito:", err);
        }
      }

      if (videoRef.current) {
        videoRef.current.muted = false;
        try {
          await videoRef.current.play();
        } catch { /* noop */ }
      }

      // Zoom in/out no botão no clique
      if (logoBtnRef.current) {
        gsap.timeline({ defaults: { ease: "power2.out" } })
          .to(logoBtnRef.current, { scale: 1.2, duration: 0.12 })
          .to(logoBtnRef.current, { scale: 0.95, duration: 0.12 })
          .to(logoBtnRef.current, { scale: 1.0, duration: 0.16 });
      }
    } catch (e) {
      console.warn("Ativar som falhou:", e);
    }
  }, [audioEnabled, setAudioEnabled, playSound]);

  // Animação pulsante contínua no ícone Play (mais agressiva)
  useEffect(() => {
    if (!logoImgRef.current) return;
    const target = logoImgRef.current;
    const tween = gsap.to(target, {
      scale: isLowEnd ? 1.08 : 1.14,
      duration: isLowEnd ? 0.8 : 0.6,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
    });
    return () => { tween.kill(); };
  }, [isLowEnd]);

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
            <button
              ref={logoBtnRef}
              type="button"
              onClick={handleLogoActivate}
              className="w-20 h-20 md:w-24 md:h-24 outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Ativar som do vídeo"
            >
              <img
                ref={logoImgRef}
                src="/icons/play.svg"
                alt=""
                aria-hidden="true"
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </button>

            {/* CTA visível com fade-out na remoção */}
            <AnimatePresence>
              {ctaVisible && (
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 text-white font-semibold text-base tracking-wide"
                >
                  Solta o Som!
                </motion.span>
              )}
            </AnimatePresence>

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