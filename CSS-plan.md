# 🧩 Plano de Estilização CSS - Festival de Rock 2025

Com base no PRD do Festival de Rock 2025 e análise dos logs de referência, desenvolvi um plano completo de estilização focando na experiência imersiva e disruptiva exigida pelo projeto.

## 1. Estrutura geral da página

**Layout principal:** Utilizarei CSS Grid para o container principal e Flexbox para componentes específicos, garantindo responsividade total. O sistema seguirá uma estrutura de camadas com sobreposições para efeitos visuais dinâmicos.

```css
.festival-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}
```

## 2. Estilo base (Reset e padrões globais)

**Reset customizado** inspirado nas práticas observadas nos logs, com foco em transições suaves universais:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

:root {
  --cor-primaria: #ff0066;
  --cor-secundaria: #6600ff;
  --cor-neon: #00ffff;
  --cor-destaque: #ffff00;
  --cor-fundo: #0a0a0a;
  --cor-fundo-card: rgba(26, 26, 26, 0.9);
  --fonte-titulo: 'Rock Salt', cursive;
  --fonte-corpo: 'Roboto', sans-serif;
  --sombra-neon: 0 0 20px currentColor;
}

body {
  font-family: var(--fonte-corpo);
  background: var(--cor-fundo);
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden;
}
```

## 3. Componentes principais

### **Hero Section - Página Pré-Home**
**Função:** Criar impacto visual imediato com ambiente de "entrada do festival"

**Sugestão de estilo:**
```css
.pre-home-hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #0a0a0a, #1a0033, #000066);
  position: relative;
  overflow: hidden;
}

.festival-gate {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('festival-gate.svg') center/cover;
  animation: gateGlow 2s ease-in-out infinite alternate;
}

.enter-button {
  background: linear-gradient(45deg, var(--cor-primaria), var(--cor-secundaria));
  border: 3px solid var(--cor-neon);
  color: white;
  padding: 20px 40px;
  font-size: 1.5rem;
  font-family: var(--fonte-titulo);
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: var(--sombra-neon);
  animation: neonPulse 1.5s ease-in-out infinite;
}

.enter-button:hover {
  transform: scale(1.05) rotate(1deg);
  animation: shake 0.5s ease-in-out;
}

@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 20px var(--cor-neon); }
  50% { box-shadow: 0 0 40px var(--cor-neon), 0 0 60px var(--cor-primaria); }
}
```

### **Page Loader**
**Função:** Manter engajamento durante carregamento com visual de mesa de som

**Sugestão de estilo:**
```css
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #1a1a1a, #000);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.mixing-desk {
  width: 300px;
  height: 150px;
  background: linear-gradient(145deg, #333, #111);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  border: 2px solid var(--cor-neon);
}

.slider {
  width: 8px;
  height: 80px;
  background: var(--cor-primaria);
  border-radius: 4px;
  position: absolute;
  animation: sliderMove 2s ease-in-out infinite alternate;
}

.progress-guitar {
  width: 80%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 30px;
  position: relative;
}

