
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";
import { AppRole } from "@/lib/supabase";

// Define modules
const modules = [
  { id: "dashboard", name: "Tableau de bord" },
  { id: "clients", name: "Clients" },
  { id: "projects", name: "Projets" },
  { id: "products", name: "Produits" },
  { id: "calendar", name: "Calendrier" },
  { id: "settings", name: "Paramètres" },
];

// Define roles
const roles = [
  { id: "admin" as AppRole, name: "Administrateur" },
  { id: "collaborateur" as AppRole, name: "Collaborateur" },
  { id: "lecture_seule" as AppRole, name: "Lecture seule" },
];

const RolePermissionsMatrix = () => {
  const [permissions, setPermissions] = useState<Record<AppRole, string[]>>({
    admin: [],
    collaborateur: [],
    lecture_seule: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch permissions from Supabase
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true);
        const rolePermissions = await userService.getRolePermissions();
        setPermissions(rolePermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les permissions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [toast]);

  const handlePermissionChange = async (roleId: AppRole, moduleId: string, checked: boolean) => {
    try {
      // Optimistic update
      const updatedPermissions = { ...permissions };
      
      if (checked) {
        if (!updatedPermissions[roleId].includes(moduleId)) {
          updatedPermissions[roleId] = [...updatedPermissions[roleId], moduleId];
        }
      } else {
        updatedPermissions[roleId] = updatedPermissions[roleId].filter(id => id !== moduleId);
      }
      
      setPermissions(updatedPermissions);
      
      // Update in Supabase
      const success = await userService.updateRolePermission(roleId, moduleId, checked);
      
      if (success) {
        toast({
          title: "Permissions mises à jour",
          description: `Les permissions pour ${roleId} ont été mises à jour`,
        });
      } else {
        // Revert the optimistic update if the API call fails
        const revertedPermissions = await userService.getRolePermissions();
        setPermissions(revertedPermissions);
        throw new Error("Échec de la mise à jour des permissions");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les permissions",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (roleId: AppRole, moduleId: string): boolean => {
    return permissions[roleId]?.includes(moduleId) || false;
  };

  if (isLoading) {
    return <div className="text-center py-4">Chargement des permissions...</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2">Module / Rôle</th>
            {roles.map(role => (
              <th key={role.id} className="p-2 text-center">
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modules.map(module => (
            <tr key={module.id} className="border-t">
              <td className="p-2 font-medium">{module.name}</td>
              {roles.map(role => (
                <td key={`${role.id}-${module.id}`} className="p-2 text-center">
                  <Checkbox 
                    checked={hasPermission(role.id, module.id)}
                    disabled={role.id === "admin"} // Admin always has all permissions
                    onCheckedChange={(checked) => {
                      handlePermissionChange(role.id, module.id, checked === true);
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-muted-foreground mt-4">
        * L'Administrateur a toujours accès à tous les modules
      </p>
    </div>
  );
};

export default RolePermissionsMatrix;
