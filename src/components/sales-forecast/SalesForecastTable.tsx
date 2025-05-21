
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalesForecast } from "@/services/salesForecastService";

interface SalesForecastTableProps {
  forecasts: SalesForecast[];
}

export const SalesForecastTable: React.FC<SalesForecastTableProps> = ({ forecasts }) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'facturé':
        return <Badge variant="default" className="bg-green-500">Facturé</Badge>;
      case 'annulé':
        return <Badge variant="destructive">Annulé</Badge>;
      case 'prévu':
      default:
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Prévu</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Projet</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Date de la vente</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forecasts.length > 0 ? (
            forecasts.map((forecast) => (
              <TableRow key={forecast.id}>
                <TableCell className="font-medium">{forecast.project_name}</TableCell>
                <TableCell>{forecast.label}</TableCell>
                <TableCell className="text-right">{formatAmount(forecast.amount)}</TableCell>
                <TableCell>{formatDate(forecast.expected_date)}</TableCell>
                <TableCell>{getStatusBadge(forecast.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Aucune prévision de vente pour cette période
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