.string-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--cor-primaria), var(--cor-neon));
  border-radius: 2px;
  animation: stringVibrate 0.3s ease-in-out infinite;
  transition: width 0.3s ease;
}
```

### **Line-up Cards Interativos**
**Função:** Apresentar bandas com efeitos 3D e animações de favoritar

**Sugestão de estilo baseada nos padrões observados:**
```css
.lineup-container {
  display: flex;
  gap: 30px;
  padding: 50px 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.band-card {
  min-width: 300px;
  height: 400px;
  background: var(--cor-fundo-card);
  border-radius: 20px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  scroll-snap-align: center;
  border: 2px solid transparent;
  overflow: hidden;
}

.band-card:hover {
  transform: rotateY(15deg) rotateX(5deg) scale(1.05);
  border-color: var(--cor-neon);
  box-shadow: 0 20px 40px rgba(255, 0, 102, 0.3);
}

.favorite-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn.favorited {
  color: var(--cor-destaque);
  animation: starBurst 0.6s ease-out;
}

@keyframes starBurst {
  0% { transform: scale(1); }
  50% { transform: scale(1.3) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}
```

### **Quiz Interativo**
**Função:** Interface gamificada estilo BuzzFeed com feedback visual intenso

**Sugestão de estilo:**
```css
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.question-card {
  background: var(--cor-fundo-card);
  border-radius: 25px;
  padding: 40px;
  margin-bottom: 30px;
  border: 3px solid var(--cor-secundaria);
  position: relative;
  overflow: hidden;
}

.quiz-option {
  display: block;
  width: 100%;
  padding: 20px;
  margin: 15px 0;
  background: linear-gradient(135deg, #222, #333);
  border: 2px solid #555;
  border-radius: 15px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.quiz-option:hover {
  transform: translateX(10px);
  border-color: var(--cor-neon);
  background: linear-gradient(135deg, var(--cor-primaria), var(--cor-secundaria));
  animation: glow 0.3s ease;
}

.quiz-option.selected {
  animation: shake 0.5s ease, glow 1s ease;
  border-color: var(--cor-destaque);
  box-shadow: 0 0 30px var(--cor-destaque);
}
```

### **Galeria Social Dinâmica**
**Função:** Grid responsivo estilo Polaroid com interações de curtir

**Sugestão de estilo:**
```css
.social-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 40px;
}

.polaroid-item {
  background: white;
  padding: 15px 15px 40px;
  border-radius: 5px;
  transform: rotate(var(--rotation));
  transition: transform 0.3s ease;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  position: relative;
}

.polaroid-item:nth-child(odd) { --rotation: -2deg; }
.polaroid-item:nth-child(even) { --rotation: 2deg; }

.polaroid-item:hover {
  transform: rotate(0deg) scale(1.05);
  z-index: 10;
}

.rockstar-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--cor-destaque);
  color: black;
  padding: 5px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  animation: float 2s ease-in-out infinite;
}
```

## 4. Animações e interações

Com base nos padrões observados nos logs (especialmente `bounceIn`, `movingTitle`, `pulse`), implementarei:

```css
/* Animações principais inspiradas nos logs */
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

@keyframes movingTitle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px) rotate(-1deg); }
  75% { transform: translateX(10px) rotate(1deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 10px currentColor; }
  50% { box-shadow: 0 0 30px currentColor, 0 0 50px currentColor; }
}

/* Efeitos especiais baseados no PRD */
@keyframes efeitos1 {
  0%, 100% { opacity: 1; color: var(--cor-neon); }
  33% { opacity: 0.7; color: var(--cor-primaria); }
  66% { opacity: 0.4; color: var(--cor-secundaria); }
}

@keyframes slideInFromLeft {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```

**Interações específicas:**
- **Hover em botões:** Efeito shake + glow
- **Click em favoritos:** starBurst animation
- **Scroll na programação:** Smooth snapping
- **Upload de fotos:** Loading spinner com efeito neon

## 5. Observações adicionais

### **Boas práticas observadas nos logs:**
- Uso consistente de `transition: all 0.3s ease` para suavidade
- Transformações com `matrix3d()` para performance
- Animações infinitas com `alternate` para efeitos contínuos
- Classes semânticas como `.bounceIn animated`

### **Performance:**
- Lazy loading para galeria social
- `transform` e `opacity` para animações (evitar reflow)
- `will-change` em elementos animados
- Media queries para reduzir animações em dispositivos móveis

### **Responsividade:**
```css
@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .band-card { min-width: 250px; }
  .quiz-container { padding: 20px 10px; }
  
  /* Reduzir animações para melhor performance mobile */
  * { animation-duration: 0.5s !important; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 0.1s !important; }
}
```

### **Bibliotecas recomendadas:**
- **Animate.css** para animações prontas
- **AOS (Animate On Scroll)** para revealing effects
- **Lottie** para animações vetoriais complexas
- **Three.js** para efeitos WebGL no hero

Este plano combina as melhores práticas observadas nos logs de referência com as necessidades específicas do Festival de Rock 2025, garantindo uma experiência visual disruptiva e performática.