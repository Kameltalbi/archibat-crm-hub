
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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
  { id: "admin", name: "Administrateur" },
  { id: "collaborateur", name: "Collaborateur" },
  { id: "lecture_seule", name: "Lecture seule" },
];

// Mock initial permissions
const initialPermissions = {
  admin: modules.map(module => module.id),
  collaborateur: ["dashboard", "clients", "projects", "products", "calendar"],
  lecture_seule: ["dashboard", "clients", "projects"],
};

const RolePermissionsMatrix = () => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const { toast } = useToast();

  const handlePermissionChange = (roleId: string, moduleId: string, checked: boolean) => {
    const updatedPermissions = { ...permissions };
    
    if (checked) {
      if (!updatedPermissions[roleId].includes(moduleId)) {
        updatedPermissions[roleId] = [...updatedPermissions[roleId], moduleId];
      }
    } else {
      updatedPermissions[roleId] = updatedPermissions[roleId].filter(id => id !== moduleId);
    }
    
    setPermissions(updatedPermissions);
    
    // This would call the Supabase update function in a real implementation
    // For now just showing a toast
    toast({
      title: "Permissions mises à jour",
      description: `Les permissions pour ${roleId} ont été mises à jour`,
    });
  };

  const hasPermission = (roleId: string, moduleId: string): boolean => {
    return permissions[roleId]?.includes(moduleId) || false;
  };

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
