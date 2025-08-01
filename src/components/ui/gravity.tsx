"use client";

import React, { useRef, useEffect, useState } from 'react';

// Simulação básica de física para Matter.js
interface Vector2D {
  x: number;
  y: number;
}

interface MatterBodyOptions {
  friction?: number;
  restitution?: number;
  density?: number;
}

interface MatterBodyProps {
  children: React.ReactNode;
  x: string;
  y: string;
  angle?: number;
  matterBodyOptions?: MatterBodyOptions;
}

interface GravityProps {
  children: React.ReactNode;
  gravity?: Vector2D;
  className?: string;
}

// Simulação de corpo físico
class PhysicsBody {
  position: Vector2D;
  velocity: Vector2D;
  angle: number;
  angularVelocity: number;
  options: MatterBodyOptions;
  element: HTMLElement | null = null;
  bounds: { width: number; height: number } = { width: 0, height: 0 };
  containerBounds: { width: number; height: number } = { width: 0, height: 0 };

  constructor(
    initialX: number,
    initialY: number,
    initialAngle: number = 0,
    options: MatterBodyOptions = {}
  ) {
    this.position = { x: initialX, y: initialY };
    this.velocity = { x: 0, y: 0 };
    this.angle = initialAngle;
    this.angularVelocity = 0;
    this.options = {
      friction: 0.2,
      restitution: 0.8,
      density: 0.001,
      ...options
    };
  }

  update(gravity: Vector2D, deltaTime: number) {
    if (!this.element || !this.containerBounds.width) return;

    // Aplicar gravidade
    this.velocity.x += gravity.x * deltaTime;
    this.velocity.y += gravity.y * deltaTime;

    // Aplicar atrito
    this.velocity.x *= (1 - this.options.friction!);
    this.velocity.y *= (1 - this.options.friction!);

    // Atualizar posição
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Atualizar ângulo
    this.angle += this.angularVelocity * deltaTime;
    this.angularVelocity *= 0.99; // Damping angular

    // Colisões com bordas
    this.handleBoundaryCollisions();

    // Aplicar transformações ao elemento
    this.applyTransform();
  }

  handleBoundaryCollisions() {
    const { width, height } = this.bounds;
    const { width: containerWidth, height: containerHeight } = this.containerBounds;

    // Colisão com bordas horizontais
    if (this.position.x <= 0) {
      this.position.x = 0;
      this.velocity.x = -this.velocity.x * this.options.restitution!;
      this.angularVelocity += Math.random() * 0.1 - 0.05;
    } else if (this.position.x + width >= containerWidth) {
      this.position.x = containerWidth - width;
      this.velocity.x = -this.velocity.x * this.options.restitution!;
      this.angularVelocity += Math.random() * 0.1 - 0.05;
    }

    // Colisão com bordas verticais
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = -this.velocity.y * this.options.restitution!;
      this.angularVelocity += Math.random() * 0.1 - 0.05;
    } else if (this.position.y + height >= containerHeight) {
      this.position.y = containerHeight - height;
      this.velocity.y = -this.velocity.y * this.options.restitution!;
      this.angularVelocity += Math.random() * 0.1 - 0.05;
    }
  }

  applyTransform() {
    if (!this.element) return;

    this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.angle}rad)`;
  }

  setElement(element: HTMLElement) {
    this.element = element;
    const rect = element.getBoundingClientRect();
    this.bounds = { width: rect.width, height: rect.height };
  }

  setContainerBounds(bounds: { width: number; height: number }) {
    this.containerBounds = bounds;
  }
}

// Contexto para gerenciar a física
const GravityContext = React.createContext<{
  gravity: Vector2D;
  registerBody: (body: PhysicsBody) => void;
  unregisterBody: (body: PhysicsBody) => void;
} | null>(null);

// Hook para usar o contexto de gravidade
const useGravity = () => {
  const context = React.useContext(GravityContext);
  if (!context) {
    throw new Error('useGravity must be used within a Gravity component');
  }
  return context;
};

// Componente Gravity
export const Gravity: React.FC<GravityProps> = ({ 
  children, 
  gravity = { x: 0, y: 0.5 }, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Set<PhysicsBody>>(new Set());
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const registerBody = (body: PhysicsBody) => {
    bodiesRef.current.add(body);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      body.setContainerBounds({ width: rect.width, height: rect.height });
    }
  };

  const unregisterBody = (body: PhysicsBody) => {
    bodiesRef.current.delete(body);
  };

  const animate = (currentTime: number) => {
    const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.016); // Cap at 60fps
    lastTimeRef.current = currentTime;

    bodiesRef.current.forEach(body => {
      body.update(gravity, deltaTime * 60); // Normalize to 60fps
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        bodiesRef.current.forEach(body => {
          body.setContainerBounds({ width: rect.width, height: rect.height });
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gravity]);

  return (
    <GravityContext.Provider value={{ gravity, registerBody, unregisterBody }}>
      <div ref={containerRef} className={`relative ${className}`}>
        {children}
      </div>
    </GravityContext.Provider>
  );
};

// Componente MatterBody
export const MatterBody: React.FC<MatterBodyProps> = ({ 
  children, 
  x, 
  y, 
  angle = 0, 
  matterBodyOptions = {} 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<PhysicsBody | null>(null);
  const { registerBody, unregisterBody } = useGravity();

  useEffect(() => {
    if (!elementRef.current) return;

    // Converter porcentagens para pixels
    const container = elementRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const initialX = parseFloat(x.replace('%', '')) * containerRect.width / 100;
    const initialY = parseFloat(y.replace('%', '')) * containerRect.height / 100;

    // Criar corpo físico
    const body = new PhysicsBody(initialX, initialY, angle * Math.PI / 180, matterBodyOptions);
    body.setElement(elementRef.current);
    bodyRef.current = body;

    // Registrar no sistema de física
    registerBody(body);

    return () => {
      if (bodyRef.current) {
        unregisterBody(bodyRef.current);
      }
    };
  }, [x, y, angle, matterBodyOptions, registerBody, unregisterBody]);

  return (
    <div 
      ref={elementRef}
      className="absolute"
      style={{
        left: 0,
        top: 0,
        transformOrigin: 'center center'
      }}
    >
      {children}
    </div>
  );
};

export default { Gravity, MatterBody };