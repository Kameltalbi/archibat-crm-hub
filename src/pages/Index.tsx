import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
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

        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

        const salesData = await salesForecastService.getAllMonthlyForecasts(currentYear);
        const formattedSalesData = salesData.map(item => ({
          name: monthNames[item.month - 1],
          amount: item.totalAmount
        }));
        setMonthlySales(formattedSalesData);

        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('*')
          .gte('date', `${currentYear}-01-01`)
          .lte('date', `${currentYear}-12-31`);

        if (expensesError) throw expensesError;

        const allExpenses = [...(expensesData || [])];

        // Handle recurring expenses
        const recurringExpenses = allExpenses.filter(e => e.is_recurring);
        for (const exp of recurringExpenses) {
          const date = new Date(exp.start_date);
          if (date.getFullYear() > currentYear) continue;

          for (let month = 0; month < 12; month++) {
            const recurringDate = new Date(currentYear, month, date.getDate());
            if (recurringDate >= new Date(currentYear, 0, 1) && recurringDate <= new Date(currentYear, 11, 31)) {
              allExpenses.push({
                ...exp,
                date: recurringDate.toISOString()
              });
            }
          }
        }

        const expensesByMonth = Array(12).fill(0).map((_, i) => ({
          name: monthNames[i],
          amount: 0
        }));

        allExpenses.forEach(expense => {
          const date = new Date(expense.date);
          const month = date.getMonth();
          expensesByMonth[month].amount += Number(expense.amount);
        });

        setMonthlyExpenses(expensesByMonth);

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, name, target_revenue')
          .limit(6);

        if (projectsError) throw projectsError;

        const profitabilityData = [];
        for (const project of projectsData || []) {
          const { data: projectSales, error: salesError } = await supabase
            .from('project_sales')
            .select('amount')
            .eq('project_id', project.id);

          if (salesError) throw salesError;

          const totalSales = (projectSales || []).reduce((sum, sale) => sum + Number(sale.amount), 0);
          const simulatedCost = project.target_revenue ? project.target_revenue * 0.7 : 0;
          const profit = totalSales - simulatedCost;

          profitabilityData.push({
            name: project.name,
            profit: profit,
            sales: totalSales,
            costs: simulatedCost
          });
        }
        setProjectProfitability(profitabilityData);

        const { data: categorizedExpenses, error: catError } = await supabase
          .from('expenses')
          .select(`amount, expense_categories(name)`);

        if (catError) throw catError;

        const expenseCategories = new Map();
        (categorizedExpenses || []).forEach(expense => {
          const categoryName = expense.expense_categories?.name || 'Non catégorisé';
          const currentAmount = expenseCategories.get(categoryName) || 0;
          expenseCategories.set(categoryName, currentAmount + Number(expense.amount));
        });

        const categoryData = Array.from(expenseCategories.entries()).map(([name, value]) => ({ name, value }));
        setExpensesByCategory(categoryData);

      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentYear]);

  const CHART_COLORS = ['#3D8BFF', '#00B88D', '#FFC107', '#F44336', '#764AF1', '#50C4ED'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      <DashboardSummary isLoading={isLoading} />
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl text-muted-foreground">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Charts and cards identiques à ta version actuelle */}
          <RecentProjects />
        </>
      )}
    </div>
  );
};

export default Dashboard;