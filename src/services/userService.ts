
import { supabase, UserRole, RolePermission, UserWithRole, AppRole } from "@/lib/supabase";

export const userService = {
  // Récupérer les utilisateurs avec leurs rôles
  async getUsersWithRoles(): Promise<UserWithRole[]> {
    // Récupérer d'abord tous les utilisateurs de Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Erreur lors de la récupération des utilisateurs:', authError);
      return [];
    }

    if (!authUsers || authUsers.users.length === 0) {
      return [];
    }

    // Récupérer ensuite tous les rôles des utilisateurs
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.error('Erreur lors de la récupération des rôles:', rolesError);
      return [];
    }

    // Fusionner les données pour obtenir les utilisateurs avec leurs rôles
    const usersWithRoles: UserWithRole[] = authUsers.users.map(user => {
      const userRole = userRoles?.find(role => role.user_id === user.id);
      
      // Ensure status is strictly typed as "active" | "pending"
      const userStatus: "active" | "pending" = user.email_confirmed_at ? "active" : "pending";
      
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilisateur',
        email: user.email || '',
        role: userRole?.role || 'lecture_seule',
        status: userStatus
      };
    });

    return usersWithRoles;
  },

  // Récupérer un utilisateur spécifique avec son rôle
  async getUserWithRole(userId: string): Promise<UserWithRole | null> {
    // Récupérer l'utilisateur
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, userError);
      return null;
    }

    // Récupérer le rôle de l'utilisateur
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (roleError && roleError.code !== 'PGRST116') { // Ignorer l'erreur si aucun rôle n'est trouvé
      console.error(`Erreur lors de la récupération du rôle de l'utilisateur ${userId}:`, roleError);
    }

    // Ensure status is strictly typed as "active" | "pending"
    const userStatus: "active" | "pending" = user.user.email_confirmed_at ? "active" : "pending";

    const userData: UserWithRole = {
      id: user.user.id,
      name: user.user.user_metadata?.name || user.user.email?.split('@')[0] || 'Utilisateur',
      email: user.user.email || '',
      role: userRole?.role || 'lecture_seule',
      status: userStatus
    };

    return userData;
  },

  // Créer un nouvel utilisateur
  async createUser(email: string, password: string, name: string, role: AppRole): Promise<UserWithRole | null> {
    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmer automatiquement l'email pour simplifier
      user_metadata: { name }
    });

    if (authError || !authData.user) {
      console.error('Erreur lors de la création de l\'utilisateur:', authError);
      return null;
    }

    // Assigner le rôle à l'utilisateur
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role
      });

    if (roleError) {
      console.error('Erreur lors de l\'attribution du rôle:', roleError);
      // On pourrait supprimer l'utilisateur ici en cas d'échec, mais on va le garder pour simplifier
    }

    // Retourner les données de l'utilisateur créé
    const newUser: UserWithRole = {
      id: authData.user.id,
      name,
      email,
      role,
      status: "active" // Nous avons défini email_confirm à true, donc l'utilisateur est actif
    };

    return newUser;
  },

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<boolean> {
    // Supprimer l'utilisateur dans Supabase Auth
    // Note: La suppression en cascade supprimera également les entrées dans user_roles
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
      return false;
    }

    return true;
  },

  // Récupérer toutes les permissions par rôle
  async getRolePermissions(): Promise<Record<AppRole, string[]>> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('can_access', true);
    
    if (error) {
      console.error('Erreur lors de la récupération des permissions:', error);
      return {
        admin: [],
        collaborateur: [],
        lecture_seule: []
      };
    }

    // Organiser les permissions par rôle
    const permissions: Record<AppRole, string[]> = {
      admin: [],
      collaborateur: [],
      lecture_seule: []
    };

    data?.forEach(permission => {
      if (permission.can_access && permissions[permission.role]) {
        permissions[permission.role].push(permission.module_id);
      }
    });

    return permissions;
  },

  // Mettre à jour les permissions d'un rôle
  async updateRolePermission(role: AppRole, moduleId: string, canAccess: boolean): Promise<boolean> {
    // Vérifier si la permission existe déjà
    const { data: existingPermission, error: fetchError } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role', role)
      .eq('module_id', moduleId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignorer l'erreur si aucune permission n'est trouvée
      console.error('Erreur lors de la vérification des permissions existantes:', fetchError);
      return false;
    }

    // Si la permission existe, la mettre à jour, sinon la créer
    if (existingPermission) {
      const { error: updateError } = await supabase
        .from('role_permissions')
        .update({ can_access: canAccess })
        .eq('id', existingPermission.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour de la permission:', updateError);
        return false;
      }
    } else {
      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert({
          role,
          module_id: moduleId,
          can_access: canAccess
        });

      if (insertError) {
        console.error('Erreur lors de la création de la permission:', insertError);
        return false;
      }
    }

    return true;
  }
};
