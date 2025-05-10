
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProjectModal from "@/components/projects/AddProjectModal";

// Mock project data
const projects = [
  {
    id: 1,
    name: "Rénovation Immeuble Castellane",
    client: "Cabinet Martin & Associés",
    startDate: "15/03/2023",
    endDate: "30/09/2023",
    status: "En cours",
  },
  {
    id: 2,
    name: "Construction Villa Prado",
    client: "SCI Bartoli",
    startDate: "10/01/2023",
    endDate: "20/12/2023",
    status: "En cours",
  },
  {
    id: 3,
    name: "Aménagement Bureaux Vieux-Port",
    client: "Groupe Durand",
    startDate: "05/11/2022",
    endDate: "28/02/2023",
    status: "Terminé",
  },
  {
    id: 4,
    name: "Réhabilitation Centre Culturel",
    client: "Fondation Meyers",
    startDate: "01/06/2023",
    endDate: "15/03/2024",
    status: "Suspendu",
  },
];

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
            Gérez vos projets et leur avancement
          </p>
        </div>
        <AddProjectModal />
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
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Date début</TableHead>
                  <TableHead className="hidden md:table-cell">Date fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell className="hidden md:table-cell">{project.startDate}</TableCell>
                    <TableCell className="hidden md:table-cell">{project.endDate}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          project.status === "En cours" 
                            ? "bg-amber-50 text-amber-700 border border-amber-200" 
                            : project.status === "Terminé"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
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
