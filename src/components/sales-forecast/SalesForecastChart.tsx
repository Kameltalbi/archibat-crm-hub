
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface SalesForecastChartProps {
  data: { month: number; totalAmount: number }[];
}

export const SalesForecastChart: React.FC<SalesForecastChartProps> = ({ data }) => {
  const monthNames = [
    "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
    "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
  ];

  const formattedData = data.map((item) => ({
    ...item,
    name: monthNames[item.month - 1],
  }));

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      currencyDisplay: 'symbol',
    }).format(value);
  };

  const config = {
    sales: { label: "Ventes Prévues", theme: { light: "#0ea5e9", dark: "#0ea5e9" } },
  };

  return (
    <div className="h-72 sm:h-96 w-full">
      <ChartContainer
        config={config}
        className="h-full"
      >
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => `${value} DT`} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="font-semibold">
                        {payload[0].payload.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <div>Total: {formatMoney(payload[0].value as number)}</div>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="totalAmount" name="Ventes" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
