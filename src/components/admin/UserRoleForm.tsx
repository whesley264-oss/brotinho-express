import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserWithRole, useCreateUserRole, useUpdateUserRole } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';

interface UserRoleFormProps {
  user: UserWithRole | null;
  open: boolean;
  onClose: () => void;
}

export const UserRoleForm = ({ user, open, onClose }: UserRoleFormProps) => {
  const [formData, setFormData] = useState({
    role: 'editor' as 'super_admin' | 'admin' | 'editor',
    can_manage_products: true,
    can_manage_categories: false,
    can_manage_users: false,
  });

  const createUserRole = useCreateUserRole();
  const updateUserRole = useUpdateUserRole();

  const existingRole = user?.user_roles?.[0];

  useEffect(() => {
    if (existingRole) {
      setFormData({
        role: existingRole.role,
        can_manage_products: existingRole.can_manage_products,
        can_manage_categories: existingRole.can_manage_categories,
        can_manage_users: existingRole.can_manage_users,
      });
    } else {
      setFormData({
        role: 'editor',
        can_manage_products: true,
        can_manage_categories: false,
        can_manage_users: false,
      });
    }
  }, [existingRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (existingRole) {
      updateUserRole.mutate({ id: existingRole.id, ...formData }, {
        onSuccess: () => onClose(),
      });
    } else {
      createUserRole.mutate({ user_id: user.id, ...formData }, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isLoading = createUserRole.isPending || updateUserRole.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Gerenciar Permissões - {user?.full_name || user?.email}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Tipo de Acesso</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'super_admin' | 'admin' | 'editor') => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin (acesso total)</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role !== 'super_admin' && (
            <div className="space-y-3 pt-2">
              <Label className="text-sm font-medium">Permissões específicas:</Label>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="can_manage_products" className="font-normal">
                  Gerenciar produtos
                </Label>
                <Switch
                  id="can_manage_products"
                  checked={formData.can_manage_products}
                  onCheckedChange={(checked) => setFormData({ ...formData, can_manage_products: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="can_manage_categories" className="font-normal">
                  Gerenciar categorias
                </Label>
                <Switch
                  id="can_manage_categories"
                  checked={formData.can_manage_categories}
                  onCheckedChange={(checked) => setFormData({ ...formData, can_manage_categories: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="can_manage_users" className="font-normal">
                  Gerenciar usuários
                </Label>
                <Switch
                  id="can_manage_users"
                  checked={formData.can_manage_users}
                  onCheckedChange={(checked) => setFormData({ ...formData, can_manage_users: checked })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {existingRole ? 'Atualizar' : 'Conceder Acesso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
