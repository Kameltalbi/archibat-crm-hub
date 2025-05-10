
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { supabase } from "@/lib/supabase";

const COLORS = ['#E26D5A', '#A65F3D', '#3C3C3C', '#2D2D2D', '#584D39'];

const CategoryDistribution = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer tous les projets avec leurs catégories et objectifs de CA
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('category, target_revenue');
          
        if (error) throw error;
        
        // Agréger les données par catégorie
        const categoryMap = new Map();
        
        projectsData.forEach(project => {
          if (project.category) {
            const currentValue = categoryMap.get(project.category) || 0;
            categoryMap.set(project.category, currentValue + (project.target_revenue || 0));
          }
        });
        
        // Transformer en tableau pour le graphique
        const formattedData = Array.from(categoryMap).map(([name, value]) => ({ name, value }));
        
        setCategoryData(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des données par catégorie:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, []);
  
  // Données de secours en cas d'erreur ou pendant le chargement
  const fallbackData = [
    { name: "Rénovation", value: 45000 },
    { name: "Construction", value: 85000 },
    { name: "Aménagement", value: 28000 },
    { name: "Réhabilitation", value: 22000 },
  ];
  
  const data = categoryData.length > 0 ? categoryData : fallbackData;
  
  return (
    <Card className="animate-fade-in delay-400">
      <CardHeader>
        <CardTitle>Répartition par catégorie</CardTitle>
        <CardDescription>CA par catégorie de projets</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            Chargement des données...
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} TND`, 'Chiffre d\'affaires']}
                  contentStyle={{
                    backgroundColor: '#F5F0E6',
                    border: '1px solid #E0E0E0',
                    borderRadius: '4px',
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
