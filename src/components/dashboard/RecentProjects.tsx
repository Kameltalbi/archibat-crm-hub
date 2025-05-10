
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const projects = [
  {
    id: 1,
    name: "Rénovation Villa Martigues",
    client: "SCI Bartoli",
    status: "En cours",
    revenue: 42600,
  },
  {
    id: 2,
    name: "Bureaux Aix Centre",
    client: "Groupe Durand",
    status: "Planifié",
    revenue: 38200,
  },
  {
    id: 3,
    name: "Résidence Les Oliviers",
    client: "Cabinet Martin & Associés",
    status: "En cours",
    revenue: 36100,
  },
  {
    id: 4,
    name: "Extension Belle-Vue",
    client: "Immobilier Côté Sud",
    status: "Terminé",
    revenue: 29400,
  },
  {
    id: 5,
    name: "Centre médical Provence",
    client: "Fondation Meyers",
    status: "Terminé",
    revenue: 22500,
  },
];

const statusColors = {
  "En cours": "bg-terracotta text-white",
  "Planifié": "bg-ocre text-white",
  "Terminé": "bg-light-gray text-dark-gray",
};

const RecentProjects = () => {
  return (
    <Card className="animate-fade-in delay-300">
      <CardHeader>
        <CardTitle>Projets récents</CardTitle>
        <CardDescription>Les 5 derniers projets</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">CA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {project.revenue.toLocaleString()} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
