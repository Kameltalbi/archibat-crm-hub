
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Filter } from "lucide-react";
import { MonthSelector } from "@/components/sales-forecast/MonthSelector";
import { SalesForecastTable } from "@/components/sales-forecast/SalesForecastTable";
import { SalesForecastChart } from "@/components/sales-forecast/SalesForecastChart";
import { salesForecastService, SalesForecast } from "@/services/salesForecastService";
import { useQuery } from "@tanstack/react-query";

const SalesForecastPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Query for monthly forecasts
  const { data: monthlyForecasts, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ["sales-forecast", currentMonth, currentYear],
    queryFn: () => salesForecastService.getSalesForecasts(currentYear, currentMonth),
  });

  // Query for yearly chart data
  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ["sales-forecast-chart", currentYear],
    queryFn: () => salesForecastService.getAllMonthlyForecasts(currentYear),
  });

  // Query for total yearly forecasts
  const { data: yearlyTotal, isLoading: isLoadingYearlyTotal } = useQuery({
    queryKey: ["sales-forecast-total", currentYear],
    queryFn: () => salesForecastService.getAllSalesForecastsForYear(currentYear),
  });

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Calculate total amount for the selected month
  const totalMonthlyAmount = monthlyForecasts?.reduce(
    (sum, forecast) => sum + forecast.amount,
    0
  ) || 0;

  // Calculate total yearly amount
  const totalYearlyAmount = yearlyTotal?.reduce(
    (sum, forecast) => sum + forecast.amount,
    0
  ) || 0;

  // Format the total amount
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  // Format month name
  const getMonthName = (month: number): string => {
    const monthNames = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return monthNames[month - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Prévisions des ventes</h1>
          <p className="text-muted-foreground">
            Suivez et gérez vos prévisions de ventes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MonthSelector
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
            showMonthDropdown={true}
          />
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une prévision manuelle
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total des ventes prévues</CardTitle>
            <CardDescription>Pour l'année {currentYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{formatAmount(totalYearlyAmount)}</div>
                {isLoadingYearlyTotal && <div className="text-sm text-muted-foreground">Chargement...</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Total mensuel</CardTitle>
            <CardDescription>
              {getMonthName(currentMonth)} {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{formatAmount(totalMonthlyAmount)}</div>
                {isLoadingMonthly && <div className="text-sm text-muted-foreground">Chargement...</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 pb-2">
          <div>
            <CardTitle>Ventes prévues</CardTitle>
            <CardDescription>
              {getMonthName(currentMonth)} {currentYear} - Total: <span className="font-semibold">{formatAmount(totalMonthlyAmount)}</span>
            </CardDescription>
          </div>
          <MonthSelector
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
          />
        </CardHeader>
        <CardContent className="space-y-8">
          {isLoadingMonthly ? (
            <div className="py-8 flex justify-center">Chargement des prévisions...</div>
          ) : (
            <SalesForecastTable forecasts={monthlyForecasts || []} />
          )}

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Évolution des prévisions {currentYear}</h3>
            {isLoadingChart ? (
              <div className="py-8 flex justify-center">Chargement du graphique...</div>
            ) : (
              <SalesForecastChart data={chartData || []} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesForecastPage;
