
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { leaveService } from "@/services/leaveService";
import AdminDashboard from "@/components/leave/AdminDashboard";
import EmployeeProfile from "@/components/leave/EmployeeProfile";

const Leaves = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Vérifier si l'utilisateur est un administrateur
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const permissions = await userService.getRolePermissions();
          
          if (permissions && permissions.admin && permissions.admin.length > 0) {
            const userId = session.user.id;
            const userWithRole = await userService.getUserWithRole(userId);
            
            if (userWithRole && userWithRole.role === "admin") {
              setIsAdmin(true);
            }
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        setIsLoading(false);
      }
    };
    
    checkAdminRole();
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des congés</h1>
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <EmployeeProfile />
      )}
    </div>
  );
};

export default Leaves;
