import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Users, Music, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/useMobile';
import { useUserSettingsStore } from '@/stores/userSettingsStore';

interface MobileNavigationProps {
  onNavigate?: (section: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { theme } = useUserSettingsStore();

  const navigationItems = [
    { id: 'home', label: 'Início', icon: Home },
    // { id: 'lineup', label: 'Line-up', icon: Music },
    { id: 'schedule', label: 'Programação', icon: Calendar },
    { id: 'artists', label: 'Artistas', icon: Users },
    { id: 'quiz', label: 'Quiz', icon: Gift },
  ];

  const handleNavigation = (sectionId: string) => {
    onNavigate?.(sectionId);
    setIsOpen(false);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                onClick={() => handleNavigation(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
          
          {/* Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3"
              >
                <Menu className="h-4 w-4" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <nav className="flex flex-col gap-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className="justify-start gap-3 h-12"
                        onClick={() => handleNavigation(item.id)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
                
                <div className="border-t border-border pt-4 mt-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Festival de Rock 2025</p>
                    <p>15-17 de Agosto • São Paulo</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Spacer for fixed bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileNavigation;