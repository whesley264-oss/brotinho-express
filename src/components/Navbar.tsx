import { ShoppingCart, Pizza } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar = ({ onCartClick }: NavbarProps) => {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-fade-in">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Pizza className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Brotinhos
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('pizzas')}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t.nav.pizzas}
            </button>
            <button
              onClick={() => scrollToSection('drinks')}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t.nav.drinks}
            </button>
            <button
              onClick={() => scrollToSection('combos')}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t.nav.combos}
            </button>
            <button
              onClick={() => scrollToSection('promos')}
              className="text-foreground hover:text-primary transition-colors"
            >
              {t.nav.promos}
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button
              onClick={onCartClick}
              size="sm"
              className="relative bg-gradient-primary hover:opacity-90 transition-all hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center p-0 bg-secondary text-secondary-foreground animate-scale-in">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
