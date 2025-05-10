
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { projectService } from "@/services/projectService";

interface ProjectWithClient {
  id: string;
  name: string;
  clients: { id: string; name: string } | null;
  status: string;
  project_products?: any[];
  target_revenue?: number | null; // Add target_revenue field
}

const RecentProjects = () => {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjectsWithClients();
        setProjects(data.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la récupération des projets récents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculer le CA pour chaque projet (simulé pour l'instant)
  const getProjectRevenue = (project: ProjectWithClient): number => {
    // Si nous avons un objectif de CA défini, l'utiliser
    if (project.target_revenue) {
      return project.target_revenue;
    }
    
    // Si nous avons des produits associés au projet, calculer le CA
    if (project.project_products?.length) {
      return project.project_products.reduce((sum, pp) => sum + (pp.quantity * pp.price_at_time), 0);
    }
    
    // Sinon, générer un montant aléatoire pour la démonstration
    return Math.floor(Math.random() * 30000) + 15000;
  };

  const statusColors = {
    "En cours": "bg-terracotta text-white",
    "Planifié": "bg-ocre text-white",
    "Terminé": "bg-light-gray text-dark-gray",
    "Suspendu": "bg-gray-500 text-white",
  };

  return (
    <Card className="animate-fade-in delay-300">
      <CardHeader>
        <CardTitle>Projets récents</CardTitle>
        <CardDescription>Les 5 derniers projets</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Chargement des projets...</div>
        ) : projects.length > 0 ? (
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
                  <TableCell>{project.clients?.name || "Non assigné"}</TableCell>
                  <TableCell>
                    <Badge className={
                      statusColors[project.status as keyof typeof statusColors] || "bg-gray-200 text-gray-800"
                    }>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {getProjectRevenue(project).toLocaleString()} TND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun projet à afficher
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
