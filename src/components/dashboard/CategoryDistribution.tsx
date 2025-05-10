
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Études', value: 35000 },
  { name: 'Travaux', value: 85000 },
  { name: 'Services', value: 28000 },
  { name: 'Conseils', value: 12000 },
];

const COLORS = ['#E26D5A', '#A65F3D', '#3C3C3C', '#2D2D2D'];

const CategoryDistribution = () => {
  return (
    <Card className="animate-fade-in delay-400">
      <CardHeader>
        <CardTitle>Répartition par catégorie</CardTitle>
        <CardDescription>CA par type de prestation</CardDescription>
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
                formatter={(value) => [`${value.toLocaleString()} €`, 'Chiffre d\'affaires']}
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
