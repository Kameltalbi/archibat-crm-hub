
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { ProjectStatus, supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import AddSaleDialog from "@/components/projects/sales/AddSaleDialog";

interface ProjectWithClient {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus | null;
  category: string | null;
  target_revenue: number | null;
  client_name?: string;
  clients?: { name: string; id: string };
}

interface ProjectSale {
  id: string;
  label: string;
  amount: number;
  category: string;
  client_name: string | null;
  product_name: string | null;
  date: string;
  remarks?: string | null;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ProjectWithClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<ProjectSale[]>([]);

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
      fetchProjectSales(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(id, name)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;

      if (data) {
        setProject({
          ...data,
          // Explicitement cast le status à ProjectStatus pour résoudre l'erreur de type
          status: data.status as ProjectStatus,
          client_name: data.clients ? data.clients.name : 'Pas de client'
        });
        
        console.log("Catégorie du projet:", data.category); // Debug log pour voir la catégorie
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du projet."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectSales = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_sales')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        setSales(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les ventes du projet."
      });
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-";
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour gérer l'ajout d'une nouvelle vente
  const handleSaleAdded = () => {
    fetchProjectSales(id!);
    toast({
      title: "Vente ajoutée",
      description: "La vente a été enregistrée avec succès."
    });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Chargement des détails du projet...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
        <p className="text-xl text-muted-foreground">Projet non trouvé</p>
        <Button onClick={() => navigate('/projects')}>Retour aux projets</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bouton de retour - Placé visiblement en haut */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/projects')}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la liste des projets
      </Button>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            {project.name}
            {project.status && (
              <span 
                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium ${
                  getStatusClass(project.status)
                }`}
              >
                {project.status}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground">
            {project.client_name} 
            {project.start_date && ` • Démarré le ${new Date(project.start_date).toLocaleDateString()}`}
            {project.end_date && ` • Fin prévue le ${new Date(project.end_date).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails du projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.description && (
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Description</h3>
                <p>{project.description}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">Catégorie</h3>
              <p>{project.category || 'Non définie'}</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">Objectif CA</h3>
              <p className="font-semibold text-lg">{formatCurrency(project.target_revenue)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Date de début</h3>
                <p>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Non définie'}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Date de fin</h3>
                <p>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Non définie'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground mb-1">CA Réalisé</h3>
              <p className="font-semibold text-2xl">
                {formatCurrency(sales.reduce((sum, sale) => sum + sale.amount, 0))}
              </p>
            </div>
            {project.target_revenue && (
              <div>
                <h3 className="font-medium text-muted-foreground mb-1">Progression</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (sales.reduce((sum, sale) => sum + sale.amount, 0) / project.target_revenue) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((sales.reduce((sum, sale) => sum + sale.amount, 0) / (project.target_revenue || 1)) * 100)}% de l'objectif
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ventes liées</CardTitle>
          <AddSaleDialog 
            projectId={id!}
            projectName={project.name}
            projectCategory={project.category || undefined}
            onSaleAdded={handleSaleAdded}
          />
        </CardHeader>
        <CardContent>
          {sales.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.label}</TableCell>
                    <TableCell>{sale.category}</TableCell>
                    <TableCell>{sale.product_name || '-'}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune vente enregistrée pour ce projet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
