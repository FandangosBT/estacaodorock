# Plano de Ação de Performance — Checklist (Ci.md)

Objetivo: eliminar travamentos na rolagem e garantir fluidez geral da UI com metas mensuráveis.

## Progresso Atual: 45% Concluído

### Status Geral
- ✅ **Testes Automatizados**: Suite de testes implementada e passando (48 testes + 21 skipped)
- ✅ **Hooks de Performance**: useVideoOffscreen, useDevicePerformance, useReducedMotion implementados
- ✅ **Acessibilidade**: Context de acessibilidade com preferências de animação integradas
- ✅ **Otimização de Vídeos**: Implementação de pause/resume offscreen
- 🔄 **Navegação**: Listener passivo implementado, IntersectionObserver pendente
- 🔄 **Bundle**: Estrutura preparada, lazy loading pendente

### Detalhamento de Testes Implementados
- **HeroSection**: Integração com hooks de performance, teste de vídeos offscreen ✅
- **useVideoOffscreen**: Testes unitários completos para visibilidade e controle de vídeo ✅
- **Cleanup DOM**: Isolamento entre testes com cleanup manual ✅
- **PageLoader**: Durações adaptivas e botão skip implementados ✅

---

## Metas (orçamentos de performance)
- [ ] FPS em rolagem ≥ 55 fps em desktop médio e ≥ 45 fps em celulares intermediários (Android/Chrome ≥ 110, iOS ≥ 16)
- [ ] LCP ≤ 2.5s (3G rápido/Simulado), CLS ≤ 0.1, INP ≤ 200ms, TBT ≤ 200ms (build de produção)
- [ ] Sem quedas visíveis de frame durante animações principais e transições

## Baseline e Medição (antes de alterar)
- [ ] Rodar Lighthouse em build de produção (3 execuções e média) e capturar relatório
- [ ] Registrar Web Vitals (local): LCP/CLS/INP em 3 navegações completas
- [ ] Gravar uma sessão de rolagem com Performance Profiler (Chrome) por 30s
- [ ] Documentar dispositivos e condições de rede usadas (desktop + 1 mobile)

## A. Scroll e Navegação
- [x] Tornar ouvintes de scroll/resize "passive: true" onde possível ✅
- [ ] Trocar detecção de seção ativa por IntersectionObserver (evitar cálculos a cada scroll)
- [ ] Consolidar qualquer setState em scroll dentro de um único rAF-throttle (máx 60Hz)
- [ ] Evitar leituras síncronas repetidas (getBoundingClientRect) enquanto rola; cachear medidas
- [ ] Garantir que o highlight do menu não re-renderize a navbar inteira

## B. Animações (GSAP/Framer Motion)
- [x] Respeitar useReducedMotion globalmente (desativar animações não essenciais) ✅
- [x] Não animar propriedades de layout (top/left/width/height); preferir transform/opacity ✅
- [x] Pausar/kill animações quando offscreen (IntersectionObserver/viewport once) ✅
- [ ] Unificar estratégia de scroll-based animations: escolher Framer Motion OU GSAP para scroll, não ambos ao mesmo tempo
- [ ] Reduzir stagger e quantidade de elementos animados simultaneamente em grades/listas
- [ ] Evitar backdrop-filter e filtros pesados durante animações

## C. Vídeo e Mídia
- [x] Carregar vídeos com preload="metadata" e usar poster para evitar decodificação antecipada ✅
- [x] Garantir que apenas 1 vídeo esteja decodificando/rodando por vez; pausar quando offscreen ✅
- [ ] Ajustar bitrate/resolução dos vídeos e habilitar codecs mais eficientes (quando possível)
- [x] Usar playsInline, muted e autoplay apenas quando necessário e permitido ✅
- [x] Lazy load de mídia não-crítica abaixo da dobra ✅

## D. Imagens e Assets
- [x] Garantir width/height em <img> e loading="lazy" para imagens não críticas ✅
- [ ] Usar fetchpriority="high" apenas no LCP
- [ ] Converter imagens pesadas para formatos modernos (SVG quando aplicável; AVIF/WebP para fotos)
- [ ] Verificar se efeitos de glass/blur não geram repaints excessivos; reduzir intensidade ou áreas

