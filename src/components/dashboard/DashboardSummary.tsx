
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, CircleDollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { expenseService } from "@/services/expenseService";
import { useToast } from "@/hooks/use-toast";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  delay: number;
  trendIsPositive?: boolean;
  isAlert?: boolean;
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

const StatCard = ({ title, value, description, icon: Icon, trend, trendLabel, delay, trendIsPositive = true, isAlert = false }: StatCardProps) => (
  <Card className={`animate-fade-in delay-${delay} ${isAlert ? 'border-terracotta' : ''}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${isAlert ? 'text-terracotta' : 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trendIsPositive ? (
            <TrendingUp className={`h-3 w-3 ${trendIsPositive ? 'text-green-600' : 'text-terracotta'}`} />
          ) : (
            <TrendingDown className={`h-3 w-3 ${trendIsPositive ? 'text-green-600' : 'text-terracotta'}`} />
          )}
          <span className={`text-xs font-medium ${trendIsPositive ? 'text-green-600' : 'text-terracotta'}`}>{trend}%</span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Update the component to accept the props defined in the interface
const DashboardSummary = ({ isLoading = false, stats }: DashboardSummaryProps) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [delayedProjects, setDelayedProjects] = useState<number>(0);
  const [totalClients, setTotalClients] = useState<number>(0);
  const [clientsToContact, setClientsToContact] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState<number>(0);
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(isLoading);
  const { toast } = useToast();

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
          .select('id, end_date')
          .eq('status', 'En cours');
          
        if (projectsError) throw projectsError;
        setActiveProjects(activeProjectsData.length);
        
        // Compter les projets en retard (date de fin passée mais statut en cours)
        const today = new Date();
        const delayedProjectsCount = activeProjectsData.filter((project: any) => {
          if (!project.end_date) return false;
          return new Date(project.end_date) < today;
        }).length;
        setDelayedProjects(delayedProjectsCount);
        
        // Récupérer le nombre total de clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id');
          
        if (clientsError) throw clientsError;
        // Éliminer les doublons par nom (car il y a des clients dupliqués)
        const uniqueClientNames = new Set(clientsData.map((client: any) => client.name));
        setTotalClients(uniqueClientNames.size);
        
        // Clients sans activité récente (à relancer) - supposons qu'un client doit être relancé 
        // s'il n'a pas eu de projet dans les 3 derniers mois
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        // Compter combien de clients n'ont pas eu de projets récents
        const { data: recentProjectsData } = await supabase
          .from('projects')
          .select('client_id')
          .gte('created_at', threeMonthsAgo.toISOString());
        
        const activeClientIds = new Set((recentProjectsData || []).map(p => p.client_id));
        const clientsToContactCount = clientsData.filter((c: any) => 
          c.id && !activeClientIds.has(c.id)
        ).length;
        
        setClientsToContact(clientsToContactCount);
        
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
        
        // Calculer le CA du mois précédent
        const previousMonth = currentDate.getMonth();
        const previousMonthYear = previousMonth === 0 ? currentYear - 1 : currentYear;
        const adjustedPreviousMonth = previousMonth === 0 ? 12 : previousMonth;
        
        const { data: prevMonthProjectsData, error: prevMonthError } = await supabase
          .from('projects')
          .select('target_revenue')
          .gte('start_date', `${previousMonthYear}-${adjustedPreviousMonth.toString().padStart(2, '0')}-01`)
          .lte('start_date', `${previousMonthYear}-${adjustedPreviousMonth.toString().padStart(2, '0')}-31`);
          
        if (prevMonthError) throw prevMonthError;
        
        const prevMonthRevenueValue = prevMonthProjectsData.reduce((sum, project) => {
          return sum + (project.target_revenue || 0);
        }, 0);
        setPreviousMonthRevenue(prevMonthRevenueValue);
        
        // Calculer le pourcentage de variation entre ce mois et le mois précédent
        
        // Récupérer les dépenses pour le mois en cours et le mois précédent
        try {
          const currMonthExpenses = await expenseService.getCurrentMonthExpenses();
          const prevMonthExpenses = await expenseService.getPreviousMonthExpenses();
          
          setCurrentMonthExpenses(currMonthExpenses);
          setPreviousMonthExpenses(prevMonthExpenses);
        } catch (expenseError) {
          console.error("Erreur lors de la récupération des dépenses:", expenseError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer les données des dépenses."
          });
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement des données du dashboard:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord."
        });
      } finally {
        setIsLoadingLocal(false);
      }
    };

    fetchDashboardData();
  }, [stats, toast]);

  // Use the effective loading state: either from props or from local state
  const effectiveLoading = isLoading || isLoadingLocal;
  
  // Calcul des tendances
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  const revenueTrend = calculateTrend(monthlyRevenue, previousMonthRevenue);
  const expensesTrend = calculateTrend(currentMonthExpenses, previousMonthExpenses);
  
  // Formater les montants en TND
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString()} TND`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Revenus ce mois"
        value={effectiveLoading ? "Chargement..." : formatCurrency(monthlyRevenue)}
        description={`vs ${formatCurrency(previousMonthRevenue)} le mois dernier`}
        icon={CircleDollarSign}
        trend={revenueTrend}
        trendLabel="vs mois précédent"
        trendIsPositive={revenueTrend >= 0}
        delay={100}
      />
      <StatCard
        title="Projets Actifs"
        value={effectiveLoading ? "Chargement..." : `${activeProjects}`}
        description={delayedProjects > 0 ? `${delayedProjects} projets en retard` : "Tous les projets sont à jour"}
        icon={Briefcase}
        delay={200}
        isAlert={delayedProjects > 0}
      />
      <StatCard
        title="Dépenses ce mois"
        value={effectiveLoading ? "Chargement..." : formatCurrency(currentMonthExpenses)}
        description={`vs ${formatCurrency(previousMonthExpenses)} le mois dernier`}
        icon={CircleDollarSign}
        trend={expensesTrend}
        trendLabel="vs mois précédent"
        trendIsPositive={expensesTrend <= 0}
        delay={300}
      />
      <StatCard
        title="Clients à relancer"
        value={effectiveLoading ? "Chargement..." : `${clientsToContact}`}
        description={`Sur un total de ${totalClients} clients`}
        icon={AlertTriangle}
        delay={400}
        isAlert={clientsToContact > 0}
      />
    </div>
  );
};

export default DashboardSummary;
