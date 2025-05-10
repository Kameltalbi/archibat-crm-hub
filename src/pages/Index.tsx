
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

  useEffect(() => {
    // Cette fonction vérifie simplement la connexion à Supabase au chargement du dashboard
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.from('projects').select('count', { count: 'exact' }).limit(1);
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la connexion:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      
      <DashboardSummary />
      
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
