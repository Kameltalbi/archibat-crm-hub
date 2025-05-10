import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProjectModal from "@/components/projects/AddProjectModal";
import EditProjectModal from "@/components/projects/EditProjectModal";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectStatus } from "@/lib/supabase";

// Update the interface to match the expected types
interface ProjectWithClient extends Omit<Project, 'status'> {
  client_name: string;
  status: ProjectStatus | null;
  clients?: { name: string; id: string; }; // Add clients field to match what we get from Supabase
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectWithClient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          clients(id, name)
        `);
        
      if (projectsError) {
        throw projectsError;
      }
      
      console.log("Raw projects data:", projectsData);
      
      // Transformer les données pour inclure le nom du client
      const formattedProjects: ProjectWithClient[] = projectsData.map(project => {
        return {
          ...project,
          client_name: project.clients ? project.clients.name : 'Pas de client',
          // Ensure status is correctly typed as ProjectStatus
          status: project.status as ProjectStatus | null 
        };
      });
      
      console.log("Formatted projects data:", formattedProjects);
      setProjects(formattedProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les projets. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le projet. Veuillez réessayer."
      });
    }
  };

  const handleRowClick = (project: ProjectWithClient) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };
  
  const closeDetails = () => {
    setIsDetailsOpen(false);
  };
  
  const getStatusClass = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-700 border border-gray-200";
    
    switch (status) {
      case "En cours":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Terminé":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Planifié":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Suspendu":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Format currency for target_revenue display with TND instead of EUR
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Projets</h1>
          <p className="text-muted-foreground">
            Gérez vos projets et leur avancement
          </p>
        </div>
        <AddProjectModal onProjectAdded={fetchProjects} />
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
                  <TableHead>Objectif CA</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="hidden md:table-cell">Date début</TableHead>
                  <TableHead className="hidden md:table-cell">Date fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className="cursor-pointer hover:bg-muted/60"
                      onClick={() => handleRowClick(project)}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{formatCurrency(project.target_revenue)}</TableCell>
                      <TableCell>{project.category || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                            getStatusClass(project.status)
                          }`}
                        >
                          {project.status || 'Non défini'}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <EditProjectModal 
                            project={project} 
                            onUpdate={fetchProjects}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedProject && (
        <ProjectDetails 
          project={{
            id: Number(selectedProject.id),
            name: selectedProject.name,
            client: selectedProject.client_name,
            startDate: selectedProject.start_date || '',
            endDate: selectedProject.end_date || '',
            status: selectedProject.status || '',
            clients: [{ id: Number(selectedProject.client_id || 0), name: selectedProject.client_name }],
            category: selectedProject.category || undefined,
            targetRevenue: selectedProject.target_revenue || undefined // Pass the target revenue to project details
          }}
          open={isDetailsOpen} 
          onClose={closeDetails} 
        />
      )}
    </div>
  );
};

export default Projects;
