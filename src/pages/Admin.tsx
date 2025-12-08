import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts, useCategories, useAddons, useDeleteProduct, useDeleteCategory, useDeleteAddon, Product, Category, Addon } from '@/hooks/useProducts';
import { useUsers, UserWithRole, useDeleteUserRole } from '@/hooks/useUsers';
import { useOrders, useUpdateOrder, Order } from '@/hooks/useOrders';
import { useAnalytics } from '@/hooks/useAnalytics';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProductForm } from '@/components/admin/ProductForm';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { AddonForm } from '@/components/admin/AddonForm';
import { UserRoleForm } from '@/components/admin/UserRoleForm';
import { 
  Pizza, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Users, 
  FolderOpen, 
  Package,
  CirclePlus,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Check,
  Clock,
  X
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Admin = () => {
  const { user, userRole, isLoading: authLoading, signOut, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: addons, isLoading: addonsLoading } = useAddons();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const deleteProduct = useDeleteProduct();
  const deleteCategory = useDeleteCategory();
  const deleteAddon = useDeleteAddon();
  const deleteUserRole = useDeleteUserRole();
  const updateOrder = useUpdateOrder();
  const { toast } = useToast();
  const deleteUserRole = useDeleteUserRole();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{type: string; id: string; name: string} | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && !userRole) {
      // User logged in but has no role - show pending message
    }
  }, [user, userRole, authLoading]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;

    switch (deleteConfirm.type) {
      case 'product':
        deleteProduct.mutate(deleteConfirm.id);
        break;
      case 'category':
        deleteCategory.mutate(deleteConfirm.id);
        break;
      case 'addon':
        deleteAddon.mutate(deleteConfirm.id);
        break;
      case 'userRole':
        deleteUserRole.mutate(deleteConfirm.id);
        break;
    }
    setDeleteConfirm(null);
  };

  const canManageProducts = userRole?.can_manage_products || isSuperAdmin;
  const canManageCategories = userRole?.can_manage_categories || isSuperAdmin;
  const canManageUsers = userRole?.can_manage_users || isSuperAdmin;

  const handleOrderStatusChange = (orderId: string, status: string) => {
    updateOrder.mutate({ id: orderId, status }, {
      onSuccess: () => {
        toast({ title: `Pedido atualizado para: ${status}` });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      confirmed: 'secondary',
      preparing: 'default',
      ready: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
    };
    const labels: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>;
  };
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Pizza className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Acesso Pendente</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Seu cadastro foi realizado com sucesso! Aguarde a aprovação de um administrador para acessar o painel.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Voltar ao site
              </Button>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pizza className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isSuperAdmin ? 'default' : 'secondary'}>
              {userRole?.role === 'super_admin' ? 'Super Admin' : userRole?.role === 'admin' ? 'Admin' : 'Editor'}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-6">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="products" disabled={!canManageProducts}>
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Produtos</span>
            </TabsTrigger>
            <TabsTrigger value="categories" disabled={!canManageCategories}>
              <FolderOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Categorias</span>
            </TabsTrigger>
            <TabsTrigger value="addons" disabled={!canManageProducts}>
              <CirclePlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Adicionais</span>
            </TabsTrigger>
            <TabsTrigger value="users" disabled={!canManageUsers}>
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <DashboardStats 
              analytics={analytics} 
              orders={orders || []} 
              products={products || []}
              isLoading={analyticsLoading || ordersLoading || productsLoading}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold">Pedidos</h2>
            <Card>
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.customer_name}</TableCell>
                          <TableCell>{order.customer_phone}</TableCell>
                          <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleOrderStatusChange(order.id, 'confirmed')} title="Confirmar">
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOrderStatusChange(order.id, 'preparing')} title="Preparando">
                                <Clock className="h-4 w-4 text-yellow-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOrderStatusChange(order.id, 'completed')} title="Concluído">
                                <Package className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleOrderStatusChange(order.id, 'cancelled')} title="Cancelar">
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground p-8">Nenhum pedido encontrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Produtos</h2>
              <Button onClick={() => { setSelectedProduct(null); setShowProductForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                {productsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imagem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img 
                              src={product.image_url || '/placeholder.svg'} 
                              alt={product.name_pt}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name_pt}</TableCell>
                          <TableCell>
                            R$ {product.price.toFixed(2)}
                            {product.original_price && (
                              <span className="text-muted-foreground line-through ml-2">
                                R$ {product.original_price.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {(product as any).categories?.name_pt || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.is_active ? 'default' : 'secondary'}>
                              {product.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => { setSelectedProduct(product); setShowProductForm(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeleteConfirm({ type: 'product', id: product.id, name: product.name_pt })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categorias</h2>
              <Button onClick={() => { setSelectedCategory(null); setShowCategoryForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                {categoriesLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Ordem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories?.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name_pt}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.display_order}</TableCell>
                          <TableCell>
                            <Badge variant={category.is_active ? 'default' : 'secondary'}>
                              {category.is_active ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => { setSelectedCategory(category); setShowCategoryForm(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeleteConfirm({ type: 'category', id: category.id, name: category.name_pt })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addons Tab */}
          <TabsContent value="addons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Adicionais</h2>
              <Button onClick={() => { setSelectedAddon(null); setShowAddonForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Adicional
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                {addonsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {addons?.map((addon) => (
                        <TableRow key={addon.id}>
                          <TableCell className="font-medium">{addon.name_pt}</TableCell>
                          <TableCell>R$ {addon.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={addon.is_active ? 'default' : 'secondary'}>
                              {addon.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => { setSelectedAddon(addon); setShowAddonForm(true); }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeleteConfirm({ type: 'addon', id: addon.id, name: addon.name_pt })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Usuários</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                {usersLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Acesso</TableHead>
                        <TableHead>Permissões</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((userItem) => {
                        const role = userItem.user_roles?.[0];
                        return (
                          <TableRow key={userItem.id}>
                            <TableCell className="font-medium">{userItem.full_name || '-'}</TableCell>
                            <TableCell>{userItem.email}</TableCell>
                            <TableCell>
                              {role ? (
                                <Badge variant={role.role === 'super_admin' ? 'default' : 'secondary'}>
                                  {role.role === 'super_admin' ? 'Super Admin' : role.role === 'admin' ? 'Admin' : 'Editor'}
                                </Badge>
                              ) : (
                                <Badge variant="outline">Sem acesso</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {role && role.role !== 'super_admin' && (
                                <div className="flex gap-1 flex-wrap">
                                  {role.can_manage_products && <Badge variant="outline" className="text-xs">Produtos</Badge>}
                                  {role.can_manage_categories && <Badge variant="outline" className="text-xs">Categorias</Badge>}
                                  {role.can_manage_users && <Badge variant="outline" className="text-xs">Usuários</Badge>}
                                </div>
                              )}
                              {role?.role === 'super_admin' && (
                                <Badge variant="outline" className="text-xs">Acesso Total</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => { setSelectedUser(userItem); setShowUserForm(true); }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {role && userItem.id !== user?.id && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setDeleteConfirm({ type: 'userRole', id: role.id, name: userItem.email })}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Forms */}
      <ProductForm 
        product={selectedProduct}
        categories={categories || []}
        open={showProductForm}
        onClose={() => setShowProductForm(false)}
      />
      <CategoryForm 
        category={selectedCategory}
        open={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
      />
      <AddonForm 
        addon={selectedAddon}
        open={showAddonForm}
        onClose={() => setShowAddonForm(false)}
      />
      <UserRoleForm 
        user={selectedUser}
        open={showUserForm}
        onClose={() => setShowUserForm(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteConfirm?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
