
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Briefcase, CircleDollarSign, FileText, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
  const [progressData, setProgressData] = useState<any[]>([]);

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
          .select('amount');
          
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
        
        // Préparer les données pour le graphique de progression
        setProgressData([
          { name: 'Objectifs', value: totalObjectives },
          { name: 'Ventes', value: totalSales }
        ]);
        
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#E26D5A', '#A65F3D', '#3C3C3C', '#2D2D2D', '#584D39', '#7D7463', '#8B7E6A'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité pour {currentYear}</p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-xl text-muted-foreground">Chargement des données...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Carte 1: Objectifs CA */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Objectifs CA
                </CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalObjectives.toLocaleString()} TND
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Objectifs cumulés de tous les projets
                </p>
              </CardContent>
            </Card>

            {/* Carte 2: Nombre de projets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Projets
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalProjects}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeProjects} projets actifs
                </p>
              </CardContent>
            </Card>

            {/* Carte 3: Progression des ventes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventes / Objectifs
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((stats.totalSales / stats.totalObjectives) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalSales.toLocaleString()} TND réalisés
                </p>
              </CardContent>
            </Card>
          </div>

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
                      <Bar dataKey="objectives" fill="#E26D5A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique 3: Progression des ventes par rapport aux objectifs */}
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Ventes vs Objectifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      objectives: { color: "#A65F3D" },
                      sales: { color: "#E26D5A" }
                    }}
                  >
                    <BarChart data={progressData}>
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
                      <Bar dataKey="value" name="Montant" fill="var(--color-objectives)" />
                    </BarChart>
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
