import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStateProvider } from "@/hooks/use-global-state";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SkipLinks } from "@/components/SkipLinks";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import PreHome from "./pages/PreHome";
import LoaderPage from "./pages/LoaderPage";
import LoaderExample from "./pages/LoaderExample";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalStateProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipLinks />
            <PWAInstallPrompt />
            <PWAUpdatePrompt />
            <Routes>
              <Route path="/" element={<PreHome />} />
              <Route path="/loader" element={<LoaderPage />} />
              <Route path="/loader-example" element={<LoaderExample />} />
              <Route path="/festival" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </GlobalStateProvider>
  </QueryClientProvider>
);

export default App;
