import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { AddonsModal } from '@/components/AddonsModal';
import { CartSheet } from '@/components/CartSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/lib/products';
import { Product, Addon } from '@/types/product';
import { ArrowDown, Instagram, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddons, setShowAddons] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

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

  const handleWhatsApp = () => {
    if (!contactName.trim() || !contactMessage.trim()) {
      toast.error(t.contact.fillFields);
      return;
    }
    const message = encodeURIComponent(`Olá! Meu nome é ${contactName}.\n\n${contactMessage}`);
    window.open(`https://wa.me/5573991120178?text=${message}`, '_blank');
  };

  const handleInstagram = () => {
    window.open('https://www.instagram.com/brotinhos_express__?igsh=MTlxeWJubjl1cHVrbw==', '_blank');
  };

  const pizzas = products.filter(p => p.category === 'pizza');
  const drinks = products.filter(p => p.category === 'drink');
  const combos = products.filter(p => p.category === 'combo');
  const promos = products.filter(p => p.category === 'promo');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setShowCart(true)} />

      {/* Hero Section */}
      <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-hero opacity-90 animate-fade-in" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-muted-foreground max-w-2xl mx-auto px-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t.hero.subtitle}
          </p>
          <Button
            onClick={() => document.getElementById('pizzas')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 transition-all hover:scale-110 animate-pulse-glow shadow-glow"
          >
            {t.hero.cta}
            <ArrowDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
          </Button>
        </div>
      </section>

      {/* Pickup Info Section */}
      <section className="py-6 sm:py-8 md:py-12 px-4 bg-primary/10 border-y-2 border-primary/20 animate-slide-in-bottom shadow-glow">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-primary animate-fade-in-up">
            {t.pickup.title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t.pickup.description}
          </p>
        </div>
      </section>

      {/* Pizzas Section */}
      <section id="pizzas" className="py-10 sm:py-16 md:py-20 px-4 scroll-mt-20">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground animate-fade-in-up">
            {t.sections.pizzas}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {pizzas.map((product, index) => (
              <div 
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section id="drinks" className="py-10 sm:py-16 md:py-20 px-4 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground animate-fade-in-up">
            {t.sections.drinks}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {drinks.map((product, index) => (
              <div 
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" className="py-10 sm:py-16 md:py-20 px-4 scroll-mt-20">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground animate-fade-in-up">
            {t.sections.combos}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {combos.map((product, index) => (
              <div 
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section id="promos" className="py-10 sm:py-16 md:py-20 px-4 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground animate-fade-in-up">
            {t.sections.promos}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {promos.map((product, index) => (
              <div 
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-10 sm:py-16 md:py-20 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-foreground animate-fade-in-up">
            {t.contact.title}
          </h2>
          
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-elegant animate-scale-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.contact.name}
                </label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t.contact.namePlaceholder}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.contact.message}
                </label>
                <Textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-105"
                >
                  <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t.contact.whatsapp}
                </Button>
                
                <Button
                  onClick={handleInstagram}
                  className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white transition-all hover:scale-105"
                >
                  <Instagram className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t.contact.instagram}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-6 sm:py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground text-sm sm:text-base">
          <p>© 2024 Brotinhos Express. Todos os direitos reservados.</p>
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