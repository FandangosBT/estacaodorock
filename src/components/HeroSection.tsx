"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoveRight, Guitar, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function HeroSection() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [flash, setFlash] = useState(false);
  const [audioStatus, setAudioStatus] = useState('ready'); // 'ready', 'loading', 'playing', 'error'
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const titles = useMemo(
    () => ["CAÓTICO", "BRUTAL", "INSANO", "HISTÓRICO", "INCONTROLÁVEL"],
    []
  );

  // Alterna palavras do título
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => console.log('🎵 Audio load started');
    const handleLoadedData = () => console.log('🎵 Audio data loaded');
    const handleCanPlay = () => console.log('🎵 Audio can play');
    const handlePlay = () => {
      console.log('🎵 Audio play event');
      setAudioStatus('playing');
    };
    const handlePause = () => {
      console.log('🎵 Audio pause event');
      if (audioStatus === 'playing') setAudioStatus('ready');
    };
    const handleEnded = () => {
      console.log('🎵 Audio ended');
      setAudioStatus('ready');
    };
    const handleError = (e: Event) => {
      console.error('🎵 Audio error event:', e);
      setAudioStatus('error');
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioStatus]);

  // Handler do caos
  const handleChaos = async () => {
    console.log('🎵 handleChaos called');
    setAudioStatus('loading');
    
    if (!audioRef.current) {
      console.error('❌ Audio element not found');
      setAudioStatus('error');
      return;
    }

    const audio = audioRef.current;
    console.log('🎵 Audio element:', audio);
    console.log('🎵 Audio src:', audio.src);
    console.log('🎵 Audio readyState:', audio.readyState);
    console.log('🎵 Audio paused:', audio.paused);
    console.log('🎵 Audio currentTime:', audio.currentTime);
    console.log('🎵 Audio duration:', audio.duration);
    console.log('🎵 Audio volume:', audio.volume);
    console.log('🎵 Audio muted:', audio.muted);

    try {
      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Ensure volume is up and not muted
      audio.volume = 1.0;
      audio.muted = false;
      
      console.log('🎵 Attempting to play audio...');
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('✅ Audio started playing successfully');
        setAudioStatus('playing');
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      setAudioStatus('error');
      
      // Check if it's an autoplay policy error
      if (error.name === 'NotAllowedError') {
        console.log('🚫 Autoplay blocked by browser policy');
        alert('Por favor, clique novamente para ativar o áudio. O navegador bloqueia reprodução automática.');
        setAudioStatus('ready');
        return;
      }
      
      // Retry mechanism for other errors
      try {
        console.log('🔄 Retrying audio play...');
        setAudioStatus('loading');
        await new Promise(resolve => setTimeout(resolve, 100));
        audio.load();
        await new Promise(resolve => setTimeout(resolve, 500));
        await audio.play();
        console.log('✅ Audio started playing on retry');
        setAudioStatus('playing');
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        setAudioStatus('error');
        alert('Erro ao reproduzir áudio. Verifique se o arquivo existe e o volume está ligado.');
      }
    }

    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setAudioStatus('ready');
    }, 15000);
  };

  useEffect(() => {
    const festivalDate = new Date("2025-08-15T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = festivalDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
      const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, "0");

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <section 
      className="relative min-h-screen w-full text-[#f0f0f0] flex flex-col items-center justify-center overflow-hidden px-4 py-20 lg:py-40 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/station.png')" }}
    >
      {/* Flash/Glitch overlay */}
      {flash && <div className="fixed inset-0 z-50 animate-glitch bg-black"></div>}

      {/* Stickers flutuantes atualizados */}
      <img src="/stickers/cranio.png" className="absolute top-10 left-6 w-14 rotate-[-12deg] opacity-90 z-10 animate-float" alt="Cráneo" />
      <img src="/stickers/estrela.png" className="absolute top-20 right-10 w-12 rotate-[8deg] opacity-90 z-10 animate-float" alt="Estrela" />
      <img src="/stickers/guitarra.png" className="absolute bottom-24 left-10 w-14 rotate-[6deg] opacity-90 z-10 animate-float" alt="Guitarra" />
      <img src="/stickers/microfone.png" className="absolute top-1/2 right-20 w-12 -translate-y-1/2 rotate-[15deg] opacity-90 z-10 animate-float" alt="Microfone" />

      <div className="z-20 flex flex-col gap-8 items-center max-w-4xl animate-fadeInUp">
        {/* Título com palavras animadas */}
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider font-[Bebas Neue] max-w-2xl mx-auto">
          ESTAÇÃO ROCK <span className="text-[#ffbd00]">2025</span>
          <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 text-[#ff2a2a]">
            &nbsp;
            {titles.map((title, index) => (
              <motion.span
                key={index}
                className="absolute font-semibold"
                initial={{ opacity: 0, y: "-100%" }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 50 }}
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg uppercase font-semibold text-white tracking-wide animate-fadeInUp">
          🔥 A EXPERIÊNCIA MAIS BRUTAL DO ANO!
        </p>
        <p className="text-md text-[#f0f0f0] max-w-xl animate-fadeInUp">
          Prepare-se para o caos sonoro. O maior festival de rock do interior está chegando com força total!
        </p>

        {/* Cards de informação */}
        <div className="flex flex-wrap gap-4 justify-center font-bold uppercase text-sm animate-fadeInUp">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#ff2a2a] text-white rounded border border-white/20">
            <Guitar className="w-4 h-4" /> 20+ BANDAS
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#ffbd00] text-black rounded border border-white/20">
            🔊 3 PALCOS
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded border border-white/20">
            <Mic className="w-4 h-4" /> 50MIL+ PESSOAS
          </div>
        </div>

        {/* Botões principais */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleChaos}
            disabled={audioStatus === 'loading'}
            className={`px-6 py-3 text-sm font-bold uppercase transition-all duration-300 ${
              audioStatus === 'loading' 
                ? 'bg-yellow-600 text-white cursor-not-allowed' 
                : audioStatus === 'playing'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : audioStatus === 'error'
                ? 'bg-red-800 hover:bg-red-700 text-white'
                : 'bg-[#ff2a2a] text-white hover:bg-[#cc0000]'
            }`}
          >
            {audioStatus === 'loading' && '🔄 CARREGANDO...'}
            {audioStatus === 'playing' && '🎵 CAOS ATIVO!'}
            {audioStatus === 'error' && '❌ ERRO - TENTE NOVAMENTE'}
            {audioStatus === 'ready' && '🎟️ ENTRAR NO CAOS'}
          </Button>
          <Button className="bg-[#ffbd00] text-black px-6 py-3 text-sm font-bold uppercase hover:bg-[#e0af00]">
            🔥 VER LINEUP
          </Button>
        </div>

        {/* Data do festival */}
        <div className="mt-4 border border-[#f0f0f0] bg-[#0f0f0f] px-6 py-4 rounded-lg text-center text-[#ffbd00] text-sm font-bold uppercase animate-fadeInUp">
          📍 15, 16 E 17 DE AGOSTO<br />
          <span className="text-[#ff2a2a]">SÃO PAULO • BRASIL</span>
        </div>
      </div>

      {/* Contador Regressivo */}
      <div className="absolute bottom-6 bg-black border border-[#f0f0f0] px-6 py-3 rounded-lg flex gap-6 text-center z-20">
        {Object.entries(countdown).map(([key, val]) => (
          <div key={key}>
            <div className="text-2xl font-extrabold text-[#ffbd00]">{val}</div>
            <div className="text-xs uppercase text-[#ff2a2a] tracking-widest">{key}</div>
          </div>
        ))}
      </div>

      {/* Áudio do Ozzy */}
      <audio 
        ref={audioRef} 
        src="/audio/please.MP3" 
        preload="auto"
      />
      
      {/* Componente de teste de áudio */}

    </section>
  );
}