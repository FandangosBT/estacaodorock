import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '../test/test-utils';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import PageLoader from '@/components/PageLoader';
import { useDevicePerformance } from '@/utils/performance';

// Mock framer-motion para evitar timings de animação nos testes
vi.mock('framer-motion', () => {
  const React = require('react');
  return {
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: new Proxy({}, {
      get: (_target, prop: string) => {
        const Tag: any = prop;
        return ({ children, ...rest }: any) => React.createElement(Tag, { ...rest }, children);
      }
    })
  };
});

// Mock do hook de performance
vi.mock('@/utils/performance', () => ({
  useDevicePerformance: vi.fn(() => ({ isLowEnd: false, deviceInfo: {} }))
}));

// Mock do vitest para timers
beforeEach(() => {
  // Isola o DOM entre testes (auto-cleanup está desativado no projeto)
  cleanup();
  vi.useFakeTimers();
});

afterEach(() => {
  // Limpa DOM e timers pendentes
  cleanup();
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('PageLoader', () => {
  describe('Renderização básica', () => {
    it('deve renderizar o loader corretamente', () => {
      render(<PageLoader onFinish={vi.fn()} />);
      
      // Verifica elementos essenciais
      expect(screen.getByText(/Aquecendo os motores/i)).toBeInTheDocument();
      const video = document.querySelector('video') as HTMLVideoElement | null;
      expect(video).not.toBeNull();
    });
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(<PageLoader onFinish={vi.fn()} />);
    
    const loader = screen.getByRole('status');
    expect(loader).toHaveAttribute('aria-live', 'polite');
  });

  it('deve ter o logo visível', () => {
    render(<PageLoader onFinish={vi.fn()} />);
    
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.svg');
  });
});