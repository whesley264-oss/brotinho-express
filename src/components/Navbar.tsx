import { Link } from 'react-router-dom';
import { ShoppingCart, Pizza, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar = ({ onCartClick }: NavbarProps) => {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border shadow-glow animate-slide-in-bottom">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Pizza className="h-6 w-6 md:h-8 md:w-8 text-primary animate-pulse-glow" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Brotinhos
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('pizzas')}
              className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t.nav.pizzas}
            </button>
            <button
              onClick={() => scrollToSection('drinks')}
              className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t.nav.drinks}
            </button>
            <button
              onClick={() => scrollToSection('combos')}
              className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t.nav.combos}
            </button>
            <button
              onClick={() => scrollToSection('promos')}
              className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {t.nav.promos}
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            <LanguageToggle />
            
            {user ? (
              <div className="flex items-center gap-1">
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                    <Link to="/admin">
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Link>
                </Button>
              </div>
            )}
            
            <Button
              onClick={onCartClick}
              size="sm"
              className="relative bg-gradient-primary hover:opacity-90 transition-all hover:scale-110 shadow-glow"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center p-0 bg-secondary text-secondary-foreground animate-bounce shadow-glow">
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
