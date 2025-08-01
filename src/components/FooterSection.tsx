import React from 'react';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { GravityTextFooter } from '@/components/ui/gravity-text-footer';

const FooterSection: React.FC = () => {
  return (
    <div className="relative">
      {/* Seção de Text Reveal */}
      <section className="bg-black relative overflow-visible">
        <TextRevealByWord 
          text="VOCÊ CHEGOU AO FIM... MAS O SHOW NÃO PARA."
          className="text-white"
        />
      </section>
      
      {/* Componente GravityTextFooter com física - altura limitada ao footer */}
      <section className="relative py-20 bg-black overflow-visible" style={{ height: '400px' }}>
        <div className="relative z-10">
          {/* Conteúdo do footer */}
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <GravityTextFooter />
        </div>
      </section>
      
      {/* Créditos Finais */}
      <footer className="bg-black py-6 text-center relative">
        <p className="text-sm text-white/50">
          © 2025 Estação Rock Festival. Desenvolvido por{' '}
          <span className="text-[#ffbd00] font-semibold">Q7 Ops - Sistema ÉPICO</span>
        </p>
      </footer>
    </div>
  );
};

export default FooterSection;