'use client';

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef, forwardRef } from 'react';

interface SectionProps {
  scrollYProgress: MotionValue<number>;
}

// ---------- Componente de fita adesiva ----------
const Tape: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }> = ({
  position,
  color = '#ffbd00',
}) => {
  const positions: Record<string, string> = {
    tl: 'top-0 left-0 -translate-x-1/3 -translate-y-1/3 -rotate-6',
    tr: 'top-0 right-0 translate-x-1/3 -translate-y-1/3 rotate-6',
    bl: 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3 rotate-6',
    br: 'bottom-0 right-0 translate-x-1/3 translate-y-1/3 -rotate-6',
  };

  return (
    <div
      className={`absolute w-16 h-4 ${positions[position]}`}
      style={{
        backgroundColor: color,
        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
      }}
    />
  );
};

// ---------- SECTION 1 (Pôster 1) ----------
const Section1: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className='sticky top-0 h-screen flex flex-col items-center justify-center
                 bg-black overflow-hidden'
    >
      <div className="relative bg-[#111111] border-2 border-white/20 rounded-md px-6 py-12
                      text-center shadow-xl max-w-3xl mx-auto">
        
        {/* Fitas adesivas */}
        <Tape position="tl" color="#ffbd00" />
        <Tape position="tr" color="#ff2a2a" />
        <Tape position="bl" color="#ff2a2a" />
        <Tape position="br" color="#ffbd00" />

        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-tight text-[#f0f0f0]'>
          VOCÊ CHEGOU <br /> AO FIM... MAS O SHOW NÃO PARA!
        </h1>
      </div>
    </motion.section>
  );
};

// ---------- SECTION 2 (Pôster 2) ----------
const Section2: React.FC<SectionProps> = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [10, 0]);

  return (
    <motion.section
      style={{ scale, rotate }}
      className='relative h-screen bg-[#111111] flex flex-col items-center justify-center'
    >
      <div className="relative bg-black border-2 border-white/20 rounded-md px-6 py-12
                      text-center shadow-xl max-w-3xl mx-auto">

        {/* Fitas adesivas */}
        <Tape position="tl" color="#ff2a2a" />
        <Tape position="tr" color="#ffbd00" />
        <Tape position="bl" color="#ffbd00" />
        <Tape position="br" color="#ff2a2a" />

        <h2 className='text-2xl md:text-4xl lg:text-5xl font-bold uppercase leading-snug text-[#f0f0f0]'>
          Esse site foi hackeado pelo caos criativo <br />
          <span className='text-[#ffbd00]'>da Q7 Ops</span> by{' '}
          <a
            href='https://www.instagram.com/oericbarros'
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-[#ff2a2a] transition'
          >
            @oericbarros
          </a>
        </h2>
       </div>
     </motion.section>
   );
 };

// ---------- COMPONENT PRINCIPAL ----------
const HeroScrollAnimation = forwardRef<HTMLElement>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <main ref={container} className='relative h-[200vh] overflow-x-hidden'>
      <Section1 scrollYProgress={scrollYProgress} />
      <Section2 scrollYProgress={scrollYProgress} />

      <footer className='bg-black py-16 flex justify-center items-center'>
        <p className='text-[#f0f0f0] text-lg uppercase tracking-widest'>
          © Copyright 2025 Estação do Rock. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
});

HeroScrollAnimation.displayName = 'HeroScrollAnimation';
export default HeroScrollAnimation;