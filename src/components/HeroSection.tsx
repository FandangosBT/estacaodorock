import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Zap, Users, Play } from 'lucide-react';
import { AnimatedCanvas } from '@/components/AnimatedCanvas';
import heroImage from '@/assets/hero-festival.jpg';

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Canvas Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedCanvas />
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-10">
        <img 
          src={heroImage} 
          alt="Festival de Rock 2025" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      </div>

      {/* Lightning Effects */}
      <div className="absolute inset-0 z-15">
        <div className="animate-lightning absolute top-20 left-1/4 w-1 h-32 bg-accent opacity-0 transform rotate-12" style={{ animationDelay: '2s' }}></div>
        <div className="animate-lightning absolute top-40 right-1/3 w-1 h-24 bg-secondary opacity-0 transform -rotate-12" style={{ animationDelay: '4s' }}></div>
        <div className="animate-lightning absolute bottom-1/3 left-1/3 w-1 h-20 bg-primary opacity-0 transform rotate-45" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 z-20">
        <div className="floating absolute top-20 left-10 w-3 h-3 bg-primary rounded-full glow-primary animate-pulse"></div>
        <div className="floating-delayed absolute top-40 right-20 w-4 h-4 bg-secondary rounded-full glow-secondary"></div>
        <div className="floating absolute bottom-32 left-1/4 w-2 h-2 bg-accent rounded-full glow-accent animate-pulse"></div>
        <div className="floating-delayed absolute top-1/3 right-1/3 w-3 h-3 bg-electric rounded-full glow-electric"></div>
        <div className="floating absolute top-60 left-2/3 w-2 h-2 bg-primary rounded-full glow-primary"></div>
        <div className="floating-delayed absolute bottom-40 right-1/4 w-3 h-3 bg-secondary rounded-full glow-secondary animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-30 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-gradient-neon uppercase tracking-wider">
          Festival de Rock
        </h1>
        
        <div className="text-4xl md:text-6xl font-bold mb-8 text-glow-primary">
          2025
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 text-foreground/90 max-w-2xl mx-auto leading-relaxed">
          A experiência musical mais intensa do ano está chegando. 
          Prepare-se para três dias de puro rock e energia!
        </p>

        {/* Stats */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          <div className="flex items-center gap-3 text-lg">
            <Music className="w-6 h-6 text-primary" />
            <span className="text-glow-primary font-bold">20+ Bandas</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <Zap className="w-6 h-6 text-secondary" />
            <span className="text-glow-secondary font-bold">3 Palcos</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <Users className="w-6 h-6 text-accent" />
            <span className="text-glow-accent font-bold">50mil+ Pessoas</span>
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            className="btn-hero-primary group overflow-hidden"
            onClick={() => document.getElementById('lineup')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Entrar na Experiência
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              🎸
            </div>
          </Button>
          <Button 
            className="btn-neon-secondary group"
            onClick={() => document.getElementById('programacao')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Music className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Ver Programação
          </Button>
        </div>

        {/* Date and Location */}
        <div className="mt-12 text-center">
          <div className="text-2xl font-bold text-glow-accent mb-2">
            15, 16 e 17 de Agosto
          </div>
          <div className="text-lg text-foreground/80">
            São Paulo • Brasil
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center glow-primary">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse-intense"></div>
          </div>
          <div className="text-center mt-2 text-sm text-primary font-semibold">
            Explore
          </div>
        </div>
      </div>
    </section>
  );
};