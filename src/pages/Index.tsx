import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Briefcase, CircleDollarSign, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import DashboardSummary from "@/components/dashboard/DashboardSummary";

const Dashboard = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalSales: 0,
    totalObjectives: 0
  });
  const [projectsByCategory, setProjectsByCategory] = useState<any[]>([]);
  const [monthlyObjectives, setMonthlyObjectives] = useState<any[]>([]);
  const [monthlySalesVsObjectives, setMonthlySalesVsObjectives] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer tous les projets
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');
        
        if (projectsError) throw projectsError;
        
        // Calculer les statistiques
        const totalProjects = projectsData?.length || 0;
        const activeProjects = projectsData?.filter(p => p.status === 'En cours').length || 0;
        const totalObjectives = projectsData?.reduce((sum, proj) => sum + (proj.target_revenue || 0), 0) || 0;
        
        // Récupérer les ventes
        const { data: salesData, error: salesError } = await supabase
          .from('project_sales')
          .select('*');
          
        if (salesError) throw salesError;
        
        const totalSales = salesData?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0;
        
        setStats({
          totalProjects,
          activeProjects,
          totalSales,
          totalObjectives
        });
        
        // Préparer les données pour le graphique par catégorie
        const categoriesMap = new Map();
        projectsData?.forEach(project => {
          if (project.category) {
            const currentCount = categoriesMap.get(project.category) || 0;
            categoriesMap.set(project.category, currentCount + 1);
          }
        });
        
        const categoryData = Array.from(categoriesMap).map(([name, count]) => ({ 
          name, 
          value: count 
        }));
        setProjectsByCategory(categoryData);
        
        // Préparer les données pour les objectifs mensuels
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        const objectivesByMonth = monthNames.map(name => ({ name, objectives: 0 }));
        
        projectsData?.forEach(project => {
          if (project.start_date && project.target_revenue) {
            const startDate = new Date(project.start_date);
            const month = startDate.getMonth();
            objectivesByMonth[month].objectives += project.target_revenue;
          }
        });
        setMonthlyObjectives(objectivesByMonth);
        
        // Préparer les données pour le graphique de progression ventes vs objectifs par mois
        const monthlyData = monthNames.map(name => ({ 
          name, 
          objectives: 0,
          sales: 0
        }));

        // Ajouter les objectifs par mois
        projectsData?.forEach(project => {
          if (project.start_date && project.target_revenue) {
            const startDate = new Date(project.start_date);
            const month = startDate.getMonth();
            monthlyData[month].objectives += project.target_revenue;
          }
        });

        // Ajouter les ventes par mois
        salesData?.forEach(sale => {
          if (sale.date) {
            const saleDate = new Date(sale.date);
            const month = saleDate.getMonth();
            monthlyData[month].sales += sale.amount;
          }
        });

        setMonthlySalesVsObjectives(monthlyData);
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Nouvelles couleurs inspirées de l'image
  const COLORS = ['#764AF1', '#2CE5A7', '#FF6B6B', '#FFB347', '#50C4ED'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      
      {/* Ajout du DashboardSummary en haut avec les KPIs */}
      <DashboardSummary isLoading={isLoading} />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl text-muted-foreground">Chargement des données...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Graphique 1: Répartition projets par catégorie */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Projets par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} projets`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique 2: Objectifs CA par mois */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Objectifs CA par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyObjectives}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} TND`, 'Objectif CA']} />
                      <Bar dataKey="objectives" fill="#2CE5A7" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique 3: Courbe Ventes vs Objectifs par mois */}
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Ventes vs Objectifs par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      objectives: { color: "#FF6B6B" },
                      sales: { color: "#2CE5A7" }
                    }}
                  >
                    <LineChart data={monthlySalesVsObjectives}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value: any) => 
                              `${parseInt(value).toLocaleString()} TND`
                            }
                          />
                        }
                      />
                      <Line 
                        type="monotone" 
                        dataKey="objectives" 
                        name="Objectifs" 
                        stroke="#FF6B6B" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="Ventes" 
                        stroke="#2CE5A7" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
