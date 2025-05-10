
import { Card, CardContent } from "@/components/ui/card";
import { TableRow, TableCell, TableHeader, TableHead, Table, TableBody } from "@/components/ui/table";
import { Sale } from "./types";
import AddSaleModal from "@/components/projects/AddSaleModal";
import { Client } from "./types";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  projectClients: Client[];
  projectName: string;
  projectCategory?: string;
}

export const SalesTable = ({ sales, isLoading, projectClients, projectName, projectCategory }: SalesTableProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-charcoal dark:text-light-gray">Ventes</h3>
        <AddSaleModal 
          projectClients={projectClients} 
          projectName={projectName} 
          projectCategory={projectCategory} 
        />
      </div>
      
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement des données de ventes...
            </div>
          ) : sales.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Montant (DT)</TableHead>
                  <TableHead>Client</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.label}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.product || sale.category}</TableCell>
                    <TableCell>{sale.amount.toLocaleString()} DT</TableCell>
                    <TableCell>{sale.client}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune vente enregistrée pour ce projet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
