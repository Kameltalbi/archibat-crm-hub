
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { projectService } from "@/services/projectService";
import DatePickerField from "./DatePickerField";
import CategorySelect from "./CategorySelect";
import StatusSelect from "./StatusSelect";

interface ProjectFormData {
  name: string;
  startDate?: Date;
  endDate?: Date;
  status: string;
  category: string;
  targetRevenue?: number; // Ajout du champ objectif CA
}

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ProjectForm = ({ onSuccess, onCancel, isOpen }: ProjectFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    startDate: undefined,
    endDate: undefined,
    status: "",
    category: "",
    targetRevenue: undefined, // Initialisation du champ objectif CA
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    // Validation des champs requis
    if (!formData.name || !formData.status || !formData.startDate) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newProject = await projectService.createProject({
        name: formData.name,
        client_id: null,
        description: null,
        start_date: formData.startDate.toISOString(),
        end_date: formData.endDate ? formData.endDate.toISOString() : null,
        status: formData.status as any,
        category: formData.category || null,
        target_revenue: formData.targetRevenue || null, // Ajout de l'objectif CA
        is_archived: false // Ajouté pour résoudre l'erreur
      });
      
      if (newProject) {
        toast({
          title: "Succès",
          description: "Le projet a été créé avec succès",
        });
        
        // Réinitialiser le formulaire
        resetForm();
        
        // Appeler le callback de succès
        onSuccess();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer le projet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du projet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      startDate: undefined,
      endDate: undefined,
      status: "",
      category: "",
      targetRevenue: undefined, // Réinitialisation du champ objectif CA
    });
  };

  return (
    <div className="grid gap-4 py-4">
      {/* Project Name */}
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nom du projet *
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Entrez le nom du projet"
          className="border-input"
        />
      </div>
      
      {/* Category Selection */}
      <CategorySelect
        value={formData.category}
        onValueChange={(value) => handleChange("category", value)}
        disabled={isLoading}
        isOpen={isOpen}
      />

      {/* Target Revenue - Nouveau champ */}
      <div className="grid gap-2">
        <label htmlFor="targetRevenue" className="text-sm font-medium">
          Objectif CA (DT HT)
        </label>
        <Input
          id="targetRevenue"
          type="number"
          min="0"
          step="0.01"
          value={formData.targetRevenue || ""}
          onChange={(e) => handleChange("targetRevenue", e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Entrez l'objectif de chiffre d'affaires"
          className="border-input"
        />
      </div>

      {/* Start Date */}
      <DatePickerField
        id="startDate"
        label="Date de début"
        value={formData.startDate}
        onChange={(date) => handleChange("startDate", date)}
        required={true}
      />

      {/* End Date */}
      <DatePickerField
        id="endDate"
        label="Date de fin"
        value={formData.endDate}
        onChange={(date) => handleChange("endDate", date)}
      />

      {/* Status */}
      <StatusSelect
        value={formData.status}
        onValueChange={(value) => handleChange("status", value)}
        disabled={isLoading}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          onClick={handleSave}
          className="bg-terracotta hover:bg-ocre"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer le projet"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectForm;
