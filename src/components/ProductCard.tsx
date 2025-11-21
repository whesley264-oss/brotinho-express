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
    <Card className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-glow transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {product.originalPrice && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{product.name[language]}</h3>
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
            className="bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 shadow-glow"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t.product.add}
          </Button>
        </div>
      </div>
    </Card>
  );
};
