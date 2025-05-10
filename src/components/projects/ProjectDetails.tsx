
import { useState, useMemo } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell, TableHeader, TableHead, Table, TableBody } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import AddSaleModal from "@/components/projects/AddSaleModal";

interface Client {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
  client?: string;
  startDate: string;
  endDate: string;
  status: string;
  clients: Client[];
}

interface Sale {
  id: number;
  label: string;
  date: string;
  amount: number;
  category: string;
  client: string;
}

interface ProjectDetailsProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

const CHART_COLORS = ['#a05a2c', '#cfb095', '#d4cdc3', '#8e9196', '#403e43', '#6d4824'];

const ProjectDetails = ({ project, open, onClose }: ProjectDetailsProps) => {
  // Mock sales data for the project
  const [sales, setSales] = useState<Sale[]>([
    { id: 1, label: "Phase de conception", date: "12/04/2023", amount: 15000, category: "Étude", client: "Cabinet Martin & Associés" },
    { id: 2, label: "Matériaux de construction", date: "25/05/2023", amount: 45000, category: "Fourniture", client: "Cabinet Martin & Associés" },
    { id: 3, label: "Phase de construction", date: "15/06/2023", amount: 60000, category: "Travaux", client: "Cabinet Martin & Associés" },
    { id: 4, label: "Finitions", date: "10/08/2023", amount: 25000, category: "Service", client: "Cabinet Martin & Associés" }
  ]);

  // Calculate total revenue and chart data
  const totalRevenue = useMemo(() => {
    return sales.reduce((sum, sale) => sum + sale.amount, 0);
  }, [sales]);

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
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Chiffre d'Affaires Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-terracotta">
                  {totalRevenue.toLocaleString()} DT
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {sales.length} ventes enregistrées
                </p>
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
              <AddSaleModal projectClients={project.clients} projectName={project.name} />
            </div>
            
            <Card>
              <CardContent className="p-4">
                {sales.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libellé</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant (DT)</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Client</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.label}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.amount.toLocaleString()} DT</TableCell>
                          <TableCell>{sale.category}</TableCell>
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
