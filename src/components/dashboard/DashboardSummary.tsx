
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, ArrowUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  delay: number;
}

// Define the props interface for DashboardSummary
export interface DashboardSummaryProps {
  isLoading?: boolean;
  stats?: {
    totalProjects: number;
    activeProjects: number;
    totalSales: number;
    totalClients: number;
  };
}

const StatCard = ({ title, value, description, icon: Icon, trend, trendLabel, delay }: StatCardProps) => (
  <Card className={`animate-fade-in delay-${delay}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <ArrowUp className="h-3 w-3 text-terracotta" />
          <span className="text-xs font-medium text-terracotta">{trend}%</span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Update the component to accept the props defined in the interface
const DashboardSummary = ({ isLoading = false, stats }: DashboardSummaryProps) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(isLoading);

  // Use the stats props if provided, otherwise fetch from supabase
  useEffect(() => {
    // If stats are provided, use them instead of fetching
    if (stats) {
      setTotalRevenue(stats.totalSales);
      setActiveProjects(stats.activeProjects);
      setTotalClients(stats.totalClients);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoadingLocal(true);
        
        // Récupérer le nombre de projets actifs
        const { data: activeProjectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id')
          .eq('status', 'En cours');
          
        if (projectsError) throw projectsError;
        setActiveProjects(activeProjectsData.length);
        
        // Récupérer le nombre total de clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id');
          
        if (clientsError) throw clientsError;
        // Éliminer les doublons par nom (car il y a des clients dupliqués)
        const uniqueClientNames = new Set(clientsData.map((client: any) => client.name));
        setTotalClients(uniqueClientNames.size);
        
        // Récupérer les projets avec leurs objectifs de CA pour calculer le CA total
        const { data: projectsData, error: revenueError } = await supabase
          .from('projects')
          .select('target_revenue');
          
        if (revenueError) throw revenueError;
        
        const totalRevenueValue = projectsData.reduce((sum, project) => {
          return sum + (project.target_revenue || 0);
        }, 0);
        setTotalRevenue(totalRevenueValue);
        
        // Calculer le CA du mois en cours
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() est 0-indexé
        const currentYear = currentDate.getFullYear();
        
        const { data: monthlyProjectsData, error: monthlyError } = await supabase
          .from('projects')
          .select('target_revenue')
          .gte('start_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lte('start_date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`);
          
        if (monthlyError) throw monthlyError;
        
        const monthlyRevenueValue = monthlyProjectsData.reduce((sum, project) => {
          return sum + (project.target_revenue || 0);
        }, 0);
        setMonthlyRevenue(monthlyRevenueValue);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchDashboardData();
  }, [stats]);

  // Use the effective loading state: either from props or from local state
  const effectiveLoading = isLoading || isLoadingLocal;
  
  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="CA Total"
        value={effectiveLoading ? "Chargement..." : `${totalRevenue.toLocaleString()} TND`}
        description="Chiffre d'affaires global"
        icon={Calendar}
        trend={12}
        trendLabel="vs période précédente"
        delay={100}
      />
      <StatCard
        title="Projets Actifs"
        value={effectiveLoading ? "Chargement..." : `${activeProjects}`}
        description="Projets en cours"
        icon={Briefcase}
        trend={8}
        trendLabel="vs période précédente"
        delay={200}
      />
      <StatCard
        title="Clients"
        value={effectiveLoading ? "Chargement..." : `${totalClients}`}
        description="Total des clients"
        icon={Users}
        trend={5}
        trendLabel="vs période précédente"
        delay={300}
      />
      <StatCard
        title="Ventes du mois"
        value={effectiveLoading ? "Chargement..." : `${monthlyRevenue.toLocaleString()} TND`}
        description="CA du mois en cours"
        icon={Calendar}
        trend={15}
        trendLabel="vs mois précédent"
        delay={400}
      />
    </div>
  );
};

export default DashboardSummary;
