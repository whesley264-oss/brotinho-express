import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Product, Category, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  open: boolean;
  onClose: () => void;
}

export const ProductForm = ({ product, categories, open, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    name_es: '',
    description_pt: '',
    description_en: '',
    description_es: '',
    price: 0,
    original_price: null as number | null,
    image_url: '',
    category_id: '',
    has_addons: false,
    items: [] as string[],
    is_active: true,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name_pt: product.name_pt,
        name_en: product.name_en,
        name_es: product.name_es,
        description_pt: product.description_pt || '',
        description_en: product.description_en || '',
        description_es: product.description_es || '',
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url || '',
        category_id: product.category_id || '',
        has_addons: product.has_addons,
        items: product.items || [],
        is_active: product.is_active,
        display_order: product.display_order,
      });
    } else {
      setFormData({
        name_pt: '',
        name_en: '',
        name_es: '',
        description_pt: '',
        description_en: '',
        description_es: '',
        price: 0,
        original_price: null,
        image_url: '',
        category_id: categories[0]?.id || '',
        has_addons: false,
        items: [],
        is_active: true,
        display_order: 0,
      });
    }
  }, [product, categories]);

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setIsUploading(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      toast({
        title: 'Erro ao fazer upload da imagem',
        description: uploadError.message,
        variant: 'destructive',
      });
      setIsUploading(false);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    setIsUploading(false);
    return publicUrl.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const productData = {
      ...formData,
      image_url: imageUrl,
      original_price: formData.original_price || null,
    };

    if (product) {
      updateProduct.mutate({ id: product.id, ...productData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_pt">Descrição (PT)</Label>
              <Textarea
                id="description_pt"
                value={formData.description_pt}
                onChange={(e) => setFormData({ ...formData, description_pt: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">Descrição (EN)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_es">Descrição (ES)</Label>
              <Textarea
                id="description_es"
                value={formData.description_es}
                onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="original_price">Preço Original (R$)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price || ''}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="Opcional (para promoções)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded mt-2"
                />
              )}
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
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="has_addons"
                checked={formData.has_addons}
                onCheckedChange={(checked) => setFormData({ ...formData, has_addons: checked })}
              />
              <Label htmlFor="has_addons">Permite adicionais</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {product ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
