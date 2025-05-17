
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { ProjectStatus } from "@/lib/supabase";

interface ProjectWithClient {
  id: string;
  name: string;
  clients: { id: string; name: string } | null;
  status: ProjectStatus;
  target_revenue?: number | null;
}

// Mapping between status values and their display labels
const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "in_progress", label: "En cours" },
  { value: "planned", label: "Planifié" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Suspendu" },
];

// Helper function to get the display label for a status value
const getStatusLabel = (status: ProjectStatus): string => {
  return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
};

const RecentProjects = () => {
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*, clients:client_id(id, name)')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // Cast the status to ProjectStatus type
        const typedProjects = data.map(project => ({
          ...project,
          status: project.status as ProjectStatus
        })) as ProjectWithClient[];
        
        setProjects(typedProjects);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets récents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const statusColors = {
    "in_progress": "bg-blue-accent text-white",
    "planned": "bg-gold-yellow text-title-dark",
    "completed": "bg-mint-green text-white",
    "cancelled": "bg-gray-500 text-white",
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
                  <TableCell className="font-medium">
                    <Link to={`/dashboard/projects/${project.id}`} className="hover:underline text-blue-accent">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.clients?.name || "Non assigné"}</TableCell>
                  <TableCell>
                    <Badge className={
                      statusColors[project.status as keyof typeof statusColors] || "bg-gray-200 text-gray-800"
                    }>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {project.target_revenue ? `${project.target_revenue.toLocaleString()} TND` : "N/A"}
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
