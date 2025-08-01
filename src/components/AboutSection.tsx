import React from 'react';
import EnhancedCard from './EnhancedCard';
import { Badge } from '@/components/ui/badge';
import { GrungeBackground } from '@/components/ui/grunge-background';
import { GrungeNoise } from '@/components/ui/grunge-noise';
import { TapeElement, TapeCorner } from '@/components/ui/tape-element';
import { Calendar, MapPin, Users, Music, Heart, Award, Skull, Zap, Volume2, Guitar } from 'lucide-react';
import { useScrollAnimation, useTimelineAnimation } from '@/hooks/use-scroll-animations';

export const AboutSection = () => {
  const stats = [
    { icon: Skull, value: '150MIL+', label: 'ALMAS CONQUISTADAS', color: 'text-red-500' },
    { icon: Guitar, value: '100+', label: 'BANDAS BRUTAIS', color: 'text-yellow-400' },
    { icon: Zap, value: '24', label: 'ANOS DE CAOS', color: 'text-white' },
    { icon: Volume2, value: '50TON', label: 'DECIBÉIS DE FÚRIA', color: 'text-red-400' }
  ];

  const milestones = [
    {
      year: '2002',
      title: 'NASCIMENTO DO CAOS',
      description: 'Jovens rebeldes decidiram quebrar o silêncio sertanejo com puro rock'
    },
    {
      year: '2007',
      title: 'ESTRUTURA DE GUERRA',
      description: 'Som profissional e palcos dignos para a batalha sonora'
    },
    {
      year: '2013',
      title: 'INVASÃO NACIONAL',
      description: 'As grandes lendas do rock brasileiro pisaram em nosso território'
    },
    {
      year: '2025',
      title: 'DOMINAÇÃO TOTAL',
      description: 'O festival se tornou a meca do rock no interior paulista'
    }
  ];

  const titleAnimation = useScrollAnimation({ delay: 100 });
  const statsAnimation = useScrollAnimation({ delay: 200, stagger: 150 });
  const timelineAnimation = useTimelineAnimation(milestones.length);

  return (
    <section id="sobre" className="py-20 bg-black relative overflow-hidden">
      {/* Grunge Background Effects */}
      <GrungeBackground 
        intensity={0.8}
        color="rgba(255,255,255,0.1)"
        overlay
        className="absolute inset-0"
      />
      <GrungeNoise 
        patternSize={2}
        patternScaleX={1}
        patternScaleY={1}
        patternAlpha={0.15}
        className="absolute inset-0 mix-blend-overlay"
      />
      
      {/* Tape Elements */}
       <TapeElement 
         variant="diagonal"
         color="red"
         size="md"
         rotation={12}
         className="absolute top-10 left-10"
       />
       <TapeElement 
         variant="horizontal"
         color="yellow"
         size="lg"
         rotation={-6}
         className="absolute top-1/3 right-20"
       />
       <TapeElement 
         variant="vertical"
         color="white"
         size="sm"
         rotation={45}
         className="absolute bottom-20 left-1/4"
       />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <TapeElement 
            variant="horizontal"
            color="red"
            size="lg"
            rotation={-3}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          />
          <h2 
            ref={titleAnimation.ref}
            className={`text-4xl md:text-6xl font-black mb-6 uppercase tracking-wider transform -skew-x-2 ${titleAnimation.getAnimationClasses()}`}
            style={{
              color: '#f0f0f0',
              textShadow: '4px 4px 0px #ff2a2a, 8px 8px 0px #0f0f0f',
              fontFamily: 'Bebas Neue, Impact, Arial Black, sans-serif'
            }}
          >
            NOSSA GUERRA
          </h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-black/80 border-2 border-red-500 transform rotate-1 rounded-sm"></div>
            <p className="relative text-xl text-white font-bold leading-relaxed p-6 uppercase tracking-wide">
              NO CORAÇÃO SERTANEJO, JOVENS REBELDES ERGUERAM O PUNHO E GRITARAM: 
              <span className="text-red-400 font-black">"O ROCK NÃO MORRE!"</span>
              <br />A REVOLUÇÃO COMEÇOU AQUI.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          ref={statsAnimation.ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${statsAnimation.getAnimationClasses(index)} relative`}
              >
                {/* Random tape elements on stats */}
                {index % 2 === 0 && (
                  <TapeElement 
                    variant="diagonal"
                    color={index === 0 ? "red" : "yellow"}
                    size="sm"
                    rotation={index * 15}
                    className="absolute -top-2 -right-2 z-10"
                  />
                )}
                <div className="relative bg-black border-2 border-white p-6 transform hover:scale-105 transition-all duration-300 group">
                  {/* Grunge background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80"></div>
                  <GrungeNoise 
                    patternSize={1}
                    patternScaleX={0.5}
                    patternScaleY={0.5}
                    patternAlpha={0.2}
                    className="absolute inset-0"
                  />
                  
                  <div className="relative text-center">
                    <IconComponent className="w-8 h-8 mx-auto mb-3 text-white" />
                    <div className={`text-3xl font-black mb-2 ${stat.color} transform -skew-x-1`}
                         style={{ textShadow: '2px 2px 0px #0f0f0f' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-white font-bold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          <TapeElement 
            variant="horizontal"
            color="yellow"
            size="lg"
            rotation={2}
            className="absolute -top-6 left-1/4"
          />
          <h3 className="text-3xl font-bold text-center mb-12 uppercase tracking-wider transform -skew-x-1"
              style={{
              color: '#f0f0f0',
              textShadow: '3px 3px 0px #ff2a2a, 6px 6px 0px #0f0f0f',
              fontFamily: 'Bebas Neue, Impact, Arial Black, sans-serif'
            }}>
            MARCOS DA DESTRUIÇÃO
          </h3>
          
          <div className="relative">
            {/* Timeline Line - Grunge Style */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-red-500 via-yellow-400 to-white rounded-none border border-black"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-black opacity-50"></div>
            
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                ref={timelineAnimation.getItemRef(index)}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} ${timelineAnimation.getItemClasses(index)}`}
              >
                {/* Timeline Dot - Grunge Style */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-500 border-4 border-white z-10 transform rotate-45"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black z-20 transform rotate-45"></div>
                
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'} relative`}>
                  {/* Random tape on timeline items */}
                  <TapeElement 
                    variant="diagonal"
                    color={index % 3 === 0 ? "red" : index % 3 === 1 ? "yellow" : "white"}
                    size="sm"
                    rotation={index % 2 === 0 ? 15 : -15}
                    className={`absolute ${index % 2 === 0 ? '-top-3 -right-3' : '-top-3 -left-3'} z-10`}
                  />
                  
                  <div className="relative bg-black border-2 border-white p-6 transform hover:scale-105 transition-all duration-300">
                    {/* Grunge background */}
                    <GrungeNoise 
                      patternSize={1}
                      patternScaleX={0.3}
                      patternScaleY={0.3}
                      patternAlpha={0.15}
                      className="absolute inset-0"
                    />
                    
                    <div className="relative">
                      {/* Year Badge */}
                      <div className="inline-block bg-red-500 text-white px-3 py-1 text-sm font-black uppercase mb-3 transform -skew-x-2"
                           style={{ textShadow: '1px 1px 0px #0f0f0f' }}>
                        {milestone.year}
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-wide transform -skew-x-1"
                          style={{ textShadow: '2px 2px 0px #ff0000' }}>
                        {milestone.title}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-white/90 leading-relaxed font-medium">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center relative">
          {/* Multiple tape elements */}
          <TapeElement 
            variant="horizontal"
            color="red"
            size="lg"
            rotation={-5}
            className="absolute -top-8 left-10"
          />
          <TapeElement 
            variant="diagonal"
            color="yellow"
            size="md"
            rotation={25}
            className="absolute top-10 right-20"
          />
          <TapeElement 
            variant="vertical"
            color="white"
            size="sm"
            rotation={-15}
            className="absolute bottom-10 left-1/4"
          />
          
          <div className="max-w-4xl mx-auto relative bg-black border-4 border-white p-8 transform hover:scale-105 transition-all duration-300">
            {/* Grunge background */}
            <GrungeBackground 
              intensity={0.6}
              color="rgba(255,255,255,0.1)"
              className="absolute inset-0"
            />
            <GrungeNoise 
              patternSize={2}
              patternScaleX={0.8}
              patternScaleY={0.8}
              patternAlpha={0.2}
              className="absolute inset-0"
            />
            
            <div className="relative">
              {/* Icon and Title */}
              <div className="flex items-center justify-center mb-6">
                <Skull className="w-12 h-12 text-red-500 mr-4" />
                <h3 className="text-3xl font-black text-white uppercase tracking-wider transform -skew-x-1"
                    style={{
                      textShadow: '3px 3px 0px #ff2a2a, 6px 6px 0px #0f0f0f',
                      fontFamily: 'Impact, Arial Black, sans-serif'
                    }}>
                  NOSSO JURAMENTO
                </h3>
                <Skull className="w-12 h-12 text-red-500 ml-4" />
              </div>
              
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 transform rotate-1"></div>
                <p className="relative text-lg text-white font-bold leading-relaxed p-6 uppercase tracking-wide">
                  ALÉM DO SOM BRUTAL, MANTEMOS A TRADIÇÃO DE ARRECADAÇÃO DE ALIMENTOS. 
                  <span className="text-yellow-400 font-black">ROCK COM PROPÓSITO!</span>
                  <br />FAZEMOS A DIFERENÇA ATRAVÉS DA MÚSICA E DA SOLIDARIEDADE.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-red-500 text-white px-4 py-2 font-black uppercase transform -skew-x-2 border-2 border-white"
                     style={{ textShadow: '1px 1px 0px #0f0f0f' }}>
                  SOM PESADO
                </div>
                <div className="bg-yellow-400 text-black px-4 py-2 font-black uppercase transform skew-x-2 border-2 border-black"
                     style={{ textShadow: '1px 1px 0px #f0f0f0' }}>
                  AÇÃO SOCIAL
                </div>
                <div className="bg-white text-black px-4 py-2 font-black uppercase transform -skew-x-1 border-2 border-red-500"
                     style={{ textShadow: '1px 1px 0px #ff0000' }}>
                  UNIÃO TOTAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;