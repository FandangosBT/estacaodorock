import React from 'react';
import Loader from '../components/ui/loader';

/**
 * Página de exemplo demonstrando o uso do componente Loader
 * 
 * Para integrar em seu projeto:
 * 1. Importe o componente: import Loader from '../components/ui/loader';
 * 2. Use como tela de carregamento inicial ou durante transições
 * 3. Combine com lógica de roteamento para redirecionamento automático
 */
export default function LoaderExample() {
  return (
    <div className="min-h-screen">
      <Loader />
    </div>
  );
}