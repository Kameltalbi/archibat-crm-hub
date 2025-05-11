
import { useState, useMemo } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// Removing the import of TableRow, TableCell, etc. as they're no longer needed
// Removing the import of AddSaleModal

// Define a minimal client type for this component's needs
interface ClientMinimal {
  id: string;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  client?: string;
  startDate: string;
  endDate: string;
  status: string;
  clients: ClientMinimal[]; // Use the minimal client type
  category?: string;
}

// Removing the Sale interface as it's no longer needed

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

const ProjectDetails = ({ project, open, onClose }: ProjectDetailsProps) => {
  // Détermine la catégorie de produit associée à la catégorie du projet
  const productCategory = project?.category ? categoryMapping[project.category] || "Services" : undefined;
  
  // Removing the mock sales data and sales state
  
  // S'assurer que project.clients existe toujours et n'est jamais undefined
  const projectClients = useMemo(() => {
    return project?.clients || [];
  }, [project]);

  // Removing total revenue calculation and chart data as they depend on sales

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
          {/* Removing Revenue Summary section */}
          
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
          
          {/* Removing the Sales Section */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
