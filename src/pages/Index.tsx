
import { useEffect, useState } from "react";
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
        
        // Récupérer les statistiques générales
        const [projectsResult, clientsResult, salesResult] = await Promise.all([
          supabase.from('projects').select('count'),
          supabase.from('clients').select('count'),
          supabase.from('project_sales').select('amount')
        ]);
        
        // Récupérer le nombre de projets actifs (statut "En cours")
        const activeProjectsResult = await supabase
          .from('projects')
          .select('count')
          .eq('status', 'En cours');
        
        // Calculer le montant total des ventes
        const totalSalesAmount = salesResult.data?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
        
        setStats({
          totalProjects: projectsResult.count || 0,
          activeProjects: activeProjectsResult.count || 0,
          totalSales: totalSalesAmount,
          totalClients: clientsResult.count || 0
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
      
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-xl text-muted-foreground">Tableau de bord vide</p>
      </div>
    </div>
  );
};

export default Dashboard;
