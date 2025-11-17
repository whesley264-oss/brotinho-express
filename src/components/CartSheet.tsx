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
    message += `*Pagamento:* ${formData.payment === 'cash' ? 'Dinheiro' : formData.payment === 'card' ? 'Cartão' : 'PIX'}\n\n`;
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
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    setShowCheckout(false);
    onClose();
    toast.success('Pedido enviado com sucesso!');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{t.cart.title}</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? t.cart.empty : `${items.length} ${items.length === 1 ? 'item' : 'itens'}`}
          </SheetDescription>
        </SheetHeader>

        {!showCheckout ? (
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t.cart.empty}
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={`${item.product.id}-${JSON.stringify(item.addons)}`} className="flex gap-4 p-4 border border-border rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name[language]}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.product.name[language]}</h4>
                      <p className="text-sm text-muted-foreground">
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
                      <p className="text-primary font-bold mt-2">R$ {item.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.product.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>{t.cart.subtotal}:</span>
                    <span className="font-bold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>{t.cart.total}:</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                >
                  {t.cart.finish}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">{t.checkout.name} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="João Silva"
                />
              </div>

              <div>
                <Label htmlFor="phone">{t.checkout.phone} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="payment">{t.checkout.payment}</Label>
                <Select value={formData.payment} onValueChange={(value) => setFormData({ ...formData, payment: value })}>
                  <SelectTrigger>
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
                <Label htmlFor="notes">{t.checkout.notes}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Tirar cebola, sem azeitonas..."
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-xl font-bold text-primary mb-4">
                <span>{t.cart.total}:</span>
                <span>R$ {totalPrice.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-lg py-6"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {t.checkout.send}
                </Button>
                <Button
                  onClick={() => setShowCheckout(false)}
                  variant="outline"
                  className="w-full"
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
