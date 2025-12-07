import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export type Profile = Tables<'profiles'>;
export type UserRole = Tables<'user_roles'>;

export interface UserWithRole extends Profile {
  user_roles: UserRole[] | null;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRole[] = profiles.map(profile => ({
        ...profile,
        user_roles: roles.filter(role => role.user_id === profile.id)
      }));
      
      return usersWithRoles;
    },
  });
};

export const useCreateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userRole: {
      user_id: string;
      role: 'super_admin' | 'admin' | 'editor';
      can_manage_products?: boolean;
      can_manage_categories?: boolean;
      can_manage_users?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert(userRole)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Permissão concedida com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao conceder permissão', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'user_roles'> & { id: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Permissões atualizadas com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao atualizar permissões', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Permissão removida com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao remover permissão', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};
