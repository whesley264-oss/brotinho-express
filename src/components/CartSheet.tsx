import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

export const CartSheet = ({ open, onClose }: CartSheetProps) => {
  const { items, removeItem, totalPrice, clearCart } = useCart();
  const { language, t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    payment: 'cash',
    pickupTime: '',
    notes: ''
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio!');
      return;
    }
    setShowCheckout(true);
  };

  const handleSendWhatsApp = () => {
    if (!formData.name || !formData.phone) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    let message = `🍕 *NOVO PEDIDO - RETIRADA NO LOCAL* 🍕\n\n`;
    message += `*Cliente:* ${formData.name}\n`;
    message += `*Telefone:* ${formData.phone}\n`;
    message += `*Pagamento:* ${formData.payment === 'cash' ? 'Dinheiro' : formData.payment === 'card' ? 'Cartão' : 'PIX'}\n`;
    if (formData.pickupTime) {
      message += `*Horário de Retirada:* ${formData.pickupTime}\n`;
    }
    message += `\n`;
    message += `*ITENS DO PEDIDO:*\n`;
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. ${item.product.name[language]} (${item.quantity}x)\n`;
      message += `   R$ ${item.product.price.toFixed(2)}\n`;
      
      if (item.addons && item.addons.length > 0) {
        message += `   *Adicionais:*\n`;
        item.addons.forEach(addon => {
          message += `   - ${addon.name[language]} (+R$ ${addon.price.toFixed(2)})\n`;
        });
      }
    });

    message += `\n*TOTAL: R$ ${totalPrice.toFixed(2)}*\n`;

    if (formData.notes) {
      message += `\n*Observações:* ${formData.notes}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5573991120178?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    setShowCheckout(false);
    onClose();
    toast.success('Pedido enviado com sucesso!');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-xl sm:text-2xl">{t.cart.title}</SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            {items.length === 0 ? t.cart.empty : `${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
          </SheetDescription>
        </SheetHeader>

        {!showCheckout ? (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm sm:text-base">
                {t.cart.empty}
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={`${item.product.id}-${JSON.stringify(item.addons)}`} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg animate-fade-in">
                    <img
                      src={item.product.image}
                      alt={item.product.name[language]}
                      loading="lazy"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm sm:text-base truncate">{item.product.name[language]}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {item.quantity}x R$ {item.product.price.toFixed(2)}
                      </p>
                      {item.addons && item.addons.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="font-semibold">{t.cart.addons}:</span>
                          {item.addons.map(addon => (
                            <div key={addon.id}>• {addon.name[language]}</div>
                          ))}
                        </div>
                      )}
                      <p className="text-primary font-bold mt-1 sm:mt-2 text-sm sm:text-base">R$ {item.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}

                <div className="border-t border-border pt-3 sm:pt-4 space-y-2 flex-shrink-0">
                  <div className="flex justify-between text-base sm:text-lg">
                    <span>{t.cart.subtotal}:</span>
                    <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-primary">
                    <span>{t.cart.total}:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-primary hover:opacity-90 text-base sm:text-lg py-5 sm:py-6 transition-all hover:scale-105"
                >
                  {t.cart.finish}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">{t.checkout.name} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="João Silva"
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base">{t.checkout.phone} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="payment" className="text-sm sm:text-base">{t.checkout.payment}</Label>
                <Select value={formData.payment} onValueChange={(value) => setFormData({ ...formData, payment: value })}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t.checkout.paymentCash}</SelectItem>
                    <SelectItem value="card">{t.checkout.paymentCard}</SelectItem>
                    <SelectItem value="pix">{t.checkout.paymentPix}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pickupTime" className="text-sm sm:text-base">{t.checkout.pickupTime}</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm sm:text-base">{t.checkout.notes}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Tirar cebola, sem azeitonas..."
                  className="text-sm sm:text-base min-h-[80px]"
                />
              </div>
            </div>

            <div className="border-t border-border pt-3 sm:pt-4 flex-shrink-0">
              <div className="flex justify-between text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4">
                <span>{t.cart.total}:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-base sm:text-lg py-5 sm:py-6 transition-all hover:scale-105"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {t.checkout.send}
                </Button>
                <Button
                  onClick={() => setShowCheckout(false)}
                  variant="outline"
                  className="w-full text-sm sm:text-base py-4 sm:py-5"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
