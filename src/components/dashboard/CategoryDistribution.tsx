
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Interface de projet simplifiée pour la démonstration
interface Project {
  id: number;
  name: string;
  category: string;
  value: number; // Représente le CA du projet
}

// Données mockées des projets avec leurs catégories et montants
const projectsData: Project[] = [
  { id: 1, name: "Rénovation Immeuble Castellane", category: "Rénovation", value: 45000 },
  { id: 2, name: "Construction Villa Prado", category: "Construction", value: 65000 },
  { id: 3, name: "Aménagement Bureaux Vieux-Port", category: "Aménagement", value: 28000 },
  { id: 4, name: "Réhabilitation Centre Culturel", category: "Réhabilitation", value: 22000 },
  { id: 5, name: "Extension Maison Individuelle", category: "Construction", value: 20000 },
];

// Préparation des données pour le graphique, agrégation par catégorie
const prepareCategoryData = () => {
  const categoryMap = new Map<string, number>();
  
  projectsData.forEach((project) => {
    const currentValue = categoryMap.get(project.category) || 0;
    categoryMap.set(project.category, currentValue + project.value);
  });
  
  return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
};

const COLORS = ['#E26D5A', '#A65F3D', '#3C3C3C', '#2D2D2D', '#584D39'];

const CategoryDistribution = () => {
  const data = prepareCategoryData();
  
  return (
    <Card className="animate-fade-in delay-400">
      <CardHeader>
        <CardTitle>Répartition par catégorie</CardTitle>
        <CardDescription>CA par catégorie de projets</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
