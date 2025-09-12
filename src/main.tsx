import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// In DEV, ensure no stale Service Worker controls the dev server
if ('serviceWorker' in navigator && import.meta.env.DEV) {
  navigator.serviceWorker.getRegistrations?.().then((regs) => {
    regs.forEach((r) => r.unregister().catch(() => {}));
  }).catch(() => {});
  // optional: clear caches used by old SW
  (window as any).caches?.keys?.().then((keys: string[]) => keys.forEach((k) => (window as any).caches?.delete?.(k)));
}

// Register Service Worker somente em produção
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // sucesso: não logar para reduzir ruído
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
