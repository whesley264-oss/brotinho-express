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
      <DialogContent className="max-w-lg bg-card flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl">{t.addons.title}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">{t.addons.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg">
            <img
              src={product.image}
              alt={product.name[language]}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
            />
            <div>
              <h4 className="font-bold text-sm sm:text-base">{product.name[language]}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {addons.map(addon => (
              <div
                key={addon.id}
                className="flex items-center justify-between p-2 sm:p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => toggleAddon(addon)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Checkbox
                    checked={selectedAddons.some(a => a.id === addon.id)}
                    onCheckedChange={() => toggleAddon(addon)}
                  />
                  <span className="font-medium text-sm sm:text-base">{addon.name[language]}</span>
                </div>
                <span className="text-primary font-bold text-sm sm:text-base">+ R$ {addon.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {selectedAddons.length > 0 && (
            <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                {selectedAddons.length} {t.addons.selected}
              </p>
              <p className="text-lg sm:text-xl font-bold text-primary">
                Total: R$ {totalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full bg-gradient-primary hover:opacity-90 text-base sm:text-lg py-5 sm:py-6 flex-shrink-0 mt-2"
        >
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t.addons.confirm}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
