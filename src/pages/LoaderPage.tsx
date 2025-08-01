import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui/loader';

const LoaderPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica se veio da pré-home com áudio
    const shouldPlayAudio = location.state?.playAudio !== false;
    
    if (shouldPlayAudio) {
      // Pequeno delay para garantir que o componente foi montado
      const timer = setTimeout(async () => {
        if (audioRef.current) {
          try {
            audioRef.current.volume = 0.7;
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
          } catch (error) {
            console.error('Erro ao reproduzir áudio no loader:', error);
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Timer para completar o loading após 4.5 segundos
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      handleLoadingComplete();
    }, 4500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleLoadingComplete = () => {
    // Para o áudio quando o loading estiver completo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsLoading(false);
    
    // Redireciona para a home
    navigate('/festival');
  };

  return (
    <div className="relative">
      {/* Áudio que continua tocando durante o loader */}
      <audio 
        ref={audioRef}
        preload="metadata"
        loop={false}
      >
        <source src="/audio/riff.MP3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      
      {/* Page Loader */}
      {isLoading && (
        <Loader />
      )}
    </div>
  );
};

export default LoaderPage;