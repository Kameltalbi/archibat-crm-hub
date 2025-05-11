
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

// Update the component to correctly calculate total target revenue and active projects
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
        
        // Get all projects to calculate total target revenue
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('target_revenue, status');
          
        if (projectsError) throw projectsError;
        
        // Calculate total target revenue from all projects
        const totalTargetRevenue = projectsData.reduce((sum, project) => {
          return sum + (project.target_revenue || 0);
        }, 0);
        setTotalRevenue(totalTargetRevenue);
        
        // Count active projects with status "En cours"
        const activeProjectsCount = projectsData.filter(project => project.status === 'En cours').length;
        setActiveProjects(activeProjectsCount);
        
        // Get total clients count
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id');
          
        if (clientsError) throw clientsError;
        setTotalClients(clientsData.length);
        
        // Calculate monthly revenue (projects started in current month)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
        const currentYear = currentDate.getFullYear();
        
        const { data: monthlySalesData, error: monthlySalesError } = await supabase
          .from('project_sales')
          .select('amount')
          .gte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lte('date', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`);
          
        if (monthlySalesError) throw monthlySalesError;
        
        const monthlyRevenueValue = monthlySalesData.reduce((sum, sale) => {
          return sum + (parseFloat(sale.amount) || 0);
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
        description="Objectif CA des projets"
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
