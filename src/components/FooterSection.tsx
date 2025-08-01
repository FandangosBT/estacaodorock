import React from 'react';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { GravityTextFooter } from '@/components/ui/gravity-text-footer';

const FooterSection: React.FC = () => {
  return (
    <>
      {/* Seção de Text Reveal */}
      <section className="bg-black">
        <TextRevealByWord 
          text="VOCÊ CHEGOU AO FIM... MAS O SHOW NÃO PARA."
          className="text-white"
        />
      </section>
      
      {/* Componente GravityTextFooter com física */}
      <GravityTextFooter />
      
      {/* Créditos Finais */}
      <footer className="bg-black py-6 text-center">
        <p className="text-sm text-white/50">
          © 2025 Estação Rock Festival. Desenvolvido por{' '}
          <span className="text-[#ffbd00] font-semibold">Q7 Ops - Sistema ÉPICO</span>
        </p>
      </footer>
    </>
  );
};

export default FooterSection;