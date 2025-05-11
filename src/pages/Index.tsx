
import { useEffect, useState } from "react";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopClients from "@/components/dashboard/TopClients";
import RecentProjects from "@/components/dashboard/RecentProjects";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalSales: 0,
    totalClients: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les projets avec leur statut et target_revenue
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('status, target_revenue');
          
        if (projectsError) throw projectsError;
        
        const totalProjects = projectsData.length;
        
        // Compter les projets actifs (statut "En cours")
        const activeProjects = projectsData.filter(project => project.status === 'En cours').length;
        
        // Calculer le montant total des objectifs CA
        const totalTargetRevenue = projectsData.reduce((sum, project) => {
          return sum + (project.target_revenue || 0);
        }, 0);
        
        // Récupérer le nombre total de clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id');
          
        if (clientsError) throw clientsError;
        
        setStats({
          totalProjects: totalProjects,
          activeProjects: activeProjects,
          totalSales: totalTargetRevenue,
          totalClients: clientsData.length
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      
      <DashboardSummary isLoading={isLoading} stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <CategoryDistribution />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentProjects />
        <TopClients />
      </div>
    </div>
  );
};

export default Dashboard;
