
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RecentProjects from "@/components/dashboard/RecentProjects";
import { expenseService } from "@/services/expenseService";
import { salesForecastService } from "@/services/salesForecastService";

const Dashboard = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [monthlySales, setMonthlySales] = useState<any[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<any[]>([]);
  const [projectProfitability, setProjectProfitability] = useState<any[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Monthly Sales Forecast data (bar chart)
        const salesData = await salesForecastService.getAllMonthlyForecasts(currentYear);
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        
        const formattedSalesData = salesData.map(item => ({
          name: monthNames[item.month - 1],
          amount: item.totalAmount
        }));
        
        setMonthlySales(formattedSalesData);
        
        // 2. Monthly Expenses data (line chart)
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount, date')
          .gte('date', `${currentYear}-01-01`)
          .lte('date', `${currentYear}-12-31`);
          
        if (expensesError) throw expensesError;
        
        // Group expenses by month
        const expensesByMonth = Array(12).fill(0).map((_, i) => ({
          name: monthNames[i],
          amount: 0
        }));
        
        (expensesData || []).forEach(expense => {
          const date = new Date(expense.date);
          const month = date.getMonth();
          expensesByMonth[month].amount += Number(expense.amount);
        });
        
        setMonthlyExpenses(expensesByMonth);
        
        // 3. Project Profitability data (bar chart)
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name, target_revenue')
          .limit(6); // Limit to keep the chart readable
          
        if (projectsError) throw projectsError;
        
        // For each project, get sales and expenses
        const profitabilityData = [];
        
        for (const project of projectsData || []) {
          // Get sales for this project
          const { data: projectSales, error: salesError } = await supabase
            .from('project_sales')
            .select('amount')
            .eq('project_id', project.id);
            
          if (salesError) throw salesError;
          
          const totalSales = (projectSales || []).reduce((sum, sale) => sum + Number(sale.amount), 0);
          
          // We don't have direct project expenses in the schema,
          // So we'll use the target_revenue as a proxy for cost+profit
          // and calculate a simulated profitability
          const simulatedCost = project.target_revenue ? project.target_revenue * 0.7 : 0; // Assume 70% cost
          const profit = totalSales - simulatedCost;
          
          profitabilityData.push({
            name: project.name,
            profit: profit,
            sales: totalSales,
            costs: simulatedCost
          });
        }
        
        setProjectProfitability(profitabilityData);
        
        // 4. Expenses by Category (pie chart)
        const { data: categorizedExpenses, error: catError } = await supabase
          .from('expenses')
          .select(`
            amount,
            expense_categories(name)
          `);
          
        if (catError) throw catError;
        
        // Group expenses by category
        const expenseCategories = new Map();
        
        (categorizedExpenses || []).forEach(expense => {
          const categoryName = expense.expense_categories?.name || 'Non catégorisé';
          const currentAmount = expenseCategories.get(categoryName) || 0;
          expenseCategories.set(categoryName, currentAmount + Number(expense.amount));
        });
        
        const categoryData = Array.from(expenseCategories.entries()).map(([name, value]) => ({
          name,
          value
        }));
        
        setExpensesByCategory(categoryData);
        
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentYear]);

  // Modern color palette with updated colors
  const CHART_COLORS = ['#3D8BFF', '#00B88D', '#FFC107', '#F44336', '#764AF1', '#50C4ED'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      
      {/* KPI Summary Cards */}
      <DashboardSummary isLoading={isLoading} />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl text-muted-foreground">Chargement des données...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Monthly Sales Forecast (Bar Chart) */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Ventes prévues par mois</CardTitle>
                  <CardDescription>Prévisions du CA mensuel pour {currentYear}</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/sales-forecast">Voir détails</a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} TND`, 'CA prévu']} />
                      <Bar dataKey="amount" fill="#3D8BFF" name="CA prévu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Monthly Expenses (Line Chart) */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Dépenses prévues par mois</CardTitle>
                  <CardDescription>Evolution des charges mensuelles</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/expenses">Voir détails</a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} TND`, 'Dépenses']} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#F44336" 
                        strokeWidth={2} 
                        name="Dépenses"
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 3: Expense Categories (Pie Chart) */}
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Dépenses par catégorie</CardTitle>
                  <CardDescription>Répartition des charges par type</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/expense-categories">Voir détails</a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} TND`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart 4: Project Profitability (Bar Chart) */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Rentabilité par projet</CardTitle>
                <CardDescription>CA vs coûts par projet</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/projects">Voir tous les projets</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={projectProfitability}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} TND`]} />
                    <Legend />
                    <Bar dataKey="sales" fill="#3D8BFF" name="Ventes" />
                    <Bar dataKey="costs" fill="#F44336" name="Coûts" />
                    <Bar dataKey="profit" fill="#00B88D" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects Section */}
          <RecentProjects />
        </>
      )}
    </div>
  );
};

export default Dashboard;
