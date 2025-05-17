
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/lib/supabase";

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Obtenir l'année en cours
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer tous les projets
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*');
          
        if (error) throw error;
        
        // Initialiser les données par mois avec les 12 mois
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
        const revenueByMonth = monthNames.map((name, index) => ({
          name,
          value: 0,
          month: index + 1,
        }));
        
        // Agréger le CA par mois à partir des projets
        projectsData.forEach(project => {
          if (project.start_date) {
            const startDate = new Date(project.start_date);
            const month = startDate.getMonth(); // 0-indexed
            
            // Si le projet a un objectif de CA, l'ajouter au mois correspondant
            if (project.target_revenue) {
              revenueByMonth[month].value += project.target_revenue;
            }
          }
        });
        
        setChartData(revenueByMonth);
      } catch (error) {
        console.error("Erreur lors du chargement des données de revenus:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRevenueData();
  }, []);
  
  // Données de secours en cas d'erreur ou pendant le chargement
  const fallbackData = [
    { name: 'Jan', value: 12000 },
    { name: 'Fév', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Avr', value: 17500 },
    { name: 'Mai', value: 21000 },
    { name: 'Juin', value: 22000 },
    { name: 'Juil', value: 24000 },
    { name: 'Août', value: 18000 },
    { name: 'Sept', value: 30000 },
    { name: 'Oct', value: 25000 },
    { name: 'Nov', value: 28000 },
    { name: 'Déc', value: 35000 },
  ];

  return (
    <Card className="animate-fade-in delay-100">
      <CardHeader>
        <CardTitle>Chiffre d'affaires {currentYear}</CardTitle>
        <CardDescription>Évolution mensuelle du CA pour l'année {currentYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={isLoading || chartData.length === 0 ? fallbackData : chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#764AF1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#764AF1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" stroke="#3C3C3C" />
              <YAxis
                stroke="#3C3C3C"
                tickFormatter={(value) => `${value / 1000}k TND`}
              />
              <Tooltip
                formatter={(value) => [`${value} TND`, 'Chiffre d\'affaires']}
                labelFormatter={(label) => `Mois: ${label} ${currentYear}`}
                contentStyle={{
                  backgroundColor: '#F5F0E6',
                  border: '1px solid #E0E0E0',
                  borderRadius: '4px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#764AF1"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
