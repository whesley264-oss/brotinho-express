import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category, useCreateCategory, useUpdateCategory } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  category?: Category | null;
  open: boolean;
  onClose: () => void;
}

export const CategoryForm = ({ category, open, onClose }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    slug: '',
    display_order: 0,
    is_active: true,
  });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setFormData({
        name_pt: category.name_pt,
        name_en: category.name_en,
        name_es: category.name_es,
        slug: category.slug,
        display_order: category.display_order,
        is_active: category.is_active,
      });
    } else {
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: '',
        slug: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (category) {
      updateCategory.mutate({ id: category.id, ...formData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createCategory.mutate(formData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name_pt">Nome (PT)</Label>
            <Input
              id="name_pt"
              value={formData.name_pt}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({ 
                  ...formData, 
                  name_pt: name,
                  slug: !category ? generateSlug(name) : formData.slug
                });
              }}
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
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="ex: pizzas, drinks"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Ordem de exibição</Label>
            <Input
              id="display_order"
              type="number"
              min="0"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Ativa</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {category ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
