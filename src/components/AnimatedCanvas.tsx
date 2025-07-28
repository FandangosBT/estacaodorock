import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'smoke' | 'light' | 'spark';
}

export const AnimatedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create initial particles
    const createParticle = (type: 'smoke' | 'light' | 'spark'): Particle => {
      const canvas = canvasRef.current!;
      let particle: Particle;

      switch (type) {
        case 'smoke':
          particle = {
            x: Math.random() * canvas.width,
            y: canvas.height + 50,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 2 - 1,
            life: 0,
            maxLife: Math.random() * 200 + 100,
            size: Math.random() * 30 + 10,
            color: `rgba(138, 43, 226, ${Math.random() * 0.3 + 0.1})`, // Purple smoke
            type: 'smoke'
          };
          break;
        case 'light':
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            life: 0,
            maxLife: Math.random() * 150 + 50,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 270}, 100%, 70%)`, // Purple to pink lights
            type: 'light'
          };
          break;
        case 'spark':
          particle = {
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 200,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 1,
            life: 0,
            maxLife: Math.random() * 80 + 40,
            size: Math.random() * 2 + 0.5,
            color: `hsl(${Math.random() * 40 + 40}, 100%, 60%)`, // Orange/red sparks
            type: 'spark'
          };
          break;
      }

      return particle;
    };

    // Initialize particles
    for (let i = 0; i < 30; i++) {
      particles.current.push(createParticle('smoke'));
    }
    for (let i = 0; i < 50; i++) {
      particles.current.push(createParticle('light'));
    }
    for (let i = 0; i < 20; i++) {
      particles.current.push(createParticle('spark'));
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current = particles.current.filter(particle => {
        particle.life++;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add some turbulence
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;

        // Mouse interaction
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }

        const alpha = 1 - (particle.life / particle.maxLife);

        if (particle.type === 'smoke') {
          // Smoke effect
          ctx.save();
          ctx.globalAlpha = alpha * 0.6;
          ctx.filter = 'blur(2px)';
          
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (particle.type === 'light') {
          // Light orbs effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 20;
          ctx.shadowColor = particle.color;
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (particle.type === 'spark') {
          // Spark effect
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Spark trail
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
          ctx.stroke();
          ctx.restore();
        }

        return particle.life < particle.maxLife && 
               particle.x > -50 && particle.x < canvas.width + 50 &&
               particle.y > -50 && particle.y < canvas.height + 50;
      });

      // Add new particles periodically
      if (Math.random() < 0.3) {
        particles.current.push(createParticle('smoke'));
      }
      if (Math.random() < 0.4) {
        particles.current.push(createParticle('light'));
      }
      if (Math.random() < 0.2) {
        particles.current.push(createParticle('spark'));
      }

      // Crowd silhouette effect (static for performance)
      if (particles.current.length < 200) {
        drawCrowdSilhouette(ctx, canvas);
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const drawCrowdSilhouette = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      
      // Simple crowd silhouette at bottom
      for (let i = 0; i < canvas.width; i += 20) {
        const height = Math.sin(i * 0.01) * 30 + 60 + Math.random() * 40;
        ctx.beginPath();
        ctx.rect(i, canvas.height - height, 20, height);
        ctx.fill();
      }
      ctx.restore();
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};