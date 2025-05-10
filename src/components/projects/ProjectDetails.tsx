
import { useState, useMemo, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell, TableHeader, TableHead, Table, TableBody } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import AddSaleModal from "@/components/projects/AddSaleModal";

interface Client {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  client?: string;
  startDate: string;
  endDate: string;
  status: string;
  clients: Client[];
  category?: string;
  targetRevenue?: number;
}

interface Sale {
  id: string;
  label: string;
  date: string;
  amount: number;
  category: string;
  client: string;
  product?: string;
}

interface ProjectDetailsProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

// Mapper entre ID de catégorie du projet et nom de catégorie de produit
const categoryMapping: Record<string, string> = {
  "Rénovation": "Travaux",
  "Construction": "Travaux",
  "Aménagement": "Services",
  "Réhabilitation": "Études",
  "Extension": "Travaux"
};

const CHART_COLORS = ['#a05a2c', '#cfb095', '#d4cdc3', '#8e9196', '#403e43', '#6d4824'];

// Define the project sales table type to match what we just created in the database
interface ProjectSale {
  id: string;
  project_id: string;
  label: string;
  date: string;
  amount: number;
  category: string;
  client_name: string | null;
  product_name: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectDetails = ({ project, open, onClose }: ProjectDetailsProps) => {
  // Détermine la catégorie de produit associée à la catégorie du projet
  const productCategory = project?.category ? categoryMapping[project.category] || "Services" : undefined;
  
  // Use real sales data instead of mock data
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch sales data from Supabase when the project is opened
  useEffect(() => {
    if (open && project) {
      fetchSalesData();
    }
  }, [open, project]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      // Use the correct project_id format
      const { data, error } = await supabase
        .from('project_sales')
        .select('*')
        .eq('project_id', String(project.id));
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Properly cast the data to our ProjectSale interface
        const formattedSales: Sale[] = (data as ProjectSale[]).map(sale => ({
          id: sale.id,
          label: sale.label,
          date: new Date(sale.date).toLocaleDateString('fr-FR'),
          amount: sale.amount,
          category: sale.category,
          client: sale.client_name || project.client || '',
          product: sale.product_name || undefined
        }));
        
        setSales(formattedSales);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de ventes pour ce projet."
      });
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total revenue and chart data
  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.amount, 0);
  }, [sales]);

  // Calculate percentage of target reached
  const percentageReached = useMemo(() => {
    if (!project.targetRevenue || project.targetRevenue === 0) return 0;
    const percentage = (totalRevenue / project.targetRevenue) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }, [totalRevenue, project.targetRevenue]);

  // Prepare pie chart data by category
  const chartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    sales.forEach(sale => {
      const currentTotal = categoryMap.get(sale.category) || 0;
      categoryMap.set(sale.category, currentTotal + sale.amount);
    });
    
    return Array.from(categoryMap).map(([name, value]) => ({ name, value }));
  }, [sales]);

  if (!project) return null;

  // Format the target revenue for display
  const formatTargetRevenue = (amount: number | undefined) => {
    if (amount === undefined) return "Non défini";
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center justify-between">
            <div>
              <span className="text-charcoal dark:text-light-gray">{project.name}</span>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                Démarré le {project.startDate} 
                {project.endDate && ` • Fin prévue le ${project.endDate}`}
                {project.category && ` • Catégorie: ${project.category}`}
              </div>
            </div>
            <span 
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ${
                project.status === "En cours" 
                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                  : project.status === "Terminé"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {project.status}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Display Objectif CA and Pie Chart side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Objectif CA</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center h-[200px]">
                <div className="text-3xl font-bold text-terracotta">
                  {formatTargetRevenue(project.targetRevenue)}
                </div>
                {project.targetRevenue && totalRevenue > 0 && (
                  <>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {Math.round(percentageReached)}% de l'objectif atteint
                        </p>
                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(totalRevenue)}
                        </p>
                      </div>
                      <Progress value={percentageReached} className="h-2" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">CA par Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `${value.toLocaleString()} DT`} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Information */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-charcoal dark:text-light-gray">Informations</h3>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client(s)</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.clients.map((client) => (
                        <span
                          key={client.id}
                          className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {client.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Statut</p>
                    <p>{project.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sales Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-charcoal dark:text-light-gray">Ventes</h3>
              <AddSaleModal 
                projectClients={project.clients} 
                projectName={project.name} 
                projectCategory={productCategory} 
              />
            </div>
            
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chargement des données de ventes...
                  </div>
                ) : sales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Montant (DT)</TableHead>
                        <TableHead>Client</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.label}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.product || sale.category}</TableCell>
                          <TableCell>{sale.amount.toLocaleString()} DT</TableCell>
                          <TableCell>{sale.client}</TableCell>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
