import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Baby, Car, Shield, Utensils, X } from 'lucide-react';
import gsap from 'gsap';
import OptimizedImage from '@/components/OptimizedImage';

// Seção de Atrações do evento, inspirada em "layout grid" interativo
// - 4 cards: Espaço Kids, Encontro de carros antigos, Presença de Motoclubes, Praça de Alimentação
// - Animações suaves com framer-motion + microinterações GSAP (respeitando prefers-reduced-motion)
// - Acessível: navegação por teclado, aria-attributes, contraste

type Attraction = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradientFrom: string;
  gradientTo: string;
  imageSrc: string;
  imageAlt: string;
};

const ATTRACTIONS: Attraction[] = [
  {
    id: 'kids',
    title: 'Espaço Kids',
    description: `O Festival é para todos — e isso inclui os pequenos!
No Espaço Kids, as crianças encontram um ambiente seguro, criativo e cheio de atividades pensadas especialmente para elas. Brincadeiras, jogos e atrações que garantem diversão do começo ao fim, enquanto os pais podem relaxar e curtir os shows com tranquilidade.
Porque alegria compartilhada em família é ainda melhor!`,
    icon: Baby,
    gradientFrom: 'from-pink-500/30',
    gradientTo: 'to-purple-500/30',
    imageSrc: '/kids.jpg',
    imageAlt: 'Espaço Kids com brinquedos e crianças se divertindo',
  },
  {
    id: 'carros',
    title: 'Encontro de Carros Antigos',
    description: `Uma viagem no tempo sobre quatro rodas!
Na antiga plataforma da Estação de Ferro acontece o tradicional Encontro de Carros Antigos, realizado desde 2017.
O evento reúne veículos raros e restaurados, trazendo de volta o charme e a elegância de outras épocas. Mais do que uma exposição, é um mergulho na cultura retrô, embalado por música, nostalgia e a energia única do Festival.
A locomotiva da memória vai partir… venha com a gente nessa experiência vibrante!`,
    icon: Car,
    gradientFrom: 'from-amber-500/30',
    gradientTo: 'to-red-600/30',
    imageSrc: '/carros.jpg',
    imageAlt: 'Carros antigos expostos lado a lado',
  },
  {
    id: 'motoclubes',
    title: 'Encontro de Moto Clubes',
    description: `Liberdade, estrada e irmandade sobre duas rodas.
O Encontro de Moto Clubes é uma atração especial dentro do Festival, reunindo motociclistas de diferentes regiões para celebrar a paixão pelas motos. Mais do que um encontro, é uma demonstração de união, estilo e atitude.
Prepare-se para sentir a vibração dos motores e viver de perto essa experiência única, que só quem é apaixonado por duas rodas entende.`,
    icon: Shield,
    gradientFrom: 'from-teal-400/30',
    gradientTo: 'to-emerald-600/30',
    imageSrc: '/motos.jpg',
    imageAlt: 'Motociclistas reunidos com suas motos',
  },
  {
    id: 'food',
    title: 'Praça de Alimentação',
    description: `Nem só de música vive um Festival — também de sabores!
A Praça de Alimentação é o ponto de encontro perfeito para recarregar as energias. Uma seleção de comidas e bebidas deliciosas, preparada para agradar todos os gostos, acompanha o clima descontraído entre um show e outro.
Um espaço para sentar, relaxar e compartilhar bons momentos com amigos e família, sempre com o astral do Festival em volta.`,
    icon: Utensils,
    gradientFrom: 'from-yellow-400/30',
    gradientTo: 'to-orange-600/30',
    imageSrc: '/burger.jpg',
    imageAlt: 'Hambúrguer suculento representando a praça de alimentação',
  },
];

