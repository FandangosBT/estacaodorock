import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const PreHome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [keySequence, setKeySequence] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentText, setCurrentText] = useState('');
  
  const fullText = "Prepare-se para a experiência mais épica do ano...";

  // Typing animation
  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setCurrentText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 80);

    return () => clearInterval(typeTimer);
  }, []);

  // Easter egg listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key.toLowerCase()).slice(-4);
      setKeySequence(newSequence);
      
      if (newSequence === 'rock') {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const handleEnterFestival = () => {
    setIsLoading(true);
    
    // Simulate loading and transition
    setTimeout(() => {
      navigate('/festival');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background with animated gate */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-red-900/20" />
        
        {/* Animated gate silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full">
            {/* Gate pillars */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse-neon" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse-neon" />
            
            {/* Crowd silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-32">
              <div className="flex items-end justify-center h-full space-x-1 opacity-60">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black rounded-t-full animate-float"
                    style={{
                      width: '8px',
                      height: `${Math.random() * 40 + 20}px`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-float opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Blinking lights */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-32 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-16 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Festival title */}
          <h1 className="text-4xl md:text-6xl font-bold text-glow-primary mb-8">
            <span className="text-gradient-neon">FESTIVAL DE ROCK</span>
            <br />
            <span className="text-3xl md:text-5xl text-accent">2025</span>
          </h1>

          {/* Typing animation */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Enter button */}
          <div className="relative">
            <Button
              onClick={handleEnterFestival}
              disabled={isLoading}
              className="btn-neon-primary text-2xl md:text-3xl px-12 py-6 h-auto relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                🎟️ {isLoading ? 'ENTRANDO...' : 'ENTRAR NO FESTIVAL'}
              </span>
              
              {/* Hover ripple effect */}
              <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-md" />
              
              {/* Pulsing border */}
              <div className="absolute inset-0 border-2 border-primary/50 rounded-md animate-pulse" />
            </Button>
          </div>
        </div>

        {/* Audio control */}
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-muted-foreground hover:text-primary"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Easter egg overlay */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-pulse z-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white animate-bounce">🤘 ROCK ON! 🤘</h2>
            <p className="text-2xl text-white mt-4 animate-pulse">Você desbloqueou o modo rockstar!</p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-40 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-xl text-primary animate-pulse">Carregando a experiência...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreHome;