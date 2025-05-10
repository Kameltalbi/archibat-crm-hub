
import { 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "./types";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
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
  );
};
