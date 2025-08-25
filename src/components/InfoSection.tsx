import React from 'react';
import EnhancedCard from './EnhancedCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Car, 
  Bus, 
  Utensils, 
  Tent, 
  Shield, 
  Heart,
  Info,
  Phone,
  Mail,
  ExternalLink,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animations';
import '@/styles/rock-styles.css';

export const InfoSection = () => {
  const titleAnimation = useScrollAnimation({ delay: 100 });
  const cardsAnimation = useScrollAnimation({ delay: 200, stagger: 150 });
  
  const practicalInfo = [
    {
      icon: MapPin,
      title: 'Localização',
      content: 'Centro de Eventos de Berna\nRua Principal, 123 - Centro\nBerna, SP',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Clock,
      title: 'Horários',
      content: 'Abertura dos portões: 14h\nPrimeiro show: 15h\nÚltimo show: 02h',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      icon: Car,
      title: 'Estacionamento',
      content: 'Gratuito no local\nCapacidade para 500 veículos\nSegurança 24h',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: Bus,
      title: 'Transporte',
      content: 'Ônibus especiais saindo de:\nRibeirão Preto, Araraquara\ne São Carlos',
      color: 'text-electric',
      bgColor: 'bg-electric/10'
    }
  ];

  const services = [
    {
      icon: Utensils,
      title: 'Alimentação',
      items: ['Food trucks variados', 'Praça de alimentação', 'Opções vegetarianas', 'Bebidas e lanches']
    },
    {
      icon: Tent,
      title: 'Estrutura',
      items: ['Palco principal 20x12m', 'Som profissional', 'Iluminação LED', 'Telões laterais']
    },
    {
      icon: Shield,
      title: 'Segurança',
      items: ['Equipe especializada', 'Posto médico', 'Brigada de incêndio', 'Segurança patrimonial']
    },
    {
      icon: Heart,
      title: 'Acessibilidade',
      items: ['Área PcD', 'Banheiros adaptados', 'Intérprete de Libras', 'Cadeirantes prioritários']
    }
  ];

  const prohibitedItems = [
    { icon: X, text: 'Proibido entrada com bebidas alcoólicas', type: 'prohibited' },
    { icon: X, text: 'Não é permitido objetos cortantes', type: 'prohibited' },
    { icon: X, text: 'Proibido animais (exceto cães-guia)', type: 'prohibited' },
    { icon: X, text: 'Proibido substâncias ilícitas', type: 'prohibited' }
  ];

  const allowedItems = [
    { icon: Check, text: 'Permitido cadeiras de praia', type: 'allowed' },
    { icon: Check, text: 'Permitido garrafas plásticas vazias', type: 'allowed' },
    { icon: Check, text: 'Permitido protetor solar e repelente', type: 'allowed' },
    { icon: Check, text: 'Permitido câmeras fotográficas', type: 'allowed' }
  ];

  const specialRules = [
    { icon: Heart, text: 'Meia-entrada para estudantes e idosos', type: 'special' },
    { icon: Utensils, text: '1kg de alimento = 50% desconto', type: 'special' }
  ];

  const contacts = [
    {
      icon: Phone,
      label: 'Telefone',
      value: '(16) 3xxx-xxxx',
      action: 'tel:+551630000000'
    },
    {
      icon: Mail,
      label: 'E-mail',
      value: 'contato@festivalberna.com.br',
      action: 'mailto:contato@festivalberna.com.br'
    },
    {
      icon: MapPin,
      label: 'Endereço',
      value: 'Rua Principal, 123 - Berna/SP',
      action: 'https://maps.google.com'
    }
  ];

  return (
    <section id="informacoes" aria-labelledby="informacoes-title" className="bg-black py-16 relative">
      <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
        {/* Header - BRUTALIST STYLE */}
        <div className="text-center mb-16">
          <h2 
            id="informacoes-title"
            ref={titleAnimation.ref}
            className={`text-4xl md:text-6xl font-black mb-6 uppercase text-white ${titleAnimation.getAnimationClasses()}`}
            style={{
              textShadow: '4px 4px 0px #ff2a2a, 8px 8px 0px rgba(0,0,0,0.8)',
              fontFamily: 'Bebas Neue, Arial Black, sans-serif'
            }}
          >
            INFORMAÇÕES PRÁTICAS
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed font-black uppercase tracking-wide"
             style={{
               fontFamily: 'Bebas Neue, Arial Black, sans-serif'
             }}>
            TUDO QUE VOCÊ PRECISA SABER PARA APROVEITAR AO MÁXIMO O <span className="text-yellow-400 font-black">ESTAÇÃO ROCK 2025</span>.
          </p>
        </div>

        {/* Practical Info Grid - BRUTALIST STYLE */}
        <div 
          ref={cardsAnimation.ref}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16 ${cardsAnimation.getAnimationClasses()}`}
        >
          {practicalInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div
                key={index}
                className={`bg-[#111] text-white border-2 border-yellow-500 p-6 rounded-none hover:scale-105 transition-all duration-300 ${cardsAnimation.getAnimationClasses(index)}`}
                style={{
                  filter: 'drop-shadow(0 0 4px #ffbd00)'
                }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <IconComponent className="text-yellow-400 text-2xl w-8 h-8" />
                  <h3 className="uppercase font-extrabold tracking-wider text-lg text-white"
                      style={{
                        fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                      }}>
                    {info.title}
                  </h3>
                  <div className="text-white text-sm whitespace-pre-line leading-relaxed text-center font-medium">
                    {info.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Grid - BRUTALIST STYLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="bg-black border-2 border-red-600 px-6 py-4 rounded-none hover:scale-105 transition-all duration-300"
                style={{
                  filter: 'drop-shadow(0 0 4px #ff2a2a)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <IconComponent className="text-red-600 w-8 h-8" />
                  <h3 className="text-white uppercase font-bold text-xl tracking-wider"
                      style={{
                        fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                      }}>
                    {service.title}
                  </h3>
                </div>
                <ul className="list-disc list-inside text-white space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm font-medium marker:text-yellow-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Rules and Guidelines - BRUTALIST STYLE */}
        <div className="max-w-5xl mx-auto py-16 px-6 mb-16">
          <h3 className="text-4xl md:text-6xl font-black uppercase text-white text-center mb-16" 
              style={{
                textShadow: '4px 4px 0px #ff2a2a, 8px 8px 0px rgba(0,0,0,0.8)',
                fontFamily: 'Bebas Neue, Arial Black, sans-serif'
              }}>
            REGRAS E ORIENTAÇÕES
          </h3>
          
          <div className="bg-black p-0">
            {/* Prohibited Items */}
            <div className="mb-12">
              <h4 className="text-3xl font-black text-red-600 mb-8 uppercase tracking-wider flex items-center gap-4"
                  style={{
                    textShadow: '2px 2px 0px #000',
                    fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                  }}>
                ❌ ITENS PROIBIDOS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prohibitedItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} 
                         className="bg-[#111] border-2 border-red-700 p-4 rounded-none flex items-center gap-4 hover:scale-105 transition-all duration-300 hover:border-red-500">
                      <IconComponent className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white font-bold uppercase text-sm tracking-wide">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Allowed Items */}
            <div className="mb-12">
              <h4 className="text-3xl font-black text-yellow-400 mb-8 uppercase tracking-wider flex items-center gap-4"
                  style={{
                    textShadow: '2px 2px 0px #000',
                    fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                  }}>
                ✅ ITENS PERMITIDOS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allowedItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} 
                         className="bg-[#111] border-2 border-yellow-500 p-4 rounded-none flex items-center gap-4 hover:scale-105 transition-all duration-300 hover:border-yellow-400">
                      <IconComponent className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white font-bold uppercase text-sm tracking-wide">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Rules */}
            <div>
              <h4 className="text-3xl font-black text-cyan-400 mb-8 uppercase tracking-wider flex items-center gap-4"
                  style={{
                    textShadow: '2px 2px 0px #000',
                    fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                  }}>
                📛 REGRAS ESPECIAIS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specialRules.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} 
                         className="bg-[#111] border-2 border-cyan-600 p-4 rounded-none flex items-center gap-4 hover:scale-105 transition-all duration-300 hover:border-cyan-400">
                      <IconComponent className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white font-bold uppercase text-xs tracking-wide">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - BRUTALIST STYLE */}
        <div className="max-w-5xl mx-auto py-16 px-6">
          <h3 className="text-4xl md:text-6xl font-black uppercase text-white text-center mb-16" 
              style={{
                textShadow: '4px 4px 0px #ff2a2a, 8px 8px 0px rgba(0,0,0,0.8)',
                fontFamily: 'Bebas Neue, Arial Black, sans-serif'
              }}>
            CONTATO E SUPORTE
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div 
                  key={index}
                  className="bg-black border-2 border-white p-8 rounded-none hover:scale-105 transition-all duration-300 hover:border-red-600"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    <IconComponent className="w-16 h-16 text-white" />
                    <div>
                      <div className="text-xl font-black uppercase text-white tracking-wider mb-2"
                           style={{
                             fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                           }}>
                        {contact.label}
                      </div>
                      <div className="text-sm text-gray-400 uppercase tracking-wide">{contact.value}</div>
                    </div>
                    <button 
                      className="bg-red-600 hover:bg-white hover:text-black text-white font-bold text-xs px-4 py-2 rounded-none border-2 border-white uppercase tracking-wider transition-all duration-300"
                      onClick={() => window.open(contact.action, '_blank')}
                      style={{
                        fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2 inline" />
                      CONTATAR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Info - BRUTALIST STYLE */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-black border-4 border-red-600 p-8 rounded-none">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Info className="w-12 h-12 text-red-600" />
              <h4 className="text-3xl font-black uppercase text-red-600 tracking-wider"
                  style={{
                    textShadow: '2px 2px 0px #000',
                    fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                  }}>
                🚨 EMERGÊNCIAS
              </h4>
            </div>
            <p className="text-white font-bold uppercase text-lg mb-6 tracking-wide"
               style={{
                 fontFamily: 'Bebas Neue, Arial Black, sans-serif'
               }}>
              EM CASO DE EMERGÊNCIA, PROCURE IMEDIATAMENTE A EQUIPE DE SEGURANÇA OU O POSTO MÉDICO.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-red-600 text-white font-black px-6 py-3 rounded-none border-2 border-white uppercase tracking-wider"
                   style={{
                     fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                   }}>
                🏥 POSTO MÉDICO: PORTÃO PRINCIPAL
              </div>
              <div className="bg-red-600 text-white font-black px-6 py-3 rounded-none border-2 border-white uppercase tracking-wider"
                   style={{
                     fontFamily: 'Bebas Neue, Arial Black, sans-serif'
                   }}>
                🛡️ SEGURANÇA: 24H NO LOCAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;