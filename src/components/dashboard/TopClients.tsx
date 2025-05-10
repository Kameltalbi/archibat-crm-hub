
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const clients = [
  {
    id: 1,
    name: "Groupe Durand",
    revenue: 34500,
    projects: 4,
  },
  {
    id: 2,
    name: "SCI Bartoli",
    revenue: 29200,
    projects: 2,
  },
  {
    id: 3,
    name: "Cabinet Martin & Associés",
    revenue: 25400,
    projects: 3,
  },
  {
    id: 4,
    name: "Immobilier Côté Sud",
    revenue: 19800,
    projects: 2,
  },
  {
    id: 5,
    name: "Fondation Meyers",
    revenue: 15600,
    projects: 1,
  },
];

const TopClients = () => {
  return (
    <Card className="animate-fade-in delay-200">
      <CardHeader>
        <CardTitle>Top Clients</CardTitle>
        <CardDescription>Par chiffre d'affaires</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">CA</TableHead>
              <TableHead className="text-right">Projets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell className="text-right">
                  {client.revenue.toLocaleString()} €
                </TableCell>
                <TableCell className="text-right">{client.projects}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopClients;
