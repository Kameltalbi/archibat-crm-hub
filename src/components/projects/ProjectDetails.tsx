
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Import new components
import { ProjectHeader } from "./details/ProjectHeader";
import { ProjectObjectives } from "./details/ProjectObjectives";
import { SalesByCategoryChart } from "./details/SalesByCategoryChart";
import { ProjectInfo } from "./details/ProjectInfo";
import { SalesTable } from "./details/SalesTable";
import { useSalesData } from "./details/useSalesData";
import { Project } from "./details/types";

// Mapper entre ID de catégorie du projet et nom de catégorie de produit
const categoryMapping: Record<string, string> = {
  "Rénovation": "Travaux",
  "Construction": "Travaux",
  "Aménagement": "Services",
  "Réhabilitation": "Études",
  "Extension": "Travaux"
};

interface ProjectDetailsProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

const ProjectDetails = ({ project, open, onClose }: ProjectDetailsProps) => {
  // Détermine la catégorie de produit associée à la catégorie du projet
  const productCategory = project?.category ? categoryMapping[project.category] || "Services" : undefined;
  
  // Use our custom hook to fetch and manage sales data
  const { sales, isLoading, totalRevenue } = useSalesData(project, open);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <ProjectHeader project={project} />
        
        <div className="space-y-6 py-4">
          {/* Display Objectif CA and Pie Chart side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectObjectives 
              targetRevenue={project.targetRevenue} 
              totalRevenue={totalRevenue} 
            />
            <SalesByCategoryChart sales={sales} />
          </div>

          {/* Project Information */}
          <ProjectInfo clients={project.clients} status={project.status} />
          
          {/* Sales Table */}
          <SalesTable 
            sales={sales}
            isLoading={isLoading}
            projectClients={project.clients}
            projectName={project.name}
            projectCategory={productCategory}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetails;
