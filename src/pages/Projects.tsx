import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash, Archive, ArchiveRestore, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddProjectModal from "@/components/projects/AddProjectModal";
import EditProjectModal from "@/components/projects/EditProjectModal";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectStatus, supabase } from "@/lib/supabase"; // Ajout de l'import de supabase
import { projectService } from "@/services/projectService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Update the interface to match the expected types
interface ProjectWithClient extends Omit<Project, 'status'> {
  client_name: string;
  status: ProjectStatus | null;
  clients?: { name: string; id: string; }; // Add clients field to match what we get from Supabase
  is_archived: boolean;
}

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<ProjectWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Fetch active projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          clients(id, name)
        `)
        .eq('is_archived', false);
        
      if (projectsError) {
        throw projectsError;
      }
      
      // Fetch archived projects
      const { data: archivedData, error: archivedError } = await supabase
        .from('projects')
        .select(`
          *,
          clients(id, name)
        `)
        .eq('is_archived', true);
        
      if (archivedError) {
        throw archivedError;
      }
      
      // Transform data to include client name
      const transformProjects = (data: any[]): ProjectWithClient[] => {
        return data.map(project => ({
          ...project,
          client_name: project.clients ? project.clients.name : 'Pas de client',
          status: project.status as ProjectStatus | null,
          is_archived: project.is_archived || false
        }));
      };
      
      setProjects(transformProjects(projectsData || []));
      setArchivedProjects(transformProjects(archivedData || []));
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
      setArchivedProjects(archivedProjects.filter(project => project.id !== id));
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
  
  const handleArchiveProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      const projectToArchive = projects.find(project => project.id === id);
      if (projectToArchive) {
        // Remove from active projects
        setProjects(projects.filter(project => project.id !== id));
        
        // Add to archived projects
        setArchivedProjects([{...projectToArchive, is_archived: true}, ...archivedProjects]);
        
        toast({
          title: "Projet archivé",
          description: "Le projet a été archivé avec succès."
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'archivage du projet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'archiver le projet. Veuillez réessayer."
      });
    }
  };
  
  const handleUnarchiveProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: false })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      const projectToUnarchive = archivedProjects.find(project => project.id === id);
      if (projectToUnarchive) {
        // Remove from archived projects
        setArchivedProjects(archivedProjects.filter(project => project.id !== id));
        
        // Add to active projects
        setProjects([{...projectToUnarchive, is_archived: false}, ...projects]);
        
        toast({
          title: "Projet désarchivé",
          description: "Le projet a été désarchivé avec succès."
        });
      }
    } catch (error) {
      console.error('Erreur lors de la désarchivation du projet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de désarchiver le projet. Veuillez réessayer."
      });
    }
  };

  // Fix the navigation to project details by ensuring we're working with the correct ID type
  const handleRowClick = (project: ProjectWithClient) => {
    console.log(`Navigating to project with ID: ${project.id}`);
    navigate(`/dashboard/projects/${project.id}`);
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
  
  const getFilteredProjects = () => {
    const projectsList = activeTab === "active" ? projects : archivedProjects;
    return projectsList.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // Format currency for target_revenue display - Updated to use TND
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredProjects = getFilteredProjects();
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Actions commerciales</h1>
          <p className="text-muted-foreground">
            Gérez vos actions commerciales et leur avancement
          </p>
        </div>
        <AddProjectModal onProjectAdded={fetchProjects} />
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des actions commerciales</CardTitle>
          <CardDescription>
            {projects.length} actions actives, {archivedProjects.length} actions archivées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="active">Actions actives</TabsTrigger>
              <TabsTrigger value="archived">Actions archivées</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une action commerciale..."
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
                      {activeTab === "active" ? "Aucune action active trouvée" : "Aucune action archivée trouvée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className="hover:bg-muted/60"
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleRowClick(project)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {activeTab === "active" ? (
                            <>
                              <EditProjectModal 
                                project={project} 
                                onUpdate={fetchProjects}
                              />
                              
                              {project.status === "Terminé" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-amber-500 hover:text-amber-600"
                                  onClick={() => handleArchiveProject(project.id)}
                                  title="Archiver"
                                >
                                  <Archive className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-blue-500 hover:text-blue-600"
                              onClick={() => handleUnarchiveProject(project.id)}
                              title="Désarchiver"
                            >
                              <ArchiveRestore className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive"
                                title="Supprimer"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette action commerciale ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  );
};

export default Projects;