const containerVariants = {
  hidden: {},
  show: {},
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const AttractionsSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);

  const enableAnimations = useMemo(() => !prefersReducedMotion, [prefersReducedMotion]);

  const onCardActivate = useCallback((id: string) => setSelected(id), []);
  const onClose = useCallback(() => setSelected(null), []);

  // Refs para GSAP microinteractions
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const innerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Float idle em cada card (yoyo)
  useEffect(() => {
    if (!enableAnimations) return;

    const timelines: gsap.core.Tween[] = [];

    Object.entries(innerRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const delay = Math.random() * 0.6;
      const tween = gsap.to(el, {
        y: -10,
        duration: 2.8 + Math.random() * 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
        force3D: true,
      });
      timelines.push(tween);
    });

    return () => {
      timelines.forEach((t) => t.kill());
    };
  }, [enableAnimations]);

  // Hover/Focus lift + micro rotação
  useEffect(() => {
    if (!enableAnimations) return;

    const cleanups: Array<() => void> = [];

    Object.entries(cardRefs.current).forEach(([id, btn]) => {
      const inner = innerRefs.current[id];
      if (!btn || !inner) return;

      const enter = () => {
        gsap.to(inner, {
          duration: 0.4,
          scale: 1.04,
          y: -6,
          rotate: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
          force3D: true,
        });
      };

      const leave = () => {
        gsap.to(inner, {
          duration: 0.35,
          scale: 1,
          y: -4, // mantém ligeiro float de base
          rotate: 0,
          ease: 'power3.out',
          overwrite: 'auto',
          force3D: true,
        });
      };

      const onMouseEnter = () => enter();
      const onMouseLeave = () => leave();
      const onFocus = () => enter();
      const onBlur = () => leave();

      btn.addEventListener('mouseenter', onMouseEnter);
      btn.addEventListener('mouseleave', onMouseLeave);
      btn.addEventListener('focus', onFocus);
      btn.addEventListener('blur', onBlur);

      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onMouseEnter);
        btn.removeEventListener('mouseleave', onMouseLeave);
        btn.removeEventListener('focus', onFocus);
        btn.removeEventListener('blur', onBlur);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [enableAnimations]);

  // Parallax suave no mousemove (conteúdo)
  const handleParallax = useCallback((id: string, e: React.MouseEvent) => {
    if (!enableAnimations) return;
    const inner = innerRefs.current[id];
    if (!inner) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const px = (mx / rect.width) - 0.5; // -0.5 .. 0.5
    const py = (my / rect.height) - 0.5;

    // Translação sutil e inclinação leve
    const translateX = px * 6; // max 6px
    const translateY = py * 6; // max 6px
    const rotX = -py * 2; // max 2deg
    const rotY = px * 2;  // max 2deg

    gsap.to(inner, {
      x: translateX,
      y: `-=0`, // preserva y do float base
      rotationX: rotX,
      rotationY: rotY,
      transformPerspective: 700,
      transformOrigin: 'center',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [enableAnimations]);

  const resetParallax = useCallback((id: string) => {
    const inner = innerRefs.current[id];
    if (!inner) return;
    gsap.to(inner, {
      x: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // Fechar com ESC
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, onClose]);

  // Spring no overlay ao abrir
  const overlayCardRef = useRef<HTMLDivElement | null>(null);
  const overlayTitleRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (!enableAnimations || !selected) return;

    const tl = gsap.timeline();
    if (overlayCardRef.current) {
      tl.fromTo(
        overlayCardRef.current,
        { borderRadius: 28, scale: 0.98 },
        { borderRadius: 20, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.7)' }
      );
    }
    if (overlayTitleRef.current) {
      tl.fromTo(
        overlayTitleRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      );
    }

    return () => {
      tl.kill();
    };
  }, [enableAnimations, selected]);

  return (
    <section id="atracoes" aria-labelledby="atracoes-title" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h2 id="atracoes-title" className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
            Atrações do Evento
          </h2>
          <p className="mt-2 text-white/70 max-w-2xl mx-auto">
            Experiências pensadas para toda a família e a cultura do asfalto.
          </p>
        </header>

        <motion.ul
          role="list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          transition={enableAnimations ? { staggerChildren: 0.08, delayChildren: 0.05 } : undefined}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 grid-rows-2 gap-6"
          aria-describedby="atracoes-desc"
        >
          <span id="atracoes-desc" className="sr-only">
            Lista de quatro atrações do evento, selecione para saber mais.
          </span>

          {ATTRACTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = selected === item.id;
            return (
              <li key={item.id} className="relative">
                <motion.button
                  ref={(el) => (cardRefs.current[item.id] = el)}
                  layoutId={enableAnimations ? `card-${item.id}` : undefined}
                  variants={cardVariants}
                  whileHover={{}} // GSAP cuida do hover
                  whileTap={enableAnimations ? { scale: 0.98 } : {}}
                  onClick={() => onCardActivate(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCardActivate(item.id);
                    }
                  }}
                  onMouseMove={(e) => handleParallax(item.id, e)}
                  onMouseLeave={() => resetParallax(item.id)}
                  role="button"
                  aria-pressed={isSelected}
                  aria-expanded={isSelected}
                  aria-controls={isSelected ? `details-${item.id}` : undefined}
                  className="group relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 bg-white/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                  style={{ willChange: 'transform' }}
                >
                  <div
                    ref={(el) => (innerRefs.current[item.id] = el)}
                    className="absolute inset-0"
                    style={{ willChange: 'transform' }}
                  >
                    {/* Imagem da atração */}
                    <div className="absolute inset-0" aria-hidden="true">
                      <OptimizedImage
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        className="w-full h-full"
                        lazy
                      />
                    </div>

                    {/* Overlays para contraste */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo}`} aria-hidden="true" />
                    <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

                    {/* Conteúdo */}
                    <div className="relative z-10 h-full w-full flex items-center justify-center p-4 text-center pointer-events-none">
                      <div className="flex flex-col items-center gap-2">
                        <Icon aria-hidden className="w-8 h-8 text-white/90 drop-shadow" />
                        <h3 className="text-white font-extrabold uppercase tracking-wide text-lg">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-xs max-w-[16rem] line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Efeito de destaque on-hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-white/5" />
                      <div className="absolute -inset-1 rounded-3xl ring-1 ring-yellow-300/30 blur-md" />
                    </div>
                  </div>
                </motion.button>
              </li>
            );
          })}
        </motion.ul>

        {/* Overlay de detalhes ao selecionar */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-live="polite"
            >
              <button
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-label="Fechar detalhes"
                onClick={onClose}
              />

              {ATTRACTIONS.filter((a) => a.id === selected).map((a) => {
                const Icon = a.icon;
                return (
                  <motion.div
                    key={a.id}
                    ref={overlayCardRef}
                    layoutId={enableAnimations ? `card-${a.id}` : undefined}
                    className="relative z-10 w-[92vw] max-w-xl rounded-2xl overflow-hidden border border-white/15 bg-black/90"
                    initial={enableAnimations ? { borderRadius: 24 } : undefined}
                    animate={enableAnimations ? { borderRadius: 20 } : undefined}
                  >
                    {/* Header com imagem */}
                    <div className="relative h-40 w-full" aria-hidden="true">
                      <OptimizedImage src={a.imageSrc} alt={a.imageAlt} className="w-full h-full" lazy />
                      <div className={`absolute inset-0 bg-gradient-to-br ${a.gradientFrom} ${a.gradientTo}`} />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div id={`details-${a.id}`} className="relative z-10 p-6 text-white">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <Icon aria-hidden className="w-10 h-10 text-white/90" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 ref={overlayTitleRef} className="text-2xl font-extrabold uppercase tracking-wide">{a.title}</h3>
                          <p className="mt-2 text-white/90 leading-relaxed">
                            {a.description}
                          </p>
                        </div>
                        <div className="-mt-2">
                          <button
                            onClick={onClose}
                            className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                            aria-label="Fechar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AttractionsSection;