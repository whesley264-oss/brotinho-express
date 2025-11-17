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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pizza className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button
              onClick={onCartClick}
              className="relative bg-gradient-primary hover:opacity-90 transition-all"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-secondary text-secondary-foreground">
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
