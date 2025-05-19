
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from "recharts";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyData {
  month: Date;
  monthLabel: string;
  salesTotal: number;
  expensesTotal: number;
  balance: number;
}

interface TreasuryChartProps {
  data: MonthlyData[];
}

const TreasuryChart = ({ data }: TreasuryChartProps) => {
  // Format the data for the chart
  const chartData = data.map((monthData) => ({
    name: format(monthData.month, 'MMM', { locale: fr }),
    encaissements: monthData.salesTotal,
    décaissements: monthData.expensesTotal,
    balance: monthData.balance,
  }));

  // Format money values
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de la trésorerie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => `${value / 1000}k`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={(value) => `${value / 1000}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [formatMoney(value as number), ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="encaissements" 
                name="Encaissements" 
                fill="#4CAF50" 
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="left" 
                dataKey="décaissements" 
                name="Décaissements" 
                fill="#FF5252" 
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="balance" 
                name="Solde cumulé" 
                stroke="#2196F3" 
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreasuryChart;
