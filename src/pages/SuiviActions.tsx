
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Project, ProjectStatus, ProjectWithProgress } from "@/lib/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the column types
type ColumnType = "planifiée" | "en_cours" | "en_suivi" | "archivée";

const columnsConfig = {
  "planifiée": { title: "Planifiée", color: "bg-blue-100" },
  "en_cours": { title: "En cours", color: "bg-amber-100" },
  "en_suivi": { title: "En suivi", color: "bg-green-100" },
  "archivée": { title: "Archivée", color: "bg-gray-100" }
};

const SuiviActions = () => {
  const { toast } = useToast();
  const [projectsByColumn, setProjectsByColumn] = useState<Record<string, ProjectWithProgress[]>>({
    planifiée: [],
    en_cours: [],
    en_suivi: [],
    archivée: []
  });

  // Fetch projects data
  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects-kanban'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data
      return data.map((project: any) => ({
        ...project,
        client_name: project.clients?.name,
        objectif_ca: project.target_revenue || 0,
        montant_realise: project.achieved_amount || 0,
        etape_pipeline: project.status || 'planned'
      })) as ProjectWithProgress[];
    }
  });

  useEffect(() => {
    if (projects) {
      // Group projects by status
      const grouped = projects.reduce((acc, project) => {
        const status = mapStatusToColumn(project.status || 'planned');
        if (!acc[status]) acc[status] = [];
        acc[status].push(project);
        return acc;
      }, {} as Record<string, ProjectWithProgress[]>);
      
      // Ensure all columns exist
      Object.keys(columnsConfig).forEach(column => {
        if (!grouped[column]) grouped[column] = [];
      });
      
      setProjectsByColumn(grouped);
    }
  }, [projects]);

  // Map our status values to column types
  const mapStatusToColumn = (status: ProjectStatus | string): ColumnType => {
    const statusMap: Record<string, ColumnType> = {
      'planned': 'planifiée',
      'in_progress': 'en_cours',
      'completed': 'en_suivi',
      'cancelled': 'archivée'
    };
    
    return statusMap[status] || 'planifiée';
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, projectId: string, currentStatus: string) => {
    e.dataTransfer.setData("projectId", projectId);
    e.dataTransfer.setData("currentStatus", currentStatus);
  };

  // Handle dropping projects between columns
  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("projectId");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    
    if (currentStatus === targetStatus) return;
    
    // Update the project in the UI first (optimistic update)
    const updatedColumns = { ...projectsByColumn };
    const projectIndex = updatedColumns[currentStatus].findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      const [movedProject] = updatedColumns[currentStatus].splice(projectIndex, 1);
      movedProject.status = reverseMapStatus(targetStatus) as ProjectStatus;
      movedProject.etape_pipeline = targetStatus;
      updatedColumns[targetStatus].push(movedProject);
      setProjectsByColumn(updatedColumns);
    }
    
    // Then update in Supabase
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: reverseMapStatus(targetStatus) })
        .eq('id', projectId);
        
      if (error) throw error;
      
      toast({
        title: "Action mise à jour",
        description: "Le statut de l'action a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
      refetch(); // Refresh data from server to revert UI
    }
  };

  // Convert column type back to status value
  const reverseMapStatus = (columnType: string): string => {
    const reverseMap: Record<string, string> = {
      'planifiée': 'planned',
      'en_cours': 'in_progress',
      'en_suivi': 'completed',
      'archivée': 'cancelled'
    };
    
    return reverseMap[columnType] || 'planned';
  };

  // Allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Calculate column statistics
  const getColumnStats = (projects: ProjectWithProgress[]) => {
    const count = projects.length;
    const totalTarget = projects.reduce((sum, p) => sum + (p.objectif_ca || 0), 0);
    const totalRealized = projects.reduce((sum, p) => sum + (p.montant_realise || 0), 0);
    return { count, totalTarget, totalRealized };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-4">Chargement des actions commerciales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        <p>Une erreur est survenue lors du chargement des données.</p>
        <Button onClick={() => refetch()} className="mt-2">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Suivi des actions commerciales</h1>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => refetch()} variant="outline" className="mr-2">
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-x-auto">
        {Object.entries(columnsConfig).map(([columnId, config]) => (
          <div 
            key={columnId}
            className={`rounded-lg p-4 ${config.color} min-h-[500px] min-w-[280px]`}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">{config.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                {projectsByColumn[columnId]?.length || 0}
              </span>
            </div>

            {/* Column statistics */}
            {projectsByColumn[columnId] && projectsByColumn[columnId].length > 0 && (
              <div className="bg-white/60 rounded p-2 mb-4 text-xs">
                <div className="flex justify-between mb-1">
                  <span>Objectif Total:</span>
                  <span className="font-medium">{getColumnStats(projectsByColumn[columnId]).totalTarget.toLocaleString()} DT</span>
                </div>
                <div className="flex justify-between">
                  <span>Réalisé:</span>
                  <span className="font-medium">{getColumnStats(projectsByColumn[columnId]).totalRealized.toLocaleString()} DT</span>
                </div>
              </div>
            )}

            {/* Cards container */}
            <div className="space-y-3">
              {projectsByColumn[columnId]?.map((project) => (
                <Card 
                  key={project.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, project.id, columnId)}
                >
                  <CardContent className="pt-4">
                    <div className="font-medium mb-1 line-clamp-2">{project.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{project.client_name}</div>

                    {/* Project dates */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(project.start_date || Date.now()).toLocaleDateString()} - 
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'En cours'}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progression</span>
                        <span className="font-medium">
                          {project.objectif_ca && project.objectif_ca > 0
                            ? Math.round((project.montant_realise || 0) / project.objectif_ca * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(
                            project.objectif_ca && project.objectif_ca > 0
                              ? (project.montant_realise || 0) / project.objectif_ca
                              : 0
                          )}`}
                          style={{ 
                            width: `${project.objectif_ca && project.objectif_ca > 0
                              ? Math.min(100, Math.round((project.montant_realise || 0) / project.objectif_ca * 100))
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">Objectif:</span>
                        <span className="font-medium ml-1">{(project.objectif_ca || 0).toLocaleString()} DT</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Réalisé:</span>
                        <span className="font-medium ml-1">{(project.montant_realise || 0).toLocaleString()} DT</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 pb-3">
                    <Button variant="ghost" size="sm" className="ml-auto text-xs" asChild>
                      <a href={`/dashboard/projects/${project.id}`}>
                        Voir la fiche <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get progress bar color based on completion percentage
function getProgressColor(progress: number): string {
  if (progress < 0.25) return 'bg-red-500';
  if (progress < 0.5) return 'bg-orange-500';
  if (progress < 0.75) return 'bg-yellow-500';
  return 'bg-green-500';
}

export default SuiviActions;
