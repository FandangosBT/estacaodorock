import React from 'react';
import { Crown, Music, Users, Zap, Heart, Handshake, Star, Award, Building, Headphones } from 'lucide-react';

export const SponsorsSection = () => {
  const sponsorTiers = [
    {
      tier: 'Patrocinador Master',
      icon: Star,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      sponsors: [
        { name: 'Prefeitura Municipal de Berna', logo: '🏛️' },
        { name: 'Câmara Municipal', logo: '🏢' }
      ]
    },
    {
      tier: 'Apoio Cultural',
      icon: Heart,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/30',
      sponsors: [
        { name: 'Secretaria de Cultura', logo: '🎭' },
        { name: 'Fundação Cultural', logo: '🎨' },
        { name: 'Casa da Cultura', logo: '🏛️' }
      ]
    },
    {
      tier: 'Parceiros Locais',
      icon: Handshake,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30',
      sponsors: [
        { name: 'Comércio Local', logo: '🏪' },
        { name: 'Restaurantes Parceiros', logo: '🍽️' },
        { name: 'Hotéis e Pousadas', logo: '🏨' },
        { name: 'Transportadoras', logo: '🚛' }
      ]
    },
    {
      tier: 'Apoio Técnico',
      icon: Award,
      color: 'text-electric',
      bgColor: 'bg-electric/10',
      borderColor: 'border-electric/30',
      sponsors: [
        { name: 'Som & Luz Profissional', logo: '🎵' },
        { name: 'Estruturas e Palcos', logo: '🏗️' },
        { name: 'Segurança Especializada', logo: '🛡️' }
      ]
    }
  ];

  const communityPartners = [
    { name: 'Banco de Alimentos', description: 'Distribuição de doações arrecadadas' },
    { name: 'Casa de Apoio São Vicente', description: 'Beneficiária das arrecadações' },
    { name: 'Lar dos Idosos', description: 'Apoio à terceira idade' },
    { name: 'Creche Municipal', description: 'Cuidado com as crianças' }
  ];

  return (
    <section id="apoiadores" className="bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider text-white mb-4" style={{textShadow: '2px 2px #ff2a2a'}}>
            Parceiros do Festival
          </h2>
          <p className="text-[#f0f0f0] text-lg max-w-3xl mx-auto">
            Conheça as empresas e organizações que tornam este festival possível
          </p>
        </div>

        {/* Sponsor Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sponsorTiers.map((tier, index) => {
            const isTop = tier.tier.toLowerCase().includes('master');
            
            return (
              <div key={index} className="border border-[#ff2a2a] rounded-lg p-4 bg-[#111111] shadow-xl relative">
                {/* Fita adesiva para patrocinador master */}
                {isTop && (
                  <span className="bg-[#ffbd00] px-2 py-0.5 rotate-[4deg] absolute -top-2 left-2 text-xs font-bold uppercase text-black shadow-lg z-10">
                    TOP
                  </span>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <tier.icon className="text-[#ff2a2a] w-8 h-8" />
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide">{tier.tier}</h3>
                </div>
                
                <div className="space-y-3">
                  {tier.sponsors.map((sponsor, sponsorIndex) => (
                    <div key={sponsorIndex} className="border border-white/20 bg-[#0f0f0f] px-6 py-4 rounded-lg text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sponsor.logo}</span>
                        <div>
                          <h4 className="text-white font-bold">{sponsor.name}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Partners */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#ff2a2a] uppercase tracking-wider" style={{textShadow: '2px 2px #000'}}>
              Parceiros Sociais
            </h3>
            <p className="text-[#f0f0f0] max-w-2xl mx-auto text-sm uppercase tracking-wide">
              Organizações que compartilham nossa visão de transformação social através da música
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityPartners.map((partner, index) => (
              <div key={index} className="border border-white/20 bg-[#0f0f0f] px-6 py-4 rounded-lg text-left">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="text-[#ff2a2a] w-6 h-6" />
                  <h4 className="text-white font-bold">{partner.name}</h4>
                </div>
                <p className="text-white/70 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20">
          <div className="border border-[#ff2a2a] rounded-lg p-8 bg-[#111111] shadow-xl text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Handshake className="text-[#ff2a2a] w-8 h-8" />
              <h3 className="text-2xl font-bold uppercase tracking-wide text-white">
                Seja nosso parceiro
              </h3>
            </div>
            <p className="text-[#f0f0f0] mb-6 max-w-2xl mx-auto">
              Junte-se a nós e faça parte da transformação social através da música. 
              Apoie o Festival Berna e fortaleça a cultura em nossa comunidade.
            </p>
            <button className="bg-[#ff2a2a] text-[#f0f0f0] px-8 py-3 rounded uppercase font-bold border border-white/10 hover:bg-[#e02121] transition mb-6">
              Quero ser parceiro
            </button>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-[#0f0f0f] border border-white/20 px-3 py-1 text-xs uppercase font-medium text-[#f0f0f0] rounded">
                Visibilidade
              </span>
              <span className="bg-[#0f0f0f] border border-white/20 px-3 py-1 text-xs uppercase font-medium text-[#f0f0f0] rounded">
                Impacto Social
              </span>
              <span className="bg-[#0f0f0f] border border-white/20 px-3 py-1 text-xs uppercase font-medium text-[#f0f0f0] rounded">
                Networking
              </span>
              <span className="bg-[#0f0f0f] border border-white/20 px-3 py-1 text-xs uppercase font-medium text-[#f0f0f0] rounded">
                Cultura
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;