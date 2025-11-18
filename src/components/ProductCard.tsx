import { Product } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { language, t } = useLanguage();

  return (
    <Card className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {product.originalPrice && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">{product.name[language]}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.description[language]}</p>
        </div>

        {product.items && (
          <div className="text-xs text-muted-foreground space-y-1">
            {product.items.map((item, index) => (
              <div key={index}>• {item}</div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <Button
            onClick={() => onAddToCart(product)}
            className="bg-gradient-primary hover:opacity-90 transition-all"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t.product.add}
          </Button>
        </div>
      </div>
    </Card>
  );
};