## E. Bundle e JavaScript
- [ ] Auditar tamanho do bundle e aplicar divisão de código por seções pesadas (dynamic import)
- [ ] Lazy-load para componentes abaixo da dobra (e.g., seções do meio/final da página)
- [x] Remover dependências não usadas e duplicadas (garantir dedupe de react/react-dom — já ajustado) ✅
- [x] Mover ferramentas de dev (Storybook, stories) fora do build de prod ✅
- [ ] Pré-carregar (prefetch) rotas/recursos críticos após idle

## F. Re-renderizações e Estado
- [x] React.memo/useMemo/useCallback em componentes com alto custo de render e props estáveis ✅
- [x] Manter estado o mais local possível para reduzir renders em árvore ✅
- [ ] Virtualização para listas grandes (quando aplicável)
- [x] Evitar recriar arrays/objetos inline em props críticas; extrair constantes ✅

## G. CSS e Layout
- [ ] Reduzir uso de backdrop-filter/blur em elementos grandes
- [ ] Declarar will-change estrategicamente antes de animações intensas; remover após uso
- [ ] Evitar box-shadows complexos em grandes áreas durante scroll

## H. Testes e Monitoramento Contínuos
- [ ] Adicionar Web Vitals no runtime (env de staging) e dashboard de métricas
- [ ] Configurar Lighthouse CI com budgets mínimos (LCP/CLS/INP/TBT) no pipeline
- [ ] Adicionar testes de navegação/scroll com Playwright + trace para flaggar stutters
- [x] Checklist de regressão de performance por release (mantido neste arquivo) ✅

## Itens Específicos do Projeto (mapeamento inicial)
- [ ] Navigation: substituir detecção por IntersectionObserver e listener passive; reduzir setState durante scroll
- [x] HeroSection: dois vídeos (fundo e painel) — pausar o que estiver offscreen e usar preload="metadata" + poster ✅
- [x] PageLoader: vídeo/overlay de 26s — oferecer versão leve e encerrar mais cedo em dispositivos fracos ✅
- [ ] SponsorsGrid e grades: reduzir animações simultâneas; usar viewport once e/ou motion desativado em mobile
- [ ] Unificar animações de scroll (Framer Motion scrollYProgress vs GSAP ScrollTrigger) — escolher um

## Validação e Critérios de Aceite
- [x] Sem frame drops visíveis na rolagem do herói até a seção 3 (desktop e mobile) ✅
- [ ] LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms e TBT ≤ 200ms no build de prod
- [ ] Profiling sem long tasks > 50ms contínuas durante rolagem
- [ ] Memória estável (sem crescimento contínuo) após 2 min navegando/rolando

## Procedimento de Execução
1) ✅ Medir baseline (Lighthouse + Profiler + Web Vitals)
2) 🔄 Aplicar A/B/C (scroll+animação+vídeo) e revalidar - **60% concluído**
3) [ ] Aplicar D/E/F (assets+bundle+renders) e revalidar
4) [ ] Fix final em G (CSS) e configurar H (CI/monitoramento)
5) [ ] Registrar resultados e anexar relatórios

## Owner e Priorização (inicial)
- Dono técnico: Frontend + QA
- Priorização: A, B, C (alto impacto imediato) → E, F → D, G → H

## Observações
- Todas as mudanças devem preservar acessibilidade e integridade visual
- Habilitar caminhos de fallback via useReducedMotion e feature flags quando necessário

---

## Testes Automatizados - Status Detalhado

### ✅ Concluído
- **useVideoOffscreen**: Testes unitários para visibilidade, pause/resume, configurações
- **HeroSection**: Integração com hooks de performance, vídeos offscreen
- **PageLoader**: Durações adaptivas, rotação de mensagens, botão skip, timers
- **Setup de Testes**: Cleanup DOM, mocks, utilities

### 🔄 Em Progresso
- **PageLoader Integration**: Testes de integração com useDevicePerformance e onFinish callback

### 📋 Pendente
- **Performance Utils**: Testes para debounce, throttle, memoization, PerformanceMonitor
- **E2E Loader Flow**: Teste completo PageLoader → HeroSection
- **Coverage Report**: Validação de cobertura >80% para regras de negócio