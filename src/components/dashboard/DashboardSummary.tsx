
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown, 
  CalendarClock, 
  Users, 
  AlertTriangle 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { expenseService } from "@/services/expenseService";
import { salesForecastService } from "@/services/salesForecastService";
import { useToast } from "@/hooks/use-toast";
import { format, endOfMonth, startOfMonth, addDays } from "date-fns";

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
  <Card className={`animate-fade-in delay-${delay} ${isAlert ? 'border-alert-red' : ''}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${isAlert ? 'text-alert-red' : 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trendIsPositive ? (
            <TrendingUp className={`h-3 w-3 ${trendIsPositive ? 'text-mint-green' : 'text-alert-red'}`} />
          ) : (
            <TrendingDown className={`h-3 w-3 ${trendIsPositive ? 'text-mint-green' : 'text-alert-red'}`} />
          )}
          <span className={`text-xs font-medium ${trendIsPositive ? 'text-mint-green' : 'text-alert-red'}`}>{trend}%</span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Update the component to include the requested KPIs
const DashboardSummary = ({ isLoading = false, stats }: DashboardSummaryProps) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
  const [previousMonthExpenses, setPreviousMonthExpenses] = useState<number>(0);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [thisWeekDeadlines, setThisWeekDeadlines] = useState<number>(0);
  const [activeClients, setActiveClients] = useState<number>(0);
  const [isLoadingLocal, setIsLoadingLocal] = useState<boolean>(isLoading);
  const [cashflowBalance, setCashflowBalance] = useState<number>(0);
  const { toast } = useToast();

  // Use the stats props if provided, otherwise fetch from supabase
  useEffect(() => {
    if (stats) {
      setMonthlyRevenue(stats.totalSales);
      setActiveProjects(stats.activeProjects);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoadingLocal(true);
        
        // Get current date info for filtering
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const firstDayOfMonth = startOfMonth(today).toISOString();
        const lastDayOfMonth = endOfMonth(today).toISOString();
        const weekFromNow = addDays(today, 7).toISOString();
        
        // 1. Monthly Revenue - Fetch sales forecast for the current month
        const { data: monthSales, error: salesError } = await supabase
          .from('project_sales')
          .select('amount')
          .eq('status', 'prévu')
          .gte('expected_date', firstDayOfMonth)
          .lte('expected_date', lastDayOfMonth);
          
        if (salesError) throw salesError;
        
        const monthlyRevenueValue = (monthSales || []).reduce((sum, sale) => sum + (sale.amount || 0), 0);
        setMonthlyRevenue(monthlyRevenueValue);
        
        // 2. Monthly Expenses - Get current month expenses
        try {
          const currMonthExpenses = await expenseService.getCurrentMonthExpenses();
          setCurrentMonthExpenses(currMonthExpenses);
          
          // 3. Calculate cashflow balance
          setCashflowBalance(monthlyRevenueValue - currMonthExpenses);
        } catch (expenseError) {
          console.error("Error fetching expenses:", expenseError);
        }
        
        // 4. Active Projects
        const { data: activeProjectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id')
          .eq('status', 'En cours');
          
        if (projectsError) throw projectsError;
        setActiveProjects(activeProjectsData?.length || 0);
        
        // 5. This week's deadlines (sales with expected dates in the next 7 days)
        const { data: weekDeadlines, error: deadlinesError } = await supabase
          .from('project_sales')
          .select('id')
          .gte('expected_date', today.toISOString().split('T')[0])
          .lte('expected_date', weekFromNow.split('T')[0]);
          
        if (deadlinesError) throw deadlinesError;
        setThisWeekDeadlines(weekDeadlines?.length || 0);
        
        // 6. Active clients this month (clients with sales this month)
        const { data: monthClients, error: clientsError } = await supabase
          .from('project_sales')
          .select('projects(client_id)')
          .gte('date', firstDayOfMonth)
          .lte('date', lastDayOfMonth);
          
        if (clientsError) throw clientsError;
        
        // Extract unique client IDs
        const clientIds = new Set();
        (monthClients || []).forEach(sale => {
          if (sale.projects?.client_id) {
            clientIds.add(sale.projects.client_id);
          }
        });
        
        setActiveClients(clientIds.size);
        
        // Get previous month data for trends
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        
        // Previous month sales
        const prevMonthStart = new Date(prevMonthYear, prevMonth - 1, 1).toISOString();
        const prevMonthEnd = endOfMonth(new Date(prevMonthYear, prevMonth - 1, 1)).toISOString();
        
        const { data: prevSales } = await supabase
          .from('project_sales')
          .select('amount')
          .eq('status', 'prévu')
          .gte('expected_date', prevMonthStart)
          .lte('expected_date', prevMonthEnd);
          
        const prevMonthRevenueValue = (prevSales || []).reduce((sum, sale) => sum + (sale.amount || 0), 0);
        setPreviousMonthRevenue(prevMonthRevenueValue);
        
        // Previous month expenses
        try {
          const prevMonthExpenses = await expenseService.getPreviousMonthExpenses();
          setPreviousMonthExpenses(prevMonthExpenses);
        } catch (error) {
          console.error("Error fetching previous month expenses:", error);
        }
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
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
  
  // Calculate trends
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  const revenueTrend = calculateTrend(monthlyRevenue, previousMonthRevenue);
  const expensesTrend = calculateTrend(currentMonthExpenses, previousMonthExpenses);
  
  // Format amounts in TND
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString()} TND`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Monthly Revenue Forecast */}
      <StatCard
        title="CA prévu ce mois"
        value={effectiveLoading ? "Chargement..." : formatCurrency(monthlyRevenue)}
        description={previousMonthRevenue > 0 ? `vs ${formatCurrency(previousMonthRevenue)} le mois dernier` : "Prévisions du mois en cours"}
        icon={CircleDollarSign}
        trend={revenueTrend}
        trendLabel="vs mois précédent"
        trendIsPositive={revenueTrend >= 0}
        delay={100}
      />
      
      {/* 2. Monthly Expenses */}
      <StatCard
        title="Dépenses prévues ce mois"
        value={effectiveLoading ? "Chargement..." : formatCurrency(currentMonthExpenses)}
        description={previousMonthExpenses > 0 ? `vs ${formatCurrency(previousMonthExpenses)} le mois dernier` : "Charges prévues du mois"}
        icon={CircleDollarSign}
        trend={expensesTrend}
        trendLabel="vs mois précédent"
        trendIsPositive={expensesTrend <= 0}
        delay={200}
      />
      
      {/* 3. Projected Cash Balance */}
      <StatCard
        title="Solde de trésorerie prévisionnel"
        value={effectiveLoading ? "Chargement..." : formatCurrency(cashflowBalance)}
        description={`Recettes prévues - Dépenses prévues`}
        icon={CircleDollarSign}
        trendIsPositive={cashflowBalance >= 0}
        delay={300}
        isAlert={cashflowBalance < 0}
      />
      
      {/* 4. Active Projects */}
      <StatCard
        title="Projets en cours"
        value={effectiveLoading ? "Chargement..." : `${activeProjects}`}
        description="Projets avec statut 'En cours'"
        icon={Briefcase}
        delay={400}
      />
      
      {/* 5. This Week's Deadlines */}
      <StatCard
        title="Échéances cette semaine"
        value={effectiveLoading ? "Chargement..." : `${thisWeekDeadlines}`}
        description="Ventes à réaliser dans les 7 prochains jours"
        icon={CalendarClock}
        delay={500}
        isAlert={thisWeekDeadlines > 5}
      />
      
      {/* 6. Active Clients This Month */}
      <StatCard
        title="Clients actifs ce mois"
        value={effectiveLoading ? "Chargement..." : `${activeClients}`}
        description="Clients avec au moins une vente ce mois"
        icon={Users}
        delay={600}
      />
    </div>
  );
};

export default DashboardSummary;
