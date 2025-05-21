
import { useState, useEffect } from "react";
import { userService } from "@/services/userService";
import { supabase } from "@/lib/supabase";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopClients from "@/components/dashboard/TopClients";
import RecentProjects from "@/components/dashboard/RecentProjects";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const permissions = await userService.getRolePermissions();
          
          if (permissions) {
            const userId = session.user.id;
            const userWithRole = await userService.getUserWithRole(userId);
            
            if (userWithRole && userWithRole.role === "admin") {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
      }
    };
    
    checkAdminRole();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace de gestion
          </p>
        </div>
      </div>

      <DashboardSummary />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart />
        <CategoryDistribution />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopClients />
        <RecentProjects />
      </div>
    </div>
  );
};

export default Dashboard;
