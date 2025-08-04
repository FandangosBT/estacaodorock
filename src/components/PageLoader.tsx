"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const messages = [
  "Aquecendo os motores...",
  "O trem do rock está chegando...",
  "Prepare-se para a viagem sonora!",
  "Quase lá...",
  "Você vai sentir o peso do rock!",
];

export default function PageLoader() {
  const [showVideo, setShowVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const videoTimer = setTimeout(() => setShowVideo(true), 8000); // Vídeo fade-in
    const fadeOutTimer = setTimeout(() => setFadeOut(true), 25000); // Fade-out geral

    // Redirecionar para /home após fade-out
    const redirectTimer = setTimeout(() => {
      window.location.href = "/home";
    }, 26000);

    // Troca de mensagens
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Vídeo de fundo */}
          <motion.video
            className="absolute w-full h-full object-cover"
            src="/video/loader-trem.mp4"
            autoPlay
            playsInline
            loop
            initial={{ opacity: 0 }}
            animate={{ opacity: showVideo ? 1 : 0 }}
            transition={{ duration: 2, delay: showVideo ? 0 : 8 }}
          />

          {/* Layer de loader */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <motion.img
              src="/logo.svg"
              alt="Logo"
              className="w-40 animate-pulse"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 0.95, 1], opacity: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                className="mt-6 text-[#f0f0f0] uppercase tracking-widest text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {messages[currentMessage]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}