
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
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

const RevenueChart = () => {
  return (
    <Card className="animate-fade-in delay-100">
      <CardHeader>
        <CardTitle>Chiffre d'affaires</CardTitle>
        <CardDescription>Évolution mensuelle du CA</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E26D5A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E26D5A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" stroke="#3C3C3C" />
              <YAxis
                stroke="#3C3C3C"
                tickFormatter={(value) => `${value / 1000}k€`}
              />
              <Tooltip
                formatter={(value) => [`${value} €`, 'Chiffre d\'affaires']}
                labelFormatter={(label) => `Mois: ${label}`}
                contentStyle={{
                  backgroundColor: '#F5F0E6',
                  border: '1px solid #E0E0E0',
                  borderRadius: '4px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E26D5A"
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
