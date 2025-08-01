import React, { useRef, useState } from 'react';

const AudioTest: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState('ready');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    console.log(logMessage);
    setLogs(prev => [...prev.slice(-10), logMessage]); // Keep last 10 logs
  };

  const testAudio = async () => {
    addLog('🎵 Teste de áudio iniciado');
    setStatus('loading');

    if (!audioRef.current) {
      addLog('❌ Elemento de áudio não encontrado');
      setStatus('error');
      return;
    }

    const audio = audioRef.current;
    
    // Log audio properties
    addLog(`📊 Audio src: ${audio.src}`);
    addLog(`📊 ReadyState: ${audio.readyState}`);
    addLog(`📊 NetworkState: ${audio.networkState}`);
    addLog(`📊 Duration: ${audio.duration}`);
    addLog(`📊 Volume: ${audio.volume}`);
    addLog(`📊 Muted: ${audio.muted}`);

    try {
      // Reset and configure audio
      audio.currentTime = 0;
      audio.volume = 1.0;
      audio.muted = false;

      addLog('▶️ Tentando reproduzir áudio...');
      
      // Try to play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        addLog('✅ Áudio reproduzindo com sucesso!');
        setStatus('playing');
        
        // Auto stop after 3 seconds for testing
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          setStatus('ready');
          addLog('⏹️ Áudio parado automaticamente');
        }, 3000);
      }
    } catch (error: any) {
      addLog(`❌ Erro: ${error.name} - ${error.message}`);
      setStatus('error');
      
      if (error.name === 'NotAllowedError') {
        addLog('🚫 Reprodução bloqueada - política do navegador');
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'bg-yellow-500';
      case 'playing': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading': return '🔄 Carregando...';
      case 'playing': return '🎵 Reproduzindo';
      case 'error': return '❌ Erro';
      default: return '▶️ Testar Áudio';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-50">
      <h3 className="text-lg font-bold mb-3">🧪 Teste de Áudio</h3>
      
      <audio 
        ref={audioRef} 
        preload="auto"
        onLoadStart={() => addLog('📥 Carregamento iniciado')}
        onLoadedData={() => addLog('📊 Dados carregados')}
        onCanPlay={() => addLog('▶️ Pode reproduzir')}
        onPlay={() => addLog('▶️ Reprodução iniciada')}
        onPause={() => addLog('⏸️ Reprodução pausada')}
        onEnded={() => addLog('🏁 Reprodução finalizada')}
        onError={(e) => addLog(`❌ Erro no áudio: ${e.type}`)}
      >
        <source src="/audio/please.MP3" type="audio/mpeg" />
      </audio>
      
      <button
        onClick={testAudio}
        disabled={status === 'loading' || status === 'playing'}
        className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
          getStatusColor()
        } ${status === 'loading' || status === 'playing' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
      >
        {getStatusText()}
      </button>
      
      <div className="mt-3">
        <h4 className="text-sm font-semibold mb-1">📋 Logs:</h4>
        <div className="text-xs bg-gray-900 p-2 rounded max-h-32 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-400">Nenhum log ainda...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
      
      <button
        onClick={() => setLogs([])}
        className="mt-2 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
      >
        🗑️ Limpar Logs
      </button>
    </div>
  );
};

export default AudioTest;