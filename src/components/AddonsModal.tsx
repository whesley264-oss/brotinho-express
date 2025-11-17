import { useState } from 'react';
import { Product, Addon } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { addons } from '@/lib/products';
import { ShoppingCart } from 'lucide-react';

interface AddonsModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (product: Product, selectedAddons: Addon[]) => void;
}

export const AddonsModal = ({ product, open, onClose, onConfirm }: AddonsModalProps) => {
  const { language, t } = useLanguage();
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  if (!product) return null;

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleConfirm = () => {
    onConfirm(product, selectedAddons);
    setSelectedAddons([]);
    onClose();
  };

  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = product.price + addonsTotal;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t.addons.title}</DialogTitle>
          <DialogDescription>{t.addons.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <img
              src={product.image}
              alt={product.name[language]}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h4 className="font-bold">{product.name[language]}</h4>
              <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-3">
            {addons.map(addon => (
              <div
                key={addon.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => toggleAddon(addon)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAddons.some(a => a.id === addon.id)}
                    onCheckedChange={() => toggleAddon(addon)}
                  />
                  <span className="font-medium">{addon.name[language]}</span>
                </div>
                <span className="text-primary font-bold">+ R$ {addon.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {selectedAddons.length > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                {selectedAddons.length} {t.addons.selected}
              </p>
              <p className="text-xl font-bold text-primary">
                Total: R$ {totalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {t.addons.confirm}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
