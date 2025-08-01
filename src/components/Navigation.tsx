import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Info, 
  Music, 
  Calendar, 
  Image, 
  MapPin, 
  Heart,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './rock-styles.css';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { id: 'hero', label: 'Início', icon: Home },
    { id: 'sobre', label: 'Sobre', icon: Info },
    { id: 'lineup', label: 'Lineup', icon: Music },
    { id: 'programacao', label: 'Programação', icon: Calendar },
    { id: 'galeria', label: 'Galeria', icon: Image },
    { id: 'informacoes', label: 'Informações', icon: MapPin },
    { id: 'apoiadores', label: 'Apoiadores', icon: Heart }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = navigationItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-4">
             <img 
               src="/logo2.svg" 
               alt="Estação Rock Logo" 
               className="h-16 w-auto drop-shadow-[0_0_12px_#ff2a2a] animate-heartbeat"
             />
           </a>

          {/* Menu Desktop */}
          <ul className="hidden md:flex gap-8 text-white uppercase text-sm font-bold tracking-wider">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <a 
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={cn(
                      "hover:text-[#ffbd00] transition-colors duration-200",
                      isActive ? "text-[#ffbd00]" : "text-white"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Menu Mobile (hamburger) */}
          <button 
            className="md:hidden text-white text-3xl hover:text-[#ff2a2a] transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
         <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-md">
           <div className="pt-32 px-6">
            <div className="space-y-4">
              {navigationItems.map((item) => {
                const isActive = activeSection === item.id;
                
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={cn(
                      "block w-full text-left p-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 border-l-4",
                      isActive 
                        ? "text-[#ffbd00] border-[#ffbd00] bg-[#ffbd00]/10" 
                        : "text-white border-transparent hover:text-[#ffbd00] hover:border-[#ffbd00] hover:bg-[#ffbd00]/5"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile Footer */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="text-center text-sm text-white/60 font-bold uppercase tracking-wider">
                Estação Rock 2025
              </div>
              <div className="text-center text-xs text-white/40 mt-2">
                15, 16 e 17 de Agosto • São Paulo
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Navigation;