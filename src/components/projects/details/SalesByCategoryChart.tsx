
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Sale } from "./types";

interface SalesByCategoryChartProps {
  sales: Sale[];
}

const CHART_COLORS = ['#a05a2c', '#cfb095', '#d4cdc3', '#8e9196', '#403e43', '#6d4824'];

export const SalesByCategoryChart = ({ sales }: SalesByCategoryChartProps) => {
  // Prepare pie chart data by category
  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    sales.forEach(sale => {
      const currentTotal = categoryMap.get(sale.category) || 0;
      categoryMap.set(sale.category, currentTotal + sale.amount);
    });
    
    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  }, [sales]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">CA par Catégorie</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} DT`} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucune donnée disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
};
