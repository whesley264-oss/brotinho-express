import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { AddonsModal } from '@/components/AddonsModal';
import { CartSheet } from '@/components/CartSheet';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/lib/products';
import { Product, Addon } from '@/types/product';
import { ArrowDown } from 'lucide-react';

const Index = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddons, setShowAddons] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleAddToCart = (product: Product) => {
    if (product.hasAddons) {
      setSelectedProduct(product);
      setShowAddons(true);
    } else {
      addItem(product);
    }
  };

  const handleConfirmAddons = (product: Product, addons: Addon[]) => {
    addItem(product, addons);
  };

  const pizzas = products.filter(p => p.category === 'pizza');
  const drinks = products.filter(p => p.category === 'drink');
  const combos = products.filter(p => p.category === 'combo');
  const promos = products.filter(p => p.category === 'promo');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setShowCart(true)} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <Button
            onClick={() => document.getElementById('pizzas')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 animate-pulse-glow"
          >
            {t.hero.cta}
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Pizzas Section */}
      <section id="pizzas" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            {t.sections.pizzas}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pizzas.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section id="drinks" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            {t.sections.drinks}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            {t.sections.combos}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {combos.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section id="promos" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            {t.sections.promos}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promos.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 Brotinhos. Todos os direitos reservados.</p>
        </div>
      </footer>

      <AddonsModal
        product={selectedProduct}
        open={showAddons}
        onClose={() => setShowAddons(false)}
        onConfirm={handleConfirmAddons}
      />

      <CartSheet open={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default Index;
