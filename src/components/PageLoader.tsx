"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDevicePerformance } from "@/utils/performance";
import { useAudio } from "@/contexts/AudioContext";
import gsap from "gsap";

const WHISTLE_URL = "/audio/train-whistle.mp3";
const WHISTLE_URL_WAV = "/audio/train-whistle.wav";

const baseMessages = [
  "Aquecendo os motores...",
  // Removida: "O trem do rock está chegando...",
  "Prepare-se para uma viagem sonora!",
  "Quase lá...",
  "Você vai sentir o peso do rock!",
];

export default function PageLoader({ onFinish, userGesture }: { onFinish: () => void; userGesture?: boolean }) {
  const { isLowEnd } = useDevicePerformance();
  const { setAudioEnabled, audioEnabled, stopBackgroundMusic, playSound, preloadSound, isMuted, toggleMute } = useAudio();
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(true);
  const [playVisible, setPlayVisible] = useState(true);
  const [audioHint, setAudioHint] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const logoBtnRef = useRef<HTMLButtonElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const finishedRef = useRef(false);
  const whistleElRef = useRef<HTMLAudioElement | null>(null);
  const webAudioRef = useRef<AudioContext | null>(null);

  // Evita re-execuções do agendamento de áudio em re-renders
  const scheduledOnceRef = useRef(false);

  // Pré-carrega o som do apito (MP3 + fallback WAV) para latência mínima no clique
  useEffect(() => {
    try { preloadSound(WHISTLE_URL); } catch { /* noop */ }
    try { preloadSound(WHISTLE_URL_WAV); } catch { /* noop */ }
    // Precarregar também o elemento áudio DOM (maior compatibilidade mobile)
    try {
      if (whistleElRef.current) {
        whistleElRef.current.preload = 'auto'
        // Removido crossOrigin para evitar interferência no iOS
        // whistleElRef.current.crossOrigin = 'anonymous'
        whistleElRef.current.load()
      }
    } catch { /* noop */ }
  }, [preloadSound]);

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
      setAudioHint(null);
      // Começa o fade-out imediato do CTA e do botão Play após o gesto
      setCtaVisible(false);
      setPlayVisible(true); // garante visível antes de animar

      // Disparar reprodução o quanto antes dentro do gesto
      let playedEarly = false;
      if (whistleElRef.current) {
        const a = whistleElRef.current;
        try {
          a.muted = false;
          a.volume = 1;
          a.src = WHISTLE_URL;
          try { a.load(); } catch {}
          try { a.currentTime = 0; } catch {}
          a.play().catch(() => {});
          // Não aguardar aqui para não perder o gesto, iremos validar depois
          playedEarly = true;
        } catch {}
      }

      // Habilita áudio global se ainda não estiver ativo
      if (!audioEnabled) setAudioEnabled(true);
      // Se estiver mutado por preferência anterior, desmutar explicitamente ao clicar em "Solta o Som!"
      if (isMuted) toggleMute();

      // Primeira tentativa: tocar pelo elemento <audio> DOM (melhor compatibilidade mobile/iOS)
      let played = false;
      if (whistleElRef.current) {
        const a = whistleElRef.current;
        try {
          a.muted = false;
          a.volume = 1;
          // Definir src explicitamente e carregar antes de tocar
          a.src = WHISTLE_URL;
          try { a.load(); } catch { /* noop */ }
          try { a.currentTime = 0; } catch { /* noop */ }
          const p1 = a.play();
          if (p1 !== undefined) {
            await p1;
          }
          played = !a.paused;
        } catch {
          played = false;
        }

        // Fallback via elemento DOM para WAV
        if (!played) {
          try {
            a.pause();
            try { a.currentTime = 0; } catch { /* noop */ }
            a.src = WHISTLE_URL_WAV;
            try { a.load(); } catch { /* noop */ }
            const p2 = a.play();
            if (p2 !== undefined) {
              await p2;
            }
            played = !a.paused;
          } catch {
            played = false;
          }
        }
      }

      // Fallback: usar contexto com MP3 e depois WAV
      if (!played) {
        try {
          await playSound(WHISTLE_URL, { volume: 1, force: true });
          played = true;
        } catch {
          try {
            await playSound(WHISTLE_URL_WAV, { volume: 1, force: true });
            played = true;
          } catch {
            played = false;
          }
        }
      }

      // Agora podemos esconder o CTA e o botão Play com fade-out
      setCtaVisible(false);
      setPlayVisible(false);

      // Fallback final: Web Audio API (desbloqueio + reprodução)
      if (!played) {
        try {
          // @ts-ignore - webkitAudioContext para iOS
          const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (Ctx) {
            webAudioRef.current = webAudioRef.current || new Ctx();
            await webAudioRef.current.resume();
            // Tenta MP3 primeiro
            let ok = false;
            try {
              const res = await fetch(WHISTLE_URL);
              const buf = await res.arrayBuffer();
              const decoded = await webAudioRef.current.decodeAudioData(buf);
              const src = webAudioRef.current.createBufferSource();
              src.buffer = decoded;
              src.connect(webAudioRef.current.destination);
              src.start(0);
              ok = true;
            } catch {
              ok = false;
            }
            if (!ok) {
              const res = await fetch(WHISTLE_URL_WAV);
              const buf = await res.arrayBuffer();
              const decoded = await webAudioRef.current.decodeAudioData(buf);
              const src = webAudioRef.current.createBufferSource();
              src.buffer = decoded;
              src.connect(webAudioRef.current.destination);
              src.start(0);
            }
            played = true;
          }
        } catch {
          played = false;
        }
      }

      if (!played) {
        setAudioHint("Não conseguimos reproduzir o som. Verifique o modo silencioso/volume do iPhone e tente novamente.");
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
      setAudioHint("Não conseguimos reproduzir o som. Verifique o modo silencioso/volume do iPhone e tente novamente.");
    }
  }, [audioEnabled, setAudioEnabled, isMuted, toggleMute, playSound]);

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
            {/* Áudio oculto para máxima compatibilidade em mobile */}
            <audio ref={whistleElRef} preload="auto" aria-hidden="true" className="sr-only">
              <source src={WHISTLE_URL} type="audio/mpeg" />
              <source src={WHISTLE_URL_WAV} type="audio/wav" />
            </audio>

            {/* Botão Play com fade-out ao acionar */}
            <AnimatePresence>
              {playVisible && (
                <motion.button
                  ref={logoBtnRef}
                  type="button"
                  onClick={handleLogoActivate}
                  className="w-20 h-20 md:w-24 md:h-24 outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full grid place-items-center bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Ativar som do vídeo"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    ref={logoImgRef}
                    src="/icons/play.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-10 h-10 md:w-12 md:h-12"
                  />
                </motion.button>
              )}
            </AnimatePresence>

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
                  Solta o som!
                </motion.span>
              )}
            </AnimatePresence>

            {/* Legendas rotativas acessíveis */}
            <div className="mt-3 h-6 flex items-center" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentMessage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/80 text-sm"
                >
                  {baseMessages[currentMessage]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Botão Pular Intro */}
            <motion.button
              type="button"
              onClick={handleSkip}
              className="mt-4 text-white/90 hover:text-white underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Pular Intro
            </motion.button>

            {audioHint && (
              <div className="mt-2 text-white/80 text-xs max-w-[80%]">{audioHint}</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}