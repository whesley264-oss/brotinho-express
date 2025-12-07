import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Addon, useCreateAddon, useUpdateAddon } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface AddonFormProps {
  addon?: Addon | null;
  open: boolean;
  onClose: () => void;
}

export const AddonForm = ({ addon, open, onClose }: AddonFormProps) => {
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    price: 0,
    is_active: true,
  });

  const createAddon = useCreateAddon();
  const updateAddon = useUpdateAddon();

  useEffect(() => {
    if (addon) {
      setFormData({
        name_pt: addon.name_pt,
        name_en: addon.name_en,
        name_es: addon.name_es,
        price: addon.price,
        is_active: addon.is_active,
      });
    } else {
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: '',
        price: 0,
        is_active: true,
      });
    }
  }, [addon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addon) {
      updateAddon.mutate({ id: addon.id, ...formData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createAddon.mutate(formData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isLoading = createAddon.isPending || updateAddon.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {addon ? 'Editar Adicional' : 'Novo Adicional'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name_pt">Nome (PT)</Label>
            <Input
              id="name_pt"
              value={formData.name_pt}
              onChange={(e) => setFormData({ ...formData, name_pt: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_en">Nome (EN)</Label>
            <Input
              id="name_en"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_es">Nome (ES)</Label>
            <Input
              id="name_es"
              value={formData.name_es}
              onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Ativo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {addon ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
