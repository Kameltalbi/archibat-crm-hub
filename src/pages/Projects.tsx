
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye } from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Rénovation Villa Martigues",
    client: "SCI Bartoli",
    status: "En cours",
    date: "2023-09-15",
    revenue: 42600,
  },
  {
    id: 2,
    name: "Bureaux Aix Centre",
    client: "Groupe Durand",
    status: "Planifié",
    date: "2023-11-01",
    revenue: 38200,
  },
  {
    id: 3,
    name: "Résidence Les Oliviers",
    client: "Cabinet Martin & Associés",
    status: "En cours",
    date: "2023-08-20",
    revenue: 36100,
  },
  {
    id: 4,
    name: "Extension Belle-Vue",
    client: "Immobilier Côté Sud",
    status: "Terminé",
    date: "2023-07-12",
    revenue: 29400,
  },
  {
    id: 5,
    name: "Centre médical Provence",
    client: "Fondation Meyers",
    status: "Terminé",
    date: "2023-06-30",
    revenue: 22500,
  },
  {
    id: 6,
    name: "Restaurant Le Mistral",
    client: "Groupe Durand",
    status: "Planifié",
    date: "2023-12-01",
    revenue: 18900,
  },
];

const statusColors = {
  "En cours": "bg-terracotta text-white",
  "Planifié": "bg-ocre text-white",
  "Terminé": "bg-light-gray text-dark-gray",
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Projets</h1>
          <p className="text-muted-foreground">
            Gérez vos projets et suivez leur avancement
          </p>
        </div>
        <Button className="bg-terracotta hover:bg-ocre">
          <Plus className="mr-2 h-4 w-4" /> Nouveau projet
        </Button>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des projets</CardTitle>
          <CardDescription>
            {filteredProjects.length} projets au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Client principal</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">CA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(project.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.revenue.toLocaleString()} €
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
