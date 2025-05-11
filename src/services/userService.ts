
import { supabase, UserRole, RolePermission, UserWithRole, AppRole } from "@/lib/supabase";

export const userService = {
  // Récupérer les utilisateurs avec leurs rôles
  async getUsersWithRoles(): Promise<UserWithRole[]> {
    try {
      // Récupérer le token de l'utilisateur actuel
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Non autorisé: vous devez être connecté");
      }
      
      // Appeler la fonction Edge avec le token d'authentification
      const response = await supabase.functions.invoke('manage-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: 'LIST_USERS',
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Erreur lors de la récupération des utilisateurs");
      }
      
      return response.data as UserWithRole[];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  },

  // Récupérer un utilisateur spécifique avec son rôle
  async getUserWithRole(userId: string): Promise<UserWithRole | null> {
    try {
      // Récupérer tous les utilisateurs et filtrer
      const users = await this.getUsersWithRoles();
      return users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
      return null;
    }
  },

  // Créer un nouvel utilisateur
  async createUser(email: string, password: string, name: string, role: AppRole): Promise<UserWithRole | null> {
    try {
      // Récupérer le token de l'utilisateur actuel
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Non autorisé: vous devez être connecté");
      }
      
      // Appeler la fonction Edge avec le token d'authentification
      const response = await supabase.functions.invoke('manage-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: 'CREATE_USER',
          data: {
            email,
            password,
            name,
            role
          }
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Erreur lors de la création de l'utilisateur");
      }
      
      return response.data as UserWithRole;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return null;
    }
  },

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<boolean> {
    try {
      // Récupérer le token de l'utilisateur actuel
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Non autorisé: vous devez être connecté");
      }
      
      // Appeler la fonction Edge avec le token d'authentification
      const response = await supabase.functions.invoke('manage-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: 'DELETE_USER',
          data: {
            userId
          }
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Erreur lors de la suppression de l'utilisateur");
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
      return false;
    }
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
