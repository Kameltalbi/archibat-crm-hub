
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientRevenueProps {
  yearRevenue: number | null;
}

export const ClientRevenue = ({ yearRevenue }: ClientRevenueProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chiffre d'affaires</CardTitle>
        <CardDescription>
          CA de l'année {currentYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-4xl font-bold">
            {yearRevenue !== null 
              ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(yearRevenue)
              : "Calcul..."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
