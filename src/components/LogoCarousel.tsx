import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import OptimizedImage from '@/components/OptimizedImage';

interface LogoCarouselProps {
  logos: {
    id: string;
    name: string;
    logo: string;
    url?: string;
  }[];
  className?: string;
  speed?: number; // seconds per full loop
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({
  logos,
  className = '',
  speed = 40,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const playState = prefersReducedMotion ? 'paused' : paused ? 'paused' : 'running';

  const duplicatedLogos = [...logos, ...logos];

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.07 },
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-label="Patrocinadores do evento"
    >
      {/* Keyframes locais para permitir pausa controlada no hover/focus */}
      <style>{`
        @keyframes logoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Linha 1: esquerda -> direita (scroll para a esquerda) */}
        <div
          className="flex items-center gap-8"
          style={{
            width: 'max-content',
            animationName: 'logoScroll',
            animationTimingFunction: 'linear',
            animationDuration: `${speed}s`,
            animationIterationCount: 'infinite',
            animationPlayState: playState as any,
          }}
          aria-live="off"
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.div
              key={`row1-${logo.id}-${index}`}
              className="flex-shrink-0 w-32 h-20 relative group/logo"
              variants={logoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={prefersReducedMotion ? {} : 'hover'}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full p-3 bg-white backdrop-blur-sm rounded-lg border border-white/20 hover:bg-yellow-400/25 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60"
                  aria-label={`Visitar site do ${logo.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {logo.logo.startsWith('http') || logo.logo.includes('.') ? (
                      <OptimizedImage
                        src={logo.logo}
                        alt={`Logo ${logo.name}`}
                        containerClassName="bg-transparent"
                        placeholderClassName="bg-transparent"
                        imgClassName="w-full h-full object-contain transition-transform duration-300"
                        lazy
                      />
                    ) : (
                      <span className="text-2xl group-hover/logo:scale-110 transition-transform duration-300" aria-hidden="true">{logo.logo}</span>
                    )}
                  </div>
                </a>
              ) : (
                <div
                  className="w-full h-full p-3 bg-white backdrop-blur-sm rounded-lg border border-white/20 hover:bg-yellow-400/25"
                  role="img"
                  aria-label={`Logo ${logo.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {logo.logo.startsWith('http') || logo.logo.includes('.') ? (
                      <OptimizedImage
                        src={logo.logo}
                        alt={`Logo ${logo.name}`}
                        containerClassName="bg-transparent"
                        placeholderClassName="bg-transparent"
                        imgClassName="w-full h-full object-contain"
                        lazy
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">{logo.logo}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Linha 2: direção inversa (direita -> esquerda visualmente invertida) */}
        <div
          className="flex items-center gap-8 mt-6"
          style={{
            width: 'max-content',
            animationName: 'logoScroll',
            animationTimingFunction: 'linear',
            animationDuration: `${Math.max(20, speed - 6)}s`,
            animationIterationCount: 'infinite',
            animationDirection: 'reverse',
            animationPlayState: playState as any,
          }}
          aria-live="off"
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.div
              key={`row2-${logo.id}-${index}`}
              className="flex-shrink-0 w-32 h-20 relative group/logo"
              variants={logoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={prefersReducedMotion ? {} : 'hover'}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {logo.url ? (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full p-3 bg-white backdrop-blur-sm rounded-lg border border-white/20 hover:bg-yellow-400/25 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60"
                  aria-label={`Visitar site do ${logo.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {logo.logo.startsWith('http') || logo.logo.includes('.') ? (
                      <OptimizedImage
                        src={logo.logo}
                        alt={`Logo ${logo.name}`}
                        containerClassName="bg-transparent"
                        placeholderClassName="bg-transparent"
                        imgClassName="w-full h-full object-contain transition-transform duration-300"
                        lazy
                      />
                    ) : (
                      <span className="text-2xl group-hover/logo:scale-110 transition-transform duration-300" aria-hidden="true">{logo.logo}</span>
                    )}
                  </div>
                </a>
              ) : (
                <div
                  className="w-full h-full p-3 bg-white backdrop-blur-sm rounded-lg border border-white/20 hover:bg-yellow-400/25"
                  role="img"
                  aria-label={`Logo ${logo.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {logo.logo.startsWith('http') || logo.logo.includes('.') ? (
                      <OptimizedImage
                        src={logo.logo}
                        alt={`Logo ${logo.name}`}
                        containerClassName="bg-transparent"
                        placeholderClassName="bg-transparent"
                        imgClassName="w-full h-full object-contain"
                        lazy
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">{logo.logo}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fades laterais */}
      <div 
        className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black/80 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
      <div 
        className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black/80 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
    </div>
  );
};

export default LogoCarousel;