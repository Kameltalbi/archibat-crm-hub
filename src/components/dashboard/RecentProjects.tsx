
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

interface ProjectWithClient {
  id: string;
  name: string;
  clients: { id: string; name: string } | null;
  status: string;
  target_revenue?: number | null;
}

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
        setProjects(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets récents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const statusColors = {
    "En cours": "bg-blue-accent text-white",
    "Planifié": "bg-gold-yellow text-title-dark",
    "Terminé": "bg-mint-green text-white",
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
                      {project.status}
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
