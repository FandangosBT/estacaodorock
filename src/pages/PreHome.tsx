import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreHome.css';

const PreHome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  const handleAudioPlay = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      
      // Aguarda 1 segundo e redireciona para o page loader
      setTimeout(() => {
        navigate('/loader', { state: { playAudio: true } });
      }, 1000);
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-center px-4 animate-fade-slide">
      
      {/* Logo com batimento cardíaco irregular */}
      <img 
        src="/logo2.svg" 
        alt="Estação Rock Logo" 
        className="h-32 w-auto mb-12 drop-shadow-[0_0_12px_#ff2a2a] animate-heartbeat" 
      />
      
      {/* Texto principal */}
      <p className="text-[#ffbd00] text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
        <svg 
          className="w-5 h-5 text-[#ffbd00]" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l-2 2m0 0l-2-2m2 2h10m-6 13v-5h-4l4-8v8h4l-4 8z" />
        </svg>
        O trem do rock está na plataforma
      </p>
      <p className="text-[#f0f0f0] text-sm mb-8">
        Aperte o play e já comece a sair da linha
      </p>
      
      {/* Botão de tocar riff */}
      <button 
        onClick={handleAudioPlay}
        disabled={isPlaying}
        className="flex items-center gap-2 bg-[#ffbd00] text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg border border-black/30 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? '🔄' : '▶'} {isPlaying ? 'Carregando...' : 'Play'}
      </button>
      
      {/* Botão de entrar estilo brutalista */}
      <button 
        onClick={() => navigate('/loader', { state: { playAudio: false } })}
        className="px-10 py-4 border-2 border-[#ffbd00] text-[#f0f0f0] font-bold uppercase tracking-wider relative group"
      >
        Entrar SEM Som ⚡
        <span className="absolute inset-0 border-2 border-[#ffbd00] translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></span>
      </button>
      
      {/* Fitas adesivas decorativas */}
      <div className="absolute top-12 left-6 rotate-[-10deg] w-24 h-2 bg-[#ffbd00]" />
      <div className="absolute bottom-20 right-8 rotate-[15deg] w-28 h-2 bg-[#ff2a2a]" />
      
      {/* Áudio */}
      <audio 
        ref={audioRef}
        onEnded={handleAudioEnd}
        preload="metadata"
      >
        <source src="/audio/riff.MP3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      
    </div>
  );
};

export default PreHome;