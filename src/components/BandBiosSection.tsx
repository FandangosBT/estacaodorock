"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart, Star, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import { gsap } from "gsap";

// Arranjo de bios específico desta seção, reutilizando os nomes do LineupPoster
// Imagens serão inseridas posteriormente (usaremos placeholder por ora)
// Links sociais podem ser atualizados conforme disponibilidade real

const placeholderImg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="64" height="72" viewBox="0 0 64 72" role="img" aria-labelledby="title desc"><title>Imagem da banda indisponível</title><desc>Imagem temporária para a banda</desc><rect width="64" height="72" fill="#27272a"/><g fill="#a1a1aa"><rect x="12" y="16" width="40" height="6"/><rect x="8" y="30" width="48" height="6"/><rect x="16" y="44" width="32" height="6"/></g></svg>`);

// Map de imagens reais no diretório /public/bandbios
const BAND_IMAGE_MAP: Record<string, string> = {
  "Trilha do Rock": "/bandbios/Trilha-do-Rock.svg",
  "Dona Tequila": "/bandbios/Dona-Tequila.svg",
  "LEDMOON": "/bandbios/LEDMOON.svg",
  "Landau 69": "/bandbios/Landau69.svg",
  "PMA Trio": "/bandbios/PMA-Trio.svg",
  "Mad Max": "/bandbios/MADMAX-MCBand.svg",
  "The Wizzards": "/bandbios/the-wizzards.svg",
  "Vigarista SK8Rock": "/bandbios/Vigarista-SK8Rock.svg",
  "Egypcio + 7 Jack's | Tihuana": "/bandbios/Egypcio+7JACKS.svg",
};

const getBandImage = (name: string) => BAND_IMAGE_MAP[name] ?? placeholderImg;

const bandsBios = [
  { name: "Trilha do Rock", bio: "A banda Trilha é quem vai abrir nosso Festival! Formada por músicos da nossa cidade de Bernardino de Campos, vem com um repertório completo de pop rock e rock nacional.", img: getBandImage("Trilha do Rock"), links: { instagram: "https://www.instagram.com/trilha.banda/", instagram2: undefined } },
  { name: "Dona Tequila", bio: "A banda Dona Tequila foi formada em 2007 pelos amigos: Alf, Limil, Duzão, Gustavo Salaro e Gustavo Alcântara. Eles se dedicam a tocar o puro rock que vai desde o nacional até Ramones e Alice in Chains, além de fazerem parte do projeto \"Santa Cruz, cidade do Rock\" e da comissão de bandas de Santa Cruz do Rio Pardo, equipe que realiza o Rock Rio Pardo.", img: getBandImage("Dona Tequila"), links: { instagram: "https://www.instagram.com/bandadonatequila/", instagram2: undefined } },
  { name: "LEDMOON", bio: "A LedMoon é formada por integrantes da cidade de Bauru – SP e Bernardino de Campos - SP e vão fazer um grande tributo às lendas do rock: Led Zeppelin e Pink Floyd.", img: getBandImage("LEDMOON"), links: { instagram: "https://www.instagram.com/bandaledmoon/", instagram2: undefined } },
  { name: "Landau 69", bio: "A banda começou sua jornada em 2002, na cidade de Santa Cruz do Rio Pardo - SP, com mais de 300 shows realizados, eles percorreram uma extensa lista de cidades, levando sua música para todos os cantos.<br /><br />Seu repertório é uma celebração da música nacional e internacional. Desde os clássicos do pop rock brasileiro das décadas de 80/90/00 até o indie rock dos anos 2000.", img: getBandImage("Landau 69"), links: { instagram: "https://www.instagram.com/landau69/", instagram2: undefined } },
  { name: "PMA Trio", bio: "Banda de rock clássico de Bernardino de Campos. Um trio que teve a formação de três professores de música formados em Tatuí para fazer o melhor do Rock e também os mais variados estilos, se aventurando pelo Pop, Reggae e Rock Nacional.<br /><br />São mais de 20 anos tocando e levando música de qualidade ao público. De Phil Collins a Bryan Adams, de Creedence Clearwater Revival a Rolling Stones, de Pink Floyd a Queen, de Bob Marley a Jimmy Cliff, de Bon Jovi a Nazareth, do Rock nacional dos anos 80 aos 2000. Um repertório muito completo e cheio de emoção.", img: getBandImage("PMA Trio"), links: { instagram: "https://www.instagram.com/pmatrioclassicrock/", instagram2: undefined } },
  { name: "Mad Max", bio: "Formada por membros do Mad Max M.C de Avaré - SP, a banda é composta por amigos amantes de duas rodas e rock n'roll.<br /><br />Com o repertório voltado ao público estradeiro, é recheado de clássicos anos 70/80 e 90, como: Creedence Clearwater Revival, Lynyrd Skynyrd, KISS, ZZ Top, etc...", img: getBandImage("Mad Max"), links: { instagram: "https://www.instagram.com/madmaxmcband/", instagram2: undefined } },
  { name: "The Wizzards", bio: "Banda tributo apaixonada por Black Sabbath e Ozzy Osbourne, dedicada a celebrar o legado destes ícones do rock. Com músicos talentosos e uma performance eletrizante, eles recriam fielmente os sucessos atemporais, transportando o público para a era dourada do rock.<br /><br />Formada em Bauru em 2019 a banda conta com Renato Guilhoto nos vocais, Walter Claro na guitarra, Cesar Guarnieri no baixo e Antônio Neto na bateria.", img: getBandImage("The Wizzards"), links: { instagram: "https://www.instagram.com/thewizzards_/", instagram2: undefined } },
  { name: "Vigarista SK8Rock", bio: "Fundada no início de 2010 por Samuel Castilho e Vinicius Barcellos, experientes músicos da noite paulista, a banda vem se apresentado por diversos palcos de todo interior de São Paulo e Capital.<br /><br />Sua filosofia profissional garante qualidade e inovação a cada show, fidelidade sonora, pegada e carisma. Seu repertório conta com uma homenagem ao Charlie Brown Jr e ao rock nacional, que vem arrastando centenas de pessoas por onde passa.", img: getBandImage("Vigarista SK8Rock"), links: { instagram: "https://www.instagram.com/vigarista_sk8rock/", instagram2: undefined } },
  { name: "Egypcio + 7 Jack's | Tihuana", bio: "Cantor, compositor e instrumentista brasileiro, conhecido por ser o vocalista da Tihuana, banda de rock brasileira formada em 1999 em São Paulo. Tornou-se conhecida nos primeiros anos da década de 2000 com a repercussão de \"Tropa de Elite\", canção que foi inclusa na trilha sonora do filme de mesmo nome.<br /><br />Egypcio também é vocalista da banda Cali e do projeto Charlie Brown Jr. A banda 7Jacks formada por músicos de Marília, toca todo tipo de rock e vem para uma parceria gigante com Egypcio!", img: getBandImage("Egypcio + 7 Jack's | Tihuana"), links: { instagram: "https://www.instagram.com/egypcio/", instagram2: "https://www.instagram.com/7jacksoficial/" } },
];

const SQRT_5000 = Math.sqrt(5000);

type Band = typeof bandsBios[number];

// Função para detectar se a bio é longa (>200 caracteres)
const isLongBio = (bio: string) => bio.length > 200;

// Função segura para remover HTML antes de truncar
const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Função para truncar texto preservando palavras
const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated) + "...";
};

export default function BandBiosSection() {
  const [cardSize, setCardSize] = useState(365);
  const [list, setList] = useState(bandsBios.map((b, i) => ({ ...b, tempId: i + 1 })));
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const bioRefs = useRef<Map<string, HTMLElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const centerCardRef = useRef<HTMLDivElement | null>(null);
  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  }, []);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 385 : 320); // Aumentei o tamanho para acomodar melhor o conteúdo
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Recalcular altura do container com base na altura real do card central
  useEffect(() => {
    const baseHeight = prefersReducedMotion ? (isMobile ? 560 : 580) : (isMobile ? 720 : 640);
    const measure = () => {
      const centerEl = centerCardRef.current;
      if (!centerEl) {
        setWrapperHeight(baseHeight);
        return;
      }
      // Altura real do card central
      const cardH = centerEl.scrollHeight || centerEl.clientHeight || 0;
      // Margens de segurança e deslocamento vertical do layout
      const clearanceTop = 140; // espaço para etiqueta/ornamentos
      const clearanceBottom = 160; // espaço para CTA e controles
      const next = Math.max(baseHeight, cardH + clearanceTop + clearanceBottom);
      setWrapperHeight(next);
    };

    // medir após pintura
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, prefersReducedMotion, list, expandedCards]);

  const handleMove = (steps: number) => {
    if (steps === 0) return;
    const newList = [...list];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) break;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) break;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setList(newList);
  };

  const toggleFavorite = (name: string) => {
    const next = new Set(favorites);
    if (next.has(name)) next.delete(name); else next.add(name);
    setFavorites(next);
  };

  const toggleExpanded = (bandName: string) => {
    const el = bioRefs.current.get(bandName);
    if (!el) return;

    const isExpanded = expandedCards.has(bandName);
    const next = new Set(expandedCards);
    const linesCollapsed = 6; // ~6 linhas no estado colapsado

    // Medidas iniciais
    const startHeight = el.clientHeight;
    let endHeight = 0;

    if (!isExpanded) {
      // Expandir: medir altura completa
      // Primeiro garantimos um maxHeight inicial igual à altura atual
      el.style.maxHeight = `${startHeight}px`;
      // Atualizar estado para renderizar conteúdo completo (já renderizamos completo no center)
      next.add(bandName);
      setExpandedCards(next);

      // Aguardar próxima pintura para medir o scrollHeight real
      if (!prefersReducedMotion) {
        requestAnimationFrame(() => {
          const fullHeight = el.scrollHeight;
          gsap.to(el, {
            duration: 0.45,
            ease: "power2.inOut",
            maxHeight: fullHeight,
            onComplete: () => {
              el.style.maxHeight = "none"; // liberar após animar
            }
          });
        });
      }
    } else {
      // Colapsar: animar até ~N linhas
      const lineHeightPx = parseFloat(getComputedStyle(el).lineHeight || "22");
      endHeight = Math.round(lineHeightPx * linesCollapsed);
      // Fixar maxHeight atual antes de animar
      el.style.maxHeight = `${startHeight}px`;

      if (!prefersReducedMotion) {
        gsap.to(el, {
          duration: 0.4,
          ease: "power2.inOut",
          maxHeight: endHeight,
          onComplete: () => {
            // atualizar estado após a animação para manter consistência visual
            const after = new Set(expandedCards);
            after.delete(bandName);
            setExpandedCards(after);
          }
        });
      } else {
        const after = new Set(expandedCards);
        after.delete(bandName);
        setExpandedCards(after);
      }
    }
  };

  const setBioRef = (bandName: string, element: HTMLElement | null) => {
    if (element) {
      bioRefs.current.set(bandName, element);
    } else {
      bioRefs.current.delete(bandName);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleMove(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleMove(1);
    }
  };

  return (
    <section
      id="artistas"
      className="relative w-full overflow-hidden bg-black py-14"
      aria-roledescription="carousel"
      aria-label="Apresentações das bandas"
    >
      {/* Ruído sutil no fundo para textura */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light">
        {/* fallback puro CSS se não houver canvas disponível */}
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6">
        <h2 className="mb-2 text-center text-3xl font-extrabold uppercase tracking-wider text-white">Apresentações</h2>
        <p className="text-center text-white/70">Conheça as bios das atrações do nosso lineup</p>

        <div
          ref={wrapperRef}
          className="relative mt-10 w-full bg-zinc-900/40"
          style={{ height: wrapperHeight ?? (prefersReducedMotion ? (isMobile ? 560 : 580) : (isMobile ? 720 : 640)) }}
          role="group"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {list.map((band, index) => {
            const len = list.length;
            const centerIndex = Math.floor(len / 2);
            const position = index - centerIndex;
            const isCenter = position === 0;
            const translateX = (cardSize / 1.5) * position;
            const translateY = isCenter ? -75 : position % 2 ? 20 : -20;
            const rotate = isCenter ? 0 : position % 2 ? 2.5 : -2.5;

            const isExpanded = expandedCards.has(band.name);
            const longBio = isLongBio(band.bio);
            const shouldShowExpandButton = isMobile && longBio && isCenter;

            // Truncar com segurança nas laterais (sem HTML)
            const shortBioPlain = truncateText(stripHtml(band.bio), 120);

            const onCardKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMove(position);
              }
            };

            // id para acessibilidade
            const bioId = `bio-${index}`;

            return (
              <div
                key={band.tempId}
                ref={isCenter ? (el) => (centerCardRef.current = el) : undefined}
                onClick={() => handleMove(position)}
                onKeyDown={onCardKeyDown}
                role="button"
                tabIndex={0}
                aria-label={`Exibir detalhes de ${band.name}`}
                className={`absolute left-1/2 top-1/2 cursor-pointer overflow-hidden border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out ${
                  isCenter
                    ? "z-20 bg-red-600 text-black border-red-600 shadow-[0_8px_0_4px_rgba(255,255,255,0.12)]"
                    : "z-10 bg-zinc-950/90 text-white border-white/15 hover:border-red-500/50"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
                style={{
                  width: cardSize,
                  height: isCenter ? "auto" : cardSize,
                  overflow: isCenter ? "visible" : undefined,
                  clipPath:
                    isCenter && isMobile && isExpanded
                      ? "none"
                      : "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
                  boxShadow: isCenter ? "0px 8px 0px 4px rgba(255,255,255,0.12)" : "0px 0px 0px 0px transparent",
                }}
                aria-current={isCenter ? "true" : undefined}
              >
                <span
                  className="absolute block origin-top-right rotate-45 bg-white/20"
                  style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
                />

                {/* Topo: Imagem + Ação Favorito */}
                <div className="flex items-start justify-between gap-4">
                  <img
                    src={band.img}
                    alt={`Foto da banda ${band.name}`}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = placeholderImg;
                    }}
                    className={`${isCenter ? "ring-black/50" : "ring-white/20"} h-16 w-16 lg:h-[72px] lg:w-[72px] rounded-full object-cover object-center bg-zinc-800/50 ring-2 shadow-[0_1px_0_rgba(0,0,0,0.6)]`}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(band.name);
                    }}
                    className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-bold uppercase transition-colors ${
                      favorites.has(band.name)
                        ? "border-red-600 bg-red-600 text-black"
                        : "border-white/20 bg-transparent text-white hover:border-red-600 hover:text-red-500"
                    }`}
                    aria-pressed={favorites.has(band.name)}
                    aria-label={`${favorites.has(band.name) ? "Remover" : "Adicionar"} ${band.name} aos favoritos`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${favorites.has(band.name) ? "fill-current" : ""}`} />
                    {favorites.has(band.name) ? "Favorito" : "Favoritar"}
                  </button>
                </div>

                {/* Conteúdo */}
                <h3 className={`mt-4 text-xl font-extrabold uppercase tracking-tight ${isCenter ? "text-black" : "text-yellow-400"}`}>
                  {band.name}
                </h3>
                {favorites.has(band.name) && (
                  <Star className={`mt-1 h-5 w-5 ${isCenter ? "text-black" : "text-red-500"} ${isCenter ? "" : "fill-current"}`} aria-hidden="true" />)
                }
                
                {/* Bio com tipografia melhorada - bloco unificado abaixo */}
                {isCenter ? (
                  <div className="relative mt-3 text-sm leading-relaxed" style={{ lineHeight: 1.6 }}>
                    <div
                      id={bioId}
                      ref={(el) => setBioRef(band.name, el)}
                      className={`text-sm ${isCenter ? "text-black/85" : "text-white/85"}`}
                      style={{
                        overflow: "hidden",
                        maxHeight: shouldShowExpandButton && !isExpanded ? "9.6em" : "none", // ~6 linhas
                      }}
                      dangerouslySetInnerHTML={{ __html: band.bio }}
                    />
                    {shouldShowExpandButton && !isExpanded && (
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-red-600 to-transparent" />
                    )}
                  </div>
                ) : (
                  <p className={`mt-3 text-sm leading-relaxed ${isCenter ? "text-black/85" : "text-white/85"}`} style={{ lineHeight: 1.6 }}>
                    {shortBioPlain}
                  </p>
                )}

                {/* Botão Ver mais/menos para mobile */}
                {shouldShowExpandButton && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(band.name);
                    }}
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase transition-colors ${
                      isCenter ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
                    }`}
                    aria-expanded={isExpanded}
                    aria-controls={bioId}
                    aria-label={`${isExpanded ? "Menos" : "Mais"} informações sobre ${band.name}`}
                  >
                    {isExpanded ? (
                      <>
                        Ver menos <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        Ver mais <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}

                {/* Social */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {band.links.instagram && (
                    <a
                      href={band.links.instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase transition-colors ${
                        isCenter ? "border-black text-black hover:bg-black hover:text-red-500" : "border-red-600 text-red-600 hover:bg-red-600 hover:text-black"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Abrir Instagram de ${band.name}${band.links.instagram2 ? ' - Perfil Egypcio' : ''}`}
                    >
                      <Instagram className="h-4 w-4" /> {band.links.instagram2 ? "Egypcio" : "Instagram"}
                    </a>
                  )}
                  {band.links.instagram2 && (
                    <a
                      href={band.links.instagram2}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase transition-colors ${
                        isCenter ? "border-black text-black hover:bg-black hover:text-red-500" : "border-red-600 text-red-600 hover:bg-red-600 hover:text-black"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Abrir Instagram de ${band.name} - Perfil 7 Jack's`}
                    >
                      <Instagram className="h-4 w-4" /> 7 Jack's
                    </a>
                  )}
                </div>

                {/* Dica de acessibilidade/instrução (visível, porém discreta) */}
                {/* Dica: exibida apenas quando o card NÃO está em destaque para não sobrepor os CTAs */}
                {!isCenter && (
                  <p
                    className={`pointer-events-none absolute bottom-4 left-6 right-6 hidden text-center text-xs ${isCenter ? "text-black/60" : "text-white/50"} sm:block`}
                    aria-hidden="true"
                  >
                    Dica: use as setas do teclado para navegar
                  </p>
                )}
              </div>
            );
          })}

          {/* Controles */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <button
              onClick={() => handleMove(-1)}
              className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black/60 text-white transition-colors hover:border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Anterior"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => handleMove(1)}
              className="flex h-12 w-12 items-center justify-center border-2 border-white/20 bg-black/60 text-white transition-colors hover:border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Próximo"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}